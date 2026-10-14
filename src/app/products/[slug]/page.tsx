import type { Metadata } from 'next';
import { permanentRedirect, notFound } from 'next/navigation';
import { Scene } from '@/components/art/Scene';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { ProductSection } from '@/components/product/ProductSection';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RecentlyViewed, ViewTracker } from '@/components/product/RecentlyViewed';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { JsonLd } from '@/components/ui/JsonLd';
import { Breadcrumbs, Container, Price, ProductTags, StockStatus } from '@/components/ui/primitives';
import { TCG_META } from '@/lib/collections';
import { SITE_URL } from '@/lib/config';
import { getProductBySlugOrId, getProducts } from '@/lib/data/products';
import type { Product } from '@/lib/types';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProductBySlugOrId((await params).slug);
  if (!p) return {};
  const description = p.description ?? `${p.name}${p.set ? ` – ${p.set}` : ''}. ${p.isGraded ? `${p.gradingCompany ?? ''} ${p.grade ?? ''}` : p.condition}. Authenticity guaranteed, securely shipped.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: 'website', title: p.name, description, url: `/products/${p.slug}`, images: p.images[0] ? [{ url: p.images[0] }] : undefined },
  };
}

const availabilityUrl = (p: Product) =>
  ({ 'in-stock': 'InStock', 'low-stock': 'LimitedAvailability', 'sold-out': 'OutOfStock', preorder: 'PreOrder' })[p.availability];

function productJsonLd(p: Product) {
  const newCondition = p.kind === 'sealed' || p.isGraded || ['Mint', 'Near Mint', 'Sealed'].includes(p.condition);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.id,
    image: p.images,
    description: p.description ?? `${p.name} – ${p.tcgLabel}`,
    brand: { '@type': 'Brand', name: p.tcgLabel },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${p.slug}`,
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: `https://schema.org/${availabilityUrl(p)}`,
      itemCondition: `https://schema.org/${newCondition ? 'NewCondition' : 'UsedCondition'}`,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const key = (await params).slug;
  const product = await getProductBySlugOrId(key);
  if (!product) notFound();
  if (product.slug !== key) permanentRedirect(`/products/${product.slug}`);

  const all = await getProducts();
  const others = all.filter((p) => p.id !== product.id && p.stock > 0);
  const related = [...others.filter((p) => p.tcg === product.tcg && p.kind === product.kind), ...others.filter((p) => p.tcg === product.tcg)]
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 10);
  const sameSet = product.set ? others.filter((p) => p.set === product.set).slice(0, 10) : [];

  const tcgSlug = TCG_META[product.tcg].slug;

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ViewTracker productId={product.id} />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs
          className="mb-5"
          items={[{ name: 'Home', href: '/' }, { name: 'Shop', href: '/shop' }, { name: product.tcgLabel, href: product.tcg === 'other' ? '/shop' : `/collections/${tcgSlug}` }, { name: product.name }]}
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <ProductGallery
            images={product.images}
            name={product.name}
            backdrop={<Scene variant="gateway" />}
            badge={<ProductTags tags={product.tags} max={3} />}
          />

          <div className="space-y-5 lg:pt-2">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">{[product.tcgLabel, product.set].filter(Boolean).join(' · ')}</p>
              <h1 className="mt-1 font-serif text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-stone/70 bg-white p-4 font-sans text-sm sm:grid-cols-3">
              {product.cardNumber && (
                <div>
                  <dt className="text-xs text-muted">Card number</dt>
                  <dd className="font-semibold text-navy">{product.cardNumber}</dd>
                </div>
              )}
              {product.language && (
                <div>
                  <dt className="text-xs text-muted">Language</dt>
                  <dd className="font-semibold text-navy">{product.language}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-muted">Condition</dt>
                <dd className="font-semibold text-navy">{product.condition}</dd>
              </div>
              {product.isGraded && (
                <>
                  <div>
                    <dt className="text-xs text-muted">Grading company</dt>
                    <dd className="font-semibold text-navy">{product.gradingCompany ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Grade</dt>
                    <dd>
                      <GradeBadge product={product} />
                    </dd>
                  </div>
                  {product.certNumber && (
                    <div>
                      <dt className="text-xs text-muted">Certificate</dt>
                      <dd className="font-semibold tabular-nums text-navy">{product.certNumber}</dd>
                    </div>
                  )}
                </>
              )}
              <div>
                <dt className="text-xs text-muted">Product type</dt>
                <dd className="font-semibold text-navy">{product.productType}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <Price product={product} size="lg" />
                <p className="mt-1 font-sans text-xs text-muted">{product.requestToBuy ? 'Insured shipping and payment details are confirmed personally.' : 'VAT included where applicable. Shipping calculated at checkout.'}</p>
              </div>
              <StockStatus product={product} detailed />
            </div>

            <ProductPurchasePanel product={product} />
          </div>
        </div>

        <div className="mt-12">
          <ProductTabs product={product} />
        </div>
      </Container>

      <ProductSection title="You May Also Like" products={related} />
      <ProductSection title="More From This Set" products={sameSet} tone="parchment" />
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
