// Draft mock exam. Written in the style of the module's content and problem sets; the real
// paper's format hasn't been released, so treat this as practice, not a prediction.
export interface Part { label: string; q: string; marks: number; scheme: string[] }
export interface Question { n: number; title: string; lectures: number[]; intro?: string; parts: Part[] }

export const MOCK: Question[] = [
  {
    n: 1, title: 'Complex numbers and vectors', lectures: [2],
    parts: [
      { label: 'a', q: 'Let $z = 1 - i\\sqrt3$. Find $|z|$, $\\bar z$ and $z$ in polar form $re^{i\\theta}$.', marks: 4,
        scheme: ['$|z| = \\sqrt{1 + 3} = 2$ [1]', '$\\bar z = 1 + i\\sqrt3$ [1]', 'Point $(1, -\\sqrt3)$ is in the fourth quadrant, so $\\theta = -\\pi/3$ (or $5\\pi/3$) [1]', '$z = 2e^{-i\\pi/3}$ [1]'] },
      { label: 'b', q: 'Hence compute $z^6$.', marks: 2,
        scheme: ['$z^6 = 2^6 e^{-2\\pi i}$ [1]', '$= 64$ [1]'] },
      { label: 'c', q: 'For $\\ket a = \\begin{pmatrix} 1 \\\\ i \\end{pmatrix}$ and $\\ket b = \\begin{pmatrix} i \\\\ 2 \\end{pmatrix}$, compute $\\braket{a}{b}$.', marks: 2,
        scheme: ['$\\bra a = (1, -i)$ (conjugate!) [1]', '$\\braket ab = 1\\cdot i + (-i)\\cdot 2 = i - 2i = -i$ [1]'] },
    ],
  },
  {
    n: 2, title: 'Qubits and measurement', lectures: [3],
    intro: 'A qubit is prepared in $\\ket\\psi = \\tfrac{1}{\\sqrt5}\\ket0 + \\tfrac{2i}{\\sqrt5}\\ket1$.',
    parts: [
      { label: 'a', q: 'Show that $\\ket\\psi$ is normalised.', marks: 1, scheme: ['$\\tfrac15 + |2i|^2/5 = \\tfrac15 + \\tfrac45 = 1$ [1]'] },
      { label: 'b', q: 'Find the probabilities of each outcome when measuring in the $\\{\\ket0, \\ket1\\}$ basis.', marks: 2, scheme: ['$P(0) = 1/5$ [1]', '$P(1) = 4/5$ [1]'] },
      { label: 'c', q: 'Find $P(+|\\psi)$ and $P(-|\\psi)$.', marks: 3,
        scheme: ['$P(+) = |\\alpha + \\beta|^2/2 = |1 + 2i|^2/10$ [1]', '$= 5/10 = 1/2$ [1]', '$P(-) = |1 - 2i|^2/10 = 1/2$ [1]'] },
      { label: 'd', q: 'After measuring in the $\\{\\ket0,\\ket1\\}$ basis the result is 1. What is the state now, and what is $P(+)$ for a second measurement in the $\\pm$ basis?', marks: 2,
        scheme: ['State is $\\ket1$ (collapse) [1]', '$P(+|1) = 1/2$ [1]'] },
      { label: 'e', q: 'Explain, with an example, the difference between global and relative phase.', marks: 3,
        scheme: ['Global phase multiplies the whole state, $e^{i\\gamma}\\ket\\psi$; it changes no probability because $|e^{i\\gamma}| = 1$ [1]', 'Relative phase is between the $\\ket0$ and $\\ket1$ components [1]', 'Example: $\\ket+$ vs $\\ket-$ have equal 0/1 statistics but $P(+|+) = 1$, $P(+|-) = 0$ [1]'] },
    ],
  },
  {
    n: 3, title: 'Single-qubit operations', lectures: [4],
    parts: [
      { label: 'a', q: 'Write $ZX$ in the form (scalar) × (Pauli operator), showing your working.', marks: 2,
        scheme: ['$ZX = \\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$ [1]', '$= iY$ [1]'] },
      { label: 'b', q: 'State a necessary and sufficient condition for an operator $U$ to be unitary, and explain why quantum gates must be unitary.', marks: 3,
        scheme: ['$U^\\dagger U = I$ [1]', 'Unitaries preserve the norm of every state [1]', 'so total probability stays 1 [1]'] },
      { label: 'c', q: 'Is $S = \\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}$ Hermitian? Is it unitary? Justify.', marks: 2,
        scheme: ['$S^\\dagger = \\mathrm{diag}(1, -i) \\ne S$, so not Hermitian [1]', '$S^\\dagger S = \\mathrm{diag}(1, 1) = I$, so unitary [1]'] },
      { label: 'd', q: 'Compute $HZH\\ket0$ and describe the effect of $HZH$ in words.', marks: 3,
        scheme: ['$H\\ket0 = \\ket+$, $Z\\ket+ = \\ket-$ [1]', '$H\\ket- = \\ket1$ [1]', '$HZH = X$: a bit flip (half-turn about the X axis) [1]'] },
      { label: 'e', q: 'Give the eigenstates and eigenvalues of Pauli-X.', marks: 2, scheme: ['$\\ket+$ with $+1$ [1]', '$\\ket-$ with $-1$ [1]'] },
    ],
  },
  {
    n: 4, title: 'Entanglement and two-qubit gates', lectures: [5, 6],
    parts: [
      { label: 'a', q: 'Compute $\\ket-\\otimes\\ket1$ as a column vector and in ket notation.', marks: 2,
        scheme: ['$\\tfrac1{\\sqrt2}(0, 1, 0, -1)^T$ [1]', '$= \\tfrac1{\\sqrt2}(\\ket{01} - \\ket{11})$ [1]'] },
      { label: 'b', q: 'Determine whether $\\tfrac12(\\ket{00} + \\ket{01} + \\ket{10} - \\ket{11})$ is separable or entangled.', marks: 2,
        scheme: ['Test $\\alpha_{00}\\alpha_{11} = -\\tfrac14$ vs $\\alpha_{01}\\alpha_{10} = \\tfrac14$ [1]', 'Unequal, so entangled [1]'] },
      { label: 'c', q: 'Starting from $\\ket{00}$, apply $X$ to qubit 1 (the second qubit), then $H$ to qubit 0, then CNOT with qubit 0 as control. Give the state after each step and name the final state.', marks: 4,
        scheme: ['$\\ket{01}$ [1]', '$\\tfrac1{\\sqrt2}(\\ket{01} + \\ket{11})$ [1]', '$\\tfrac1{\\sqrt2}(\\ket{01} + \\ket{10})$ [1]', 'Bell state $\\ket{\\Psi^+}$ [1]'] },
      { label: 'd', q: 'Explain why measuring one half of an entangled pair cannot be used to send information faster than light.', marks: 3,
        scheme: ['The other party sees random outcomes (e.g. 50/50) [1]', 'Their local statistics are the same whatever the first party did [1]', 'Correlations only show up when results are compared over a classical channel [1]'] },
    ],
  },
  {
    n: 5, title: 'No-cloning and QKD', lectures: [7],
    parts: [
      { label: 'a', q: 'State the no-cloning theorem.', marks: 1, scheme: ['No unitary can perfectly copy an arbitrary unknown quantum state, i.e. no $U$ with $U\\ket\\psi\\ket B = \\ket\\psi\\ket\\psi$ for all $\\ket\\psi$ [1]'] },
      { label: 'b', q: 'Suppose $U\\ket0\\ket B = \\ket0\\ket0$ and $U\\ket1\\ket B = \\ket1\\ket1$. Use linearity to prove that $U$ cannot clone $\\ket+$.', marks: 4,
        scheme: ['$U\\ket+\\ket B = \\tfrac1{\\sqrt2}(U\\ket0\\ket B + U\\ket1\\ket B)$ by linearity [1]', '$= \\tfrac1{\\sqrt2}(\\ket{00} + \\ket{11})$ [1]', 'A clone would be $\\ket+\\ket+ = \\tfrac12(\\ket{00}+\\ket{01}+\\ket{10}+\\ket{11})$ [1]', 'These differ, contradiction [1]'] },
      { label: 'c', q: 'In BB84, explain why an intercept–resend eavesdropper introduces errors, and estimate the error rate in the sifted key.', marks: 3,
        scheme: ['Eve cannot copy, so must measure in a guessed basis; wrong half the time [1]', 'Then she resends the wrong basis state and Bob errs with probability 1/2 [1]', 'Error rate $1/2 \\times 1/2 = 25\\%$ [1]'] },
    ],
  },
  {
    n: 6, title: "Bell's theorem", lectures: [8],
    parts: [
      { label: 'a', q: 'For a local hidden-variable model with outcomes $A_0, A_1, B_0, B_1 \\in\\{\\pm1\\}$, show that $\\gamma = A_0B_0 + A_1B_0 + A_0B_1 - A_1B_1 = \\pm2$.', marks: 3,
        scheme: ['Factorise $\\gamma = A_0(B_0 + B_1) + A_1(B_0 - B_1)$ [1]', 'If $B_0 = B_1$ the second bracket is 0 and the first $\\pm2$; otherwise the reverse [1]', 'Multiplying by $A_i = \\pm1$ gives $\\gamma = \\pm2$ [1]'] },
      { label: 'b', q: 'Hence state the CHSH inequality.', marks: 1, scheme: ['$|S| = |E(a_0,b_0) + E(a_1,b_0) + E(a_0,b_1) - E(a_1,b_1)| \\le 2$ [1]'] },
      { label: 'c', q: 'For the singlet, $E(a,b) = -\\cos\\theta_{ab}$. Compute $S$ for $a_0 = 0°$, $a_1 = 90°$, $b_0 = 45°$, $b_1 = -45°$ and comment.', marks: 3,
        scheme: ['Angles 45°, 45°, 45°, 135° give $E = -\\tfrac1{\\sqrt2}, -\\tfrac1{\\sqrt2}, -\\tfrac1{\\sqrt2}, +\\tfrac1{\\sqrt2}$ [1]', '$S = -2\\sqrt2$ [1]', '$|S| > 2$: violates CHSH, so no LHV model reproduces QM (Tsirelson bound reached) [1]'] },
      { label: 'd', q: "Name two assumptions of Bell's theorem.", marks: 2, scheme: ['Any two of: hidden variables; locality; statistical independence; counterfactual definiteness / comparability of settings [2]'] },
    ],
  },
  {
    n: 7, title: 'Teleportation', lectures: [9],
    intro: 'Alice holds $\\ket\\psi = \\alpha\\ket0 + \\beta\\ket1$ (qubit 0) and qubit 1 of the shared state $\\ket{\\Phi^+}_{12}$; Bob holds qubit 2.',
    parts: [
      { label: 'a', q: 'List Alice\'s operations in order.', marks: 2, scheme: ['CNOT with qubit 0 as control, qubit 1 as target [1]', 'Then H on qubit 0, then measure qubits 0 and 1 [1]'] },
      { label: 'b', q: 'Before measurement the state can be written as $\\tfrac12\\sum_{m_1m_2}\\ket{m_1m_2}\\otimes\\ket{\\phi_{m_1m_2}}$. Give $\\ket{\\phi_{m_1m_2}}$ for all four outcomes.', marks: 4,
        scheme: ['00: $\\alpha\\ket0 + \\beta\\ket1$ [1]', '01: $\\alpha\\ket1 + \\beta\\ket0$ [1]', '10: $\\alpha\\ket0 - \\beta\\ket1$ [1]', '11: $\\alpha\\ket1 - \\beta\\ket0$ [1]'] },
      { label: 'c', q: "State Bob's correction for each outcome.", marks: 2, scheme: ['00: I; 01: X; 10: Z [1]', '11: X then Z [1]'] },
      { label: 'd', q: 'Explain why teleportation does not violate the no-cloning theorem or allow faster-than-light communication.', marks: 2,
        scheme: ["Alice's measurement destroys her copy, so only one copy ever exists [1]", 'Bob needs two classical bits (≤ speed of light); without them his qubit is maximally mixed [1]'] },
    ],
  },
];

export const TOTAL = MOCK.reduce((s, q) => s + q.parts.reduce((t, p) => t + p.marks, 0), 0);
