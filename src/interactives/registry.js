// The Master Map's sequence (docs/Interactive_Master_Map.docx), with what exists so far.
// Titles are Nadia's. "built" means an interactive exists; "partly" names where its content begins elsewhere.

export const MASTER_MAP = [
  { n: 1, title: 'What is a signal?', status: 'not built' },
  { n: 2, title: 'Music as a mathematical language', status: 'not built' },
  { n: 3, title: 'Periodicity in nature', status: 'not built' },
  { n: 4, title: 'Symmetry across space and time', status: 'not built' },
  { n: 5, title: 'What is a representation?', status: 'not built' },
  { n: 6, title: 'Fourier series', status: 'not built' },
  { n: 7, title: 'Fourier coefficients and orthonormal bases', status: 'built', id: 'coefficients', hashPrefix: 'coeff' },
  { n: 8, title: 'Orthogonality and zero', status: 'built', id: 'orthogonality', hashPrefix: 'ortho' },
  { n: 9, title: 'Orthogonality beyond visible dimensions', status: 'partly', note: 'stages 4 to 6 of Orthogonality and Zero begin it' },
  { n: 10, title: 'Mean-square convergence', status: 'not built' },
  { n: 11, title: 'Squared coefficients, length, and energy', status: 'not built' },
  { n: 12, title: 'Fourier pairs', status: 'not built' },
  { n: 13, title: 'Zero as a mathematical cornerstone', status: 'not built' },
  { n: 14, title: 'Quadratic geometry and the identity matrix', status: 'not built' },
  { n: 15, title: 'Information geometry', status: 'not built' },
  { n: 16, title: 'Higher-dimensional prediction space', status: 'not built' },
  { n: 17, title: 'Conjugacy and physical pairs', status: 'not built' },
  { n: 18, title: 'Infinity, circular geometry, and time', status: 'not built' },
  { n: 19, title: 'Einstein, relativity, and mathematical reality', status: 'not built' },
  { n: 20, title: 'Finite energy', status: 'parked' },
];

export const neighbours = (n) => ({
  prev: MASTER_MAP.find((m) => m.n === n - 1),
  next: MASTER_MAP.find((m) => m.n === n + 1),
});
