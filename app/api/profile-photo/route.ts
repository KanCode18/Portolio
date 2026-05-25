import { NextResponse } from 'next/server';

const linkedInUrl = 'https://in.linkedin.com/in/kanishk-chhabra-28598a1b5';

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function fallbackSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.52" stop-color="#111827"/>
      <stop offset="1" stop-color="#f97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="20%" r="70%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="640" height="640" rx="120" fill="url(#bg)"/>
  <rect width="640" height="640" rx="120" fill="url(#glow)"/>
  <circle cx="320" cy="252" r="104" fill="#f8fafc" opacity="0.9"/>
  <path d="M142 536c30-96 92-144 178-144s148 48 178 144" fill="#f8fafc" opacity="0.9"/>
  <text x="320" y="594" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" letter-spacing="10" fill="#ffffff">KC</text>
</svg>`;
}

export async function GET() {
  try {
    const response = await fetch(linkedInUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; KanishkPortfolio/1.0)',
      },
      next: { revalidate: 86400 },
    });

    const html = await response.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const imageUrl = match?.[1] ? decodeHtml(match[1]) : null;

    if (imageUrl?.startsWith('http')) {
      return NextResponse.redirect(imageUrl, 302);
    }
  } catch {
    // LinkedIn often blocks unauthenticated image scraping; use the branded fallback below.
  }

  return new NextResponse(fallbackSvg(), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
