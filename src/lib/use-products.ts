'use client';

import { useEffect, useState } from 'react';
import type { Product } from './types';

/** Fetch a set of products by id from the read API (used by wishlist + recently viewed). */
export function useProductsByIds(ids: string[]) {
  const key = ids.join(',');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(Boolean(key));

  useEffect(() => {
    if (!key) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/products?ids=${encodeURIComponent(key)}`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d: { products: Product[] }) => !cancelled && setProducts(d.products))
      .catch(() => !cancelled && setProducts([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { products, loading };
}
