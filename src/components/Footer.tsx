import { ArrowUpRight, Copy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] px-5 py-10 text-white/45 md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Copy size={20} strokeWidth={2} className="text-white" />
          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-white">craon</p>
            <p className="mt-0.5 text-[10px]">AI video editing from first cut to final frame.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <a href="#editor-story" className="transition-colors hover:text-white">Features</a>
          <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-white">
            Community <ArrowUpRight size={12} />
          </a>
          <a href="#" className="transition-colors hover:text-white">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
