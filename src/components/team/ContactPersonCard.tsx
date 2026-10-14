import Image from 'next/image';
import type { TeamMember } from '@/lib/team';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function Avatar({ member, size = 56 }: { member: TeamMember; size?: number }) {
  return member.photo ? (
    <Image src={member.photo} alt={member.name} width={size} height={size} className="rounded-full border-2 border-gold/70 object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full border-2 border-gold/70 bg-navy font-serif font-bold text-gold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials(member.name)}
    </span>
  );
}

export function ContactPersonCard({ member, replyTime }: { member: TeamMember; replyTime?: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gold/50 bg-white p-4">
      <Avatar member={member} />
      <div className="font-sans">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">Your contact</p>
        <p className="text-base font-bold text-navy">
          {member.name} <span className="font-normal text-muted">· {member.role}</span>
        </p>
        <p className="mt-1 text-sm leading-snug text-ink/85">{member.bio}</p>
        {replyTime && <p className="mt-2 text-xs font-semibold text-emerald">We reply {replyTime}.</p>}
      </div>
    </div>
  );
}
