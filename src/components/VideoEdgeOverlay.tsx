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
    const width = compact ? 192 : 288;
    const height = Math.round(width * 0.5625);
    const threshold = compact ? 96 : 82;
    const workCanvas = document.createElement('canvas');
    const workContext = workCanvas.getContext('2d', { willReadFrequently: true });
    const outputContext = canvas.getContext('2d');
    if (!workContext || !outputContext) return;

    workCanvas.width = width;
    workCanvas.height = height;
    canvas.width = width;
    canvas.height = height;

    const luminance = new Uint8Array(width * height);
    const output = outputContext.createImageData(width, height);
    let animationFrame = 0;
    let videoFrame = 0;
    let stopped = false;
    let lastPaint = 0;

    const paintEdges = (now: number) => {
      if (stopped) return;

      if (now - lastPaint >= (compact ? 118 : 84) && video.readyState >= 2 && !document.hidden) {
        lastPaint = now;
        workContext.drawImage(video, 0, 0, width, height);
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
            const magnitude = Math.abs(gradientX) + Math.abs(gradientY);

            if (magnitude > threshold) {
              const outputIndex = index * 4;
              const alpha = Math.min(210, Math.max(0, (magnitude - threshold) * 1.45));
              output.data[outputIndex] = 246;
              output.data[outputIndex + 1] = 243;
              output.data[outputIndex + 2] = 237;
              output.data[outputIndex + 3] = alpha;
            }
          }
        }

        outputContext.putImageData(output, 0, 0);
      }

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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70 mix-blend-screen [filter:contrast(1.25)]"
    />
  );
}
