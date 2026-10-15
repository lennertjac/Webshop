import type { Metadata } from 'next';
import { BadgeCheck, Camera, Coins, Search, ShieldCheck, Truck, XCircle } from 'lucide-react';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';
import { REPLY_TIME, SELL_MIN_VALUE } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Sell Your Cards',
  description: `Sell your pristine cards or collection to Atlas for up to 100% of market value. We buy cards worth €${SELL_MIN_VALUE}+ in perfect condition.`,
  alternates: { canonical: '/sell' },
};

const STEPS = [
  { icon: Camera, title: '1. Send us the details', text: 'Describe your card or collection and add clear photos of the front, back, corners and edges.' },
  { icon: Search, title: '2. We make a provisional offer', text: `We check your photos and description against current market prices and reply ${REPLY_TIME}. This offer is subject to inspection.` },
  { icon: Truck, title: '3. You ship the card to us first', text: 'If you agree, send the cards tracked, insured and well packed. We can advise on packaging. We inspect them when they arrive.' },
  { icon: Coins, title: '4. Inspection, then payment', text: 'If everything matches your description, we confirm the offer and pay by bank transfer. If not, see below.' },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        title="Sell Your Cards"
        flavour="Bring your legends to Atlas"
        description="Bring a legendary card or an entire collection to Atlas and receive its full market value – no tribute, no discount."
        scene="sell"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Sell to Us' }]}
      />
      <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-10 font-sans">
          <section>
            <h2 className="font-serif text-3xl font-bold">Full market value, no discount</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/90">
              Most buyers offer you a fraction of what a card is worth. We pay <strong className="text-navy">up to 100% of the market price</strong> – no worries, no haggling down. In return, we are
              selective: we only want cards we are fully confident in.
            </p>
          </section>

          <section aria-label="What we buy">
            <h2 className="font-serif text-3xl font-bold">What we buy</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/90">
              <li className="flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                <span>
                  <strong className="text-navy">Cards worth €{SELL_MIN_VALUE} or more.</strong> Each card must be above €{SELL_MIN_VALUE} in market value.
                </span>
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                <span>
                  <strong className="text-navy">Pristine condition only.</strong> Perfect corners, edges and surface – and good centering. Centering counts as much as condition.
                </span>
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                <span>
                  <strong className="text-navy">Pokémon, Riftbound and One Piece.</strong> Raw cards that we judge to be in perfect condition, and graded cards.
                </span>
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald" aria-hidden />
                <span>
                  <strong className="text-navy">Single cards or whole collections.</strong> For collections, we look at the qualifying cards in it.
                </span>
              </li>
            </ul>
          </section>

          <section aria-label="What we do not buy">
            <h2 className="font-serif text-3xl font-bold">What we don’t buy</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/90">
              <li className="flex gap-3">
                <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
                <span>Cards below €{SELL_MIN_VALUE}, and bulk or common cards.</span>
              </li>
              <li className="flex gap-3">
                <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
                <span>Played or damaged cards, or cards with off-center printing.</span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted">If we are not sure about a card’s condition or centering, we will tell you honestly instead of making a low offer.</p>
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
            <p className="mt-4 text-xs text-muted">The final offer is confirmed once we have inspected the cards in person and they match the photos and description.</p>
          </section>

          <section aria-label="Inspection and returns" className="rounded-2xl border border-gold/60 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-serif text-3xl font-bold">
              <ShieldCheck className="size-7 text-gold-dark" aria-hidden /> Inspection comes first
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/90">
              <li>
                <strong className="text-navy">You ship first.</strong> We ask you to send the card to us before any payment, so we can inspect it in person.
              </li>
              <li>
                <strong className="text-navy">Flaws that were not mentioned.</strong> If we find any flaw, including centering, that was not mentioned or not visible in your photos, we have the right to
                decline the card.
              </li>
              <li>
                <strong className="text-navy">Safe return.</strong> A declined card is returned to you safely, tracked and insured, and <strong className="text-navy">we cover the return shipping</strong>. Nothing is lost on your side except the wait.
              </li>
              <li>
                <strong className="text-navy">Be honest and detailed up front.</strong> The more accurately you describe the card, the faster and smoother this goes.
              </li>
            </ul>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 font-serif text-3xl font-bold">Submit your cards</h2>
          <InquiryForm type="sell" />
        </div>
      </Container>
    </>
  );
}
