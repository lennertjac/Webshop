'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getStorage } from './storage';
import { useEffect, useState } from 'react';
import type { CartLine, Product } from '@/lib/types';

interface CartState {
  lines: CartLine[];
  drawerOpen: boolean;
  add: (product: Product, quantity?: number) => 'added' | 'maxed';
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      drawerOpen: false,
      add: (product, quantity = 1) => {
        const existing = get().lines.find((l) => l.productId === product.id);
        const max = Math.max(1, product.stock);
        if (existing && existing.quantity >= max) return 'maxed';
        set((s) => ({
          lines: existing
            ? s.lines.map((l) => (l.productId === product.id ? { ...l, quantity: Math.min(max, l.quantity + quantity) } : l))
            : [
                ...s.lines,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                  quantity: Math.min(max, quantity),
                  maxQuantity: max,
                  condition: product.condition,
                  grade: product.grade,
                  gradingCompany: product.gradingCompany,
                },
              ],
        }));
        return 'added';
      },
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(quantity, l.maxQuantity) } : l)),
        })),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: 'atlas-cart-v2',
      storage: createJSONStorage(getStorage),
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export const cartSubtotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.quantity, 0);

/** Persisted stores are empty on the server; gate UI that depends on them to avoid hydration mismatches. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
