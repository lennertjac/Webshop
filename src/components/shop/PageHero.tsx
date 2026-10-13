import { Scene } from '@/components/art/Scene';
import { Breadcrumbs, Container, type Crumb } from '@/components/ui/primitives';
import type { SceneVariant } from '@/lib/collections';

interface Props {
  title: string;
  flavour?: string;
  description?: string;
  scene: SceneVariant;
  crumbs: Crumb[];
  dark?: boolean;
}

/** Small atmospheric header – normal filters and grids always follow directly below. */
export function PageHero({ title, flavour, description, scene, crumbs, dark }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-gold/40">
      <div className="absolute inset-0 -z-10">
        <Scene variant={scene} />
        <div className={dark ? 'absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-navy/10' : 'absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/75 to-ivory/10'} />
      </div>
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={crumbs} className={dark ? '[&_*]:!text-white/85' : ''} />
        <h1 className={`mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl ${dark ? '!text-white' : ''}`}>{title}</h1>
        {flavour && <p className={`mt-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'text-gold' : 'text-gold-dark'}`}>{flavour}</p>}
        {description && <p className={`mt-3 max-w-xl font-sans text-sm sm:text-base ${dark ? 'text-white/90' : 'text-ink/80'}`}>{description}</p>}
      </Container>
    </section>
  );
}
