import clsx from 'clsx';
import { BadgeCheck } from 'lucide-react';
import type { Product } from '@/lib/types';

export function GradeBadge({ product, className }: { product: Pick<Product, 'isGraded' | 'gradingCompany' | 'grade'>; className?: string }) {
  if (!product.isGraded || !product.grade) return null;
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-md bg-navy px-2 py-0.5 font-sans text-xs font-bold text-gold ring-1 ring-gold/60', className)}>
      <BadgeCheck className="size-3.5" aria-hidden />
      {[product.gradingCompany, product.grade].filter(Boolean).join(' ')}
    </span>
  );
}

/** Condition / grade / number line shown on cards and in quick view. */
export function ProductSpecsLine({ product }: { product: Product }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-muted">
      <GradeBadge product={product} />
      {!product.isGraded && <span className="font-medium text-ink/80">{product.condition}</span>}
      {product.cardNumber && <span>{product.cardNumber}</span>}
      {product.language && <span>{product.language}</span>}
    </div>
  );
}
