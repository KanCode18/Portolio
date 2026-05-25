import { NextResponse } from 'next/server';

// Server route to relay contact form to WhatsApp via Twilio
// Required environment variables:
// - TWILIO_ACCOUNT_SID
// - TWILIO_AUTH_TOKEN
// - TWILIO_WHATSAPP_FROM (e.g. "whatsapp:+1415xxxxxxx")
// - WHATSAPP_TO (your destination e.g. "whatsapp:+1yyyyyyyyy")

export async function POST(req: Request) {
  try {
    // Support FormData from the client
    const form = await req.formData();
    const name = (form.get('name') as string) || '';
    const email = (form.get('email') as string) || '';
    const message = (form.get('message') as string) || '';

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM;
    const to = process.env.WHATSAPP_TO;

    if (!accountSid || !authToken || !from || !to) {
      return NextResponse.json({ ok: false, error: 'Missing Twilio configuration' }, { status: 500 });
    }

    const bodyText = `New contact form\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`;

    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', from);
    params.append('Body', bodyText);

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const basic = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: params.toString(),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ ok: false, error: text }, { status: resp.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
