// Small dense linear algebra. Matrices are arrays of rows; vectors are plain arrays.
// Everything here is pure so the geometry can be tested without WebGL.

export const identity = (n) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

export const transpose = (A) => A[0].map((_, j) => A.map((row) => row[j]));

export const matMul = (A, B) =>
  A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));

export const matVec = (A, x) => A.map((row) => row.reduce((s, a, k) => s + a * x[k], 0));

export const add = (x, y) => x.map((v, i) => v + y[i]);
export const sub = (x, y) => x.map((v, i) => v - y[i]);
export const scale = (x, s) => x.map((v) => v * s);
export const dot = (x, y) => x.reduce((s, v, i) => s + v * y[i], 0);
export const norm = (x) => Math.sqrt(dot(x, x));

export const matAdd = (A, B) => A.map((row, i) => row.map((v, j) => v + B[i][j]));
export const matSub = (A, B) => A.map((row, i) => row.map((v, j) => v - B[i][j]));
export const matScale = (A, s) => A.map((row) => row.map((v) => v * s));

export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

/** Bilinear form xᵀ M y. With y omitted, the quadratic form xᵀ M x. */
export const form = (M, x, y = x) => dot(x, matVec(M, y));

/** Max-abs entry; used as the residual for matrix identities like AᵀMA = M. */
export const maxAbs = (A) => Math.max(...A.flat().map(Math.abs));

export const det2 = (A) => A[0][0] * A[1][1] - A[0][1] * A[1][0];

export const det3 = (A) =>
  A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
  A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
  A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

export const inv2 = (A) => {
  const d = det2(A);
  return [
    [A[1][1] / d, -A[0][1] / d],
    [-A[1][0] / d, A[0][0] / d],
  ];
};

export const inv3 = (A) => {
  const d = det3(A);
  const c = (i, j) => {
    const r = [0, 1, 2].filter((k) => k !== i);
    const s = [0, 1, 2].filter((k) => k !== j);
    const m = A[r[0]][s[0]] * A[r[1]][s[1]] - A[r[0]][s[1]] * A[r[1]][s[0]];
    return (i + j) % 2 === 0 ? m : -m;
  };
  // inverse = adjugate / det, adjugate = transpose of cofactor matrix
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => c(j, i) / d));
};

/**
 * Eigen-decomposition of a real symmetric matrix by cyclic Jacobi rotations.
 * Returns eigenvalues ascending and unit eigenvectors as columns-in-rows: vectors[k] pairs with values[k].
 */
export function eigSym(S, { tol = 1e-13, maxSweeps = 64 } = {}) {
  const n = S.length;
  const A = S.map((row) => row.slice());
  const V = identity(n);
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] ** 2;
    if (off < tol * tol) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = [...Array(n).keys()].sort((i, j) => A[i][i] - A[j][j]);
  return {
    values: order.map((i) => A[i][i]),
    vectors: order.map((i) => V.map((row) => row[i])),
  };
}

/** Lower-triangular L with L Lᵀ = S, for symmetric positive (semi)definite S. */
export function cholesky(S) {
  const n = S.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = S[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(Math.max(s, 0));
      else L[i][j] = L[j][j] > 1e-14 ? s / L[j][j] : 0;
    }
  }
  return L;
}

/** Symmetric positive-definite square root via eigen-decomposition: S^{1/2}. */
export function sqrtSPD(S) {
  const { values, vectors } = eigSym(S);
  const n = S.length;
  const R = Array.from({ length: n }, () => Array(n).fill(0));
  values.forEach((lam, k) => {
    const r = Math.sqrt(lam);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) R[i][j] += r * vectors[k][i] * vectors[k][j];
  });
  return R;
}

/** Rodrigues rotation matrix about unit axis u by angle a. */
export function rotationAxisAngle(u, a) {
  const [x, y, z] = scale(u, 1 / norm(u));
  const c = Math.cos(a);
  const s = Math.sin(a);
  const C = 1 - c;
  return [
    [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
    [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
    [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
  ];
}

/** Axis and angle of a proper rotation R ∈ SO(3). Angle in [0, π]. */
export function axisAngle(R) {
  const tr = R[0][0] + R[1][1] + R[2][2];
  const angle = Math.acos(Math.min(1, Math.max(-1, (tr - 1) / 2)));
  if (angle < 1e-9) return { axis: [0, 0, 1], angle: 0 };
  if (Math.PI - angle < 1e-6) {
    // R = 2uuᵀ - I near π: read the axis from the largest diagonal entry of (R + I)/2
    const B = R.map((row, i) => row.map((v, j) => (v + (i === j ? 1 : 0)) / 2));
    const i = [0, 1, 2].reduce((m, k) => (B[k][k] > B[m][m] ? k : m), 0);
    const col = [B[0][i], B[1][i], B[2][i]];
    return { axis: scale(col, 1 / norm(col)), angle };
  }
  const axis = [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]];
  return { axis: scale(axis, 1 / norm(axis)), angle };
}

export const matEqual = (A, B, tol = 1e-9) => maxAbs(matSub(A, B)) < tol;
