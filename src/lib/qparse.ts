// Parses a small, honest subset of Qiskit (Python) and OpenQASM 3 into a list of gate
// operations the in-browser simulator can run. It is not a Python interpreter: one
// instruction per line, no loops or variables beyond the circuit itself. Error messages
// are written to teach, e.g. "Qiskit calls CNOT `cx`".
import { State, GATES, rx, ry, rz, phase, type Mat2 } from './sim.ts';

export interface Op { g: string; q: number[]; theta?: number; line: number }
export interface Parsed { n: number; ops: Op[]; measured: boolean; errors: { line: number; msg: string }[] }

const ONE = ['h', 'x', 'y', 'z', 's', 'sdg', 't', 'tdg', 'id'];
const ONE_PARAM = ['rx', 'ry', 'rz', 'p'];
const TWO = ['cx', 'cz', 'swap'];
const ALIASES: Record<string, string> = {
  cnot: 'Qiskit calls CNOT `cx`, e.g. `qc.cx(0, 1)`.',
  toffoli: 'Qiskit calls Toffoli `ccx`, e.g. `qc.ccx(0, 1, 2)`.',
  hadamard: 'The Hadamard gate is just `h`, e.g. `qc.h(0)`.',
  not: 'NOT is the Pauli-X gate: `qc.x(0)`.',
  measureall: 'It is `measure_all()` with an underscore.',
  phase: 'Use `p(theta, qubit)` for a phase gate, or `s` / `t`.',
  u: 'General `u` gates are not supported here; combine rx, ry, rz instead.',
};

/** Evaluate a tiny arithmetic expression: numbers, pi, + - * / and brackets. */
export function evalExpr(src: string): number {
  const s = src.replace(/\s+/g, '').replace(/(np|math|numpy)\./g, '');
  let i = 0;
  const peek = () => s[i];
  function num(): number {
    if (peek() === '(') { i++; const v = add(); if (s[i++] !== ')') throw new Error('missing )'); return v; }
    if (peek() === '-') { i++; return -num(); }
    if (peek() === '+') { i++; return num(); }
    if (s.startsWith('pi', i)) { i += 2; return Math.PI; }
    if (s.startsWith('π', i)) { i += 1; return Math.PI; }
    const m = /^\d*\.?\d+(e[-+]?\d+)?/i.exec(s.slice(i));
    if (!m) throw new Error(`cannot read "${s.slice(i) || src}"`);
    i += m[0].length; return parseFloat(m[0]);
  }
  function mul(): number { let v = num(); while (peek() === '*' || peek() === '/') { const o = s[i++]; const r = num(); v = o === '*' ? v * r : v / r; } return v; }
  function add(): number { let v = mul(); while (peek() === '+' || peek() === '-') { const o = s[i++]; const r = mul(); v = o === '+' ? v + r : v - r; } return v; }
  const v = add();
  if (i !== s.length) throw new Error(`unexpected "${s.slice(i)}"`);
  return v;
}

function splitArgs(a: string): string[] {
  const out: string[] = []; let depth = 0, cur = '';
  for (const ch of a) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export function parseQiskit(src: string): Parsed {
  const res: Parsed = { n: 0, ops: [], measured: false, errors: [] };
  let circ = '';
  src.split('\n').forEach((raw, idx) => {
    const line = idx + 1;
    const s = raw.replace(/#.*/, '').trim();
    if (!s || /^(from|import|print)\b/.test(s)) return;
    const mk = /^(\w+)\s*=\s*QuantumCircuit\(\s*(\d+)\s*(,\s*\d+\s*)?\)$/.exec(s);
    if (mk) { circ = mk[1]; res.n = +mk[2]; if (res.n > 10) res.errors.push({ line, msg: 'Keep it to 10 qubits or fewer: the browser simulator stores 2ⁿ amplitudes.' }); return; }
    if (/QuantumCircuit/.test(s)) { res.errors.push({ line, msg: 'Write the circuit as `qc = QuantumCircuit(2)` (number of qubits in brackets).' }); return; }
    const m = /^(\w+)\.(\w+)\((.*)\)$/.exec(s);
    if (!m) {
      if (/^\w+\.\w+$/.test(s)) res.errors.push({ line, msg: 'Missing brackets: gates are function calls, e.g. `qc.h(0)`.' });
      else res.errors.push({ line, msg: `I can't read this line. Each line should look like \`qc.h(0)\` or \`qc.cx(0, 1)\`.` });
      return;
    }
    const [, obj, rawName, argStr] = m;
    if (!circ) { res.errors.push({ line, msg: 'Create the circuit first: `qc = QuantumCircuit(2)`.' }); return; }
    if (obj !== circ) { res.errors.push({ line, msg: `Your circuit is called \`${circ}\`, not \`${obj}\`.` }); return; }
    const name = rawName;
    const lower = name.toLowerCase();
    if (name !== lower && [...ONE, ...ONE_PARAM, ...TWO, 'ccx'].includes(lower)) { res.errors.push({ line, msg: `Gate names are lower-case in Qiskit: \`${circ}.${lower}(...)\`.` }); return; }
    if (ALIASES[lower.replace(/_/g, '')] && lower !== 'measure_all') { res.errors.push({ line, msg: ALIASES[lower.replace(/_/g, '')] }); return; }
    if (lower === 'barrier') return;
    if (lower === 'measure_all' || lower === 'measure') { res.measured = true; return; }
    const args = splitArgs(argStr);
    const qubit = (a: string) => {
      if (!/^\d+$/.test(a)) throw new Error(`Qubit indices are whole numbers like 0 or 1; got \`${a}\`.`);
      const k = +a; if (k >= res.n) throw new Error(`Qubit ${k} doesn't exist: with QuantumCircuit(${res.n}) the qubits are 0 to ${res.n - 1} (counting starts at 0).`);
      return k;
    };
    try {
      if (ONE.includes(lower)) { if (args.length !== 1) throw new Error(`\`${lower}\` takes one qubit, e.g. \`${circ}.${lower}(0)\`.`); res.ops.push({ g: lower, q: [qubit(args[0])], line }); }
      else if (ONE_PARAM.includes(lower)) { if (args.length !== 2) throw new Error(`\`${lower}\` takes an angle then a qubit, e.g. \`${circ}.${lower}(pi/2, 0)\`.`); res.ops.push({ g: lower, q: [qubit(args[1])], theta: evalExpr(args[0]), line }); }
      else if (TWO.includes(lower)) {
        if (args.length !== 2) throw new Error(`\`${lower}\` takes two qubits: ${lower === 'swap' ? 'the two to swap' : 'control first, then target'}.`);
        const a = qubit(args[0]), b = qubit(args[1]);
        if (a === b) throw new Error('The two qubits must be different (a qubit cannot control itself).');
        res.ops.push({ g: lower, q: [a, b], line });
      } else if (lower === 'ccx') {
        if (args.length !== 3) throw new Error('`ccx` takes two controls then a target.');
        const qs = args.map(qubit); if (new Set(qs).size < 3) throw new Error('All three qubits must be different.');
        res.ops.push({ g: 'ccx', q: qs, line });
      } else throw new Error(`Unknown gate \`${name}\`. Supported: ${[...ONE, ...ONE_PARAM, ...TWO, 'ccx', 'measure_all'].join(', ')}.`);
    } catch (e) { res.errors.push({ line, msg: (e as Error).message }); }
  });
  if (!circ && !res.errors.length) res.errors.push({ line: 1, msg: 'No circuit found. Start with `qc = QuantumCircuit(2)`.' });
  return res;
}

export function parseQasm(src: string): Parsed {
  const res: Parsed = { n: 0, ops: [], measured: false, errors: [] };
  let reg = '';
  src.split('\n').forEach((raw, idx) => {
    const line = idx + 1;
    let s = raw.replace(/\/\/.*/, '').trim();
    if (!s) return;
    if (!s.endsWith(';')) { res.errors.push({ line, msg: 'Every OpenQASM statement ends with a semicolon `;`.' }); return; }
    s = s.slice(0, -1).trim();
    if (/^OPENQASM\s/.test(s) || /^include\s/.test(s) || /^bit(\[\d+\])?\s+\w+$/.test(s) || /^barrier\b/.test(s)) return;
    const q3 = /^qubit\[(\d+)\]\s+(\w+)$/.exec(s), q2 = /^qreg\s+(\w+)\[(\d+)\]$/.exec(s);
    if (q3 || q2) { res.n = q3 ? +q3[1] : +q2![2]; reg = q3 ? q3[2] : q2![1]; return; }
    if (/measure/.test(s)) { res.measured = true; return; }
    if (!reg) { res.errors.push({ line, msg: 'Declare the qubits first: `qubit[2] q;`.' }); return; }
    const m = /^(\w+)(?:\(([^)]*)\))?\s+(.+)$/.exec(s);
    if (!m) { res.errors.push({ line, msg: 'Expected something like `h q[0];` or `cx q[0], q[1];`.' }); return; }
    const [, gate0, param, targets] = m;
    const gate = gate0 === 'CX' || gate0 === 'cnot' ? 'cx' : gate0 === 'U' ? 'u' : gate0;
    try {
      const qs = targets.split(',').map((t) => {
        const mm = new RegExp(`^${reg}\\[(\\d+)\\]$`).exec(t.trim());
        if (!mm) throw new Error(`Refer to qubits as \`${reg}[0]\`, \`${reg}[1]\`, … (got \`${t.trim()}\`).`);
        const k = +mm[1]; if (k >= res.n) throw new Error(`\`${reg}[${k}]\` doesn't exist: qubits are ${reg}[0] to ${reg}[${res.n - 1}].`);
        return k;
      });
      if (ONE.includes(gate)) res.ops.push({ g: gate, q: qs, line });
      else if (ONE_PARAM.includes(gate) || gate === 'phase') { if (param === undefined) throw new Error(`\`${gate}\` needs an angle: \`${gate}(pi/2) ${reg}[0];\`.`); res.ops.push({ g: gate === 'phase' ? 'p' : gate, q: qs, theta: evalExpr(param), line }); }
      else if (TWO.includes(gate)) { if (qs.length !== 2 || qs[0] === qs[1]) throw new Error(`\`${gate}\` needs two different qubits.`); res.ops.push({ g: gate, q: qs, line }); }
      else if (gate === 'ccx') { if (qs.length !== 3) throw new Error('`ccx` needs three qubits.'); res.ops.push({ g: 'ccx', q: qs, line }); }
      else throw new Error(`Unknown gate \`${gate0}\`.`);
    } catch (e) { res.errors.push({ line, msg: (e as Error).message }); }
  });
  if (!reg && !res.errors.length) res.errors.push({ line: 1, msg: 'No qubits declared. Add `qubit[2] q;`.' });
  return res;
}

const MATS: Record<string, Mat2> = { h: GATES.H, x: GATES.X, y: GATES.Y, z: GATES.Z, s: GATES.S, sdg: GATES.SDG, t: GATES.T, tdg: GATES.TDG, id: GATES.I };

/** Run ops on a state (default |0...0>). */
export function run(n: number, ops: Op[], start?: State): State {
  const st = start ? start.clone() : new State(n);
  for (const o of ops) {
    if (MATS[o.g]) st.apply1(MATS[o.g], o.q[0]);
    else if (o.g === 'rx') st.apply1(rx(o.theta!), o.q[0]);
    else if (o.g === 'ry') st.apply1(ry(o.theta!), o.q[0]);
    else if (o.g === 'rz') st.apply1(rz(o.theta!), o.q[0]);
    else if (o.g === 'p') st.apply1(phase(o.theta!), o.q[0]);
    else if (o.g === 'cx') st.cx(o.q[0], o.q[1]);
    else if (o.g === 'cz') st.cz(o.q[0], o.q[1]);
    else if (o.g === 'swap') st.swap(o.q[0], o.q[1]);
    else if (o.g === 'ccx') st.ccx(o.q[0], o.q[1], o.q[2]);
  }
  return st;
}
