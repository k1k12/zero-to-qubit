// Code lab exercises. Each has starter code in both languages, unit tests (like Microsoft's
// Quantum Katas) and "diagnose" checks that recognise common wrong answers and explain them.
import { State, GATES, fidelity, c, blochOf, type C } from '../lib/sim.ts';
import { run, type Op } from '../lib/qparse.ts';

const S2 = Math.SQRT1_2;
const near = (a: C[], b: C[]) => fidelity(a, b) > 1 - 1e-6;
const vec = (...xs: number[]) => xs.map((x) => c(x));

export interface Exercise {
  id: string;
  lecture: number;
  title: string;
  brief: string; // HTML allowed
  predict: string;
  qiskit: string;
  qasm: string;
  n: number;
  tests: (st: State, ops: Op[], n: number) => { name: string; pass: boolean }[];
  diagnose?: (st: State, ops: Op[]) => string | null;
  hints: string[];
  solution: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 'random-bit', lecture: 4, n: 1, title: '1 · A true random bit',
    brief: 'Make a circuit whose measurement gives 0 or 1 with exactly 50% each, starting from |0⟩.',
    predict: 'Before running: sketch the histogram for 1,000 shots.',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\n# your gate here\n\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nbit[1] c;\n// your gate here\n\nc = measure q;\n',
    tests: (st) => [{ name: 'P(0) = P(1) = 0.5', pass: Math.abs(st.probs()[0] - 0.5) < 1e-6 }],
    diagnose: (st) => (st.probs()[1] > 0.999 ? 'You made |1⟩ (that is what X does): a definite 1, not a random bit. You need a gate that makes an equal superposition.' : null),
    hints: ['Which gate turns |0⟩ into an equal superposition?', 'Hadamard: H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2.'],
    solution: 'qc.h(0)',
  },
  {
    id: 'minus', lecture: 4, n: 1, title: '2 · Make |−⟩',
    brief: 'Starting from |0⟩, prepare |−⟩ = (|0⟩ − |1⟩)/√2. The histogram will look identical to exercise 1, so the tests check the amplitudes.',
    predict: 'Will the histogram differ from exercise 1? Why or why not?',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\n\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\n\n',
    tests: (st) => [
      { name: '50/50 measurement statistics', pass: Math.abs(st.probs()[0] - 0.5) < 1e-6 },
      { name: 'Relative phase is −1 (state is |−⟩)', pass: near(st.amps, vec(S2, -S2)) },
    ],
    diagnose: (st, ops) => {
      if (near(st.amps, vec(S2, S2))) {
        const gs = ops.map((o) => o.g).join(',');
        if (gs === 'h,x') return 'You applied H then X. But X|+⟩ = |+⟩: |+⟩ is an eigenstate of X, so X does nothing visible here. Order matters: try X first (to get |1⟩), then H. Or H then Z.';
        return 'You made |+⟩. Same histogram as |−⟩, but the sign of the |1⟩ amplitude is wrong.';
      }
      return null;
    },
    hints: ['H|1⟩ = |−⟩. How do you get |1⟩ first?', 'Alternatively Z flips the sign of |1⟩: Z|+⟩ = |−⟩.'],
    solution: 'qc.x(0)\nqc.h(0)',
  },
  {
    id: 'interference', lecture: 4, n: 1, title: '3 · Interference: H twice',
    brief: 'Apply H twice to |0⟩. Before you run, predict the histogram. Then add one gate <em>between</em> the two Hs so the result is always 1.',
    predict: 'One H gives 50/50. What do two give?',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(1)\nqc.h(0)\n# add one gate here\nqc.h(0)\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[1] q;\nh q[0];\n// add one gate here\nh q[0];\n',
    tests: (st, ops) => [
      { name: 'Always measures 1', pass: st.probs()[1] > 1 - 1e-6 },
      { name: 'Still uses H … H around your gate', pass: ops[0]?.g === 'h' && ops[ops.length - 1]?.g === 'h' },
    ],
    diagnose: (st) => (st.probs()[0] > 1 - 1e-6 ? 'Two Hs give |0⟩ again: the |1⟩ parts cancel (destructive interference). Now insert a gate that flips the sign of the |1⟩ part in the middle, so the cancellation happens on |0⟩ instead.' : null),
    hints: ['HZH = X.', 'Put `qc.z(0)` between the two Hs.'],
    solution: 'qc.h(0)\nqc.z(0)\nqc.h(0)',
  },
  {
    id: 'bell', lecture: 6, n: 2, title: '4 · Bell pair |Φ⁺⟩',
    brief: 'Prepare (|00⟩ + |11⟩)/√2.',
    predict: 'Which outcomes should never appear in the histogram?',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\n\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nbit[2] c;\n\nc = measure q;\n',
    tests: (st) => [
      { name: 'Only 00 and 11 appear', pass: st.probs()[1] + st.probs()[2] < 1e-6 },
      { name: 'State is exactly |Φ⁺⟩', pass: near(st.amps, vec(S2, 0, 0, S2)) },
    ],
    diagnose: (st) => {
      if (near(st.amps, vec(0.5, 0.5, 0.5, 0.5))) return 'You made |++⟩ (H on both qubits): all four outcomes, not entangled. Use H on one qubit, then CNOT.';
      if (near(st.amps, vec(S2, 0, S2, 0))) return 'H on qubit 0 is right; now add CNOT with qubit 0 as control.';
      if (near(st.amps, vec(S2, 0, 0, -S2))) return 'That is |Φ⁻⟩: right pattern, wrong sign. Did you start qubit 0 in |1⟩?';
      return null;
    },
    hints: ['Lecture 6: H on qubit 0, then CNOT.', '`qc.h(0)` then `qc.cx(0, 1)`.'],
    solution: 'qc.h(0)\nqc.cx(0, 1)',
  },
  {
    id: 'singlet', lecture: 8, n: 2, title: '5 · Build the singlet |Ψ⁻⟩',
    brief: 'Prepare |Ψ⁻⟩ = (|01⟩ − |10⟩)/√2, the state used in the Bell test of Lecture 8.',
    predict: 'Sketch the histogram. Which bitstrings will Qiskit print? (Careful: Qiskit prints qubit 0 on the right.)',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.x(0)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nx q[0];\nh q[0];\ncx q[0], q[1];\n',
    tests: (st) => [
      { name: 'Only 01 and 10 appear', pass: st.probs()[0] + st.probs()[3] < 1e-6 },
      { name: 'Relative sign is minus (|Ψ⁻⟩, not |Ψ⁺⟩)', pass: near(st.amps, vec(0, S2, -S2, 0)) },
    ],
    diagnose: (st) => {
      if (near(st.amps, vec(S2, 0, 0, -S2))) return 'The starter code makes |Φ⁻⟩ = (|00⟩ − |11⟩)/√2: the sign is right but the qubits agree instead of disagreeing. Flip qubit 1 as well before the CNOT.';
      if (near(st.amps, vec(0, S2, S2, 0))) return 'That is |Ψ⁺⟩: correct pattern, but the relative sign should be minus. Start qubit 0 in |1⟩ before the H.';
      return null;
    },
    hints: ['From the table in Lecture 6: input |11⟩ → H on qubit 0 → CNOT gives |Ψ⁻⟩.', 'Add `qc.x(1)` before the H.'],
    solution: 'qc.x(0)\nqc.x(1)\nqc.h(0)\nqc.cx(0, 1)',
  },
  {
    id: 'ghz', lecture: 6, n: 3, title: '6 · Three-qubit GHZ state',
    brief: 'Prepare (|000⟩ + |111⟩)/√2. (The GHZ state shows Bell-type non-classicality without any statistics: see Lecture 8\'s Go deeper.)',
    predict: 'How many CNOTs do you need?',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(3)\n\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[3] q;\n\n',
    tests: (st) => [{ name: 'State is the GHZ state', pass: near(st.amps, [c(S2), ...Array(6).fill(c(0)), c(S2)]) }],
    diagnose: (st) => (st.probs()[0] > 0.49 && st.probs()[6] > 0.49 ? 'You have (|000⟩ + |110⟩)/√2: the third qubit is not connected yet. One more CNOT.' : null),
    hints: ['Make a Bell pair on qubits 0 and 1, then copy the 0/1 value onto qubit 2.', '`qc.h(0)`, `qc.cx(0, 1)`, `qc.cx(1, 2)` (or `cx(0, 2)`).'],
    solution: 'qc.h(0)\nqc.cx(0, 1)\nqc.cx(1, 2)',
  },
  {
    id: 'swap3', lecture: 6, n: 2, title: '7 · SWAP from three CNOTs',
    brief: 'Write a circuit that swaps two qubits <strong>without</strong> using <code>swap</code>. The tests run it on several different inputs.',
    predict: 'Trace |10⟩ through your circuit on paper first.',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\n\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\n\n',
    tests: (_st, ops) => {
      const noSwap = !ops.some((o) => o.g === 'swap');
      const inputs: [C, C][][] = [[[c(0), c(1)], [c(1), c(0)]], [[c(1), c(0)], [c(0), c(1)]], [[c(S2), c(S2)], [c(1), c(0)]], [[c(0.6), c(0, 0.8)], [c(S2), c(-S2)]]];
      const ok = inputs.every(([a, b]) => {
        const out = run(2, ops, State.fromQubits([a, b]));
        return near(out.amps, State.fromQubits([b, a]).amps);
      });
      return [{ name: 'Does not use the swap gate', pass: noSwap }, { name: 'Swaps |01⟩, |10⟩, |+0⟩ and a complex input', pass: ok }];
    },
    diagnose: (_st, ops) => {
      const cx = ops.filter((o) => o.g === 'cx');
      if (cx.length === 3 && cx.every((o) => o.q[0] === cx[0].q[0])) return 'All three CNOTs have the same control. They must alternate: 0→1, 1→0, 0→1.';
      if (cx.length === 2) return 'Two CNOTs are not enough; you need three, alternating in direction.';
      return null;
    },
    hints: ['Alternate the direction of the CNOTs.', '`qc.cx(0, 1)`, `qc.cx(1, 0)`, `qc.cx(0, 1)`.'],
    solution: 'qc.cx(0, 1)\nqc.cx(1, 0)\nqc.cx(0, 1)',
  },
  {
    id: 'teleport', lecture: 9, n: 3, title: '8 · Teleportation (deferred measurement)',
    brief: 'Teleport the state made by <code>ry(1.2, 0)</code> from qubit 0 to qubit 2. This simulator can\'t do mid-circuit "if" statements, so use the <strong>deferred measurement</strong> trick: replace "if m₂ then X" with <code>cx(1, 2)</code> and "if m₁ then Z" with <code>cz(0, 2)</code>. Controlling on a qubit and then measuring it gives the same statistics as measuring and then controlling classically.',
    predict: 'Which qubit controls Bob\'s X correction, and which controls Z?',
    qiskit: 'from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(3)\nqc.ry(1.2, 0)      # the "unknown" state to teleport\n\n# 1. shared Bell pair on qubits 1 and 2\n\n# 2. Alice\'s operations on qubits 0 and 1\n\n# 3. Bob\'s corrections (deferred measurement)\n\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[3] q;\nry(1.2) q[0];\n\n',
    tests: (st) => {
      const [x, y, z] = blochOf(st, 2);
      return [{ name: 'Qubit 2 ends in ry(1.2)|0⟩ (Bloch vector check)', pass: Math.abs(x - Math.sin(1.2)) < 1e-6 && Math.abs(y) < 1e-6 && Math.abs(z - Math.cos(1.2)) < 1e-6 }];
    },
    diagnose: (st, ops) => {
      const [x, , z] = blochOf(st, 2);
      if (Math.abs(x) < 1e-6 && Math.abs(z) < 1e-6) return 'Bob\'s qubit is maximally mixed (Bloch vector at the centre): the corrections are missing, so he has no information yet. Add the two controlled corrections.';
      if (ops.some((o) => o.g === 'cz' && o.q.includes(1)) || ops.some((o) => o.g === 'cx' && o.q[0] === 0 && o.q[1] === 2)) return 'Corrections swapped: the qubit that went through Alice\'s CNOT (qubit 1) controls X; the one that went through H (qubit 0) controls Z.';
      return null;
    },
    hints: ['Pair: `h(1)`, `cx(1, 2)`. Alice: `cx(0, 1)`, `h(0)`.', 'Corrections: `cx(1, 2)` then `cz(0, 2)`.'],
    solution: 'qc.h(1)\nqc.cx(1, 2)\nqc.cx(0, 1)\nqc.h(0)\nqc.cx(1, 2)\nqc.cz(0, 2)',
  },
  {
    id: 'sandbox', lecture: 0, n: 2, title: '★ Sandbox: your own circuits',
    brief: 'No tests: write anything you like and look at the state and histogram. Your code is saved in this browser.',
    predict: 'Always predict before you run; it is the fastest way to find gaps.',
    qiskit: 'from qiskit import QuantumCircuit\nfrom math import pi\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()\n',
    qasm: 'OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nh q[0];\ncx q[0], q[1];\n',
    tests: () => [],
    hints: ['Supported gates: h x y z s sdg t tdg id, rx ry rz p (angle first), cx cz swap ccx, measure_all.'],
    solution: '',
  },
];

void GATES;
