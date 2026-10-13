import type { Metadata } from 'next';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';
import { RETURNS_POLICY, SHIPPING_POLICY } from '@/lib/policies';

export const metadata: Metadata = { title: 'Shipping & Returns', description: 'Delivery times, shipping costs and our returns policy.', alternates: { canonical: '/shipping-returns' } };

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHero title="Shipping & Returns" scene="plain" crumbs={[{ name: 'Home', href: '/' }, { name: 'Shipping & Returns' }]} />
      <Container className="max-w-3xl space-y-10 py-10 font-sans text-base leading-relaxed text-ink/90 sm:py-14">
        <section>
          <h2 className="mb-3 font-serif text-3xl font-bold">Shipping</h2>
          <div className="space-y-3">
            {SHIPPING_POLICY.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-3xl font-bold">Returns</h2>
          <div className="space-y-3">
            {RETURNS_POLICY.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
