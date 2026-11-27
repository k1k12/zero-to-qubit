// Run with: npm test   (Node 22+ runs TypeScript directly)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { State, GATES, fidelity, c, blochOf, concurrence2 } from '../src/lib/sim.ts';
import { parseQiskit, parseQasm, run, evalExpr } from '../src/lib/qparse.ts';

const close = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const S2 = Math.SQRT1_2;

test('H|0> = |+>', () => {
  const s = new State(1).apply1(GATES.H, 0);
  close(s.amps[0].re, S2); close(s.amps[1].re, S2);
});

test('qubit 0 is the leftmost label', () => {
  const s = new State(2).apply1(GATES.X, 0); // |10>
  close(s.probs()[2], 1);
});

test('H then CNOT makes Phi+, which is entangled', () => {
  const s = new State(2).apply1(GATES.H, 0).cx(0, 1);
  assert.ok(fidelity(s.amps, [c(S2), c(0), c(0), c(S2)]) > 1 - 1e-9);
  close(concurrence2(s.amps), 1);
});

test('SWAP from three CNOTs swaps |01> and |10>', () => {
  const s = new State(2).apply1(GATES.X, 1).swap(0, 1);
  close(s.probs()[2], 1);
});

test('teleportation with deferred measurement moves the state to q2', () => {
  const r = parseQiskit(`qc = QuantumCircuit(3)
qc.ry(1.2, 0)
qc.h(1)
qc.cx(1, 2)
qc.cx(0, 1)
qc.h(0)
qc.cx(1, 2)
qc.cz(0, 2)`);
  assert.equal(r.errors.length, 0);
  const st = run(3, r.ops);
  const [x, y, z] = blochOf(st, 2);
  close(x, Math.sin(1.2), 1e-9); close(y, 0); close(z, Math.cos(1.2), 1e-9);
});

test('parser gives teaching errors', () => {
  assert.match(parseQiskit('qc = QuantumCircuit(2)\nqc.cnot(0, 1)').errors[0].msg, /cx/);
  assert.match(parseQiskit('qc = QuantumCircuit(2)\nqc.h(2)').errors[0].msg, /0 to 1/);
  assert.match(parseQiskit('qc = QuantumCircuit(2)\nqc.H(0)').errors[0].msg, /lower-case/);
  assert.match(parseQasm('qubit[1] q;\nh q[0]').errors[0].msg, /semicolon/);
});

test('OpenQASM 3 Bell pair', () => {
  const r = parseQasm('OPENQASM 3.0;\ninclude "stdgates.inc";\nqubit[2] q;\nbit[2] c;\nh q[0];\ncx q[0], q[1];\nc = measure q;');
  assert.equal(r.errors.length, 0);
  close(run(2, r.ops).probs()[3], 0.5);
});

test('angle expressions', () => {
  close(evalExpr('pi/2'), Math.PI / 2);
  close(evalExpr('-np.pi / 4'), -Math.PI / 4);
  close(evalExpr('2*(pi-1)'), 2 * (Math.PI - 1));
});
