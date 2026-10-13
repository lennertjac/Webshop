'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { CardBack, ProductImage } from '@/components/product/ProductImage';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { formatPrice } from '@/lib/config';
import type { Product } from '@/lib/types';

const POSE = [
  { rotate: -9, x: 0, y: 26, z: 1 },
  { rotate: 2, x: 0, y: 0, z: 3 },
  { rotate: 10, x: 0, y: 40, z: 2 },
];

/** Foreground "discovered" cards. Real products when available, card backs otherwise. */
export function HeroCards({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  const items = products.slice(0, 3);
  const slots = items.length ? items : [null, null, null];
  const lead = items[0];

  return (
    <div className="relative mx-auto flex w-full max-w-[560px] items-end justify-center pb-6 pt-4 lg:pb-10">
      <div className="absolute inset-x-6 bottom-2 h-10 rounded-[50%] bg-navy/30 blur-xl" aria-hidden />
      <div className="absolute inset-x-12 bottom-6 h-24 rounded-[50%] bg-cyan/40 blur-2xl" aria-hidden />
      <ul className="relative flex items-end justify-center -space-x-8 sm:-space-x-10">
        {slots.map((p, i) => {
          const pose = POSE[i] ?? POSE[0];
          const card = (
            <div className="relative aspect-[5/7] w-[104px] overflow-hidden rounded-xl border-2 border-gold/80 bg-navy shadow-[0_24px_40px_-12px_rgba(24,38,63,0.55)] sm:w-[150px] lg:w-[170px] xl:w-[190px]">
              {p ? <ProductImage src={p.images[0]} alt={p.name} priority sizes="190px" className="object-cover" /> : <CardBack />}
            </div>
          );
          return (
            <motion.li
              key={p?.id ?? i}
              style={{ zIndex: pose.z }}
              initial={reduce ? false : { opacity: 0, y: 40, rotate: 0 }}
              animate={{ opacity: 1, y: pose.y, rotate: pose.rotate }}
              transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduce ? undefined : { y: pose.y - 10, rotate: pose.rotate / 2 }}
            >
              {p ? (
                <Link href={`/products/${p.slug}`} aria-label={`${p.name}, ${formatPrice(p.price)}`} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </motion.li>
          );
        })}
      </ul>
      {lead && (
        <Link
          href={`/products/${lead.slug}`}
          className="absolute -bottom-3 left-1/2 z-10 flex max-w-[92%] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold/60 bg-ivory/95 px-3.5 py-1.5 font-sans text-xs shadow-card backdrop-blur hover:border-gold sm:text-sm"
        >
          <GradeBadge product={lead} />
          <span className="max-w-[180px] truncate font-semibold text-navy">{lead.name}</span>
          <span className="font-bold text-navy">{formatPrice(lead.price)}</span>
        </Link>
      )}
    </div>
  );
}
