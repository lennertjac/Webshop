import Image from 'next/image';
import clsx from 'clsx';

export function AtlasMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C9A252" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15" fill="#18263F" />
      <path d="M9 28 L18 12 L22 19 L25 15 L31 28 Z" fill="#F8F4E9" />
      <path d="M18 12 L20.2 16 L17 16 Z" fill="#55C5D5" />
      <path d="M20 5.5 l1.1 2.6 2.6 1.1 -2.6 1.1 -1.1 2.6 -1.1 -2.6 -2.6 -1.1 2.6 -1.1z" fill="#C9A252" />
    </svg>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <div
      className={clsx('flex h-full w-full items-center justify-center bg-gradient-to-br from-navy via-navy-soft to-[#3b3f7a]', className)}
      role="img"
      aria-label="Product photo coming soon"
    >
      <div className="flex aspect-[5/7] h-[88%] items-center justify-center rounded-md border border-gold/70 [box-shadow:inset_0_0_0_4px_#18263f,inset_0_0_0_5px_rgb(201_162_82/0.5)]">
        <AtlasMark className="size-1/2 max-w-16" />
      </div>
    </div>
  );
}

function isOptimizable(src: string) {
  try {
    return new URL(src).hostname.endsWith('.supabase.co');
  } catch {
    return src.startsWith('/');
  }
}

/** Parent must be `relative` and sized (usually via aspect-ratio). */
export function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) return <CardBack />;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!isOptimizable(src)}
      className={clsx('object-contain', className)}
    />
  );
}
