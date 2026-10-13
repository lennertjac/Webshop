import Link from 'next/link';
import clsx from 'clsx';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'premium' | 'ghost' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

export function buttonClasses({ variant = 'primary', size = 'md', full = false }: { variant?: Variant; size?: Size; full?: boolean } = {}) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-colors duration-150 select-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    size === 'sm' && 'h-9 px-3.5 text-sm',
    size === 'md' && 'h-11 px-5 text-sm',
    size === 'lg' && 'h-12 px-7 text-base',
    full && 'w-full',
    variant === 'primary' && 'bg-arcane text-white shadow-sm hover:bg-arcane-dark',
    variant === 'secondary' && 'border border-navy/25 bg-white/70 text-navy hover:border-navy/50 hover:bg-white',
    variant === 'premium' && 'border border-gold bg-navy text-white shadow-sm hover:bg-navy-soft [box-shadow:inset_0_0_0_1px_rgb(201_162_82/0.35)]',
    variant === 'ghost' && 'text-navy hover:bg-navy/5',
    variant === 'onDark' && 'border border-white/50 bg-white/10 text-white backdrop-blur hover:bg-white/20',
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({ variant, size, full, className, children, ...rest }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={clsx(buttonClasses({ variant, size, full }), className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant, size, full, className, children, ...rest }: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={clsx(buttonClasses({ variant, size, full }), className)} {...rest}>
      {children}
    </Link>
  );
}
