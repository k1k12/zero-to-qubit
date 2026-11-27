// A small state-vector simulator, used by the interactive labs and the code lab.
//
// Convention (same as the lectures): in a label like |q0 q1 q2>, qubit 0 is the LEFTMOST
// symbol and the most significant bit of the index. So for 2 qubits the amplitudes are
// ordered |00>, |01>, |10>, |11>. Qiskit prints bitstrings the other way round; the code
// lab converts when it shows Qiskit-style counts.

export type C = { re: number; im: number };
export const c = (re: number, im = 0): C => ({ re, im });
export const add = (a: C, b: C): C => c(a.re + b.re, a.im + b.im);
export const mul = (a: C, b: C): C => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const scale = (a: C, s: number): C => c(a.re * s, a.im * s);
export const conj = (a: C): C => c(a.re, -a.im);
export const abs2 = (a: C): number => a.re * a.re + a.im * a.im;
export const expi = (t: number): C => c(Math.cos(t), Math.sin(t));
const S2 = Math.SQRT1_2;

export type Mat2 = [C, C, C, C]; // row-major [a b; c d]

export const GATES: Record<string, Mat2> = {
  I: [c(1), c(0), c(0), c(1)],
  X: [c(0), c(1), c(1), c(0)],
  Y: [c(0), c(0, -1), c(0, 1), c(0)],
  Z: [c(1), c(0), c(0), c(-1)],
  H: [c(S2), c(S2), c(S2), c(-S2)],
  S: [c(1), c(0), c(0), c(0, 1)],
  SDG: [c(1), c(0), c(0), c(0, -1)],
  T: [c(1), c(0), c(0), expi(Math.PI / 4)],
  TDG: [c(1), c(0), c(0), expi(-Math.PI / 4)],
};

export function rx(t: number): Mat2 { return [c(Math.cos(t / 2)), c(0, -Math.sin(t / 2)), c(0, -Math.sin(t / 2)), c(Math.cos(t / 2))]; }
export function ry(t: number): Mat2 { return [c(Math.cos(t / 2)), c(-Math.sin(t / 2)), c(Math.sin(t / 2)), c(Math.cos(t / 2))]; }
export function rz(t: number): Mat2 { return [expi(-t / 2), c(0), c(0), expi(t / 2)]; }
export function phase(t: number): Mat2 { return [c(1), c(0), c(0), expi(t)]; }

export class State {
  n: number;
  amps: C[];
  constructor(n: number, amps?: C[]) {
    this.n = n;
    this.amps = amps ?? Array.from({ length: 1 << n }, (_, i) => c(i === 0 ? 1 : 0));
  }
  static fromQubits(qs: [C, C][]): State {
    let amps: C[] = [c(1)];
    for (const [a, b] of qs) {
      // tensor product: the new qubit becomes the least significant (rightmost) bit
      const out: C[] = [];
      for (let i = 0; i < amps.length; i++) { out.push(mul(amps[i], a), mul(amps[i], b)); }
      amps = out;
    }
    return new State(qs.length, amps);
  }
  clone() { return new State(this.n, this.amps.map((a) => ({ ...a }))); }
  private bit(q: number) { return 1 << (this.n - 1 - q); }
  apply1(m: Mat2, q: number) {
    const b = this.bit(q);
    for (let i = 0; i < this.amps.length; i++) {
      if (i & b) continue;
      const a0 = this.amps[i], a1 = this.amps[i | b];
      this.amps[i] = add(mul(m[0], a0), mul(m[1], a1));
      this.amps[i | b] = add(mul(m[2], a0), mul(m[3], a1));
    }
    return this;
  }
  /** Apply m to target when every control qubit is 1. */
  controlled(m: Mat2, controls: number[], target: number) {
    const cm = controls.reduce((acc, q) => acc | this.bit(q), 0);
    const b = this.bit(target);
    for (let i = 0; i < this.amps.length; i++) {
      if (i & b || (i & cm) !== cm) continue;
      const a0 = this.amps[i], a1 = this.amps[i | b];
      this.amps[i] = add(mul(m[0], a0), mul(m[1], a1));
      this.amps[i | b] = add(mul(m[2], a0), mul(m[3], a1));
    }
    return this;
  }
  cx(ctrl: number, tgt: number) { return this.controlled(GATES.X, [ctrl], tgt); }
  cz(ctrl: number, tgt: number) { return this.controlled(GATES.Z, [ctrl], tgt); }
  ccx(c1: number, c2: number, t: number) { return this.controlled(GATES.X, [c1, c2], t); }
  swap(a: number, b: number) { this.cx(a, b); this.cx(b, a); this.cx(a, b); return this; }
  probs(): number[] { return this.amps.map(abs2); }
  /** Probability that qubit q reads 1. */
  prob1(q: number) { const b = this.bit(q); return this.amps.reduce((s, a, i) => s + (i & b ? abs2(a) : 0), 0); }
  /** Measure qubit q in the 0/1 basis, collapse, and return the result. */
  measure(q: number, rand = Math.random): 0 | 1 {
    const p1 = this.prob1(q);
    const r: 0 | 1 = rand() < p1 ? 1 : 0;
    const b = this.bit(q);
    const norm = Math.sqrt(r ? p1 : 1 - p1) || 1;
    this.amps = this.amps.map((a, i) => (((i & b) !== 0) === (r === 1) ? scale(a, 1 / norm) : c(0)));
    return r;
  }
  label(i: number) { return i.toString(2).padStart(this.n, '0'); }
}

/** Sample `shots` full measurements; keys are labels in lecture order (q0 first). */
export function sample(s: State, shots: number, rand = Math.random): Record<string, number> {
  const p = s.probs();
  const cdf: number[] = [];
  p.reduce((acc, x, i) => (cdf[i] = acc + x), 0);
  const counts: Record<string, number> = {};
  for (let k = 0; k < shots; k++) {
    const r = rand() * cdf[cdf.length - 1];
    let i = cdf.findIndex((x) => r < x);
    if (i < 0) i = cdf.length - 1;
    const key = s.label(i);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/** |<a|b>|^2 : 1 means the same state up to a global phase. */
export function fidelity(a: C[], b: C[]): number {
  let ip = c(0);
  for (let i = 0; i < a.length; i++) ip = add(ip, mul(conj(a[i]), b[i]));
  return abs2(ip);
}

/** Is a 2-qubit pure state entangled? Uses |ad - bc| (zero exactly when it factorises). */
export function concurrence2(amps: C[]): number {
  const [a, b, cc, d] = amps;
  const det = add(mul(a, d), scale(mul(b, cc), -1));
  return 2 * Math.sqrt(abs2(det));
}

/** Bloch vector (x, y, z) of a single-qubit state a|0> + b|1>. */
export function bloch(a: C, b: C): [number, number, number] {
  const ab = mul(conj(a), b);
  return [2 * ab.re, 2 * ab.im, abs2(a) - abs2(b)];
}

export function fmtC(z: C, dp = 3): string {
  const r = +z.re.toFixed(dp), i = +z.im.toFixed(dp);
  if (Math.abs(i) < 10 ** -dp) return String(r);
  if (Math.abs(r) < 10 ** -dp) return `${i}i`;
  return `${r} ${i < 0 ? '−' : '+'} ${Math.abs(i)}i`;
}

/** Bloch vector of qubit q inside a many-qubit state (via the reduced density matrix). */
export function blochOf(s: State, q: number): [number, number, number] {
  const b = 1 << (s.n - 1 - q);
  let r00 = 0, r11 = 0, r01 = c(0);
  for (let i = 0; i < s.amps.length; i++) {
    if (i & b) continue;
    const a0 = s.amps[i], a1 = s.amps[i | b];
    r00 += abs2(a0); r11 += abs2(a1);
    r01 = add(r01, mul(a0, conj(a1)));
  }
  return [2 * r01.re, -2 * r01.im, r00 - r11];
}
