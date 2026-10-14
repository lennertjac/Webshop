import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">404</p>
      <h1 className="font-serif text-5xl font-bold">This path leads nowhere</h1>
      <p className="font-sans text-muted">You have wandered off the map. This page has moved or no longer exists.</p>
      <div className="flex gap-3">
        <ButtonLink href="/shop">Shop all products</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
