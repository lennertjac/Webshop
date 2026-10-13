# Atlas Cards webshop

Premium TCG storefront (Next.js App Router, React 19, Tailwind CSS v4, Framer Motion, Zustand).
Products come from the ATLAS Stock Manager public API; customer accounts use Supabase.

## Run

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Customer auth, profiles, order history |
| `ATLAS_API_URL` | ATLAS deployment exposing `/api/public-products` |
| `NEXT_PUBLIC_DEMO_DATA=true` | Adds demo products for local design review. Never set in production |

On Vercel, set the project's framework preset to **Next.js** (it was a Vite app before).

## Structure

- `src/app` – routes (`/shop`, `/collections/[slug]`, `/products/[slug]`, `/vault`, `/search`, `/cart`, `/checkout`, `/account/*`, `/sell`, …)
- `src/lib/data/products.ts` – the single backend seam. Swap `getProducts()` to change catalog source
- `src/lib/collections.ts` – category / TCG definitions and navigation
- `src/lib/data/filter.ts` – search, filters, sorting, URL state
- `src/components/art/Scene.tsx` – original SVG landscapes used for heroes and category tiles
- `src/store` – cart, wishlist, recently viewed, toasts (persisted client-side)

## Not connected yet

- **Payments / order creation** – `POST /api/orders` re-prices and validates the cart server-side, then returns 501.
  `webshop_orders` has no insert policy, so creating orders needs a server route with the service role key.
- **Sell to Us / Contact** – `POST /api/inquiries` validates input and returns 501 until email or storage delivery is wired.
- Policy copy in `src/lib/policies.ts` is placeholder text.
- Language, rarity, set and card number appear only if ATLAS provides them (the public API now returns `createdAt`, `cardNumber`, `rarity`, `setName`).
