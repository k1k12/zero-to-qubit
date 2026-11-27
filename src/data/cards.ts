// Flashcards. Short prompts on purpose: one fact per card, answerable in a few seconds.
// $...$ is maths (KaTeX). \A{} and \B{} colour alpha and beta.
export interface Card { id: string; lecture: number; q: string; a: string }

export const CARDS: Card[] = [
  // Lecture 1: overview
  { id: 'l1-np', lecture: 1, q: 'Will quantum computers solve NP-complete problems efficiently?', a: 'No known way. There is no efficient classical or quantum algorithm for NP-complete problems, and none is expected without a major theory breakthrough.' },
  { id: 'l1-same', lecture: 1, q: 'Can quantum and classical computers solve the same set of problems?', a: 'Yes, each can simulate the other. The difference is efficiency: for some problems the best known quantum algorithm is exponentially faster.' },
  { id: 'l1-shor', lecture: 1, q: 'Shor (1994) and Grover (1996): what does each give?', a: 'Shor: factoring with an exponential speedup over known classical algorithms. Grover: unstructured search with a quadratic speedup.' },
  { id: 'l1-photo', lecture: 1, q: 'What did the photoelectric effect show about light?', a: 'Light is absorbed in lumps (photons): below a threshold frequency no electrons are emitted, however bright the light. Einstein won his Nobel Prize for this.' },
  { id: 'l1-young', lecture: 1, q: "What does Young's double-slit experiment show?", a: 'Interference: two slits give alternating bright and dark bands, not two bell curves, so light behaves like a wave.' },
  { id: 'l1-heis', lecture: 1, q: 'Why can position and momentum not both be measured to arbitrary precision?', a: 'Their operators do not commute: $[\\hat x, \\hat p] = i\\hbar$, which gives $\\Delta x\\,\\Delta p \\ge \\hbar/2$ (Heisenberg, 1927).' },
  { id: 'l1-nisq', lecture: 1, q: 'What does NISQ stand for?', a: 'Noisy Intermediate-Scale Quantum: today\'s machines, with tens to about a thousand noisy qubits and no full error correction.' },

  // Lecture 2: complex linear algebra
  { id: 'l2-ket', lecture: 2, q: 'What is a ket? What is a bra?', a: 'A ket $\\ket{\\psi}$ is a column vector. A bra $\\bra{\\psi}$ is its conjugate transpose: a row vector with every entry complex-conjugated.' },
  { id: 'l2-braket', lecture: 2, q: 'What do you get from bra × ket, and from ket × bra?', a: '$\\braket{a}{b}$ is a single number. $\\ket{a}\\bra{b}$ is a square matrix.' },
  { id: 'l2-mod', lecture: 2, q: '$|a + bi|$ = ?', a: '$\\sqrt{a^2 + b^2}$, which also equals $\\sqrt{z\\bar z}$.' },
  { id: 'l2-conj', lecture: 2, q: 'Conjugate of $3 - 4i$?', a: '$3 + 4i$ (flip the sign of the imaginary part only).' },
  { id: 'l2-euler', lecture: 2, q: "Euler's formula", a: '$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$, so any $z = r e^{i\\theta}$ with $r = |z|$ and $\\theta$ the argument (phase).' },
  { id: 'l2-matmul', lecture: 2, q: 'When can you multiply an $m\\times n$ matrix by an $m\'\\times n\'$ one?', a: 'Only if $n = m\'$ (columns of the first = rows of the second). The result is $m \\times n\'$.' },
  { id: 'l2-commute', lecture: 2, q: 'Is matrix multiplication commutative?', a: 'Not in general: usually $AB \\ne BA$. Addition is commutative.' },
  { id: 'l2-eig', lecture: 2, q: 'What is an eigenvector of $A$?', a: 'A vector whose direction $A$ does not change: $A\\ket v = a\\ket v$. The number $a$ is the eigenvalue.' },
  { id: 'l2-trace', lecture: 2, q: 'Trace of a square matrix?', a: 'The sum of its diagonal entries.' },

  // Lecture 3: qubits and measurement
  { id: 'l3-qubit', lecture: 3, q: 'General single-qubit state, and the condition on it', a: '$\\ket\\psi = \\A{\\alpha}\\ket0 + \\B{\\beta}\\ket1$ with $|\\A{\\alpha}|^2 + |\\B{\\beta}|^2 = 1$.' },
  { id: 'l3-born', lecture: 3, q: 'Probability that measuring $\\ket\\psi$ gives $\\ket\\phi$', a: '$P(\\phi|\\psi) = |\\braket{\\phi}{\\psi}|^2$ (the Born rule).' },
  { id: 'l3-plus', lecture: 3, q: '$\\ket+$ and $\\ket-$ in the 0/1 basis', a: '$\\ket\\pm = \\tfrac{1}{\\sqrt2}(\\ket0 \\pm \\ket1)$' },
  { id: 'l3-pplus', lecture: 3, q: '$P(+|\\psi)$ for $\\ket\\psi = \\A\\alpha\\ket0 + \\B\\beta\\ket1$', a: '$\\dfrac{|\\A\\alpha + \\B\\beta|^2}{2}$' },
  { id: 'l3-after', lecture: 3, q: 'What is the state just after a measurement?', a: 'The state you observed. Measuring 0/1 and getting 1 leaves the qubit in $\\ket1$.' },
  { id: 'l3-global', lecture: 3, q: 'Does a global phase $e^{i\\gamma}\\ket\\psi$ change any probability?', a: 'No: $|e^{i\\gamma}|=1$, so it cancels. Only the relative phase between $\\ket0$ and $\\ket1$ matters.' },
  { id: 'l3-bloch', lecture: 3, q: 'Bloch-sphere form of a qubit', a: '$\\ket\\psi = \\cos\\tfrac\\theta2\\ket0 + e^{i\\varphi}\\sin\\tfrac\\theta2\\ket1$, with $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$.' },
  { id: 'l3-diff', lecture: 3, q: 'Why is a qubit not just a probabilistic bit?', a: 'It can be measured in many bases ($0/1$, $+/-$, …). $\\ket+$ and $\\ket-$ both give 50/50 for 0/1, yet are perfectly distinguishable in the $+/-$ basis: phase is real information.' },
  { id: 'l3-orth', lecture: 3, q: '$P(+|-)$ = ?', a: '0: orthogonal states never give each other as results.' },

  // Lecture 4: single-qubit operations
  { id: 'l4-x', lecture: 4, q: 'Pauli-X matrix and action', a: '$X = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, flips: $X\\ket0=\\ket1$, $X\\ket1=\\ket0$.' },
  { id: 'l4-z', lecture: 4, q: 'Pauli-Z matrix and action', a: '$Z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$: $Z\\ket0=\\ket0$, $Z\\ket1=-\\ket1$ (phase flip).' },
  { id: 'l4-y', lecture: 4, q: 'Pauli-Y matrix', a: '$Y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$: $Y\\ket0 = i\\ket1$, $Y\\ket1 = -i\\ket0$.' },
  { id: 'l4-h', lecture: 4, q: 'Hadamard matrix and action on basis states', a: '$H=\\tfrac1{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$; $H\\ket0=\\ket+$, $H\\ket1=\\ket-$.' },
  { id: 'l4-xy', lecture: 4, q: '$XY$ = ? and $YX$ = ?', a: '$XY = iZ$, $YX = -iZ$. In general $\\sigma_a\\sigma_b = i\\varepsilon_{abc}\\sigma_c$ for $a\\neq b$.' },
  { id: 'l4-stab', lecture: 4, q: 'Which basis does each Pauli stabilise?', a: 'Z: $\\{\\ket0,\\ket1\\}$. X: $\\{\\ket+,\\ket-\\}$. Y: $\\{\\ket{i},\\ket{-i}\\}$. Each has eigenvalues $\\pm1$.' },
  { id: 'l4-unitary', lecture: 4, q: 'Necessary and sufficient condition for $U$ to be unitary', a: '$U^\\dagger U = I$ (equivalently $U^{-1} = U^\\dagger$). Unitaries preserve the norm, so probabilities still add to 1.' },
  { id: 'l4-herm', lecture: 4, q: 'Necessary and sufficient condition for $A$ to be Hermitian', a: '$A = A^\\dagger$ (it equals its own conjugate transpose).' },
  { id: 'l4-dagger', lecture: 4, q: 'How do you compute $A^\\dagger$?', a: 'Transpose (reflect in the diagonal), then complex-conjugate every entry.' },
  { id: 'l4-sq', lecture: 4, q: 'What is $X^2$, $Y^2$, $Z^2$, $H^2$?', a: 'All equal $I$: these gates are both unitary and Hermitian, so they are their own inverses.' },
  { id: 'l4-s', lecture: 4, q: 'S and T gates', a: '$S=\\mathrm{diag}(1, i) = \\sqrt Z$, $T = \\mathrm{diag}(1, e^{i\\pi/4}) = \\sqrt S$. Unitary but not Hermitian.' },
  { id: 'l4-hzh', lecture: 4, q: '$HZH$ = ?', a: '$X$. (And $HXH = Z$.) Sandwiching with H swaps the Z and X axes of the Bloch sphere.' },

  // Lecture 5: entanglement
  { id: 'l5-tensor', lecture: 5, q: '$(a\\ket0+b\\ket1)\\otimes(c\\ket0+d\\ket1)$ = ?', a: '$ac\\ket{00}+ad\\ket{01}+bc\\ket{10}+bd\\ket{11}$' },
  { id: 'l5-grow', lecture: 5, q: 'How many amplitudes describe $n$ qubits? $n$ classical bits?', a: '$2^n$ complex amplitudes for qubits (doubles per qubit); $n$ values for bits.' },
  { id: 'l5-ent', lecture: 5, q: 'What makes a two-qubit state entangled?', a: 'It cannot be written as a tensor product $\\ket a\\otimes\\ket b$ of single-qubit states.' },
  { id: 'l5-test', lecture: 5, q: 'Quick test: is $\\alpha_{00}\\ket{00}+\\alpha_{01}\\ket{01}+\\alpha_{10}\\ket{10}+\\alpha_{11}\\ket{11}$ separable?', a: 'Separable exactly when $\\alpha_{00}\\alpha_{11} = \\alpha_{01}\\alpha_{10}$.' },
  { id: 'l5-signal', lecture: 5, q: 'Can entanglement send a message faster than light?', a: 'No. Measuring your qubit changes the other\'s state, but its holder only sees random results; the statistics they see do not depend on what you did (no-signalling).' },
  { id: 'l5-epr', lecture: 5, q: 'What did EPR (1935) argue?', a: 'That quantum mechanics is incomplete: particles must carry hidden instructions (local hidden variables) for their results.' },
  { id: 'l5-steer', lecture: 5, q: 'What is steering?', a: 'Your choice of measurement basis on your half of an entangled pair decides which basis the other half collapses into.' },

  // Lecture 6: multiple-qubit systems
  { id: 'l6-cnot', lecture: 6, q: 'CNOT action', a: '$\\mathrm{CNOT}\\ket{a,b} = \\ket{a, a\\oplus b}$: flip the target if the control is 1.' },
  { id: 'l6-cnotm', lecture: 6, q: 'CNOT matrix (control first)', a: '$\\begin{pmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&1\\\\0&0&1&0\\end{pmatrix}$' },
  { id: 'l6-bell', lecture: 6, q: 'Circuit that makes $\\ket{\\Phi^+}$ from $\\ket{00}$', a: 'H on qubit 0, then CNOT (control 0, target 1): $\\tfrac1{\\sqrt2}(\\ket{00}+\\ket{11})$.' },
  { id: 'l6-four', lecture: 6, q: 'The four Bell states', a: '$\\ket{\\Phi^\\pm}=\\tfrac1{\\sqrt2}(\\ket{00}\\pm\\ket{11})$, $\\ket{\\Psi^\\pm}=\\tfrac1{\\sqrt2}(\\ket{01}\\pm\\ket{10})$.' },
  { id: 'l6-swap', lecture: 6, q: 'How many CNOTs make a SWAP?', a: 'Three: CNOT(a→b), CNOT(b→a), CNOT(a→b).' },
  { id: 'l6-toffoli', lecture: 6, q: 'What does the Toffoli (CCNOT) gate do?', a: 'Flips the target only when both controls are 1. It is reversible and universal for classical reversible logic.' },
  { id: 'l6-kron', lecture: 6, q: '$\\ket0\\otimes\\ket1$ as a column vector', a: '$(0,1,0,0)^T = \\ket{01}$' },

  // Lecture 7: no-cloning
  { id: 'l7-thm', lecture: 7, q: 'State the no-cloning theorem', a: 'No physical process can make a perfect copy of an arbitrary unknown quantum state: there is no $U$ with $U\\ket\\psi\\ket{B}=\\ket\\psi\\ket\\psi$ for all $\\ket\\psi$.' },
  { id: 'l7-who', lecture: 7, q: 'Who proved no-cloning, and when?', a: 'Wootters and Zurek, and independently Dieks, in 1982, prompted by Herbert\'s FLASH faster-than-light proposal.' },
  { id: 'l7-why', lecture: 7, q: 'What property of quantum operations forbids cloning?', a: 'Linearity: $U(a x + b y) = aU(x) + bU(y)$. Cloning a superposition would need a non-linear output.' },
  { id: 'l7-basis', lecture: 7, q: 'Can you copy $\\ket0$ and $\\ket1$?', a: 'Yes: CNOT copies known orthogonal basis states. It fails for their superpositions, e.g. $\\ket+$.' },
  { id: 'l7-related', lecture: 7, q: 'Three theorems related to no-cloning', a: 'No-deleting, no-broadcasting, no-signalling (no-communication).' },
  { id: 'l7-bb84', lecture: 7, q: 'BB84 in one line', a: 'Alice sends qubits in random bases (0/1 or +/−); Bob measures in random bases; they keep matching-basis bits. An eavesdropper cannot copy the qubits, so spying causes detectable errors.' },
  { id: 'l7-cnotplus', lecture: 7, q: 'What does CNOT do to $\\ket+\\ket0$?', a: 'Makes $\\tfrac1{\\sqrt2}(\\ket{00}+\\ket{11})$, entangled, not the copy $\\ket+\\ket+$.' },

  // Lecture 8: Bell's theorem
  { id: 'l8-chsh', lecture: 8, q: 'CHSH quantity S', a: '$S = E(a_0,b_0) + E(a_1,b_0) + E(a_0,b_1) - E(a_1,b_1)$' },
  { id: 'l8-lhv', lecture: 8, q: 'Bound on |S| for local hidden variables', a: '$|S| \\le 2$' },
  { id: 'l8-qm', lecture: 8, q: 'Largest |S| quantum mechanics allows', a: '$2\\sqrt2 \\approx 2.83$ (Tsirelson\'s bound).' },
  { id: 'l8-gamma', lecture: 8, q: 'Why is $\\gamma = A_0B_0 + A_1B_0 + A_0B_1 - A_1B_1 = \\pm2$?', a: '$\\gamma = A_0(B_0+B_1) + A_1(B_0-B_1)$. With $B$s equal to $\\pm1$, one bracket is $\\pm2$ and the other is 0.' },
  { id: 'l8-E', lecture: 8, q: 'Correlation for the singlet $\\ket{\\Psi^-}$ at angle $\\theta$ between settings', a: '$E = -\\cos\\theta$' },
  { id: 'l8-angles', lecture: 8, q: 'Settings that give $|S| = 2\\sqrt2$', a: '$a_0 = 0°$, $a_1 = 90°$, $b_0 = 45°$, $b_1 = -45°$ (each pair 45° apart except $a_1,b_1$ at 135°).' },
  { id: 'l8-assume', lecture: 8, q: "Assumptions behind Bell's inequality", a: 'Hidden variables; factorisability (locality + statistical independence); comparing different settings (counterfactual definiteness or the matching condition).' },
  { id: 'l8-exp', lecture: 8, q: 'Key Bell experiments', a: 'Clauser & Freedman 1972; Aspect et al. 1980–82; loophole-free tests 2015 (Delft, Vienna, NIST). Nobel Prize 2022: Aspect, Clauser, Zeilinger.' },
  { id: 'l8-loop', lecture: 8, q: 'Name the four loopholes from the lecture', a: 'Locality, memory, detection, coincidence.' },

  // Lecture 9: teleportation
  { id: 'l9-what', lecture: 9, q: 'What does teleportation need?', a: 'One shared entangled pair plus two classical bits sent from Alice to Bob.' },
  { id: 'l9-alice', lecture: 9, q: "Alice's operations", a: 'CNOT (her input qubit controls her half of the pair), then H on the input qubit, then measure both.' },
  { id: 'l9-fix', lecture: 9, q: "Bob's corrections for bits $m_1m_2$", a: '00: nothing. 01: X. 10: Z. 11: X then Z. In short: apply $Z^{m_1}X^{m_2}$.' },
  { id: 'l9-ftl', lecture: 9, q: 'Is teleportation faster than light?', a: 'No. Until the two classical bits arrive, Bob\'s qubit is maximally mixed ($I/2$) and holds no information.' },
  { id: 'l9-clone', lecture: 9, q: 'Why does teleportation not break no-cloning?', a: "Alice's measurement destroys her copy. The state moves; it is never duplicated." },
  { id: 'l9-prob', lecture: 9, q: 'Probability of each of Alice\'s four outcomes', a: '1/4 each, whatever the input state.' },
];

export const cardsFor = (lecture: number) => CARDS.filter((c) => c.lecture === lecture);
