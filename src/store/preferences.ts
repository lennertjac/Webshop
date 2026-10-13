'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getStorage } from './storage';

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const on = !get().ids.includes(id);
        set((s) => ({ ids: on ? [id, ...s.ids] : s.ids.filter((i) => i !== id) }));
        return on;
      },
      has: (id) => get().ids.includes(id),
    }),
    { name: 'atlas-wishlist-v1', storage: createJSONStorage(getStorage) },
  ),
);

interface RecentState {
  viewed: string[];
  searches: string[];
  trackView: (id: string) => void;
  addSearch: (q: string) => void;
  clearSearches: () => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      viewed: [],
      searches: [],
      trackView: (id) => set((s) => ({ viewed: [id, ...s.viewed.filter((v) => v !== id)].slice(0, 12) })),
      addSearch: (q) => {
        const term = q.trim();
        if (term.length < 2) return;
        set((s) => ({ searches: [term, ...s.searches.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 6) }));
      },
      clearSearches: () => set({ searches: [] }),
    }),
    { name: 'atlas-recent-v1', storage: createJSONStorage(getStorage) },
  ),
);
