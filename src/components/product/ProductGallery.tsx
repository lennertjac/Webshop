'use client';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react';
import { useState, type MouseEvent, type ReactNode } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { CardBack, ProductImage } from './ProductImage';

const labelFor = (i: number, total: number) => (i === 0 ? 'Front' : i === 1 && total === 2 ? 'Back' : `Photo ${i + 1}`);

export function ProductGallery({ images, name, backdrop, badge }: { images: string[]; name: string; backdrop?: ReactNode; badge?: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const total = Math.max(images.length, 1);
  const current = images[index];

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const step = (d: 1 | -1) => setIndex((i) => (i + d + total) % total);

  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div className="relative flex-1">
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-stone/70 bg-parchment/60 shadow-card"
          onMouseMove={current ? onMove : undefined}
          onMouseLeave={() => setZoom(null)}
          onClick={() => current && setFullscreen(true)}
        >
          {backdrop && <div className="pointer-events-none absolute inset-0 opacity-40">{backdrop}</div>}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 to-parchment/40" />
          <div
            className="absolute inset-0 p-6 transition-transform duration-200 sm:p-10"
            style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          >
            <div className="relative h-full w-full drop-shadow-[0_18px_22px_rgba(24,38,63,0.3)]">
              {current ? <ProductImage src={current} alt={`${name} – ${labelFor(index, total)}`} priority sizes="(min-width:1024px) 45vw, 100vw" /> : <CardBack />}
            </div>
          </div>
          {badge && <div className="absolute left-4 top-4 z-10">{badge}</div>}
          {current && (
            <button
              type="button"
              aria-label="Open fullscreen viewer"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(true);
              }}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/95 text-navy shadow hover:bg-white"
            >
              <Maximize2 className="size-5" />
            </button>
          )}
          {current && <span className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-sans text-xs text-muted lg:flex"><ZoomIn className="size-3.5" aria-hidden /> Hover to zoom</span>}
        </div>
      </div>

      {total > 1 && (
        <ul className="flex gap-2 lg:w-20 lg:flex-col" aria-label="Product photos">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${labelFor(i, total)} photo`}
                aria-current={i === index}
                className={clsx('relative block h-20 w-16 overflow-hidden rounded-lg border-2 bg-parchment/60 lg:h-24 lg:w-20', i === index ? 'border-gold' : 'border-stone/70 hover:border-gold/60')}
              >
                <ProductImage src={src} alt="" sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={fullscreen} onClose={() => setFullscreen(false)} label={`${name} – fullscreen viewer`} side="center" className="!max-w-6xl !bg-navy">
        <div className="relative h-[85dvh] w-full bg-navy">
          <FullscreenImage src={current} alt={`${name} – ${labelFor(index, total)}`} />
          {total > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy">
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      </Sheet>
    </div>
  );
}

/** Click-to-zoom inspection view for high-resolution slab photos. */
function FullscreenImage({ src, alt }: { src?: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  return (
    <div
      className={clsx('absolute inset-0 overflow-hidden', zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in')}
      onClick={() => setZoomed((z) => !z)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
    >
      <div className="absolute inset-0 p-4 transition-transform duration-200" style={zoomed ? { transform: 'scale(2.5)', transformOrigin: `${pos.x}% ${pos.y}%` } : undefined}>
        <div className="relative h-full w-full">{src ? <ProductImage src={src} alt={alt} sizes="100vw" /> : <CardBack />}</div>
      </div>
    </div>
  );
}
