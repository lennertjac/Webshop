import type { Metadata } from 'next';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';
import { FAQ_ITEMS } from '@/lib/policies';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = { title: 'FAQ', description: 'Answers about orders, shipping, grading and returns.', alternates: { canonical: '/faq' } };

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <PageHero title="Frequently Asked Questions" scene="plain" crumbs={[{ name: 'Home', href: '/' }, { name: 'FAQ' }]} />
      <Container className="max-w-3xl py-10 sm:py-14">
        <div className="divide-y divide-stone/60 overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-card">
          {FAQ_ITEMS.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink/85">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
