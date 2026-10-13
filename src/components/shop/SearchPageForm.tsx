'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useRecent } from '@/store/preferences';

export function SearchPageForm() {
  const router = useRouter();
  const params = useSearchParams();
  const addSearch = useRecent((s) => s.addSearch);
  const [value, setValue] = useState(params.get('q') ?? '');
  return (
    <form
      role="search"
      className="mb-6 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        addSearch(q);
        router.replace(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
      }}
    >
      <label htmlFor="search-page-input" className="sr-only">
        Search cards, sets, products
      </label>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-arcane" aria-hidden />
        <input
          id="search-page-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search cards, sets, products..."
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-stone bg-white pl-12 pr-4 font-sans text-base text-ink shadow-sm placeholder:text-muted focus:border-arcane"
        />
      </div>
      <Button type="submit" size="lg">
        Search
      </Button>
    </form>
  );
}
