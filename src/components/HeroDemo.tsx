'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Captions,
  Check,
  Clapperboard,
  Crop,
  Mic2,
  Scissors,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import VideoEdgeOverlay from './VideoEdgeOverlay';

gsap.registerPlugin(ScrollTrigger);

const WireframeScene = dynamic(() => import('./WireframeScene'), { ssr: false });

const waveform = [
  22, 48, 32, 72, 42, 84, 36, 64, 28, 76, 54, 92, 44, 70, 30, 58, 82, 38,
  68, 46, 88, 34, 62, 50, 78, 26, 56, 86, 40, 74, 32, 66, 48, 80, 36, 60,
];

export default function HeroDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 1023px)');

    const ctx = gsap.context(() => {
      gsap.set('.story-copy', { autoAlpha: 0, y: 22 });
      gsap.set('.story-copy-1', { autoAlpha: 1, y: 0 });
      gsap.set('.edit-layer', { transformOrigin: '50% 50%' });
      gsap.set('.wireframe-layer', { opacity: 0.62, scale: 0.96 });

      if (media.matches || compact.matches) {
        gsap.set('.story-copy', { autoAlpha: 1, y: 0 });
        gsap.set('.edit-stack', { rotateX: -3, rotateY: -8, scale: 0.98 });

        if (!media.matches) {
          gsap.utils.toArray<HTMLElement>('.story-copy').forEach((copy) => {
            gsap.fromTo(
              copy,
              { autoAlpha: 0.3, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: copy,
                  start: 'top 92%',
                  end: 'top 58%',
                  scrub: 0.55,
                },
              },
            );
          });

          gsap.fromTo(
            '.story-visual',
            { autoAlpha: 0.72, scale: 0.96 },
            {
              autoAlpha: 1,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: '.story-visual',
                start: 'top 92%',
                end: 'center 52%',
                scrub: 0.65,
              },
            },
          );
        }
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=4200',
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
        },
      });

      timeline
        .fromTo(
          '.edit-stack',
          { scale: 0.78, rotateX: 8, rotateY: -28, xPercent: 16 },
          { scale: 1, rotateX: -5, rotateY: -18, xPercent: 16, duration: 1.2 },
        )
        .to('.wireframe-layer', { opacity: 1, scale: 1, duration: 1.1 }, '<')
        .fromTo(
          '.layer-transcript',
          { z: -8, xPercent: 0, opacity: 0.3 },
          { z: 170, xPercent: -9, opacity: 1, duration: 1.2 },
          '<',
        )
        .fromTo(
          '.layer-captions',
          { z: 10, opacity: 0.35 },
          { z: 105, opacity: 0.95, duration: 1.1 },
          '<0.08',
        )
        .to({}, { duration: 0.55 })
        .to('.story-copy-1', { autoAlpha: 0, y: -18, duration: 0.25 })
        .to('.story-copy-2', { autoAlpha: 1, y: 0, duration: 0.35 })
        .to(
          '.edit-stack',
          { rotateX: 6, rotateY: 21, xPercent: -64, scale: 0.72, duration: 1.15 },
          '<',
        )
        .to(
          '.layer-transcript',
          { z: -115, xPercent: 0, opacity: 0.28, duration: 0.8 },
          '<',
        )
        .to(
          '.layer-captions',
          { z: -48, opacity: 0.25, duration: 0.8 },
          '<',
        )
        .fromTo(
          '.layer-grade',
          { z: 15, xPercent: 0, opacity: 0.3 },
          { z: 190, xPercent: -3, opacity: 1, duration: 1.1 },
          '<0.08',
        )
        .fromTo(
          '.layer-crop',
          { z: 25, opacity: 0.2 },
          { z: 250, opacity: 0.9, duration: 1.1 },
          '<',
        )
        .to({}, { duration: 0.6 })
        .to('.story-copy-2', { autoAlpha: 0, y: -18, duration: 0.25 })
        .to('.story-copy-3', { autoAlpha: 1, y: 0, duration: 0.35 })
        .to(
          '.edit-stack',
          { rotateX: -6, rotateY: -22, xPercent: 16, scale: 0.96, duration: 1.2 },
          '<',
        )
        .to(
          '.layer-grade, .layer-crop',
          { z: -78, xPercent: 0, opacity: 0.25, duration: 0.85 },
          '<',
        )
        .fromTo(
          '.layer-audio',
          { z: -10, xPercent: 0, opacity: 0.22 },
          { z: 155, xPercent: -7, opacity: 0.95, duration: 1.05 },
          '<0.05',
        )
        .fromTo(
          '.layer-prompt',
          { z: 15, opacity: 0 },
          { z: 245, opacity: 1, duration: 1.05 },
          '<0.08',
        )
        .to('.edit-stack', { rotateX: 0, rotateY: -7, xPercent: 0, scale: 1, duration: 1.2 })
        .to(
          '.edit-layer',
          { z: 0, xPercent: 0, opacity: 1, duration: 1.1, stagger: 0.04 },
          '<',
        )
        .to('.final-ready', { autoAlpha: 1, y: 0, duration: 0.35 }, '<0.6')
        .to({}, { duration: 0.55 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="editor-story"
      className="relative min-h-[100dvh] overflow-hidden bg-[#080808] text-[#f4f1ec]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_54%_45%,rgba(255,104,61,0.055),transparent_38%)]" />

      <div className="story-grid relative mx-auto grid min-h-[100dvh] max-w-[1440px] grid-cols-1 items-center px-5 py-20 md:px-10 lg:grid-cols-12 lg:px-14">
        <StoryCopy
          className="story-copy-1 lg:col-span-4 lg:col-start-1 lg:row-start-1"
          icon={<Captions size={16} />}
          label="Speech and subtitles"
          title="Clean every word."
          body="Remove filler words, repair the transcript, and style captions without touching a timeline."
          points={['Transcript aware cuts', 'Word-perfect subtitle timing']}
        />

        <StoryCopy
          className="story-copy-2 lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:isolate lg:justify-self-end"
          icon={<Clapperboard size={16} />}
          label="Cinematic direction"
          title="Change the feeling."
          body="Reframe the subject, balance the grade, and give every shot a consistent cinematic look."
          points={['Subject-aware reframing', 'Shot-matched color grade']}
        />

        <StoryCopy
          className="story-copy-3 lg:col-span-4 lg:col-start-1 lg:row-start-1"
          icon={<WandSparkles size={16} />}
          label="AI directed edit"
          title="Describe the final cut."
          body="Ask for tighter pacing, cleaner audio, and platform-ready framing in a single prompt."
          points={['Natural language editing', 'Publish-ready sequences']}
        />

        <div className="story-visual relative order-first mb-12 h-[55vw] min-h-[310px] max-h-[650px] lg:order-none lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mb-0">
          <div className="absolute inset-[-4%] [perspective:1500px]">
            <div className="edit-stack absolute inset-[9%_4%] [transform-style:preserve-3d]">
              <div className="wireframe-layer pointer-events-none absolute inset-[-5%_-6%] z-[32]">
                <WireframeScene />
              </div>

              <div className="edit-layer layer-shell absolute inset-0 overflow-hidden rounded-[22px] border border-white/20 bg-[#111110] shadow-[0_50px_120px_rgba(0,0,0,0.7)] [backface-visibility:hidden]">
                <div className="flex h-11 items-center justify-between border-b border-white/10 px-4 text-[10px] text-white/45">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ff683d]" />
                    <span className="font-semibold tracking-[0.14em] text-white/70">CRAON STUDIO</span>
                  </div>
                  <span className="font-mono">DESKTOP 16:9</span>
                </div>

                <div className="relative h-[calc(100%-44px)] overflow-hidden bg-[#0a0a0a]">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover opacity-80"
                    src="/showreel.mp4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
                  <VideoEdgeOverlay videoRef={videoRef} />
                  <div className="absolute inset-x-[12%] bottom-[14%] z-20 text-center">
                    <span className="inline-block rounded-lg bg-[#f4f1ec] px-4 py-2 text-sm font-black tracking-[-0.02em] text-[#111] shadow-xl sm:text-xl">
                      Make the moment feel cinematic.
                    </span>
                  </div>
                </div>
              </div>

              <div className="edit-layer layer-transcript absolute inset-[4%_66%_8%_-10%] rounded-[18px] border border-white/25 bg-[#111110]/92 p-4 shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em] text-white/65">
                  <Mic2 size={14} className="text-[#ff683d]" />
                  TRANSCRIPT
                </div>
                <div className="space-y-3 text-[10px] leading-relaxed text-white/45 sm:text-xs">
                  <p><span className="text-white/25">00:02</span> Today I want to show you how I shape a scene.</p>
                  <p className="rounded-lg border border-[#ff683d]/35 bg-[#ff683d]/8 p-2 text-white/85">
                    <span className="line-through decoration-[#ff683d]">Um, there is a pause here</span>
                  </p>
                  <p><span className="text-white/25">00:08</span> The story should move without losing the breath.</p>
                </div>
              </div>

              <div className="edit-layer layer-captions pointer-events-none absolute inset-[12%_8%_10%_16%] rounded-[20px] border border-dashed border-white/28 bg-transparent [backface-visibility:hidden]">
                <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-white/15" />
                <div className="absolute left-[12%] right-[12%] top-[68%] border-t border-dashed border-white/15" />
                <div className="absolute left-1/2 top-[9%] -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/30 bg-black/80 px-4 py-2 text-sm font-extrabold text-white">
                  WORD PERFECT CAPTIONS
                </div>
              </div>

              <div className="edit-layer layer-grade absolute inset-[7%_0_7%_62%] overflow-hidden rounded-[18px] border border-white/22 bg-[#121211]/94 p-4 shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em] text-white/65">
                  <Sparkles size={14} className="text-[#ff683d]" />
                  CINEMATIC GRADE
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['Clean', 'Noir', 'Sunset', 'Film'].map((look, index) => (
                    <div
                      key={look}
                      className={`aspect-[4/3] overflow-hidden rounded-lg border ${
                        index === 2 ? 'border-[#ff683d]' : 'border-white/10'
                      }`}
                    >
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                        src="/showreel.mp4"
                        style={{
                          filter: [
                            'saturate(.7)',
                            'grayscale(1) contrast(1.25)',
                            'saturate(1.25) sepia(.12)',
                            'contrast(1.12) saturate(.85)',
                          ][index],
                        }}
                      />
                      <span className="relative -top-6 ml-2 text-[9px] font-semibold text-white">{look}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="edit-layer layer-crop pointer-events-none absolute inset-[9%_9%_13%_13%] rounded-[20px] border border-white/35 [backface-visibility:hidden]">
                <Crop size={18} className="absolute -right-2 -top-2 rounded bg-[#f4f1ec] p-0.5 text-black" />
                <div className="absolute inset-y-0 left-1/3 border-l border-dashed border-white/16" />
                <div className="absolute inset-y-0 left-2/3 border-l border-dashed border-white/16" />
                <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-white/16" />
                <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-white/16" />
              </div>

              <div className="edit-layer layer-audio absolute inset-[64%_16%_-9%_-4%] rounded-[18px] border border-white/25 bg-[#111110]/94 p-4 shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="mb-3 flex items-center justify-between text-[9px] font-semibold tracking-[0.1em] text-white/55">
                  <span className="flex items-center gap-2"><Scissors size={13} className="text-[#ff683d]" /> SMART PACING</span>
                  <span className="text-[#ff9a7c]">3 PAUSES REMOVED</span>
                </div>
                <div className="flex h-12 items-center gap-[3px] overflow-hidden rounded-lg bg-black/55 px-3">
                  {waveform.map((height, index) => (
                    <span
                      key={index}
                      className={`w-1 shrink-0 rounded-full ${index > 13 && index < 18 ? 'bg-[#ff683d]/25' : 'bg-[#ff683d]'}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="edit-layer layer-prompt absolute inset-[76%_-2%_-8%_28%] flex items-center gap-3 rounded-[18px] border border-white/25 bg-[#171614]/95 p-3 shadow-2xl backdrop-blur-xl [backface-visibility:hidden]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff683d] text-[#140a06]">
                  <WandSparkles size={17} />
                </div>
                <p className="flex-1 text-[10px] font-medium text-white/90 sm:text-xs">
                  Make it tighter, add bold subtitles, and give it a warm cinematic grade.
                </p>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4f1ec] text-black">
                  <Check size={15} />
                </div>
              </div>

              <div className="final-ready invisible absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 translate-y-4 items-center gap-3 rounded-2xl border border-white/25 bg-[#111110]/95 px-5 py-4 opacity-0 shadow-2xl backdrop-blur-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff683d] text-black">
                  <Check size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Your cut is ready</p>
                  <p className="text-[10px] text-white/45">Captions, color, audio, and pacing applied</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryCopy({
  className,
  icon,
  label,
  title,
  body,
  points,
}: {
  className: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <article className={`story-copy relative z-40 max-w-[380px] py-8 opacity-100 lg:invisible lg:py-0 lg:opacity-0 ${className}`}>
      <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-[#ff9a7c]">
        {icon}
        <span className="uppercase">{label}</span>
      </div>
      <h2 className="max-w-[11ch] text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white [text-shadow:0_3px_24px_rgba(0,0,0,.9)] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-[34ch] text-sm leading-6 text-white/72 [text-shadow:0_2px_14px_rgba(0,0,0,.9)]">{body}</p>
      <div className="mt-7 space-y-3">
        {points.map((point) => (
          <div key={point} className="flex items-center gap-3 text-xs text-white/86">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-[#ff683d]/40 text-[#ff9a7c]">
              <Check size={11} />
            </span>
            {point}
          </div>
        ))}
      </div>
    </article>
  );
}
