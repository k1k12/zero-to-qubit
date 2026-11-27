// Plain-text sitemap listing every page, for search engines.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const lectures = await getCollection('lectures');
  const paths = ['/', '/lectures/', '/flashcards/', '/quiz/', '/code-lab/', '/map/', '/notation/', '/ideas/', '/visuals/', '/practice/', '/explore/', '/mock-exam/', '/history/', '/library/', '/tools/', '/about/', '/accessibility/',
    ...lectures.flatMap((l) => [`/lectures/${l.id}/`, `/summaries/${l.id}/`])];
  return new Response(paths.map((p) => new URL(p, site).href).join('\n') + '\n', { headers: { 'Content-Type': 'text/plain' } });
};
