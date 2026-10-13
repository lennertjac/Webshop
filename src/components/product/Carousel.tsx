'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

/** Scroll-snap carousel; slides are server-rendered children. */
export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-4 pt-1 sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:px-0 [&>li]:w-[46%] [&>li]:shrink-0 [&>li]:snap-start sm:[&>li]:w-[31%] lg:[&>li]:w-[calc(25%-12px)] 3xl:[&>li]:w-[calc(20%-13px)]"
      >
        {children}
      </ul>
      {(['prev', 'next'] as const).map((d) => (
        <button
          key={d}
          type="button"
          aria-label={d === 'prev' ? 'Previous products' : 'Next products'}
          onClick={() => scrollBy(d === 'prev' ? -1 : 1)}
          className={`absolute top-[38%] z-10 hidden size-11 place-items-center rounded-full border border-stone bg-white text-navy shadow-card hover:border-gold lg:grid ${d === 'prev' ? '-left-5' : '-right-5'}`}
        >
          {d === 'prev' ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
        </button>
      ))}
    </div>
  );
}
