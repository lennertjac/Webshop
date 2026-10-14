import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductImage } from '@/components/product/ProductImage';
import { RequestForm } from '@/components/product/RequestForm';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { Breadcrumbs, Container } from '@/components/ui/primitives';
import { formatPrice } from '@/lib/config';
import { getProductBySlugOrId } from '@/lib/data/products';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ mode?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlugOrId((await params).slug);
  return { title: p ? `Request to buy – ${p.name}` : 'Request to buy', robots: { index: false } };
}

export default async function RequestPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const product = await getProductBySlugOrId(slug);
  if (!product) notFound();
  if (!product.requestToBuy || product.availability === 'sold-out') redirect(`/products/${product.slug}`);

  return (
    <Container className="py-6 sm:py-10">
      <Breadcrumbs className="mb-6" items={[{ name: 'Home', href: '/' }, { name: product.name, href: `/products/${product.slug}` }, { name: 'Request to buy' }]} />
      <h1 className="font-serif text-4xl font-bold sm:text-5xl">Request to buy</h1>
      <p className="mt-2 max-w-2xl font-sans text-sm text-muted">Choose the keeper you wish to speak with and tell us what you have in mind. Every legendary piece is confirmed personally before any payment.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
        <aside className="rounded-2xl border border-stone/70 bg-white p-5 shadow-card lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] rounded-xl bg-gradient-to-b from-ivory to-parchment/70">
            <div className="absolute inset-0 p-6">
              <div className="relative h-full w-full drop-shadow-[0_14px_16px_rgba(24,38,63,0.3)]">
                <ProductImage src={product.images[0]} alt={product.name} priority sizes="360px" />
              </div>
            </div>
          </div>
          <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">{[product.tcgLabel, product.set].filter(Boolean).join(' · ')}</p>
          <h2 className="font-serif text-2xl font-bold leading-snug">{product.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-sans text-sm">
            <GradeBadge product={product} />
            {!product.isGraded && <span className="text-ink/80">{product.condition}</span>}
            {product.certNumber && <span className="text-muted">Cert {product.certNumber}</span>}
          </div>
          <p className="mt-3 font-sans text-2xl font-bold tabular-nums text-navy">{formatPrice(product.price)}</p>
        </aside>

        <RequestForm product={{ id: product.id, name: product.name, slug: product.slug, price: product.price }} initialMode={mode === 'offer' ? 'offer' : 'buy'} />
      </div>
    </Container>
  );
}
