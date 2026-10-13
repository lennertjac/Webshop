import { NextResponse } from 'next/server';

const MAX_FILES = 6;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Intake for the Sell to Us and Contact forms. Validates input, then stops with 501 because
 * delivery (email / Supabase table + storage bucket) is not connected yet.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid', message: 'Invalid form submission.' }, { status: 400 });
  }

  const type = String(form.get('type') ?? '');
  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();

  if (!['sell', 'contact'].includes(type)) return NextResponse.json({ error: 'invalid', message: 'Unknown form type.' }, { status: 400 });
  if (!name || name.length > 120) return NextResponse.json({ error: 'invalid', message: 'Please enter your name.' }, { status: 400 });
  if (!EMAIL.test(email) || email.length > 200) return NextResponse.json({ error: 'invalid', message: 'Please enter a valid email address.' }, { status: 400 });
  if (message.length < 5 || message.length > 5000) return NextResponse.json({ error: 'invalid', message: 'Please add a short message.' }, { status: 400 });

  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return NextResponse.json({ error: 'invalid', message: `You can upload up to ${MAX_FILES} images.` }, { status: 400 });
  if (files.some((f) => !f.type.startsWith('image/') || f.size > MAX_FILE_BYTES)) {
    return NextResponse.json({ error: 'invalid', message: 'Images only, up to 8 MB each.' }, { status: 400 });
  }

  return NextResponse.json(
    { error: 'not_connected', message: 'Online submissions are not connected yet. Please email us directly and we will get back to you.' },
    { status: 501 },
  );
}
