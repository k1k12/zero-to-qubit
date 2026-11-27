// Lecture numbers, page slugs and short titles, for pages that list lectures.
export const LECTURES = [
  { n: 1, slug: '01-overview', short: 'Overview & history' },
  { n: 2, slug: '02-complex-linear-algebra', short: 'Complex linear algebra' },
  { n: 3, slug: '03-qubits-and-measurement', short: 'Qubits & measurement' },
  { n: 4, slug: '04-single-qubit-operations', short: 'Single-qubit gates' },
  { n: 5, slug: '05-entanglement', short: 'Entanglement & EPR' },
  { n: 6, slug: '06-multiple-qubit-systems', short: 'Multi-qubit gates' },
  { n: 7, slug: '07-no-cloning', short: 'No-cloning' },
  { n: 8, slug: '08-bells-theorem', short: "Bell's theorem" },
  { n: 9, slug: '09-teleportation', short: 'Teleportation' },
] as const;
export const slugOf = (n: number) => LECTURES.find((l) => l.n === n)!.slug;
