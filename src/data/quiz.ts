// Quiz questions. Each wrong option can name the mistake it represents (see mistakes.ts);
// picking it adds to your error log, and the quiz warns you about that slip next time.
export interface Q {
  id: string;
  lecture: number;
  q: string;
  options: string[];
  answer: number;
  /** Mistake tag for each wrong option, by index */
  traps?: Record<number, string>;
  /** Mistakes this question is prone to (drives the alert) */
  risks?: string[];
  work: string; // worked answer
}

export const QUIZ: Q[] = [
  // L1
  { id: 'q1-myth', lecture: 1, q: 'Which statement about quantum computers is TRUE?', options: ['They efficiently solve NP-complete problems', 'They are faster GPUs', 'They can solve exactly the same problems as classical computers, sometimes far more efficiently', 'They need calculus-heavy physics to program'], answer: 2, work: 'Classical and quantum computers can simulate each other, so they solve the same problems; the difference is efficiency for certain problems (e.g. factoring).' },
  { id: 'q1-grover', lecture: 1, q: "Grover's algorithm gives what kind of speedup for unstructured search?", options: ['Exponential', 'Quadratic', 'None', 'Linear'], answer: 1, work: 'Grover searches $N$ items in about $\\sqrt N$ steps instead of $N$: a quadratic speedup. Shor\'s factoring is the exponential one.' },

  // L2
  { id: 'q2-mod', lecture: 2, q: 'What is $|3 - 4i|$?', options: ['$5$', '$25$', '$-1$', '$7$'], answer: 0, traps: { 1: 'sqrt', 2: 'sign' }, risks: ['sqrt'], work: '$|a+bi| = \\sqrt{a^2+b^2} = \\sqrt{9+16} = \\sqrt{25} = 5$. 25 is $|z|^2$ (forgot the root).' },
  { id: 'q2-conj', lecture: 2, q: 'If $\\ket v = \\begin{pmatrix}2\\\\ i\\end{pmatrix}$, what is $\\braket{v}{v}$?', options: ['$3$', '$5$', '$4 + i$', '$\\sqrt5$'], answer: 1, traps: { 0: 'conjugate', 3: 'last-step' }, risks: ['conjugate'], work: '$\\bra v = (2, -i)$, so $\\braket vv = 4 + (-i)(i) = 4 + 1 = 5$. Without the conjugate you get $4 + i^2 = 3$. $\\sqrt5$ is the norm, not $\\braket vv$.' },
  { id: 'q2-div', lecture: 2, q: '$\\dfrac{1}{1+i}$ = ?', options: ['$\\tfrac12(1-i)$', '$1 - i$', '$\\tfrac12(1+i)$', '$\\tfrac{1}{\\sqrt2}(1-i)$'], answer: 0, traps: { 1: 'last-step', 2: 'conjugate', 3: 'sqrt' }, work: 'Multiply top and bottom by $1 - i$: $\\dfrac{1-i}{(1+i)(1-i)} = \\dfrac{1-i}{2}$.' },
  { id: 'q2-arg', lecture: 2, q: 'The argument (phase) of $-1 - i$ is', options: ['$45°$', '$-135°$ (equivalently $225°$)', '$135°$', '$-45°$'], answer: 1, traps: { 0: 'sign' }, work: 'The point $(-1, -1)$ is in the third quadrant. $\\tan^{-1}(1) = 45°$, but you must add $180°$: $225° \\equiv -135°$.' },
  { id: 'q2-mat', lecture: 2, q: 'A $2\\times3$ matrix times a $3\\times4$ matrix gives', options: ['$2\\times4$', '$3\\times3$', '$4\\times2$', 'Not defined'], answer: 0, work: '(rows of first) × (columns of second) = $2\\times4$. The inner 3s must match.' },

  // L3
  { id: 'q3-pminus', lecture: 3, q: 'For $\\ket\\psi = 0.6\\ket0 - 0.8\\ket1$, what is $P(-)$?', options: ['$0.02$', '$0.98$', '$0.7$', '$1.4$'], answer: 1, traps: { 0: 'sign', 2: 'square', 3: 'square' }, risks: ['sign', 'square'], work: '$P(-) = \\dfrac{|\\alpha - \\beta|^2}{2} = \\dfrac{|0.6 - (-0.8)|^2}{2} = \\dfrac{1.96}{2} = 0.98$.' },
  { id: 'q3-p0', lecture: 3, q: '$\\ket\\psi = \\tfrac{1}{\\sqrt3}\\ket0 + \\sqrt{\\tfrac23}\\,i\\ket1$. $P(1)$ = ?', options: ['$\\tfrac23$', '$-\\tfrac23$', '$\\sqrt{\\tfrac23}$', '$\\tfrac13$'], answer: 0, traps: { 1: 'square', 2: 'square' }, risks: ['square'], work: '$P(1) = |\\beta|^2 = |\\sqrt{2/3}\\,i|^2 = \\tfrac23\\cdot|i|^2 = \\tfrac23$. Probabilities are never negative.' },
  { id: 'q3-plus1', lecture: 3, q: 'What is $P(+|1)$?', options: ['$0$', '$\\tfrac12$', '$1$', '$\\tfrac{1}{\\sqrt2}$'], answer: 1, traps: { 3: 'square' }, risks: ['square'], work: '$\\braket{+}{1} = \\tfrac{1}{\\sqrt2}$, so $P = \\tfrac12$. $\\tfrac1{\\sqrt2}$ is the amplitude, not the probability.' },
  { id: 'q3-phase', lecture: 3, q: 'Which pair are the SAME physical state?', options: ['$\\ket+$ and $\\ket-$', '$\\ket0$ and $-\\ket0$', '$\\ket0$ and $\\ket1$', '$\\tfrac{1}{\\sqrt2}(\\ket0+i\\ket1)$ and $\\ket+$'], answer: 1, traps: { 0: 'phase', 3: 'phase' }, work: '$-\\ket0 = e^{i\\pi}\\ket0$ differs only by a global phase. The others differ by relative phase (or are orthogonal).' },
  { id: 'q3-norm', lecture: 3, q: 'Which is a valid (normalised) qubit state?', options: ['$\\ket0 + \\ket1$', '$\\tfrac12\\ket0 + \\tfrac12\\ket1$', '$\\tfrac35\\ket0 + \\tfrac45 i\\ket1$', '$0.5\\ket0 - 0.5i\\ket1$'], answer: 2, traps: { 0: 'norm', 1: 'norm', 3: 'norm' }, risks: ['norm'], work: '$(3/5)^2 + |4i/5|^2 = 9/25 + 16/25 = 1$. The others sum to 2, ½ and ½.' },
  { id: 'q3-bloch', lecture: 3, q: 'Where is $\\tfrac{1}{\\sqrt2}(\\ket0 - i\\ket1)$ on the Bloch sphere?', options: ['North pole', 'On the equator at $\\varphi = 270°$ ($-y$ axis)', 'On the equator at $\\varphi = 90°$', 'South pole'], answer: 1, traps: { 2: 'sign' }, work: '$|\\alpha| = |\\beta|$ so $\\theta = 90°$ (equator). $e^{i\\varphi} = -i$ gives $\\varphi = 270° = -90°$: the $\\ket{-i}$ point.' },

  // L4
  { id: 'q4-xz', lecture: 4, q: '$ZX$ = scalar × operator. Which?', options: ['$iY$', '$-iY$', '$Y$', '$iZ$'], answer: 0, traps: { 1: 'matrix-order' }, risks: ['matrix-order'], work: 'Cycle $X\\to Y\\to Z\\to X$: $Z$ then $X$ is in cyclic order ($ZX$), so $+iY$. Check: $ZX = \\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix} = i\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$.' },
  { id: 'q4-yz', lecture: 4, q: '$YZ$ = ?', options: ['$iX$', '$-iX$', '$X$', '$-X$'], answer: 0, traps: { 1: 'matrix-order' }, work: '$Y\\to Z$ is cyclic, so $+iX$.' },
  { id: 'q4-unit', lecture: 4, q: 'Necessary and sufficient condition for $U$ to be unitary:', options: ['$U = U^\\dagger$', '$U^\\dagger U = I$', '$\\det U = 1$', 'All entries have modulus ≤ 1'], answer: 1, work: 'Unitary ⇔ $U^\\dagger U = I$. $U = U^\\dagger$ is Hermitian. $|\\det U| = 1$ is necessary but not sufficient, and $\\det U$ need not be exactly 1 (e.g. $\\det Z = -1$).' },
  { id: 'q4-herm', lecture: 4, q: 'Necessary and sufficient condition for $A$ to be Hermitian:', options: ['$A^\\dagger A = I$', '$A = A^\\dagger$', '$A^2 = I$', '$A$ is real'], answer: 1, work: 'Hermitian (self-adjoint) means $A = A^\\dagger$. Y is Hermitian despite having imaginary entries.' },
  { id: 'q4-eigY', lecture: 4, q: 'The eigenstates of Pauli-Y are', options: ['$\\ket0, \\ket1$', '$\\ket+, \\ket-$', '$\\tfrac1{\\sqrt2}(\\ket0\\pm i\\ket1)$', '$\\tfrac1{\\sqrt2}(\\ket0\\pm\\ket1)$ and $\\ket1$'], answer: 2, work: 'Y stabilises the $\\pm i$ basis: $Y\\ket{\\pm i} = \\pm\\ket{\\pm i}$.' },
  { id: 'q4-hz', lecture: 4, q: 'Starting from $\\ket0$, apply H then Z then H. Result?', options: ['$\\ket0$', '$\\ket1$', '$\\ket+$', '$\\ket-$'], answer: 1, traps: { 0: 'matrix-order', 3: 'last-step' }, work: '$H\\ket0 = \\ket+$, $Z\\ket+ = \\ket-$, $H\\ket- = \\ket1$. (Equivalently $HZH = X$.)' },
  { id: 'q4-sdag', lecture: 4, q: 'Which gate undoes $S$?', options: ['$S$', '$S^\\dagger = \\mathrm{diag}(1, -i)$', '$Z$', '$T$'], answer: 1, work: 'For unitaries the inverse is the adjoint. $S$ is not Hermitian, so $S^{-1} = S^\\dagger \\ne S$; in fact $SS = Z$.' },

  // L5
  { id: 'q5-tensor', lecture: 5, q: '$\\ket1\\otimes\\ket+$ = ?', options: ['$\\tfrac1{\\sqrt2}(\\ket{10} + \\ket{11})$', '$\\tfrac1{\\sqrt2}(\\ket{01} + \\ket{11})$', '$\\tfrac1{\\sqrt2}(\\ket{00} + \\ket{11})$', '$\\ket{1+}$ cannot be expanded'], answer: 0, traps: { 1: 'order' }, risks: ['order'], work: 'First qubit is 1 in every term: $\\ket1\\tfrac{1}{\\sqrt2}(\\ket0+\\ket1) = \\tfrac1{\\sqrt2}(\\ket{10}+\\ket{11})$.' },
  { id: 'q5-ent', lecture: 5, q: 'Which state is entangled?', options: ['$\\tfrac12(\\ket{00}+\\ket{01}+\\ket{10}+\\ket{11})$', '$\\tfrac{1}{\\sqrt2}(\\ket{00}+\\ket{01})$', '$\\tfrac{1}{\\sqrt2}(\\ket{01}-\\ket{10})$', '$\\ket{11}$'], answer: 2, work: 'Test $\\alpha_{00}\\alpha_{11} = \\alpha_{01}\\alpha_{10}$. For the singlet: $0 \\ne -\\tfrac12$. The others are $\\ket{++}$, $\\ket0\\ket+$ and $\\ket1\\ket1$.' },
  { id: 'q5-signal', lecture: 5, q: 'Alice and Bob share $\\ket{\\Phi^+}$. Alice measures in the +/− basis. What changes in Bob\'s 0/1 statistics?', options: ['They become 100% 0', 'They become 100% +', 'Nothing: still 50/50', 'They depend on Alice\'s result, which Bob can see'], answer: 2, work: 'No-signalling: Bob\'s own statistics are unchanged. Only by comparing results later do correlations appear.' },

  // L6
  { id: 'q6-cnot', lecture: 6, q: 'CNOT (control = first qubit) applied to $\\tfrac{1}{\\sqrt2}(\\ket{10} + \\ket{01})$ gives', options: ['$\\tfrac1{\\sqrt2}(\\ket{11}+\\ket{01})$', '$\\tfrac1{\\sqrt2}(\\ket{10}+\\ket{11})$', '$\\tfrac1{\\sqrt2}(\\ket{10}+\\ket{01})$', '$\\tfrac1{\\sqrt2}(\\ket{00}+\\ket{01})$'], answer: 0, traps: { 1: 'order' }, risks: ['order'], work: '$\\ket{10}\\to\\ket{11}$ (control 1: flip the target), $\\ket{01}\\to\\ket{01}$ (control 0: nothing). Result $\\tfrac1{\\sqrt2}(\\ket{11}+\\ket{01}) = \\ket+\\otimes\\ket1$, which is separable: CNOT can also remove entanglement.' },
  { id: 'q6-bell', lecture: 6, q: 'H on the first qubit then CNOT, starting from $\\ket{10}$, gives', options: ['$\\ket{\\Phi^+}$', '$\\ket{\\Phi^-}$', '$\\ket{\\Psi^+}$', '$\\ket{\\Psi^-}$'], answer: 1, traps: { 0: 'sign' }, work: '$H\\ket1 = \\ket-$: $\\tfrac1{\\sqrt2}(\\ket{00}-\\ket{10})$, then CNOT: $\\tfrac1{\\sqrt2}(\\ket{00}-\\ket{11}) = \\ket{\\Phi^-}$.' },
  { id: 'q6-ih', lecture: 6, q: 'The 4×4 matrix for "X on the second qubit" is', options: ['$X\\otimes I$', '$I\\otimes X$', '$X\\otimes X$', 'CNOT'], answer: 1, traps: { 0: 'order' }, risks: ['order'], work: 'Slot = qubit. Second qubit → second slot: $I\\otimes X$.' },
  { id: 'q6-swap', lecture: 6, q: 'How many CNOTs are needed to build a SWAP?', options: ['1', '2', '3', '4'], answer: 2, work: 'CNOT(a→b), CNOT(b→a), CNOT(a→b).' },

  // L7
  { id: 'q7-thm', lecture: 7, q: 'Which pair of states CAN one machine clone perfectly?', options: ['$\\ket0$ and $\\ket+$', '$\\ket+$ and $\\ket-$', '$\\ket0$ and $\\tfrac{1}{\\sqrt2}(\\ket0+i\\ket1)$', 'Any pair'], answer: 1, work: 'Only orthogonal (or identical) states. $\\ket+$ and $\\ket-$ are orthogonal: apply H, CNOT, then H on both to copy them.' },
  { id: 'q7-why', lecture: 7, q: 'The core reason cloning fails is that quantum operations are', options: ['Probabilistic', 'Linear', 'Non-local', 'Irreversible'], answer: 1, work: 'Linearity: cloning would turn $\\alpha\\ket0+\\beta\\ket1$ into something quadratic in α, β.' },
  { id: 'q7-bb84', lecture: 7, q: 'In BB84 with an intercept-resend eavesdropper, the error rate in the sifted key is about', options: ['0%', '12.5%', '25%', '50%'], answer: 2, work: 'Eve guesses the wrong basis half the time; then Bob errs half the time: ½ × ½ = 25%.' },

  // L8
  { id: 'q8-bound', lecture: 8, q: 'For any local hidden-variable model, CHSH gives', options: ['$|S|\\le 1$', '$|S|\\le 2$', '$|S|\\le 2\\sqrt2$', '$|S|\\le 4$'], answer: 1, work: 'Each pair has $\\gamma = \\pm2$, so the average satisfies $|S|\\le2$. $2\\sqrt2$ is the quantum (Tsirelson) bound.' },
  { id: 'q8-E', lecture: 8, q: 'For the singlet, Alice and Bob measure along directions 60° apart. $E$ = ?', options: ['$-\\tfrac12$', '$\\tfrac12$', '$-\\tfrac{\\sqrt3}{2}$', '$0$'], answer: 0, traps: { 1: 'sign' }, risks: ['sign'], work: '$E = -\\cos 60° = -\\tfrac12$. They disagree 75% of the time: $P(\\text{same}) = (1+E)/2 = \\tfrac14$.' },
  { id: 'q8-S', lecture: 8, q: 'With $E(a_0,b_0) = E(a_1,b_0) = E(a_0,b_1) = -0.7$ and $E(a_1,b_1) = +0.7$, $S$ = ?', options: ['$-2.8$', '$-1.4$', '$2.8$', '$0$'], answer: 0, traps: { 1: 'sign', 3: 'sign' }, risks: ['sign'], work: '$S = -0.7 - 0.7 - 0.7 - (+0.7) = -2.8$. $|S| = 2.8 > 2$: violation.' },
  { id: 'q8-assume', lecture: 8, q: 'Which is NOT one of the assumptions of Bell\'s theorem?', options: ['Locality', 'Statistical independence', 'Counterfactual definiteness', 'The no-cloning theorem'], answer: 3, work: 'No-cloning plays no role in deriving the CHSH inequality.' },

  // L9
  { id: 'q9-fix', lecture: 9, q: 'Alice gets $m_1m_2 = 01$. Bob applies', options: ['Nothing', 'X', 'Z', 'X then Z'], answer: 1, traps: { 2: 'correction', 3: 'correction' }, risks: ['correction'], work: '$m_2 = 1$ → X; $m_1 = 0$ → no Z. Bob held $\\alpha\\ket1 + \\beta\\ket0$; X swaps it back.' },
  { id: 'q9-fix11', lecture: 9, q: 'Alice gets 11. Before correcting, Bob holds', options: ['$\\alpha\\ket0+\\beta\\ket1$', '$\\alpha\\ket1+\\beta\\ket0$', '$\\alpha\\ket0-\\beta\\ket1$', '$\\alpha\\ket1-\\beta\\ket0$'], answer: 3, traps: { 1: 'correction', 2: 'correction' }, risks: ['correction'], work: 'From the grouped state: the $\\ket{11}$ term is $\\tfrac12\\ket{11}(\\alpha\\ket1 - \\beta\\ket0)$. Fix: X then Z.' },
  { id: 'q9-bits', lecture: 9, q: 'How many classical bits must Alice send per teleported qubit?', options: ['0', '1', '2', 'Infinitely many (to describe α and β)'], answer: 2, work: 'Two bits, telling Bob which of the four corrections to apply. α and β themselves are never sent or known.' },
  { id: 'q9-ftl', lecture: 9, q: 'Before the bits arrive, Bob measures his qubit in 0/1. $P(0)$ = ?', options: ['$|\\alpha|^2$', '$\\tfrac12$', '$1$', 'Depends on Alice\'s result, which Bob knows'], answer: 1, work: 'Averaged over Alice\'s four equally likely results, Bob\'s qubit is $I/2$: 50/50 whatever ψ is. That\'s why teleportation can\'t signal faster than light.' },
];
