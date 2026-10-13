import type { Metadata } from 'next';
import { Camera, Coins, PackageOpen, Search, Truck } from 'lucide-react';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Sell Your Collection',
  description: 'Sell your TCG cards, graded slabs and sealed product to Atlas. Fast valuation, tracked shipping and secure payment.',
  alternates: { canonical: '/sell' },
};

const STEPS = [
  { icon: Camera, title: '1. Tell us what you have', text: 'Describe your cards or collection and upload a few clear photos.' },
  { icon: Search, title: '2. We value it', text: 'We price against current market sales, condition and demand, then send you a no-obligation offer.' },
  { icon: Truck, title: '3. Ship it to Atlas', text: 'Accept the offer and send your cards tracked and well packed. We can advise on packaging.' },
  { icon: Coins, title: '4. Get paid', text: 'Once we have checked the parcel, payment is sent by bank transfer.' },
];

export default function SellPage() {
  return (
    <>
      <PageHero title="Sell Your Collection" flavour="Bring your discoveries to Atlas" description="Singles, graded slabs, sealed product or whole collections – we are always looking for interesting pieces." scene="sell" crumbs={[{ name: 'Home', href: '/' }, { name: 'Sell to Us' }]} />
      <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-8 font-sans">
          <section>
            <h2 className="font-serif text-3xl font-bold">What we buy</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/90">
              <li>
                <strong className="text-navy">Supported TCGs:</strong> Pokémon, Riftbound, One Piece, Magic: The Gathering and selected others.
              </li>
              <li>
                <strong className="text-navy">Graded cards:</strong> PSA, CGC, BGS and other recognised grading companies.
              </li>
              <li>
                <strong className="text-navy">Raw cards:</strong> Near Mint singles, rare and high-end pieces, and bulk worth shipping.
              </li>
              <li>
                <strong className="text-navy">Sealed product:</strong> booster boxes, displays, packs and collections.
              </li>
            </ul>
          </section>
          <section aria-label="How it works">
            <h2 className="font-serif text-3xl font-bold">How it works</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-xl border border-stone/70 bg-white p-4 shadow-card">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-arcane/10 text-arcane ring-1 ring-gold/50">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-sans text-base font-bold text-navy">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted">
              <PackageOpen className="mt-0.5 size-4 shrink-0" aria-hidden /> Offers are based on photos and your description and confirmed after we inspect the cards.
            </p>
          </section>
        </div>
        <div>
          <h2 className="mb-4 font-serif text-3xl font-bold">Submit your collection</h2>
          <InquiryForm type="sell" />
        </div>
      </Container>
    </>
  );
}
