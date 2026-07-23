'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, Check, Copy, MessageCircle, Plus } from 'lucide-react';

const starterPrompt = 'Turn this into a cinematic reel with captions and cuts';

export default function CraonExactHero() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [status, setStatus] = useState<'idle' | 'working' | 'ready'>('idle');

  useEffect(() => {
    if (status !== 'working') return;
    const timeout = window.setTimeout(() => setStatus('ready'), 1250);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const runEdit = () => {
    if (!prompt.trim() || status === 'working') return;
    setStatus('working');
  };

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#080808] text-[#f4f1ec]">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full scale-[1.025] object-cover opacity-80"
          src="/showreel.mp4"
        />
        <div className="absolute inset-0 bg-black/32" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/26 via-transparent to-black/62" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(4,4,4,.24)_66%,rgba(4,4,4,.64)_100%)]" />
      </div>

      <header className="relative z-20 mx-auto flex h-[76px] w-full max-w-[1320px] items-center justify-between px-5 md:px-10">
        <a href="#" className="flex items-center gap-2.5" aria-label="Craon home">
          <Copy size={24} strokeWidth={2} className="text-white" />
          <span className="text-xl font-medium tracking-[-0.04em]">Craon</span>
        </a>

        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href="#editor-story"
            className="hidden text-white/90 transition-colors hover:text-white sm:block"
            aria-label="Join the Craon community"
          >
            <MessageCircle size={18} fill="currentColor" strokeWidth={1.5} />
          </a>
          <button className="rounded-lg bg-[#f4f1ec] px-5 py-2.5 text-xs font-semibold text-[#111] transition-transform active:scale-[0.98]">
            Login
          </button>
          <a href="#editor-story" className="hidden text-xs font-medium text-white underline underline-offset-4 sm:block">
            Sign Up
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-[1160px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-4 text-center md:px-10">
        <h1 className="max-w-[980px] text-[clamp(3rem,5.2vw,5.35rem)] font-semibold leading-[0.96] tracking-[-0.07em] text-white">
          Edit videos in{' '}
          <span className="inline-block pb-1 font-normal italic leading-[1.1] tracking-[-0.055em]">
            seconds
          </span>
        </h1>
        <p className="mt-4 max-w-[590px] text-sm leading-6 text-white/76 sm:text-base">
          From raw clips to scroll-stopping content using one simple prompt.
        </p>

        <div className="mt-10 w-full max-w-[760px] rounded-[20px] border border-white/26 bg-[linear-gradient(180deg,rgba(67,62,58,.78),rgba(20,19,18,.82))] p-4 shadow-[0_28px_90px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl">
          <label htmlFor="hero-prompt" className="sr-only">Describe your video edit</label>
          <textarea
            id="hero-prompt"
            rows={3}
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              if (status === 'ready') setStatus('idle');
            }}
            className="min-h-20 w-full resize-none bg-transparent px-1 py-1 text-left text-sm leading-6 text-white outline-none placeholder:text-white/42"
            placeholder="Describe the edit you want"
          />

          <div className="mt-2 flex items-center justify-between">
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-white/24 text-white/78 transition-colors hover:border-white/50 hover:text-white active:scale-[0.98]"
              aria-label="Add footage"
            >
              <Plus size={17} strokeWidth={1.7} />
            </button>

            <button
              onClick={runEdit}
              disabled={!prompt.trim() || status === 'working'}
              className="grid h-9 min-w-9 place-items-center rounded-full border border-white/16 bg-black/12 px-2 text-white/50 transition-colors hover:border-white/34 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label={status === 'working' ? 'Building your edit' : status === 'ready' ? 'Edit ready' : 'Create edit'}
            >
              {status === 'working' ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : status === 'ready' ? (
                <Check size={16} />
              ) : (
                <ArrowUp size={16} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {status === 'working' ? 'Building your edit' : status === 'ready' ? 'Your edit is ready' : ''}
        </p>
      </div>
    </section>
  );
}
