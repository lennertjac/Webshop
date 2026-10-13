'use client';

import clsx from 'clsx';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/config';
import { getSupabase } from '@/lib/supabase';

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  tracking_number: string | null;
  items: { id: string; name: string; price: number; grade?: string; condition?: string }[];
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900',
  PAID: 'bg-arcane/15 text-arcane-dark',
  SHIPPED: 'bg-violet/15 text-violet',
  DELIVERED: 'bg-emerald/15 text-emerald',
  CANCELLED: 'bg-stone text-muted',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getSupabase()
      .from('webshop_orders')
      .select('id, order_number, status, total, created_at, tracking_number, items')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError('Could not load your orders.');
        setOrders((data as OrderRow[]) ?? []);
      });
  }, [user]);

  return (
    <section aria-labelledby="orders-title" className="rounded-2xl border border-stone/70 bg-white p-5 shadow-card sm:p-7">
      <h2 id="orders-title" className="font-sans text-lg font-bold text-navy">
        Order history
      </h2>
      {error && <p className="mt-3 font-sans text-sm text-danger">{error}</p>}
      {orders === null ? (
        <p className="py-8 font-sans text-sm text-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="py-8 font-sans text-sm text-muted">You haven’t placed any orders yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-stone/70 text-xs uppercase tracking-wider text-muted">
                <th className="py-2 pr-3 font-semibold">Order</th>
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="py-2 pr-3 text-right font-semibold">Total</th>
                <th className="py-2 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-b border-stone/50">
                    <td className="py-3 pr-3 font-semibold text-navy">{o.order_number}</td>
                    <td className="py-3 pr-3">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                    <td className="py-3 pr-3">
                      <span className={clsx('rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_STYLES[o.status] ?? 'bg-stone text-muted')}>{o.status.charAt(0) + o.status.slice(1).toLowerCase()}</span>
                    </td>
                    <td className="py-3 pr-3 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                    <td className="py-3 text-right">
                      <button type="button" aria-expanded={open === o.id} onClick={() => setOpen(open === o.id ? null : o.id)} className="font-semibold text-arcane hover:underline">
                        {open === o.id ? 'Hide' : 'View order'}
                      </button>
                    </td>
                  </tr>
                  {open === o.id && (
                    <tr className="border-b border-stone/50 bg-ivory">
                      <td colSpan={5} className="p-4">
                        <ul className="space-y-1.5">
                          {o.items.map((it) => (
                            <li key={it.id} className="flex justify-between gap-4">
                              <span>
                                {it.name} <span className="text-muted">{it.grade && it.grade !== 'Ungraded' ? `· ${it.grade}` : it.condition ? `· ${it.condition}` : ''}</span>
                              </span>
                              <span className="tabular-nums">{formatPrice(it.price)}</span>
                            </li>
                          ))}
                        </ul>
                        {o.tracking_number && <p className="mt-3 text-xs text-muted">Tracking number: {o.tracking_number}</p>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
