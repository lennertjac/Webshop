import { NextResponse } from 'next/server';
import { REPLY_TIME, SELL_MIN_VALUE, SITE_NAME } from '@/lib/config';
import { TEAM } from '@/lib/team';

const MAX_FILES = 6;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPES = ['sell', 'contact', 'request'] as const;

const field = (form: FormData, key: string, max = 200) => String(form.get(key) ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
const bad = (message: string, status = 400) => NextResponse.json({ error: 'invalid', message }, { status });

async function sendMail(payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

/**
 * Intake for Sell to Us, Contact and Request to buy / Make an offer.
 * Validates, then emails CONTACT_EMAIL through Resend. Without RESEND_API_KEY + CONTACT_EMAIL it answers 501.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad('Invalid form submission.');
  }

  const type = field(form, 'type') as (typeof TYPES)[number];
  const name = field(form, 'name', 120);
  const email = field(form, 'email');
  const message = String(form.get('message') ?? '').trim().slice(0, 5000);
  const mode = field(form, 'mode');
  const contactPerson = TEAM.find((m) => m.id === field(form, 'contact', 40));

  if (!TYPES.includes(type)) return bad('Unknown form type.');
  if (!name) return bad('Please enter your name.');
  if (!EMAIL.test(email)) return bad('Please enter a valid email address.');
  if (type !== 'request' && message.length < 5) return bad('Please add a short message.');
  if (type === 'request' && mode === 'offer' && message.length < 1) return bad('Please add a short message with your offer.');

  if (type === 'sell') {
    const value = Number(field(form, 'estimatedValue', 20).replace(',', '.'));
    if (!Number.isFinite(value) || value < SELL_MIN_VALUE) return bad(`We only buy cards worth \u20ac${SELL_MIN_VALUE} or more.`);
  }

  let offer = '';
  if (type === 'request' && mode === 'offer') {
    const amount = Number(field(form, 'offerAmount').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) return bad('Please enter a valid offer amount.');
    offer = amount.toFixed(2);
  }

  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return bad(`You can upload up to ${MAX_FILES} images.`);
  if (files.some((f) => !f.type.startsWith('image/') || f.size > MAX_FILE_BYTES)) return bad('Images only, up to 8 MB each.');

  const to = (contactPerson && process.env[`CONTACT_EMAIL_${contactPerson.id.toUpperCase()}`]) || process.env.CONTACT_EMAIL;
  if (!process.env.RESEND_API_KEY || !to) {
    return NextResponse.json(
      { error: 'not_connected', message: 'Online submissions are not connected yet. Please email us directly and we will get back to you.' },
      { status: 501 },
    );
  }

  const product = type === 'request' ? { name: field(form, 'productName'), price: field(form, 'productPrice', 20), url: field(form, 'productUrl', 300) } : null;
  const subject =
    type === 'sell' ? `Sell to Us: ${name}` :
    type === 'contact' ? `Contact: ${name}` :
    mode === 'offer' ? `Offer €${offer} for ${product?.name}` : `Request to buy: ${product?.name}`;

  const lines = [
    `From: ${name} <${email}>`,
    contactPerson && `Wants to speak with: ${contactPerson.name}`,
    product && `Item: ${product.name} (listed at €${product.price})`,
    product && `Link: ${product.url}`,
    offer && `Offer: €${offer}`,
    type === 'sell' && `TCG: ${field(form, 'tcg')}`,
    type === 'sell' && `Estimated value: ${field(form, 'estimatedValue')}`,
    '',
    message,
    type === 'sell' && field(form, 'notes', 2000) && `\nNotes: ${String(form.get('notes') ?? '').trim().slice(0, 2000)}`,
  ].filter((l) => l !== false && l !== null && l !== undefined && l !== '' || l === '');

  const attachments = await Promise.all(
    files.map(async (f) => ({ filename: f.name.replace(/[^\w.\-]+/g, '_').slice(0, 80), content: Buffer.from(await f.arrayBuffer()).toString('base64') })),
  );

  const from = process.env.MAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;
  const delivered = await sendMail({ from, to: [to], reply_to: email, subject, text: lines.join('\n'), ...(attachments.length ? { attachments } : {}) });
  if (!delivered) return NextResponse.json({ error: 'send_failed', message: 'We could not send your message right now. Please try again or email us directly.' }, { status: 502 });

  // Best-effort confirmation so the sender knows it arrived.
  void sendMail({
    from,
    to: [email],
    subject: `We received your message – ${SITE_NAME}`,
    text: `Hi ${name},\n\nThank you for your message${product ? ` about ${product.name}` : ''}. ${contactPerson ? `${contactPerson.name} replies` : 'We reply'} ${REPLY_TIME}.\n\n${SITE_NAME}`,
  }).catch(() => undefined);

  return NextResponse.json({ ok: true, message: type === 'request' ? `Thank you! We will reply ${REPLY_TIME}.` : 'Thank you! We will get back to you shortly.' });
}
