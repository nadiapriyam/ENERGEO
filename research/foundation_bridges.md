# Foundation bridges

Each row is a mathematical bridge: an exact connector between two objects, not a topic. Generated from `research/tools/foundation_source.py`. "Project-specific" bridges were constructed in this project; "established" bridges are textbook.

| ID | Left object | Right object | Exact mathematical connector | Status | Established or project-specific | Cards | What it does NOT prove | Foundation objects |
|---|---|---|---|---|---|---|---|---|
| BR1 | zero | orthogonality | ⟨u, v⟩ = 0 defines orthogonality; ⟨0, v⟩ = 0 for every v (two different readings) | ESTABLISHED | established | G0a, S1a | that every zero is an orthogonality, or reading C/D of "0 is orthogonal" | ON6, Z4 |
| BR2 | orthogonality | decomposition | x = Σ⟨x, e_k⟩e_k for an orthonormal basis; residual of a projection ⟂ retained part | ESTABLISHED | established | O2a, B2a, S13 | that decomposition needs orthogonality (frames decompose without it) | ON2, ON3 |
| BR3 | decomposition | squared norm | ‖x‖² = Σ\|a_k\|² exactly when cross terms vanish | ESTABLISHED | established | S1a, B4b, O1e | that ‖x‖² is physical energy | ON1, ON9 |
| BR4 | squared norm | Parseval | ‖f‖² = Σ\|f̂(k)\|² (unitary change of representation) | ESTABLISHED | established | S2b, O2b | anything about phase (Parseval sees magnitudes only) | R3 |
| BR5 | translation | phase | T_τ e_k = e^{−2πikτ}e_k | ESTABLISHED | established | S3 | that phase can be recovered from magnitudes (it cannot: P1b, P1c) | R4 |
| BR6 | translation | autocorrelation | D_x(τ) = 1 − ρ_x(τ) (normalized, unitary translation) | ESTABLISHED | established | B5b | that the defect function determines the signal (it determines the autocorrelation only) | T2, T3 |
| BR7 | autocorrelation | spectral magnitude | Wiener–Khinchin: \|x̂\|² = DFT of the circular autocorrelation | ESTABLISHED | established | P1a | that the spectrum determines the signal (P1b, P1c) | T3 |
| BR8 | symmetry defect | stabilizer | D_x(g) = 0 ⟺ U_g x = x ⟺ g ∈ G_x | ESTABLISHED | established | B5b, B5c | that a small nonzero defect means g is near the stabilizer in the group (it measures distance in signal space) | T2, Z8 |
| BR9 | small translation | spectral spread | D_x(τ) ≈ (τ²/2)∫ω² dμ_x | ESTABLISHED | established | — | that it is the uncertainty inequality (a different statement) | T4, T5 |
| BR10 | preserved form | geometry | AᵀMA = M ⟺ B_M preserved; zero relations of B_M preserved | ESTABLISHED | established | C1b | that every geometry is a bilinear form (CF3, the common-form candidate is a hypothesis) | CF1, CF2 |
| BR11 | continuous symmetry | generator | exp(sK) preserves M ⟺ KᵀM + MK = 0 | ESTABLISHED | established | S9, S9(2), S9(3) | that the generators of different geometries are physically the same | CF4 |
| BR12 | generator / symmetry | conservation | d/dt(zᵀMz) = 0 ⟺ KᵀM + MK = 0; dH/dt = ∇HᵀJ∇H = 0 | ESTABLISHED | established | S9b, C2a, C1a | Noether in general (no card, CF7) | CF5, CF6, CF7 |
| BR13 | bounded geometry | unbounded parameter | t ∈ ℝ ↦ e^{iωt} ∈ S¹; s ↦ tanh s ∈ (−1, 1) | ESTABLISHED | established | C8a, S5b, C8d | that every bounded geometry repeats (★ is a hypothesis) | R6, I1, L2 |
| BR14 | c | invariant geometry | ΛᵀηΛ = η with η = diag(1, −1/c²) | ESTABLISHED | established | C9a, S5c | the user hypothesis that the two roles are linked | L1 |
| BR15 | c | theory limit | c → ∞: η_c → diag(1, 0), boost → Galilean shear | ESTABLISHED | established | C9b, C9d, S5d | that spacetime and model manifolds are the same object | L3 |
| BR16 | prediction map | Fisher metric | g = JᵀJ/σ² for Gaussian noise | ESTABLISHED | established | — | that sloppiness equals spectral decay (C7 open) | R7, CF10 |
| BR17 | Fisher metric | identifiability | g v = 0 ⟺ v changes no prediction (to first order) | ESTABLISHED | established | — | that a statistical null is a quadratic null of an indefinite form (OB1 keeps them apart) | Z9 |
| BR18 | wavelet zero mean | cancellation | ∫ψ = 0: a wavelet sums to zero by design | ESTABLISHED | established | — | that scattering proves the zero hypothesis | W1 |
| BR19 | modulus | information retention | \|f ∗ ψ\| removes phase; averaging removes position; the next order recovers part of what averaging removed | ESTABLISHED | established | — | that this mechanism equals Fourier phase loss or dephasing | W2 |
| BR20 | projection | hidden source structure | v_i = P_n e_i; source recovered as v_i + w (\|w\|² = 1/n) when the class is known | ESTABLISHED | project-specific | G2n, G3b, G3n | recovery without knowing the class (G4c obstruction) | H1, H2, H3 |
| BR21 | zero | system-supplied symmetry | independent group acting covariantly on the zero-producing tuple; commuting hidden quadratic scalar on irreducible blocks (Schur) | DERIVED | project-specific | FS2b, FS2e, MB2c, Q2d | that hidden information is in general symmetry information (mass inverts the roles) | Z12, QZ2, QZ3 |
| BR22 | centering | weighted geometry | Σm(r − R_CM) = 0 ⟺ ⟨1, C_m x⟩_D = 0; C_m D-orthogonal | ESTABLISHED | project-specific | G5b, G5d | that WMC and T′ are one geometry beyond the operator family C_G | H4, CF9 |
| BR23 | equal-mass balance | simplex projection | R_CM = (1/n)1 at r_i = e_i, so r_i − R_CM = P_n e_i | ESTABLISHED | project-specific | G4m, G2i | a universal Pair A solution | H1, H4 |
| BR24 | S_n-invariant zero | regular simplex | zero sum + full permutation symmetry ⇒ Gram ∝ I − J/n (G3c) | ESTABLISHED | project-specific | G3c, FS1e | the converse (FS2d) | H1, QZ3 |
| BR25 | zero | kernel | Σ L x_i = 0 ⟺ Σx_i ∈ ker L | ESTABLISHED | established | G4a | that zero = kernel (inherited and nonlinear zeros, G4c, Z5a) | Z3 |
| BR26 | measurement | coherence loss | non-selective projective measurement: off-diagonal blocks → 0; zero-diagonal observables lose their expectation | ESTABLISHED | established | W2a, W3a, W3b | that it is the same physical mechanism as which-path (generic map only) | QZ4 |
| BR27 | relativistic invariant | wave dispersion | E² = p²c² + m²c⁴ with E = ħω, p = ħk | ESTABLISHED | established | S12 | that mass is waves (MW1 stays a hypothesis) | MW2, MW1 |
| BR28 | Fourier coefficient decay | Fisher eigenvalue decay | none found (open) | OPEN | project-specific | S14a, S14b, S7 | any shared geometry | M4 |
