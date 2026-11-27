// "Big ideas": the physics and maths underneath the module, each tied to a lecture.
// Text uses $maths$ and **bold**; links are [label](url).
export interface Idea { title: string; lectures: number[]; level: 'Module' | 'Module+' | 'MSc' | 'PhD'; body: string; formula?: string; next?: [string, string][] }

export const PHYSICS: Idea[] = [
  {
    title: 'Spin and the Stern–Gerlach experiment: the first qubit', lectures: [3, 8], level: 'Module',
    body: 'In 1922 Stern and Gerlach fired silver atoms through a non-uniform magnetic field. Classically the beam should smear out; instead it split cleanly in **two**. The electron\'s spin, measured along any axis, only ever gives "up" or "down": a natural qubit. Put a second magnet at 90° after the first and the results are 50/50 again; the first measurement didn\'t reveal a hidden value, it **prepared** a state. Lecture 8\'s Bohm–EPR experiment uses exactly these spin measurements.',
    formula: 'P(\\text{up along } \\hat b \\mid \\text{up along } \\hat a) = \\cos^2\\tfrac{\\theta}{2}',
    next: [['PhET: Quantum Measurement simulation', 'https://phet.colorado.edu/en/simulations/quantum-measurement'], ['Susskind, Quantum Mechanics: The Theoretical Minimum, lectures 1–3', 'https://theoreticalminimum.com/courses']],
  },
  {
    title: 'Polarisation: the Born rule you can see', lectures: [3], level: 'Module',
    body: 'Lecture 3 uses polarised light (vertical, diagonal, horizontal). A polariser at angle $\\theta$ to the light lets through a fraction $\\cos^2\\theta$ of the intensity (Malus\'s law, 1809). For single photons this becomes a **probability**: each photon passes with probability $\\cos^2\\theta$. That is $|\\braket{\\phi}{\\psi}|^2$ with $\\ket\\psi = \\ket{H}$ and $\\ket\\phi$ at angle $\\theta$. Three polarisers (0°, 45°, 90°) let light through where two crossed ones (0°, 90°) block everything: measurement changes the state.',
    formula: 'P = |\\braket{\\theta}{H}|^2 = \\cos^2\\theta',
  },
  {
    title: 'The Mach–Zehnder interferometer: H, phase, H in glass', lectures: [3, 4], level: 'Module',
    body: 'A half-silvered mirror sends a photon into a superposition of two paths; a second one recombines them. That is a Hadamard, a phase, and another Hadamard. With equal paths the photon **always** exits one port: the two routes to the other port cancel. This is the experiment behind the double-slit and behind every quantum algorithm\'s interference. Try it below.',
  },
  {
    title: 'The Elitzur–Vaidman bomb tester', lectures: [4], level: 'Module+',
    body: 'Put a bomb that explodes when hit by a photon in one arm of the interferometer. If the bomb is a dud, interference sends every photon to D0. If it is live, it acts as a "which path" detector, interference stops, and 25% of the time the photon reaches D1, telling you the bomb is live **without any photon touching it** (1993). Repeated cleverly (the quantum Zeno effect) the success rate approaches 100%.',
    next: [['Scott Aaronson, Intro to QIS notes, lecture 4', 'https://www.scottaaronson.com/qclec.pdf'], ['Ryan O\'Donnell, CMU lecture 4: Unitary transformations and the Elitzur–Vaidman bomb', 'https://www.cs.cmu.edu/~odonnell/quantum18/']],
  },
  {
    title: 'Decoherence: why big things look classical', lectures: [3, 5], level: 'MSc',
    body: 'A qubit that interacts with its environment becomes **entangled** with it. Looking only at the qubit, its relative phase seems to vanish: $\\ket+\\bra+$ decays towards the mixture $\\tfrac12 I$. This is decoherence, and it is the main enemy of quantum hardware (the "noisy" in NISQ). It also explains why cats are never seen in superposition, though whether it fully solves the measurement problem is still debated.',
    formula: '\\begin{pmatrix}\\tfrac12 & \\tfrac12\\\\ \\tfrac12 & \\tfrac12\\end{pmatrix} \\xrightarrow{\\ \\text{environment}\\ } \\begin{pmatrix}\\tfrac12 & \\tfrac12 e^{-t/T_2}\\\\ \\tfrac12 e^{-t/T_2} & \\tfrac12\\end{pmatrix}',
  },
  {
    title: 'Superdense coding: teleportation in reverse', lectures: [6, 9], level: 'Module+',
    body: 'Alice and Bob share $\\ket{\\Phi^+}$. Alice applies $I$, $X$, $Z$ or $ZX$ to her half, turning it into one of the four Bell states, then sends her **one** qubit to Bob. Bob undoes the Bell-pair circuit (CNOT, then H) and reads two bits. One qubit + one ebit = two classical bits; teleportation is two bits + one ebit = one qubit (Bennett & Wiesner 1992).',
  },
  {
    title: 'Wiesner\'s quantum money', lectures: [7], level: 'Module+',
    body: 'Stephen Wiesner\'s idea (written around 1970, published 1983) that started quantum cryptography: a banknote carries qubits each in one of $\\ket0, \\ket1, \\ket+, \\ket-$, known only to the bank. A forger can\'t copy them (no-cloning) and measuring them in the wrong basis damages them. BB84 is this idea turned into key distribution.',
  },
  {
    title: 'Hardware: what a physical qubit is', lectures: [1], level: 'Module+',
    body: 'Superconducting circuits (IBM, Google), trapped ions (Quantinuum, IonQ), neutral atoms in optical tweezers (QuEra, Atom Computing), photons (PsiQuantum, Xanadu) and spins in silicon all realise $\\ket0$ and $\\ket1$ differently, but obey exactly the maths of this module. The hard parts are **coherence time**, **gate fidelity** and **scaling**. This is the syllabus\'s "hardware implementations" topic.',
    next: [['The New Quantum Era podcast (interviews with hardware builders)', 'https://podcasts.apple.com/gb/podcast/id1637676725']],
  },
];

export const MATHS: Idea[] = [
  {
    title: 'Probability, and why amplitudes are different', lectures: [3], level: 'Module',
    body: 'Classical probabilities are non-negative and **add**: two ways to an outcome means $p_1 + p_2$. Quantum amplitudes are complex and add **before** squaring: $|a_1 + a_2|^2 = |a_1|^2 + |a_2|^2 + 2\\,\\mathrm{Re}(\\bar a_1 a_2)$. The last term is interference, and it can be negative. Bayes\' rule (updating after you look) is the classical cousin of the measurement update.',
    formula: '|a_1 + a_2|^2 = |a_1|^2 + |a_2|^2 + \\underbrace{2\\,\\mathrm{Re}(\\bar a_1 a_2)}_{\\text{interference}}',
  },
  {
    title: 'Inner products and orthonormal bases', lectures: [2, 3], level: 'Module',
    body: 'An orthonormal basis $\\{\\ket{e_k}\\}$ has $\\braket{e_j}{e_k} = \\delta_{jk}$. Then any state expands as $\\ket\\psi = \\sum_k \\braket{e_k}{\\psi}\\ket{e_k}$: the coefficients **are** the amplitudes for measuring in that basis. Changing measurement basis is just re-expanding the same vector. The identity $\\sum_k \\ket{e_k}\\bra{e_k} = I$ ("resolution of the identity") is the most useful trick in the subject.',
    formula: '\\ket\\psi = \\sum_k \\ket{e_k}\\braket{e_k}{\\psi}',
  },
  {
    title: 'Spectral theorem: why measurements are Hermitian matrices', lectures: [2, 4], level: 'Module+',
    body: 'Every Hermitian matrix can be written $A = \\sum_k \\lambda_k \\ket{k}\\bra{k}$ with **real** eigenvalues and orthonormal eigenvectors. So an observable is "a list of possible results ($\\lambda_k$) attached to a measurement basis ($\\ket k$)". The average result is $\\bra\\psi A\\ket\\psi$, which is how Lecture 8 computes $E(a,b)$.',
    formula: '\\langle A\\rangle = \\bra\\psi A\\ket\\psi = \\sum_k \\lambda_k |\\braket{k}{\\psi}|^2',
  },
  {
    title: 'Matrix exponentials and rotations', lectures: [2, 4], level: 'MSc',
    body: 'Euler\'s formula has a matrix version: if $M^2 = I$ then $e^{i\\theta M} = \\cos\\theta\\, I + i\\sin\\theta\\, M$. With $M$ a Pauli matrix this gives every Bloch-sphere rotation, and with $M$ a Hamiltonian it gives time evolution. Gates are exponentials of Hermitian matrices.',
    formula: 'R_x(\\theta) = e^{-i\\theta X/2} = \\cos\\tfrac\\theta2 I - i\\sin\\tfrac\\theta2 X',
  },
  {
    title: 'Groups: Paulis, SU(2) and the 720° turn', lectures: [3, 4], level: 'MSc',
    body: 'The Paulis with phases $\\{\\pm1, \\pm i\\}$ form a **group**: closed under multiplication, every element has an inverse. Single-qubit gates (up to phase) form SU(2), which covers the rotations of 3D space **twice**: $R(360°) = -I$, not $I$. That is the deep reason for the $\\theta/2$ on the Bloch sphere, and why a real electron must turn 720° to come back exactly.',
  },
  {
    title: 'Tensor products and the Kronecker product', lectures: [5, 6], level: 'Module',
    body: 'For matrices, $A\\otimes B$ replaces each entry $a_{ij}$ of $A$ by the block $a_{ij}B$. Rules worth knowing: $(A\\otimes B)(C\\otimes D) = AC\\otimes BD$, and $(A\\otimes B)^\\dagger = A^\\dagger\\otimes B^\\dagger$. Dimensions multiply, which is why $n$ qubits live in $2^n$ dimensions.',
    formula: 'A\\otimes B = \\begin{pmatrix} a_{11}B & a_{12}B\\\\ a_{21}B & a_{22}B\\end{pmatrix}',
  },
  {
    title: 'Convexity: the geometry behind Bell inequalities', lectures: [8], level: 'PhD',
    body: 'Every local hidden-variable model is a mixture of the 16 deterministic strategies, so its possible correlations form a polytope with those 16 as corners. Bell inequalities like CHSH are the **faces** of that polytope. Quantum correlations form a larger, curved (not polytope) set, and no-signalling correlations a larger polytope still (reaching $S = 4$, Popescu–Rohrlich boxes).',
    next: [['Brunner et al., Bell nonlocality (review)', 'https://doi.org/10.1103/RevModPhys.86.419']],
  },
  {
    title: 'Information theory: bits, entropy and the Holevo bound', lectures: [5, 9], level: 'MSc',
    body: 'Shannon entropy $H = -\\sum p\\log_2 p$ counts bits. Its quantum version, von Neumann entropy $S(\\rho) = -\\mathrm{Tr}\\,\\rho\\log_2\\rho$, measures mixedness and, for half of a pure pair, entanglement. The Holevo bound says one qubit can carry at most **one** classical bit, which is why teleportation needs two classical bits to move one qubit, and why superdense coding needs a shared ebit to beat it.',
  },
];
