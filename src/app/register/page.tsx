'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';

const FIELDS = [
  { key: 'firstName', label: 'First name', autoComplete: 'given-name', half: true },
  { key: 'lastName', label: 'Last name', autoComplete: 'family-name', half: true },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { key: 'password', label: 'Password (min. 8 characters)', type: 'password', autoComplete: 'new-password' },
  { key: 'address', label: 'Address', autoComplete: 'street-address' },
  { key: 'postalCode', label: 'Postal code', autoComplete: 'postal-code', half: true },
  { key: 'city', label: 'City', autoComplete: 'address-level2', half: true },
  { key: 'country', label: 'Country', autoComplete: 'country-name' },
  { key: 'phone', label: 'Phone (optional)', autoComplete: 'tel', optional: true },
] as const;

export default function RegisterPage() {
  const { register, configured } = useAuth();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({ country: 'Belgium' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if ((values.password ?? '').length < 8) return setError('Password must be at least 8 characters.');
    setBusy(true);
    setError(null);
    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
        phone: values.phone || undefined,
      });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 sm:py-16">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone/70 bg-white p-7 shadow-card">
        <h1 className="font-serif text-4xl font-bold">Create account</h1>
        {!configured && <p className="rounded-lg bg-amber-50 p-3 font-sans text-sm text-amber-900">Customer accounts are not configured on this deployment.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={'half' in f && f.half ? '' : 'sm:col-span-2'}>
              <label htmlFor={`reg-${f.key}`} className="mb-1 block font-sans text-sm font-semibold text-navy">
                {f.label}
              </label>
              <input
                id={`reg-${f.key}`}
                type={'type' in f ? f.type : 'text'}
                required={!('optional' in f)}
                autoComplete={f.autoComplete}
                value={values[f.key] ?? ''}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className={input}
              />
            </div>
          ))}
        </div>
        {error && (
          <p role="alert" className="font-sans text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" full disabled={busy || !configured}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
        <p className="text-center font-sans text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-arcane hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
