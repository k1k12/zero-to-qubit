// The kinds of slip the error log tracks. Each has a short alert shown before a question
// where it is likely, once you have made it at least twice.
export const MISTAKES: Record<string, { label: string; alert: string }> = {
  'square': { label: 'Forgot to square the amplitude', alert: 'Probability is |amplitude|², not the amplitude. Square the modulus at the end.' },
  'sqrt': { label: 'Missing square root in |z|', alert: '|a + bi| = √(a² + b²). Do not forget the root.' },
  'sign': { label: 'Sign slip', alert: 'Watch minus signs: substitute negative numbers in brackets, e.g. α − (−0.8) = α + 0.8.' },
  'conjugate': { label: 'Wrong or missing conjugate', alert: 'A bra conjugates: ⟨ψ| has ᾱ and β̄. Turn i into −i when you go from ket to bra.' },
  'order': { label: 'Qubit/bit order mix-up', alert: 'Check which qubit is written first. In |ab⟩ the left label is the first qubit. Qiskit prints bitstrings the other way round (q1q0).' },
  'last-step': { label: 'Stopped one step early', alert: 'Re-read the question: does it want the state, the amplitude or the probability? Finish the last step.' },
  'norm': { label: 'Forgot normalisation', alert: 'Check that the squared moduli add to 1. Missing 1/√2 factors are the usual culprit.' },
  'matrix-order': { label: 'Multiplied matrices in the wrong order', alert: 'Gates applied left-to-right in a circuit multiply right-to-left in maths: first A then B is BA|ψ⟩.' },
  'phase': { label: 'Treated relative phase as irrelevant', alert: 'Global phase does not matter; relative phase (between |0⟩ and |1⟩) does.' },
  'correction': { label: 'Wrong teleportation correction', alert: 'Teleportation: bits 00 → nothing, 01 → X, 10 → Z, 11 → X then Z. First bit controls Z, second bit controls X.' },
};
