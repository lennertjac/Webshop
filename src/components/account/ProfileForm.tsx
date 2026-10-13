'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth, type WebshopUser } from '@/lib/auth-context';

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';

type Keys = 'firstName' | 'lastName' | 'phone' | 'address' | 'city' | 'postalCode' | 'country';

/** Shared edit form for profile + address pages. */
export function ProfileForm({ fields, title, showEmail }: { fields: { key: Keys; label: string; autoComplete?: string }[]; title: string; showEmail?: boolean }) {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState<Partial<WebshopUser>>(() => Object.fromEntries(fields.map((f) => [f.key, user?.[f.key] ?? ''])));
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile(values);
      setStatus({ ok: true, text: 'Saved.' });
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : 'Could not save your changes.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-card sm:p-7">
      <h2 className="font-sans text-lg font-bold text-navy">{title}</h2>
      {showEmail && user && (
        <div>
          <label htmlFor="acc-email" className="mb-1 block font-sans text-sm font-semibold text-navy">
            Email
          </label>
          <input id="acc-email" value={user.email} readOnly className={`${input} bg-ivory text-muted`} />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={`acc-${f.key}`} className="mb-1 block font-sans text-sm font-semibold text-navy">
              {f.label}
            </label>
            <input id={`acc-${f.key}`} autoComplete={f.autoComplete} value={(values[f.key] as string) ?? ''} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} className={input} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        {status && (
          <p role="status" className={`font-sans text-sm ${status.ok ? 'text-emerald' : 'text-danger'}`}>
            {status.text}
          </p>
        )}
      </div>
    </form>
  );
}
