import { Scene } from '@/components/art/Scene';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';

export function StorySection() {
  return (
    <section aria-labelledby="story-title" className="py-12 sm:py-16">
      <Container>
        <div className="grid overflow-hidden rounded-3xl border border-stone/70 bg-white shadow-card md:grid-cols-2">
          <div className="relative min-h-56 md:min-h-[360px]">
            <Scene variant="story" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">Our story</p>
            <h2 id="story-title" className="mt-2 font-serif text-4xl font-bold leading-tight">
              Built for Collectors
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-ink/80">
              Atlas ventures out in search of rare cards, graded relics and sealed treasures so you don’t have to. Each piece is examined, photographed
              and packed by collectors who care about condition as much as you do.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/about" variant="secondary">
                About Atlas
              </ButtonLink>
              <ButtonLink href="/sell" variant="premium">
                Sell to Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
