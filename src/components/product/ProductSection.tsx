import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Container, SectionHeading } from '@/components/ui/primitives';
import { Carousel } from './Carousel';
import { ProductCard, ProductGrid } from './ProductCard';

interface Props {
  title: string;
  eyebrow?: string;
  products: Product[];
  href?: string;
  hrefLabel?: string;
  variant?: 'carousel' | 'grid';
  tone?: 'ivory' | 'parchment';
  id?: string;
}

/** Standard titled product row used on the homepage and product pages. */
export function ProductSection({ title, eyebrow, products, href, hrefLabel, variant = 'carousel', tone = 'ivory', id }: Props) {
  if (!products.length) return null;
  return (
    <section id={id} aria-label={title} className={tone === 'parchment' ? 'bg-parchment-grain py-12 sm:py-16' : 'py-12 sm:py-16'}>
      <Container>
        <SectionHeading
          title={title}
          eyebrow={eyebrow}
          action={
            href && (
              <Link href={href} className="hidden shrink-0 items-center gap-1.5 font-sans text-sm font-semibold text-arcane hover:text-arcane-dark hover:underline sm:inline-flex">
                {hrefLabel ?? 'View all'} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )
          }
        />
        {variant === 'grid' ? (
          <ProductGrid products={products} />
        ) : (
          <Carousel label={title}>
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </Carousel>
        )}
        {href && (
          <div className="mt-4 sm:hidden">
            <Link href={href} className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-arcane hover:underline">
              {hrefLabel ?? 'View all'} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
