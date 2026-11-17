# Source card: Zhou and Siadat 2017

**Kecheng Zhou, M. Vali Siadat.** "Notes on Harmonic Analysis, Part I: The Fourier Transform." arXiv:1709.03377v1
[math.CA], 28 Aug 2017. Lecture notes (not a peer-reviewed journal article).

- arXiv: [1709.03377](https://arxiv.org/abs/1709.03377) (v1).
- **Read on 2026-11-17:** the full text of arXiv v1 (25 pages) was downloaded from arxiv.org and read for §1 (Fourier
  transforms on L¹(ℝ)): Definition 1.1, Theorem 1.13 and Theorem 1.15, with their proofs.
- **Why it is read:** the #17 lock needs the converse of real-signal conjugate symmetry (Hermitian symmetry ⇒ the
  signal is real) for general integrable signals. That converse follows from the uniqueness theorem below. Two other
  open texts (Wikipedia, "Fourier inversion theorem"; T. Tao, 245C Notes 2) could not be reached from this
  environment (DNS failure); nothing from them is used.

## Exact quotations (arXiv v1)

**Convention** (Definition 1.1, §1):

> For f ∈ L1 (R), the Fourier transform fˆ of f is defined as fˆ(y) = ∫ f(x)e−ixy dx for all real y ∈ R.

(The displayed formula is typeset over several lines in the PDF; the quotation joins the extracted pieces.) This is
the project convention x̂(ω) = ∫x(t)e^{−iωt}dt (FB1–FB4, P17).

**Inversion** (Theorem 1.13, §1):

> Theorem 1.13 (Inversion Theorem). Let f ∈ L1 (R), and fˆ ∈ L1 (R), then f(x) = (1/2π) ∫ fˆ(y)eixy dy for almost all real x ∈ R.

(The integral sign and fraction are typeset in the original; the text above is the extracted line.) The proof uses the
Gauss–Weierstrass kernel, Fubini's theorem and dominated convergence.

**Uniqueness** (Theorem 1.15, §1):

> Theorem 1.15 (Uniqueness Theorem). If f ∈ L1 (R) and fˆ = 0 everywhere (fˆ is always continuous), then f = 0 a.e.

> We now investigate the question of uniqueness of Fourier transform, i.e, fˆ = ĝ implies f = g. To show this, since Fourier transform is a linear operator, it suffices to show that fˆ = 0 implies f = 0 a.e.

## How the project uses it

For x ∈ L¹(ℝ), put y = conj x. Then ŷ(ω) = conj x̂(−ω) (checked symbolically, P17Le). If x̂(−ω) = conj x̂(ω) for
every ω, then ŷ = x̂, so (x − y)^ = 0 everywhere, and Theorem 1.15 gives x = y almost everywhere: x is real almost
everywhere. With the forward direction (P17Fa), this gives the exact statement used in #17:

> for x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ x is real almost everywhere.

Independent of this source, the converse is also proved exactly (no theorem imported) for finite signals (DFT, every
N: P17Lc) and for finite Hermite expansions (P17Ld).

## What it does not establish

Anything about physical pairs (T-CONJUGACY), the mass/wave seed, or relativistic dispersion. The notes are a
secondary teaching text; the theorems quoted are standard.
