import type { Metadata } from 'next';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = { title: 'About', description: 'Atlas searches for interesting cards, graded collectibles and sealed products for collectors.', alternates: { canonical: '/about' } };

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Atlas" flavour="Built for Collectors" description="A premium TCG store with a sense of adventure." scene="story" crumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]} />
      <Container className="max-w-3xl py-10 font-sans text-base leading-relaxed text-ink/90 sm:py-14">
        <div className="space-y-5">
          <p>
            Atlas searches for interesting cards, graded collectibles and sealed products for collectors. We started as collectors ourselves, and we still choose every
            piece as if we were going to keep it.
          </p>
          <p>
            Every card is checked before it is listed, photographed in detail and packed with care. Graded cards are shown with their grading company and grade, and
            raw cards are described honestly using standard conditions.
          </p>
          <p>We ship worldwide, tracked, and we are always interested in buying collections too.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop">Shop all products</ButtonLink>
          <ButtonLink href="/sell" variant="premium">
            Sell to Us
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
