import { Scene } from '@/components/art/Scene';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import type { SceneVariant } from '@/lib/collections';

interface Props {
  eyebrow?: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  scene: SceneVariant;
  premium?: boolean;
}

/** Reusable cinematic banner – the CTA always points at products. */
export function PromoBanner({ eyebrow, title, text, cta, href, scene, premium }: Props) {
  return (
    <section aria-label={title} className="py-6 sm:py-8">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl border border-gold/50 shadow-card">
          <div className="absolute inset-0 -z-10">
            <Scene variant={scene} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/10" />
          </div>
          <div className="max-w-xl px-6 py-10 sm:px-12 sm:py-14">
            {eyebrow && <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>}
            <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">{title}</h2>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-white/90 sm:text-base">{text}</p>
            <ButtonLink href={href} size="lg" variant={premium ? 'premium' : 'primary'} className="mt-6">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
