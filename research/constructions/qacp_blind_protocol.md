# Blind-label protocol: Quantum Additive Cancellation Pair (pre-registered)

Written before `verify/verify_Q2.py` was run (2026-11-12). The card computes the descriptors from amplitudes only.
States are labelled X and Y; the S² values and the names "triplet" and "singlet" are not used until card Q2e.

**States.**
- X: amplitudes (0, 1/√2, 1/√2, 0) in the basis |↑↑⟩, |↑↓⟩, |↓↑⟩, |↓↓⟩.
- Y: amplitudes (0, 1/√2, −1/√2, 0) in the same basis.

**Contribution pair.** c₁ = S_z⁽¹⁾ψ and c₂ = S_z⁽²⁾ψ.

**Candidate descriptors, computed before any label is revealed:**

1. The Gram matrix of (c₁, c₂).
2. The Gram matrix of (ψ, c₁, c₂).
3. The norms and the relative sign of c₁ and c₂.
4. The sign ε defined by P c₁ = ε c₂, where P is the canonical exchange of the two tensor factors.

**Disclosure.** I (Claude) know quantum mechanics. In particular I know the identity S² = ħ²(1 + P) for two spin-½,
and I know which amplitudes belong to the triplet. The test is procedurally blind (the card does not read the labels).
It is not blind in knowledge, so no result of this test can be called a nontrivial predictive transfer.

**Pre-registered prediction rule.** The project geometry has no internal rule that assigns an S² value to a sign ε.
The only available rule is the textbook identity S² = ħ²(1 + P), which is secondary existing mathematics. Through it:
ε = +1 ⇒ S² = 2ħ², and ε = −1 ⇒ S² = 0.

**What the test can and cannot show.**
- It can show whether some descriptor *separates* X from Y.
- It cannot show a project-internal prediction of the S² values.
