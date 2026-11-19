import { NextResponse } from 'next/server';
// Password gate (HTTP Basic). Set APP_PASSWORD (and optionally APP_USER) in Vercel env vars.
export function middleware(req) {
  const pw = process.env.APP_PASSWORD;
  let c = '';
  try { c = atob((req.headers.get('authorization') || '').split(' ')[1] || ''); } catch {}
  if (pw && c === `${process.env.APP_USER || 'admin'}:${pw}`) return NextResponse.next();
  return new NextResponse('Login required. Set APP_PASSWORD in the Vercel environment variables.', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Rainoil LPG"' } });
}
export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
