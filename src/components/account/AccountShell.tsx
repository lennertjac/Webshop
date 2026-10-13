'use client';

import clsx from 'clsx';
import { Heart, LogOut, MapPin, Package, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const { user, loading, logout, configured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) return <Container className="py-20 text-center font-sans text-muted">Loading your account…</Container>;

  if (!user) {
    return (
      <Container className="flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold">My account</h1>
        <p className="font-sans text-muted">{configured ? 'Log in to see your profile, addresses and orders.' : 'Customer accounts are not configured on this deployment.'}</p>
        {configured && (
          <div className="flex gap-3">
            <ButtonLink href="/login">Log in</ButtonLink>
            <ButtonLink href="/register" variant="secondary">
              Create account
            </ButtonLink>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-serif text-4xl font-bold">Hello, {user.firstName}</h1>
      <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav aria-label="Account" className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={clsx('flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 font-sans text-sm font-semibold', pathname === href ? 'bg-navy text-white' : 'text-navy hover:bg-navy/5')}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push('/');
            }}
            className="flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left font-sans text-sm font-semibold text-danger hover:bg-danger/10"
          >
            <LogOut className="size-4" aria-hidden /> Log out
          </button>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
