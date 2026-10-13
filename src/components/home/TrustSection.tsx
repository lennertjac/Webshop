import { BadgeCheck, Lock, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { Container, SectionHeading } from '@/components/ui/primitives';

const ITEMS = [
  { icon: BadgeCheck, title: 'Authenticity Guaranteed', text: 'Every card is checked before it is listed.' },
  { icon: Lock, title: 'Secure Payments', text: 'Encrypted checkout with trusted payment providers.' },
  { icon: PackageCheck, title: 'Careful Packaging', text: 'Sleeved, toploaded and padded for the journey.' },
  { icon: Truck, title: 'Tracked Shipping', text: 'Tracked and insured delivery options worldwide.' },
  { icon: ShieldCheck, title: 'Trusted Grading Companies', text: 'PSA, CGC, BGS and more – grades clearly shown.' },
];

export function TrustSection() {
  return (
    <section aria-label="Collect with confidence" className="py-12 sm:py-16">
      <Container>
        <SectionHeading title="Collect With Confidence" className="justify-center text-center" />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-stone/70 bg-white p-5 text-center shadow-card max-md:last:col-span-2">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-arcane/10 text-arcane ring-1 ring-gold/50">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-3 font-sans text-sm font-bold text-navy">{title}</h3>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
