import katex from 'katex';

const macros = {
  '\\ket': '\\left|#1\\right\\rangle',
  '\\bra': '\\left\\langle#1\\right|',
  '\\braket': '\\left\\langle#1\\middle|#2\\right\\rangle',
  '\\A': '\\htmlClass{amp-a}{#1}',
  '\\B': '\\htmlClass{amp-b}{#1}',
};

/** Turn a string with $inline$ and $$display$$ maths into HTML (build time only). */
export function tex(s: string): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const parts = s.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);
  return parts.map((p) => {
    if (p.startsWith('$$')) return katex.renderToString(p.slice(2, -2), { displayMode: true, throwOnError: false, macros: { ...macros }, trust: true, strict: false });
    if (p.startsWith('$') && p.length > 1) return katex.renderToString(p.slice(1, -1), { throwOnError: false, macros: { ...macros }, trust: true, strict: false });
    return esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
  }).join('');
}
