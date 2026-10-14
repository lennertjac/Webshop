export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'Atlas Cards';
export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_FLAT_RATE = 6.95;
export const INSURED_SHIPPING_EXTRA = 4.95;
export const NEW_ARRIVAL_DAYS = 21;
export const LOW_STOCK_AT = 2;
/** From this price, items use 'Request to buy' instead of instant checkout. */
export const REQUEST_TO_BUY_FROM = 2500;
export const REPLY_TIME = 'within 24 hours';
/** Minimum market value per card we buy. */
export const SELL_MIN_VALUE = 200;
export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Bancontact', 'iDEAL', 'PayPal'];

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export function formatPrice(value: number): string {
  return eur.format(value);
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FLAT_RATE;
}
