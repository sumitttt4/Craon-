'use client';

import { useEffect, useRef, type RefObject } from 'react';

type VideoWithFrameCallbacks = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: (now: number) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export default function VideoEdgeOverlay({
  videoRef,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current as VideoWithFrameCallbacks | null;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const compact = window.matchMedia('(max-width: 767px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = compact ? 320 : 576;
    const height = Math.round(width * 0.5625);
    const threshold = compact ? 152 : 138;
    const workCanvas = document.createElement('canvas');
    const workContext = workCanvas.getContext('2d', { willReadFrequently: true });
    const outputContext = canvas.getContext('2d');
    if (!workContext || !outputContext) return;

    workCanvas.width = width;
    workCanvas.height = height;
    canvas.width = width;
    canvas.height = height;

    const luminance = new Uint8Array(width * height);
    const magnitude = new Uint16Array(width * height);
    const direction = new Uint8Array(width * height);
    const temporalAlpha = new Float32Array(width * height);
    const output = outputContext.createImageData(width, height);
    let animationFrame = 0;
    let videoFrame = 0;
    let stopped = false;
    let lastPaint = 0;

    const paintEdges = (now: number) => {
      if (stopped) return;

      if (now - lastPaint >= (compact ? 125 : 96) && video.readyState >= 2 && !document.hidden) {
        lastPaint = now;
        workContext.imageSmoothingEnabled = true;
        workContext.imageSmoothingQuality = 'high';
        workContext.filter = compact ? 'blur(0.7px)' : 'blur(0.55px)';
        workContext.drawImage(video, 0, 0, width, height);
        workContext.filter = 'none';
        const source = workContext.getImageData(0, 0, width, height).data;

        for (let index = 0; index < luminance.length; index += 1) {
          const sourceIndex = index * 4;
          luminance[index] =
            source[sourceIndex] * 0.2126 +
            source[sourceIndex + 1] * 0.7152 +
            source[sourceIndex + 2] * 0.0722;
        }

        output.data.fill(0);
        for (let y = 1; y < height - 1; y += 1) {
          for (let x = 1; x < width - 1; x += 1) {
            const index = y * width + x;
            const topLeft = luminance[index - width - 1];
            const top = luminance[index - width];
            const topRight = luminance[index - width + 1];
            const left = luminance[index - 1];
            const right = luminance[index + 1];
            const bottomLeft = luminance[index + width - 1];
            const bottom = luminance[index + width];
            const bottomRight = luminance[index + width + 1];
            const gradientX =
              -topLeft - 2 * left - bottomLeft + topRight + 2 * right + bottomRight;
            const gradientY =
              -topLeft - 2 * top - topRight + bottomLeft + 2 * bottom + bottomRight;
            const gradientMagnitude = Math.abs(gradientX) + Math.abs(gradientY);

            magnitude[index] = Math.min(2047, gradientMagnitude);
            direction[index] = Math.abs(gradientX) >= Math.abs(gradientY) ? 0 : 1;
          }
        }

        output.data.fill(0);
        for (let y = 2; y < height - 2; y += 1) {
          for (let x = 2; x < width - 2; x += 1) {
            const index = y * width + x;
            const value = magnitude[index];
            const horizontalPeak =
              direction[index] === 0 &&
              value >= magnitude[index - 1] &&
              value > magnitude[index + 1];
            const verticalPeak =
              direction[index] === 1 &&
              value >= magnitude[index - width] &&
              value > magnitude[index + width];
            const targetAlpha =
              value > threshold && (horizontalPeak || verticalPeak)
                ? Math.min(184, (value - threshold) * 0.78)
                : 0;
            const alpha = temporalAlpha[index] * 0.38 + targetAlpha * 0.62;
            temporalAlpha[index] = alpha;

            if (alpha > 2) {
              const outputIndex = index * 4;
              output.data[outputIndex] = 246;
              output.data[outputIndex + 1] = 243;
              output.data[outputIndex + 2] = 237;
              output.data[outputIndex + 3] = alpha;
            }
          }
        }

        outputContext.putImageData(output, 0, 0);
      }

      if (reducedMotion && lastPaint > 0) return;

      if (video.requestVideoFrameCallback) {
        videoFrame = video.requestVideoFrameCallback(paintEdges);
      } else {
        animationFrame = window.requestAnimationFrame(paintEdges);
      }
    };

    if (video.requestVideoFrameCallback) {
      videoFrame = video.requestVideoFrameCallback(paintEdges);
    } else {
      animationFrame = window.requestAnimationFrame(paintEdges);
    }

    return () => {
      stopped = true;
      window.cancelAnimationFrame(animationFrame);
      video.cancelVideoFrameCallback?.(videoFrame);
    };
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-55 mix-blend-screen"
    />
  );
}
