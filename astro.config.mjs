import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Shared shortcuts for maths: \ket{0}, \bra{\psi}, \braket{a}{b}, and \A{..} / \B{..}
// which colour alpha (purple) and beta (teal) the same way everywhere on the site.
const macros = {
  '\\ket': '\\left|#1\\right\\rangle',
  '\\bra': '\\left\\langle#1\\right|',
  '\\braket': '\\left\\langle#1\\middle|#2\\right\\rangle',
  '\\A': '\\htmlClass{amp-a}{#1}',
  '\\B': '\\htmlClass{amp-b}{#1}',
};

// Static site: `npm run build` writes everything to dist/, which Cloudflare serves.
export default defineConfig({
  site: 'https://zerotoqubit.com',
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false, macros, trust: (ctx) => ctx.command === '\\htmlClass' }]],
    }),
  },
});
