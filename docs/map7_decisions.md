# Master Map #7: decisions (2026-10-24)

Two questions asked before #7 was built, with the options as offered and Nadia's choice. Quoted exactly; nothing here is paraphrased.

## 1. How should the waveform from #7 enter Orthogonality and Zero (#8)?

**Chosen: "Arrows are its coefficients (Recommended)"**

> #8's arrows become coefficient vectors of waveforms. Stage 1: u = your #7 signal's first-harmonic coefficient, v = a second wave's. By orthonormality u·v is exactly the inner product of the two waves, so perpendicular arrows are waves a quarter period apart. Stages 4–5 add harmonics as coordinates; 7–8 show the same waves as functions. The math stays as it is; stages 1–5 get new wording and a small waveform view.

```
#7  f = Σ aₖeₖ  (your signal)
        │ coefficients
        ▼
#8  stage 1   u = (a₁, b₁)  v = (a₁', b₁')
              u·v = ⟨f₁, g₁⟩   (exact, orthonormal basis)
              ⟂ arrows  ⇔  waves 90° out of phase
    stage 4–5 + harmonics as coordinates (ℝ³, ℝ⁴)
    stage 6   basis you can't see = the Fourier basis, perturbed
    stage 7–8 f, g as samples, then as functions
              (the arrows were the waves all along)
```

Not chosen: "Waves rejoin at stage 7". Under that option, #8 stages 1–6 would have stayed abstract arrows, and the #7 signal would have entered only at stages 7–8.

## 2. Which form of the Fourier basis should #7 use?

**Chosen: "Complex eᵏ, as in your evidence (Recommended)"**

> e_k(t) = e^{2πikt} on [0,1], f̂(k) = ⟨f, e_k⟩: exactly your C4b statement. Each coefficient is a complex number, drawn as an arrow (a phasor), which also makes the first hand-off option natural. Stages 7–8 of #8 switch to period 1 to match.

Not chosen: "Real cos kt and sin kt" (cos kt/√π and sin kt/√π on [0, 2π], with the complex form in Advanced only).

## How the build follows them

- The arrows are u = √2 f̂(1) of your signal, and v = √2 ĝ(1), where g is the same signal delayed by 0.14 of a period. The √2 makes u·v equal ⟨f₁, g₁⟩ exactly (card O2c, statement `coef.arrows`).
- Stages 4 and 5 append the real and imaginary parts of each wave's second-harmonic arrow.
- Stage 6 perturbs the basis b = (√2 cos 2πt, −√2 sin 2πt, √2 cos 4πt, −√2 sin 4πt).
- Stages 7 and 8 sample and integrate the same two waves over period 1: G = I on [0, 1], 2I on [0, 2] (card O2d).
- If the first harmonic was removed in #7, #8 uses the example signal's first harmonic, and its stage text says so.
