// Shared helpers for the interactive labs (run in the browser).
import { abs2, type C } from './sim';

const nice: [number, string][] = [
  [Math.SQRT1_2, '1/√2'], [0.5, '1/2'], [1, '1'],
];

/** Format one amplitude compactly: 0.707 shown as 1/√2 etc. */
export function amp(z: C, dp = 2): string {
  const near = (x: number) => { for (const [v, s] of nice) if (Math.abs(Math.abs(x) - v) < 1e-6) return (x < 0 ? '−' : '') + s; return null; };
  const r = Math.abs(z.re) < 1e-9 ? 0 : z.re, i = Math.abs(z.im) < 1e-9 ? 0 : z.im;
  const f = (x: number) => near(x) ?? (x < 0 ? '−' : '') + Math.abs(x).toFixed(dp).replace(/\.?0+$/, '');
  if (i === 0) return f(r);
  if (r === 0) return (near(i) === '1' ? '' : near(i) === '−1' ? '−' : f(i)) + 'i';
  return `(${f(r)} ${i < 0 ? '−' : '+'} ${f(Math.abs(i))}i)`;
}

/** A state as a sum of kets, skipping zero terms. Optional colouring of |0>/|1> terms for 1 qubit. */
export function ketString(amps: C[], n: number, colour = false): string {
  const terms: string[] = [];
  amps.forEach((a, idx) => {
    if (abs2(a) < 1e-10) return;
    let s = amp(a);
    if (s === '1') s = ''; else if (s === '−1') s = '−';
    const label = idx.toString(2).padStart(n, '0');
    const cls = colour && n === 1 ? (idx === 0 ? 'amp-a' : 'amp-b') : '';
    terms.push(`<span class="${cls}">${s}|${label}⟩</span>`);
  });
  if (!terms.length) return '0';
  return terms.join(' + ').replace(/\+ <span class="([^"]*)">−/g, '− <span class="$1">');
}

/** Horizontal probability bars. */
export function bars(el: HTMLElement, rows: { label: string; p: number; colour?: string; note?: string }[]) {
  el.innerHTML = rows.map((r) => `
    <div style="margin:.35rem 0">
      <div class="bar-label"><span>${r.label}</span><span>${(r.p * 100).toFixed(1)}%${r.note ? ' · ' + r.note : ''}</span></div>
      <div class="bar" role="img" aria-label="${r.label}: ${(r.p * 100).toFixed(1)} percent"><span style="width:${(r.p * 100).toFixed(2)}%;background:${r.colour ?? 'var(--accent)'}"></span></div>
    </div>`).join('');
}

export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
