import clsx from 'clsx';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatPrice } from '@/lib/config';
import type { Product, ProductTag } from '@/lib/types';
import { JsonLd } from './JsonLd';
import { SITE_URL } from '@/lib/config';

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function SectionHeading({
  title,
  eyebrow,
  action,
  as: Tag = 'h2',
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={clsx('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">{eyebrow}</p>}
        <Tag className="font-serif text-3xl font-bold leading-tight sm:text-4xl">{title}</Tag>
      </div>
      {action}
    </div>
  );
}

const TAG_STYLES: Record<ProductTag, { label: string; className: string }> = {
  'sold-out': { label: 'Sold out', className: 'bg-ink text-white' },
  'low-stock': { label: 'Low stock', className: 'bg-amber-100 text-amber-900 ring-1 ring-amber-300' },
  sale: { label: 'Sale', className: 'bg-danger text-white' },
  new: { label: 'New', className: 'bg-arcane text-white' },
  preorder: { label: 'Preorder', className: 'bg-violet text-white' },
  vault: { label: 'Vault item', className: 'bg-navy text-gold ring-1 ring-gold/70' },
  rare: { label: 'Rare', className: 'bg-violet/15 text-violet ring-1 ring-violet/30' },
};

const TAG_ORDER: ProductTag[] = ['sold-out', 'low-stock', 'sale', 'preorder', 'new', 'vault', 'rare'];

export function ProductTags({ tags, max = 2, className }: { tags: ProductTag[]; max?: number; className?: string }) {
  const shown = TAG_ORDER.filter((t) => tags.includes(t)).slice(0, max);
  if (!shown.length) return null;
  return (
    <div className={clsx('flex flex-wrap gap-1.5', className)}>
      {shown.map((t) => (
        <span key={t} className={clsx('rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold leading-5', TAG_STYLES[t].className)}>
          {TAG_STYLES[t].label}
        </span>
      ))}
    </div>
  );
}

export function Price({ product, size = 'md' }: { product: Pick<Product, 'price' | 'compareAtPrice'>; size?: 'md' | 'lg' }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 font-sans">
      <span className={clsx('font-bold tabular-nums text-navy', size === 'lg' ? 'text-3xl' : 'text-lg', product.compareAtPrice && 'text-danger')}>
        {formatPrice(product.price)}
      </span>
      {product.compareAtPrice && (
        <s className={clsx('tabular-nums text-muted', size === 'lg' ? 'text-base' : 'text-sm')}>{formatPrice(product.compareAtPrice)}</s>
      )}
    </p>
  );
}

export function StockStatus({ product, detailed = false }: { product: Pick<Product, 'availability' | 'stock'>; detailed?: boolean }) {
  const map = {
    'in-stock': { dot: 'bg-emerald', text: 'In stock', color: 'text-emerald' },
    'low-stock': { dot: 'bg-amber-500', text: detailed ? `Only ${product.stock} left` : 'Low stock', color: 'text-amber-800' },
    'sold-out': { dot: 'bg-muted', text: 'Sold out', color: 'text-muted' },
    preorder: { dot: 'bg-violet', text: 'Preorder', color: 'text-violet' },
  }[product.availability];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 font-sans text-xs font-semibold', map.color)}>
      <span className={clsx('size-2 rounded-full', map.dot)} aria-hidden />
      {map.text}
    </span>
  );
}

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <JsonLd data={ld} />
      <ol className="flex flex-wrap items-center gap-1 font-sans text-sm text-muted">
        {items.map((c, i) => (
          <li key={c.name} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-navy hover:underline">
                {c.name}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-navy">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-3', className)} aria-hidden>
      <span className="gold-hairline flex-1" />
      <svg width="18" height="18" viewBox="0 0 18 18" className="text-gold">
        <path d="M9 1l2.2 5.8L17 9l-5.8 2.2L9 17l-2.2-5.8L1 9l5.8-2.2z" fill="currentColor" />
      </svg>
      <span className="gold-hairline flex-1" />
    </div>
  );
}
