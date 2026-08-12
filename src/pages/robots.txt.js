/**
 * robots.txt gerado a partir da mesma constante de domínio que tudo o resto.
 */
import { SITE_URL } from '../../site.config.mjs';

export function GET() {
  const corpo = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', SITE_URL).href}`,
    '',
  ].join('\n');
  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
