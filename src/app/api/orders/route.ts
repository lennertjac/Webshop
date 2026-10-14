import { NextResponse } from 'next/server';
import { INSURED_SHIPPING_EXTRA, shippingFor } from '@/lib/config';
import { getProducts } from '@/lib/data/products';

interface OrderRequest {
  items?: { productId?: string; quantity?: number }[];
  customer?: { shippingMethod?: string };
}

/**
 * Order intake. Re-prices the cart from the live catalog (never trusts client prices) and checks stock.
 * Payment capture + persistence are not connected yet, so this stops with 501 after validation.
 */
export async function POST(request: Request) {
  let body: OrderRequest;
  try {
    body = (await request.json()) as OrderRequest;
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Invalid request.' }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  if (!items.length) return NextResponse.json({ error: 'empty_cart', message: 'Your cart is empty.' }, { status: 400 });

  const catalog = new Map((await getProducts()).map((p) => [p.id, p]));
  let subtotal = 0;
  for (const item of items) {
    const product = item.productId ? catalog.get(item.productId) : undefined;
    const qty = Number(item.quantity);
    if (!product || !Number.isInteger(qty) || qty < 1) {
      return NextResponse.json({ error: 'unavailable', message: 'One of the items in your cart is no longer available.' }, { status: 409 });
    }
    if (product.requestToBuy) {
      return NextResponse.json({ error: 'request_only', message: `“${product.name}” is sold by personal request. Please use Request to buy on its page.` }, { status: 409 });
    }
    if (qty > product.stock) {
      return NextResponse.json({ error: 'stock', message: `Only ${product.stock} of “${product.name}” left in stock.` }, { status: 409 });
    }
    subtotal += product.price * qty;
  }

  const shipping = shippingFor(subtotal) + (body.customer?.shippingMethod === 'insured' ? INSURED_SHIPPING_EXTRA : 0);

  return NextResponse.json(
    {
      error: 'payments_not_connected',
      message: 'Online payment is not connected yet, so your order has not been placed and you have not been charged. Please contact us to complete this purchase.',
      totals: { subtotal, shipping, total: subtotal + shipping },
    },
    { status: 501 },
  );
}
