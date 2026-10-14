'use client';

import clsx from 'clsx';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { RETURNS_POLICY, SHIPPING_POLICY } from '@/lib/policies';
import type { Product } from '@/lib/types';

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </div>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const specs = (
    [
      ['TCG', product.tcgLabel],
      ['Set', product.set],
      ['Card number', product.cardNumber],
      ['Rarity', product.rarity],
      ['Language', product.language],
      ['Product type', product.productType],
      ['Condition', product.condition],
      ['Grading company', product.gradingCompany],
      ['Grade', product.grade],
    ] as const
  ).filter(([, v]) => v);

  const tabs: { label: string; content: React.ReactNode }[] = [
    ...(product.contents
      ? [
          {
            label: 'What’s Included',
            content: (
              <ul className="divide-y divide-stone/60">
                {product.contents.map((c) => (
                  <li key={c.name} className="flex items-center justify-between gap-4 py-2.5">
                    <span className="font-semibold text-navy">
                      {c.quantity} × {c.name}
                    </span>
                    <span className="text-muted">{c.type}</span>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    {
      label: 'Description',
      content: <p>{product.description ?? `${product.name}${product.set ? ` from ${product.set}` : ''} – ${product.tcgLabel}. ${product.isGraded ? `Graded ${product.gradingCompany ?? ''} ${product.grade ?? ''}.` : `Condition: ${product.condition}.`} Checked and photographed by our team before listing.`}</p>,
    },
    {
      label: 'Card Details',
      content: (
        <dl className="grid gap-x-8 sm:grid-cols-2">
          {specs.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-stone/60 py-2.5">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold text-navy">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    { label: 'Shipping', content: <Paragraphs items={SHIPPING_POLICY} /> },
    { label: 'Returns', content: <Paragraphs items={RETURNS_POLICY} /> },
    {
      label: 'Collector Information',
      content: (
        <Paragraphs
          items={[
            'Photos show the actual item where available. Ask us for additional high-resolution photos before buying – we are happy to help.',
            'Every item is stored sleeved or in its original packaging and handled with clean hands. Sealed product is stored upright, away from light and moisture.',
            ...(product.isGraded
              ? [`Graded cards come in the sealed ${product.gradingCompany ?? 'grading company'} holder. You can verify the certification number on the grading company’s website.`]
              : []),
          ]}
        />
      ),
    },
  ];

  const onKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="rounded-2xl border border-stone/70 bg-white shadow-card">
      <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-stone/70 px-2">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={clsx('relative shrink-0 px-4 py-3.5 font-sans text-sm font-semibold transition-colors', active === i ? 'text-arcane after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-gold' : 'text-muted hover:text-navy')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.label} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-tab-${i}`} hidden={active !== i} className="p-5 font-sans text-sm leading-relaxed text-ink/90 sm:p-7">
          {t.content}
        </div>
      ))}
    </div>
  );
}
