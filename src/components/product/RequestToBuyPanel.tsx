import { Handshake, Lock, ShieldCheck, Truck } from 'lucide-react';
import { Avatar } from '@/components/team/ContactPersonCard';
import { ButtonLink } from '@/components/ui/Button';
import { REPLY_TIME } from '@/lib/config';
import { TEAM } from '@/lib/team';
import type { Product } from '@/lib/types';
import { WishlistButton } from './ProductActions';

/** Purchase panel for high-value items: price stays public, buying goes through a personal request page. */
export function RequestToBuyPanel({ product }: { product: Product }) {
  const soldOut = product.availability === 'sold-out';
  const base = `/products/${product.slug}/request`;
  return (
    <div id="request" className="scroll-mt-28 space-y-5">
      <div className="flex gap-2">
        {soldOut ? (
          <span className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-stone/60 font-sans text-base font-semibold text-muted">Sold out</span>
        ) : (
          <>
            <ButtonLink href={base} size="lg" full>
              Request to buy
            </ButtonLink>
            <ButtonLink href={`${base}?mode=offer`} size="lg" full variant="premium">
              <Handshake className="size-4" aria-hidden /> Make an offer
            </ButtonLink>
          </>
        )}
        <WishlistButton product={product} className="size-12 shrink-0" />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-gold/50 bg-white p-4">
        <div className="flex -space-x-3">
          {TEAM.map((m) => (
            <Avatar key={m.id} member={m} size={44} />
          ))}
        </div>
        <p className="font-sans text-sm text-ink/85">
          <strong className="text-navy">{TEAM.map((m) => m.name).join(' or ')}</strong> will help you personally. You choose who on the next step. We reply {REPLY_TIME}.
        </p>
      </div>

      <ul className="grid gap-2 rounded-xl border border-stone/70 bg-white p-4 font-sans text-sm text-ink">
        <li className="flex items-start gap-3">
          <Lock className="mt-0.5 size-5 shrink-0 text-arcane" aria-hidden />
          <span>
            <strong className="text-navy">Secure payment.</strong> After we agree, you pay by bank transfer or a secure payment link. The card is held for you meanwhile.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Truck className="mt-0.5 size-5 shrink-0 text-arcane" aria-hidden />
          <span>
            <strong className="text-navy">Insured shipping.</strong> Tracked, insured and signed-for, in a rigid box.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-arcane" aria-hidden />
          <span>
            <strong className="text-navy">Authenticity guaranteed.</strong> Graded cards ship in the sealed slab, with the certificate number shown above.
          </span>
        </li>
      </ul>
    </div>
  );
}
