import type { Metadata } from 'next';
import { Avatar } from '@/components/team/ContactPersonCard';
import { PageHero } from '@/components/shop/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import { STORY, TEAM } from '@/lib/team';

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet the people behind Atlas and why we built a home for collectors.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero title={STORY.title} flavour="The story of Atlas" description="Two collectors. One map to the rarest finds." scene="story" crumbs={[{ name: 'Home', href: '/' }, { name: 'About' }]} />
      <Container className="max-w-3xl py-10 font-sans text-base leading-relaxed text-ink/90 sm:py-14">
        <div className="space-y-5">
          {STORY.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 className="mb-5 mt-14 font-serif text-3xl font-bold">Who you will talk to</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {TEAM.map((m) => (
            <li key={m.id} className="flex gap-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-card">
              <Avatar member={m} size={72} />
              <div>
                <p className="text-lg font-bold text-navy">{m.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">{m.role}</p>
                <p className="mt-2 text-sm leading-snug text-ink/85">{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/shop">Shop all products</ButtonLink>
          <ButtonLink href="/sell" variant="premium">
            Sell to Us
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
