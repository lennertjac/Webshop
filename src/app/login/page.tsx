'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';

export default function LoginPage() {
  const { login, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone/70 bg-white p-7 shadow-card">
        <h1 className="font-serif text-4xl font-bold">Log in</h1>
        {!configured && <p className="rounded-lg bg-amber-50 p-3 font-sans text-sm text-amber-900">Customer accounts are not configured on this deployment.</p>}
        <div>
          <label htmlFor="login-email" className="mb-1 block font-sans text-sm font-semibold text-navy">
            Email
          </label>
          <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block font-sans text-sm font-semibold text-navy">
            Password
          </label>
          <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </div>
        {error && (
          <p role="alert" className="font-sans text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" full disabled={busy || !configured}>
          {busy ? 'Logging in…' : 'Log in'}
        </Button>
        <p className="text-center font-sans text-sm text-muted">
          New to Atlas?{' '}
          <Link href="/register" className="font-semibold text-arcane hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
