"""Master Map #17, first construction (2026-11-17): "Conjugacy and physical pairs — Search for hidden relationships".
Writes research/p17.json and renders research/constructions/p17_conjugacy_physical_pairs.md.
Decisions: docs/restructure_decisions.md, "Pre-#17 story patches and the first #17 construction". Cards: verify/verify_P17.py (34),
with the earlier FB4a–FB4c (real-signal conjugate symmetry) and FB8a–FB8c (the ω–k dispersion relation).
Discovery order kept: Fourier pair → exact mathematical conjugacy → what information does the pairing encode? → do physical pairings
ever share an exact relation of comparable structural depth? Only then do candidate physical examples enter.
No quantum field theory is used. Run: python3 research/tools/p17_source.py"""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
RD, MM = 'docs/restructure_decisions.md', 'docs/Interactive_Master_Map.extracted.md'
CARDS = ['P17Fa', 'P17Fb', 'P17Fc', 'P17Fd', 'P17Fe', 'P17Ff', 'P17Fg', 'P17Fh', 'P17Ra', 'P17Rb', 'P17Rc', 'P17Rd', 'P17Re', 'P17Rf',
         'P17Da', 'P17Db', 'P17Dc', 'P17Dd', 'P17De', 'P17Df', 'P17Dg', 'P17Dh', 'P17Di', 'P17Ea', 'P17Eb',
         'P17Ca', 'P17Cb', 'P17Cc', 'P17Cd', 'P17Ce', 'P17Cf', 'P17Cg', 'P17Ch', 'P17Mx']
EARLIER = ['FB4a', 'FB4b', 'FB4c', 'FB8a', 'FB8b', 'FB8c', 'FB7d', 'S12', 'S12b', 'A8Fa', 'A8Wb', 'O2a']
STATUSES = ['ESTABLISHED', 'DERIVED', 'RESTRICTED', 'PROJECT SYNTHESIS', 'FAIL', 'OPEN']

# Sentences reused verbatim by registry records (research/theories.json)
W_REALFIELD = 'For a real classical field the space-time spectrum satisfies φ̃(−ω, −k) = conj φ̃(ω, k): the reality condition pairs the mode at P = (ω/c, k) with the mode at −P, which lies on the same level set of q and on the other branch.'
W_MASSLEVEL = 'In the spectral variables P = (ω/c, k) the dispersion relation is the level set q(P) = (mc/ħ)² of the Lorentzian form q = (ω/c)² − k²: m = 0 selects the null level, m > 0 a non-null level whose branches are single boost orbits, with mc/ħ the orbit invariant.'
W_KINDS = 'Seven kinds of pairing are kept apart: conjugacy, sign symmetry, orbit symmetry, reality constraint, independent physical states, notation-dependent pairing, and Fourier duality.'
W_RESTCLOCK = 'Along the group worldline of any mode on the mass shell the phase advances at mc²/ħ per unit proper time, so the rest frequency mc²/ħ and proper time τ are a Fourier-dual pair; this is duality, not complex conjugacy.'

# ── A. The historical #17 question ───────────────────────────────────────────────────────────────────
HISTORY = dict(
 node='17. Conjugacy and physical pairs — Search for hidden relationships', predecessor='12. Fourier pairs — Change the representation, not the underlying information',
 question='Do observable physical pairings or complementarities reflect deeper symmetry analogous to mathematical conjugacy? (T-CONJUGACY, RD R12)',
 scene=['Begin with a complex Fourier coefficient and its conjugate.', 'Then show how pairs of conjugate-frequency coefficients help produce a real-valued signal.',
        'Once the mathematical relationship is established, introduce your broader question about physical pairs and whether observable relationships reflect deeper symmetry in nature.',
        'The interface could let the visitor compare several kinds of pairing—mathematical conjugacy, reflection, and physical complementarity—and investigate which share formal properties.'],
 path='Fourier pair → exact mathematical conjugacy → what information does the pairing encode? → do physical pairings ever share an exact relation of comparable structural depth?',
 notAssumed='The answer is not assumed to be yes. The branch is not defined as "mass-wave": mass/wave is one candidate investigation within it, entered only after the question is explicit.',
 seed='mass is waves too, it\'s just a different form. (T-MASS-WAVE-SEED; recorded as the historical seed for one candidate route, not promoted)')

# ── B. Fourier conjugacy: the source relation ────────────────────────────────────────────────────────
SOURCE = [
 dict(item='continuous', statement='x̂(ω) = ∫x(t)e^{−iωt}dt. For x = u + iv: x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω). So x̂(−ω) = conj x̂(ω) for every ω ⟺ v = 0 (Fourier uniqueness). Realness is exactly the property that forces the conjugacy', cards=['P17Fa', 'FB4a']),
 dict(item='the operation behind it', statement='C: x ↦ conj x and C̃: X(ω) ↦ conj X(−ω) are antilinear involutions with F∘C = C̃∘F; real signals = Fix(C), Hermitian-symmetric spectra = Fix(C̃)', cards=['P17Fb']),
 dict(item='four properties separated', statement='conjugate pair ⟺ equal magnitude AND opposite phase (where X ≠ 0); equal magnitude alone ((1+i)e^{−t²/2}) and opposite phase alone (e^{−(ω−1)²/2}e^{iω}) do not give a conjugate pair', cards=['P17Fc']),
 dict(item='DFT (finite index)', statement='X_k = Σx_n e^{−2πikn/N}; for real x: X_{(−k) mod N} = conj X_k; pairs k ↔ N − k', cards=['P17Fd', 'FB4b']),
 dict(item='DC and Nyquist exceptions', statement='self-paired indices: k = 0 always, k = N/2 iff N even; there X_k is real (phase 0 or π) and the "pair" degenerates to a reality condition on one coefficient; continuous: ω = 0 only', cards=['P17Fd', 'P17Ff']),
 dict(item='redundant degrees of freedom', statement='x ↦ (X₀, …, X_⌊N/2⌋) is invertible over ℝ (N real numbers either way); the conjugate half carries no independent information', cards=['P17Fe']),
 dict(item='what the pairing encodes', statement='each pair (X_k, X_{N−k}) is one real oscillation (2/N)|X_k|cos(2πkn/N + arg X_k): one amplitude, one phase; the imaginary parts of the pair cancel identically (a cancellation zero)', cards=['P17Fh']),
 dict(item='failure case (P17-X1)', statement='for a generic complex-valued signal the symmetry need not hold: x = (1, i, 0, 0) gives X = (1 + i, 2, 1 − i, 0); e^{−t²/2}e^{it} (FB4c)', cards=['P17Fg', 'FB4c']),
 dict(item='representation-theoretic origin', statement='for a unitary character χ of an abelian group conj χ = χ⁻¹, so a real function has f̂(χ⁻¹) = conj f̂(χ): ℝ (ω ↦ −ω), ℤ_N (k ↦ N − k), ℝ² with η (P ↦ −P) — one structure', cards=['P17Cg']),
]
FORCED_BY = 'x = conj x (realness), and nothing weaker: the defect of the symmetry, x̂(−ω) − conj x̂(ω), is exactly 2i·v̂(−ω), where v = Im x, and v̂ ≡ 0 only for v = 0 (P17Fa).'

# ── C. What "same structure" would have to mean ──────────────────────────────────────────────────────
CRITERIA = [('TC1', 'a transformation relating the pair'), ('TC2', 'an involution or symmetry operation'), ('TC3', 'a preserved relation'),
            ('TC4', 'a reconstruction or reality constraint'), ('TC5', 'paired coordinates carrying non-independent information'),
            ('TC6', 'a common quadratic/bilinear relation'), ('TC7', 'a group/representation-theoretic origin')]
LEVELS = [('L0', 'visual analogy', 'a shared word or picture only (both "waves", both "pairs", both ±, both contain c)'),
          ('L1', 'shared equation', 'the same equation or quadratic form holds on both sides'),
          ('L2', 'shared transformation structure', 'the same transformation or involution acts on both sides and preserves the stated relation'),
          ('L3', 'shared representation-theoretic structure', 'both sides arise from the same group and the same representation-theoretic fact')]
LEVEL_RULE = 'Not every candidate must meet every criterion. A level is awarded only on cards; words, ± signs and the letter c are never evidence.'

Y, N, Pt = 'yes', 'no', 'partial'
CANDIDATES = [
 dict(id='PC-0', name='Fourier coefficient pair (the source)', object='a real signal x', representation='x̂ (or the DFT X)', relation='x̂(−ω) = conj x̂(ω)', transformation='ω ↦ −ω with complex conjugation (C̃)',
      invariant='|x̂(ω)|² = |x̂(−ω)|²; realness', null='self-paired ω = 0 (zero index; X₀ real)', kind='conjugacy / reality constraint',
      criteria=dict(TC1=Y, TC2=Y, TC3=Y, TC4=Y, TC5=Y, TC6=Pt, TC7=Y), level='L3 (the source)', shared='—', notShared='—', cards=['P17Fa', 'P17Fb', 'P17Fd', 'P17Fh', 'P17Cg']),
 dict(id='PC-1', name='real classical field: mode at P and mode at −P', object='a real solution φ(t, x) of the Klein–Gordon-form PDE', representation='space-time spectrum φ̃(ω, k) (mode amplitudes a, b)', relation='φ̃(−ω, −k) = conj φ̃(ω, k); b(k) = conj a(−k)', transformation='P ↦ −P with complex conjugation',
      invariant='q(P) (both modes on the same level set)', null='—', kind='conjugacy / reality constraint',
      criteria=dict(TC1=Y, TC2=Y, TC3=Y, TC4=Y, TC5=Y, TC6=Y, TC7=Y), level='L3 — because it is the same theorem (characters of ℝ²): TRIVIAL CONSEQUENCE, not a new physical relation',
      shared='the whole source structure: antilinear involution, reality constraint, redundancy, conj χ = χ⁻¹', notShared='the two partners are not two physical entities (P17-X4); the pairing says nothing the reality of φ did not already say', cards=['P17Rb', 'P17Rc', 'P17Rd', 'P17Re', 'P17Cg', 'P17Cd']),
 dict(id='PC-2', name='upper and lower mass-shell branches', object='points of the level set q(P) = μ²', representation='(ω/c, k)', relation='q(−P) = q(P); S_t and −I exchange the branches', transformation='−I (det +1, not in SO⁺(1,1)) or S_t = diag(−1, 1)',
      invariant='q', null='none for μ > 0 (P17-X3)', kind='sign symmetry (as points); with amplitudes it is the reality pairing PC-1',
      criteria=dict(TC1=Y, TC2=Y, TC3=Y, TC4=N, TC5=N, TC6=Y, TC7=Pt), level='L2', shared='an involution preserving the quadratic relation', notShared='no reality constraint or redundancy without amplitudes; a physical reading of the lower branch belongs to a specific field theory (future branch, not used)', cards=['P17Ca', 'P17Rc']),
 dict(id='PC-3', name='right- and left-movers: (ω, k) and (ω, −k)', object='modes of one real field', representation='(ω/c, k)', relation='both on the same level set (the relation is even in k)', transformation='S_x = diag(1, −1)',
      invariant='q', null='—', kind='sign symmetry; independent physical states',
      criteria=dict(TC1=Y, TC2=Y, TC3=Y, TC4=N, TC5=N, TC6=Y, TC7=Pt), level='L2 (not conjugacy)', shared='an involution preserving q', notShared='amplitudes independent: cos(kx − ωt) has a(k) = 1/2, a(−k) = 0 (P17-X2)', cards=['P17Cb', 'P17Rd', 'P17Ca']),
 dict(id='PC-4', name='massless and massive levels', object='the level sets q = 0 and q = μ²', representation='(ω/c, k)', relation='one form, two levels', transformation='none inside O(1,1) maps one level to another (boosts and reflections preserve q)',
      invariant='q', null='q = 0 is null (contains P ≠ 0 and the zero index P = 0); q = μ² has no null point', kind='same equation, different levels',
      criteria=dict(TC1=N, TC2=N, TC3=Y, TC4=N, TC5=N, TC6=Y, TC7=Pt), level='L1 (MW-B)', shared='the quadratic form q', notShared='no transformation or involution relating them; different orbit types (four half-line orbits vs two branches)', cards=['P17Dc', 'P17De', 'P17Dh', 'P17Cc']),
 dict(id='PC-5', name='mass and wave variables as a conjugate pair (MW-C)', object='m and (ω, k)', representation='μ = mc/ħ = √q(P) on the support', relation='m² = ħ²q(P)/c²', transformation='none: conjugation and boosts fix m',
      invariant='m itself (the orbit label)', null='m = 0 ⟺ null level', kind='not a pairing: m labels the level; (ω, k) is a point on it',
      criteria=dict(TC1=N, TC2=N, TC3=Y, TC4=N, TC5=Pt, TC6=Y, TC7=Pt), level='L1 only; FAIL as conjugacy', shared='the quadratic relation m² ∝ q(P)', notShared='complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch)', cards=['P17Ch', 'P17Di']),
 dict(id='PC-6', name='rest frequency mc²/ħ and proper time τ', object='one mode on the mass shell, along its group worldline', representation='the phase e^{−i(mc²/ħ)τ}', relation='phase advance mc²/ħ per unit proper time, for every k', transformation='proper-time translation τ ↦ τ + s (a character, as in #18)',
      invariant='mc²/ħ (Lorentz invariant)', null='m = 0: the phase is constant along the light ray', kind='Fourier duality (a different meaning of "conjugate")',
      criteria=dict(TC1=Y, TC2=N, TC3=Y, TC4=N, TC5=N, TC6=Y, TC7=Y), level='L3 of a different kind: Fourier duality, not complex conjugacy; known (de Broglie)', shared='the character structure of #18 (χ of an unbounded parameter in a bounded phase)', notShared='no antilinear involution; restricted to the group worldline', cards=['P17Dg', 'P17Ch', 'A8Fa']),
 dict(id='PC-7', name='massive particle dispersion and a string on an elastic foundation', object='two physical systems', representation='(ω, k)', relation='the same ω² = c²k² + μ²c²', transformation='—',
      invariant='q', null='—', kind='shared equation',
      criteria=dict(TC1=N, TC2=N, TC3=Y, TC4=N, TC5=N, TC6=Y, TC7=N), level='L1', shared='the dispersion relation, its levels and its gap', notShared='the physics: a stiffness is not a mass; no particle in the string (boundary for MW-D)', cards=['P17Mx']),
 dict(id='PC-8', name='"positive" and "negative" frequency as labels', object='the two halves of a real spectrum', representation='complex exponentials with a chosen sign convention', relation='labels swap with the kernel sign; absent in the real (cos/sin) and one-sided representations', transformation='change of representation',
      invariant='the real signal', null='—', kind='notation-dependent pairing',
      criteria=dict(TC1=Pt, TC2=N, TC3=N, TC4=N, TC5=Y, TC6=N, TC7=N), level='L0 as a physical pair (P17-X5)', shared='—', notShared='disappears under a different representation with no information lost', cards=['P17Ce', 'P17Db']),
]

# ── D–F. Dispersion, null and level-set mathematics ──────────────────────────────────────────────────
DISPERSION = [
 dict(statement='The PDE φ_tt − c²φ_xx + μ²c²φ = 0 (a parameter μ, units 1/length) has plane waves e^{i(kx − ωt)} exactly when ω² = c²k² + μ²c²; its symbol in the project convention is c²k² + μ²c² − ω² = −c²(q(P) − μ²), P = (ω/c, k)', cards=['P17Ra', 'P17Db'], status='ESTABLISHED'),
 dict(statement='Dimensions: [ω/c] = [k] = [mc/ħ] = L⁻¹, [mc²/ħ] = T⁻¹; ω, k angular (hν = ħω, p = h/λ = ħk)', cards=['P17Da'], status='ESTABLISHED'),
 dict(statement='With μ = mc/ħ: ω² = c²k² + m²c⁴/ħ² ⟺ (ω/c)² − k² = (mc/ħ)²', cards=['FB8a', 'FB8b', 'P17Ea'], status='ESTABLISHED (μ = mc/ħ is an identification)'),
 dict(statement='Convention: the physics positive-frequency wave e^{−iω₀t} sits at −ω₀ in x̂(ω) = ∫x e^{−iωt}dt; "positive frequency" is a convention-dependent label', cards=['P17Db', 'P17Ce'], status='ESTABLISHED'),
 dict(statement='(ω/c, k) is a pair of coordinates in a plane carrying the Lorentzian quadratic form q = η(P, P); boosts act on it as on (ct, x) because the phase η(P, X) is invariant. It is a relation in frequency-wavevector / energy-momentum variables, not physical spacetime', cards=['P17Dd', 'P17Dh', 'P17De'], status='ESTABLISHED'),
]
NULLS = [
 dict(object='spacetime null vector', where='event plane X = (ct, x)', relation='η(X, X) = 0, X ≠ 0 (x = ±ct)', zeroKind='null / balance / cancellation', cards=['S12b', 'P17Dd']),
 dict(object='spectral (energy–momentum) null relation', where='spectral plane P = (ω/c, k)', relation='q(P) = 0, P ≠ 0 (ω = ±ck, m = 0); ηP ≠ 0, so not a kernel vector', zeroKind='null / balance / cancellation', cards=['P17Dc', 'P17Dd', 'FB8b']),
 dict(object='Fourier zero coefficient', where='coefficients of a signal', relation='f̂(k) = ⟨f, e_k⟩ = 0 while f ≠ 0', zeroKind='zero relation', cards=['O2a']),
 dict(object='model-manifold null direction', where='parameter space', relation='Jv = 0 ⟺ g(θ)v = 0 (a kernel vector of a semidefinite metric)', zeroKind='null / balance / cancellation (semidefinite: kernel)', cards=['FB7d']),
 dict(object='zero index on the massless cone', where='spectral plane', relation='P = 0: the constant mode (ω = 0, k = 0) — on the cone for m = 0, not on the shell for m > 0', zeroKind='zero index / frequency', cards=['P17Dc', 'P17Cc']),
]
NULL_LINK = 'The spectral null P and the spacetime null ray are related only through η: the wave e^{−iη(P, X)} with P null has constant phase along the null ray parallel to P (P17Dd). They are not one kind of zero, and they are not the same object.'
MASSIVE = [
 dict(statement='m > 0: q(P) = μ² is a hyperbola (1 + 1) with branches ω/c = ±√(k² + μ²); in 1 + 3 a two-sheeted hyperboloid', cards=['P17De', 'P17Df'], status='ESTABLISHED'),
 dict(statement='each branch is one SO⁺(1,1) orbit: the boost with tanh φ = ck/ω (= v_g/c) carries any point to the rest point (μ, 0); boosts never change the branch', cards=['P17De'], status='DERIVED'),
 dict(statement='the branches are asymptotic to the null cone (ω − c|k| = μ²c²/(ω + c|k|) → 0) and tend to it as μ → 0 at fixed k', cards=['P17De'], status='DERIVED'),
 dict(statement='frequency gap: no real k for |ω| < μc (evanescent waves); min ω = μc = mc²/ħ at k = 0', cards=['P17Df', 'P17Dg'], status='DERIVED'),
 dict(statement='proper-time phase rate mc²/ħ along the group worldline, for every k; constant phase along the light ray when m = 0', cards=['P17Dg'], status='DERIVED (known: de Broglie)'),
 dict(statement='mass as the orbit invariant: μ = mc/ħ labels the boost orbit as r labels the rotation orbit (#14 chart: Kᵀη + ηK = 0, JᵀI + IJ = 0); μ is not a form parameter like c', cards=['P17Di', 'A8Wb'], status='DERIVED; its reading as a #14 ⇢ #17 connection is PROJECT SYNTHESIS'),
]
MASS_ANSWER = 'Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly: m ↦ the level (mc/ħ)² of q = (ω/c)² − k²; m = 0 is the null level (P17Db, P17Dc, P17De). What m changes geometrically: the level and the orbit type (two branches instead of four null half-lines), a frequency gap, the existence of a rest frame, and a Lorentz-invariant proper-time frequency (P17Dg). This does not say that mass is a wave.'

# ── G. Positive / negative frequency ─────────────────────────────────────────────────────────────────
POSNEG = dict(
 math='Mathematical Fourier redundancy: the same theorem in two variables. A real field has φ̃(−ω, −k) = conj φ̃(ω, k), i.e. b(k) = conj a(−k) (P17Rb, P17Rc). The partner of (ω, k) is (−ω, −k), not (−ω, k) (P17Rd).',
 condition='It follows from the field being real, and only then: the equation admits complex solutions (P17Re); the reality pairing is available because the operator commutes with conjugation (P17Ra); for iψ_t + αψ_xx = 0 it is not (P17Rf, a PDE contrast only).',
 physical='Physical mode interpretation (classical): a real field\'s negative-frequency part is fixed by its positive-frequency part; together they make one set of real oscillations. Which half is called positive depends on the sign convention (P17Db, P17Ce).',
 quantum='Quantum particle/antiparticle interpretation: NOT USED. It needs a specific field theory and is recorded as a future branch.',
 answer=W_REALFIELD)

# ── H. Comparison with true Fourier conjugacy: kinds of pairing ──────────────────────────────────────
KINDS = [
 dict(kind='conjugacy', meaning='an antilinear involution relating X(ω) and X(−ω) (C̃), defined on any spectrum', examples='C̃ on x̂; P ↦ −P with conjugation on φ̃', cards=['P17Fb', 'P17Rc']),
 dict(kind='reality constraint', meaning='the condition that an object be fixed by that involution (x = conj x ⟺ X = C̃X)', examples='real signals; real fields: b(k) = conj a(−k)', cards=['P17Fa', 'P17Rb']),
 dict(kind='sign symmetry', meaning='a reflection that preserves a relation, imposing nothing on amplitudes', examples='k ↦ −k and ω ↦ −ω on the dispersion relation (P17-X2)', cards=['P17Ca', 'P17Cb']),
 dict(kind='orbit symmetry', meaning='a group element moving points within one level set', examples='boosts along a mass-shell branch; Doppler scaling on the cone', cards=['P17De', 'P17Dh']),
 dict(kind='independent physical states', meaning='two modes related by a symmetry whose amplitudes are independent', examples='right- and left-movers (ω, ±k)', cards=['P17Rd', 'P17Cb']),
 dict(kind='notation-dependent pairing', meaning='a pairing that exists in one representation only', examples='"positive / negative frequency" labels; the (ω, −ω) pair of a real signal, absent in the one-sided and cos/sin representations (P17-X5)', cards=['P17Ce', 'P17Db']),
 dict(kind='Fourier duality', meaning='a bilinear pairing between a variable and its Fourier variable (a different meaning of "conjugate"); the uncertainty inequality belongs here (T5)', examples='(t, ω), (x, k); mc²/ħ and proper time τ', cards=['P17Cf', 'P17Dg']),
]
COMPARISON = [
 ('(k, −k) or (ω, −ω) alone', 'sign symmetry of the relation; not conjugacy (P17Cb, P17Rd)'),
 ('(ω, k) and (−ω, −k) with conjugate amplitudes', 'conjugacy / reality constraint — the same theorem as #12 (P17Rc, P17Cg)'),
 ('the mass shell', 'a different sort of pairing: a level set with two branches exchanged by −I (sign symmetry as points); mass labels the level, it is not paired with (ω, k) (P17Ca, P17Ch)'),
 ('Lorentz boosts', 'orbit symmetry: they relate points on the same branch of the same level set (P17De); null rays are only rescaled (P17Dh)'),
 ('real-field condition', 'produces a meaningful conjugate pairing of positive- and negative-frequency modes, of the (ω, k) ↔ (−ω, −k) kind, as a reality constraint, not as two physical entities (P17Rb, P17Cd)'),
]

# ── I. The mass/wave seed: exact readings ────────────────────────────────────────────────────────────
MW = [
 dict(id='MW-A', name='de Broglie relation', words='Massive particles admit wave variables through:', reading='E = ħω, p = ħk', status='RESTRICTED',
      basis='established physics as identifications (inputs). Derived under them: v_g = pc²/E = v (group velocity = particle velocity) and ω₀ = mc²/ħ (P17Eb); the level-set geometry is ħ-scaled (P17Ea). Not classical identities; no physical data carded here', cards=['P17Ea', 'P17Eb', 'FB8a']),
 dict(id='MW-B', name='common quadratic geometry', words='Massless and massive cases occupy different level sets of the same Lorentzian quadratic form in energy-momentum / spectral variables.', reading='q(P) = 0 vs q(P) = (mc/ħ)²', status='ESTABLISHED',
      basis='exact (P17Dc, P17De, P17Di, FB8b); spectral variables, not spacetime; mass is the orbit invariant (r-role, not c-role)', cards=['P17Dc', 'P17De', 'P17Di', 'FB8b']),
 dict(id='MW-C', name='conjugate pairing', words='Mass and wave variables form a conjugate pair in the same mathematical sense as Fourier conjugates.', reading='complex conjugacy between m and (ω, k)', status='FAIL',
      basis='complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch). Restricted different reading: mc²/ħ and proper time τ are Fourier-dual along the group worldline (P17Dg) — RESTRICTED, known (de Broglie), and not the same sense as Fourier coefficient conjugacy', cards=['P17Ch', 'P17Dg']),
 dict(id='MW-D', name='representation statement', words='Particle-like and wave-like descriptions may be different representations/aspects of the same physical state.', reading='a physics interpretation', status='OPEN',
      basis='requires exact theory-specific wording; not established by the dispersion relation, which a string on an elastic foundation also satisfies (P17Mx)', cards=['P17Mx']),
]
SEED_NOTE = 'The seed "mass is waves too, it\'s just a different form." is kept verbatim and not promoted (T-MASS-WAVE-SEED stays a HYPOTHESIS). What it yields in this pass: three precise questions (MW-A, MW-B, MW-C) with exact answers and one interpretive statement (MW-D) left OPEN. Not reinterpreted as QFT.'

# ── J. Counterexamples ───────────────────────────────────────────────────────────────────────────────
COUNTER = [
 dict(id='P17-X1', words='A complex signal without conjugate symmetry.', example='x = (1, i, 0, 0): X₃ = 0 ≠ conj X₁ = 2; e^{−t²/2}e^{it} (FB4c)', breaks='conjugacy without realness', cards=['P17Fg', 'FB4c']),
 dict(id='P17-X2', words='A sign-paired relation that is not complex conjugacy.', example='k ↦ −k on ω² = c²k² + μ²c²: both modes allowed, amplitudes unrelated (e^{i(kx − ωt)} alone; cos(kx − ωt) with a(−k) = 0)', breaks='"± in the relation ⇒ conjugate pair"', cards=['P17Cb']),
 dict(id='P17-X3', words='A massive dispersion relation that has no null state.', example='μ > 0: q(P) = μ² has no null point and does not contain P = 0', breaks='"every dispersion level has a null state"', cards=['P17Cc']),
 dict(id='P17-X4', words='Two mathematically paired variables that do not correspond to two independent physical entities.', example='X_k and X_{N−k} of a real signal; a(k) and b(−k) = conj a(k) of a real field: 8 real amplitudes, 4 independent', breaks='"two paired variables ⇒ two physical things"', cards=['P17Cd', 'P17Fe']),
 dict(id='P17-X5', words='An apparent “physical pair” whose pairing disappears under a different representation.', example='the one-sided (analytic-signal) spectrum and the cos/sin basis carry no (ω, −ω) pair and lose nothing; the sign convention swaps the labels', breaks='"a pair in one representation is a physical pair"', cards=['P17Ce']),
]
SUPPORTING_COUNTER = [
 dict(id='P17Rf', example='iψ_t + αψ_xx = 0 (a PDE contrast only): one dispersion branch, conj ψ is not a solution, no reality pairing', cards=['P17Rf']),
 dict(id='P17Mx', example='a string on an elastic foundation satisfies the massive dispersion relation with no particle', cards=['P17Mx']),
]

# ── K. Status table (separate statuses; no umbrella) ─────────────────────────────────────────────────
STATUS_TABLE = [
 dict(item='Fourier conjugacy (real signal; continuous and DFT)', status='ESTABLISHED', basis='realness ⟺ Hermitian symmetry; DC/Nyquist self-paired; complex signals fail', cards=['P17Fa', 'P17Fb', 'P17Fc', 'P17Fd', 'P17Fe', 'P17Ff', 'P17Fg', 'P17Fh', 'FB4a', 'FB4b', 'FB4c']),
 dict(item='real-field positive / negative mode relation', status='DERIVED', basis='the established theorem in two variables: φ̃(−ω, −k) = conj φ̃(ω, k), b(k) = conj a(−k); a condition (realness), not a consequence of the equation', cards=['P17Ra', 'P17Rb', 'P17Rc', 'P17Rd', 'P17Re', 'P17Cg']),
 dict(item='massless null-cone relation (spectral variables)', status='ESTABLISHED', basis='q(P) = 0 ⟺ ω = ±ck; not a kernel vector; distinct from the spacetime null ray, the Fourier zero and the model-manifold null', cards=['FB8b', 'P17Dc', 'P17Dd', 'P17Dh']),
 dict(item='massive mass-shell level set', status='DERIVED', basis='hyperbola branches = boost orbits; gap; rest frame; proper-time phase rate; mass = orbit invariant', cards=['P17De', 'P17Df', 'P17Dg', 'P17Di']),
 dict(item='E = ħω, p = ħk', status='RESTRICTED', basis='physical identifications (Planck–Einstein, de Broglie), established in their physical context; inputs here, not classical identities; the algebra they induce is exact', cards=['FB8a', 'P17Ea', 'P17Eb']),
 dict(item='MW-A (de Broglie relation)', status='RESTRICTED', basis='holds under the identifications; v_g = v and ω₀ = mc²/ħ derived', cards=['P17Ea', 'P17Eb']),
 dict(item='MW-B (common quadratic geometry)', status='ESTABLISHED', basis='one Lorentzian form, levels 0 and (mc/ħ)²', cards=['P17Dc', 'P17De', 'P17Di', 'FB8b']),
 dict(item='MW-C (conjugate pairing)', status='FAIL', basis='as complex conjugacy; the Fourier-duality reading mc²/ħ ↔ τ is a separate RESTRICTED result', cards=['P17Ch', 'P17Dg']),
 dict(item='MW-C′ (rest frequency and proper time, Fourier duality)', status='RESTRICTED', basis='exact along the group worldline; known (de Broglie); a different meaning of "conjugate"', cards=['P17Dg', 'P17Ch']),
 dict(item='MW-D (representation statement)', status='OPEN', basis='theory-specific; the dispersion relation alone does not decide it (P17Mx)', cards=['P17Mx']),
 dict(item='kinds of pairing (seven kept apart)', status='PROJECT SYNTHESIS', basis='classification of carded examples; not an exhaustive classification', cards=['P17Ca', 'P17Cb', 'P17Ce', 'P17Cf', 'P17Rd']),
 dict(item='the broader #17 physical-pair hypothesis (T-CONJUGACY)', status='OPEN', basis='the one exact conjugate pairing found in a physical candidate is the reality constraint (the same theorem); no physical pairing of independent entities was found to be a conjugate pair; "physical complementarity" in the Fourier-duality sense is not yet tested beyond mc²/ħ ↔ τ', cards=['P17Rc', 'P17Cd', 'P17Ch']),
]

# ── L. Canonical-story placement and story contribution ──────────────────────────────────────────────
PLACEMENT_EDGES = [
 ('M12', 'M17', 'EARLIER PREDECESSOR', 'historical (existing): #17 "Begin[s] with a complex Fourier coefficient and its conjugate" (MM)'),
 ('M14', 'M17', 'CROSS-REFERENCE', 'later mathematical connection: the mass shell is a level set of the Lorentzian form; mass is the orbit invariant (P17Di), as r is for circles'),
 ('M19', 'M17', 'CROSS-REFERENCE', 'later mathematical connection: boosts act on (ω/c, k) as on (ct, x); Doppler on the null cone; tanh φ = ck/ω brings a massive mode to rest (P17De, P17Dh)'),
 ('M18', 'M17', 'CROSS-REFERENCE', 'later mathematical connection: the proper-time phase e^{−i(mc²/ħ)τ} is a character of an unbounded parameter in the bounded circle, as in #18 (P17Dg, A8Fa)'),
 ('M13', 'M17', 'CROSS-REFERENCE', 'later mathematical connection: spectral null, spacetime null, Fourier zero coefficient and model-manifold null kept apart; the zero index P = 0 lies on the massless cone only (P17Dd, P17Cc)'),
]
STORY = [
 dict(result='Fourier conjugacy, source-locked', answers='#12 → #17: "Begin with a complex Fourier coefficient and its conjugate." (MM); what property forces the pairing?', relation='x real ⟺ x̂(−ω) = conj x̂(ω) (the fixed points of an antilinear involution)', next='what information does the pairing encode?'),
 dict(result='what the pairing encodes', answers='what information does the pairing encode? (2026-11-17 decisions)', relation='one real oscillation per pair: amplitude and phase; the imaginary parts cancel; the conjugate half is redundant', next='do physical pairings ever share an exact relation of comparable structural depth?'),
 dict(result='real classical field pairing', answers='do physical pairings ever share an exact relation of comparable structural depth? — first physical candidate', relation='yes for a real field, and only as the same theorem: φ̃(−ω, −k) = conj φ̃(ω, k); the partners are one real oscillation, not two entities', next='which physical pairings are not this reality constraint? (sign symmetry, orbit symmetry, independent states)'),
 dict(result='kinds of pairing', answers='"compare several kinds of pairing—mathematical conjugacy, reflection, and physical complementarity—and investigate which share formal properties" (MM #17)', relation='seven kinds kept apart, with the criteria TC1–TC7 and levels L0–L3', next='in which sense of "conjugate" is "physical complementarity" meant: complex conjugacy or Fourier duality?'),
 dict(result='massless null relation', answers='in what sense is ω² = c²k² null? (2026-11-17 decisions)', relation='the null level of q in spectral variables; four nulls kept apart (#13 ⇢ #17)', next='what does m change?'),
 dict(result='massive level set', answers='Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? (2026-11-17 decisions)', relation='yes: m labels the level and the orbit (r-role); gap; rest frame; invariant proper-time frequency (#14 ⇢ #17, #19 ⇢ #17)', next='is mass paired with wave variables (MW-C)?'),
 dict(result='MW-C tested', answers='Mass and wave variables form a conjugate pair in the same mathematical sense as Fourier conjugates. (MW-C)', relation='FAIL as complex conjugacy; mc²/ħ and proper time are Fourier-dual (a different sense; #18 ⇢ #17)', next='MW-D needs a specific theory and exact wording (OPEN; future branch)'),
]
NEXT_QUESTIONS = [
 'Q17-1: Does any physical pairing of independent entities carry an exact relation beyond the reality constraint (not reducible to conj χ = χ⁻¹)?',
 'Q17-2: In which sense of "conjugate" is the Master Map\'s "physical complementarity" meant — complex conjugacy (i) or Fourier duality (ii)?',
 'Q17-3: MW-D in a specific theory, with exact theory-specific wording (future branch).',
]
FUTURE = ['a physical reading of the lower mass-shell branch / negative frequencies in a specific field theory (particle/antiparticle)', 'the orbit classification of momentum space as the first step of Wigner\'s 1939 representation theory',
          'position–momentum duality through p = ħk (quantum)', 'creation/annihilation operators, CPT, Dirac sea, virtual particles — none used, none needed by any relation above']

# ── M. What the branch does NOT establish ───────────────────────────────────────────────────────────
NOT_ESTABLISHED = ['that observable physical pairs are mathematically conjugate in general (T-CONJUGACY stays OPEN)', 'that mass is a wave (T-MASS-WAVE-SEED stays a HYPOTHESIS; MW-D OPEN)',
                   'that mass and wave variables are a conjugate pair (MW-C FAIL)', 'that (ω/c, k) is physical spacetime, or that the spectral null cone is the light cone',
                   'any particle/antiparticle, QFT, CPT, creation/annihilation, Dirac-sea or virtual-particle statement', 'a physical meaning of the lower branch',
                   'that E = ħω and p = ħk are classical identities', 'that the elastic-foundation string and a massive particle are the same physics',
                   'any physical validation (no physical data are carded)', 'anything about Energeo / finite energy (#20)']

# ── N. Ratings (secondary metadata) ──────────────────────────────────────────────────────────────────
RATINGS = [
 dict(item='Fourier conjugacy source lock (P17F)', bs=15, slop=5, td='not a transfer', breadth=2, why='textbook; locked as the source relation with its exact forcing property and exceptions'),
 dict(item='real-field reality pairing (P17R)', bs=20, slop=10, td='TRIVIAL CONSEQUENCE', breadth=2, why='the same theorem in two variables; exact, but adds no physical relation beyond realness'),
 dict(item='massless spectral null (P17N)', bs=20, slop=10, td='TRIVIAL CONSEQUENCE', breadth=2, why='the Z5 null of the η-form in spectral variables; kept apart from three other nulls'),
 dict(item='mass shell: level, orbit invariant, gap, proper-time rate (P17M)', bs=30, slop=15, td='STRUCTURAL TRANSFER', breadth=2, why='the #14 chart (preserved form → generator → orbit) applies unchanged in spectral variables and gives the exact role of m (orbit invariant), not c'),
 dict(item='E = ħω, p = ħk scaling (P17E)', bs=15, slop=10, td='TRIVIAL CONSEQUENCE', breadth=1, why='a linear scaling by ħ; the content is the physical identification, an input'),
 dict(item='kinds of pairing (P17K)', bs=30, slop=15, td='not a transfer', breadth=3, why='separates conjugacy from sign symmetry, orbit symmetry, independent states, notation and duality on carded examples; not exhaustive'),
 dict(item='MW-C′: mc²/ħ ↔ proper time (P17C)', bs=20, slop=25, td='STRUCTURAL TRANSFER', breadth=2, why='exact and known (de Broglie); shares the character structure of #18; restricted to the group worldline; not complex conjugacy'),
 dict(item='MW-C as conjugacy', bs=0, slop=5, td='FAIL', breadth=1, why='conjugation fixes m'),
 dict(item='T-CONJUGACY (#17 hypothesis)', bs=15, slop=30, td='NOT YET FORMALIZED', breadth=2, why='one physical candidate reproduces the source structure only as the same theorem; no independent physical pair found conjugate; the question stays open'),
]
BREADTH = 'Application Breadth: Fourier signals (continuous, DFT) and one classical field family (Klein–Gordon form; elastic-foundation string as a second realization of the same equation) — 2 independent mathematical families; no physical system or dataset.'

# ── P. Recommendation ────────────────────────────────────────────────────────────────────────────────
RECOMMENDATION = dict(choice='READY FOR #17 ADVERSARIAL LOCK',
 why='Every item of the construction brief is answered by PASS cards in the decided order: the source relation is locked with its forcing property and exceptions; the criteria and levels are defined before the physical candidates; the dispersion, null and level-set mathematics is carded in spectral variables; the positive/negative-frequency relation is derived and separated from its physical and quantum readings; MW-A–MW-D each have their own status; the five required counterexamples are carded; statuses are separate.',
 lockTargets=['re-derive the realness ⟺ Hermitian-symmetry converse (Fourier uniqueness, source-only) and the 2D pairing with an independent card', 'audit every live statement for an implied "physical pairs are conjugate" or "mass is a wave"',
              'check the four new cross-reference edges against the historical record (they must stay cross-references)', 'decide whether Q17-2 (complementarity as Fourier duality) is in scope for the #17 lock or a separate question'],
 limits='The broader #17 hypothesis and MW-D stay OPEN; they are open research questions, not misplacements.')

# ══ #17 final adversarial lock (2026-11-17): corrections of live statements; the old wording is kept ═════════════════
# Decisions: docs/restructure_decisions.md, "#17 final adversarial lock". Cards: verify/verify_P17L.py (P17La–P17Lg).
LOCK_CARDS = ['P17La', 'P17Lb', 'P17Lc', 'P17Ld', 'P17Le', 'P17Lf', 'P17Lg']
SUPERSEDED = []
def supersede(where, old, new, why):
    SUPERSEDED.append(dict(where=where, old=old, new=new, why=why))
    return new
W_BOOST = 'Proper orthochronous Lorentz boosts preserve each positive- or negative-energy mass-shell branch separately.'
W_LEVEL = 'Mass labels/selects the invariant level of the same Lorentzian quadratic form.'
W_LEVELS = 'm = 0 ⇒ q(P) = 0 (the null level); m > 0 ⇒ q(P) = (mc/ħ)² > 0 (a nonzero timelike mass-shell level).'
W_PHASERATE = 'Along the worldline associated with the same on-shell four-momentum, the free massive plane-wave phase accumulates at the invariant proper-time rate mc²/ħ, up to sign convention.'
W_NOTDUAL = 'This establishes a proper-time phase rate. It does NOT by itself establish that mass and proper time are Fourier-conjugate variables.'
Q_SPECTRAL = 'Is there a physically meaningful formulation in which mass/rest energy acts as a genuine spectral variable conjugate to proper time?'
SURVIVES = 'mass determines the invariant mass-shell level and the associated rest-frame/proper-time phase rate.'
PHASE_ASSUMPTIONS = 'assumptions (P17Lb): a single free massive plane wave e^{−iη(P, X)}; P on the shell q(P) = (mc/ħ)²; the straight worldline X(τ) = X₀ + (cτ/μ)P of the same on-shell momentum, on which τ is proper time; the sign convention e^{−iη(P, X)} (the opposite convention reverses the sign). On another worldline the rate differs (lab frame: ω).'
CONVERSE = dict(
 statement='for x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ x is real almost everywhere',
 forward='x real ⇒ Hermitian symmetry: the identity x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω), v = Im x (P17Fa)',
 converse='Hermitian symmetry ⇒ x real a.e.: with y = conj x, ŷ(ω) = conj x̂(−ω) (P17Le), so ŷ = x̂ and the uniqueness theorem on L¹ gives y = x a.e. — Zhou and Siadat, Notes on Harmonic Analysis I (arXiv:1709.03377), Theorem 1.15: "If f ∈ L1 (R) and fˆ = 0 everywhere (fˆ is always continuous), then f = 0 a.e." (full text read; research/sources/zhou_siadat_2017.md)',
 independent='proved exactly without importing any theorem: finite signals, every N (P17Lc: F F* = N·I; a Hermitian-symmetric X has a real inverse); finite Hermite expansions (P17Ld: the defect has h_n-coefficient 2i√(2π)iⁿ·Im c_n); and, given the inversion theorem (x, x̂ ∈ L¹), the imaginary part of the inversion integral has an odd integrand (P17Le)')

_old = SOURCE[0]['statement']
SOURCE[0]['statement'] = supersede('B. source relation, continuous', _old, 'x̂(ω) = ∫x(t)e^{−iωt}dt. For x = u + iv: x̂(−ω) − conj x̂(ω) = 2i·v̂(−ω). For x ∈ L¹(ℝ): x̂(−ω) = conj x̂(ω) for every ω ⟺ v = 0 almost everywhere — the converse by the uniqueness theorem on L¹ (Zhou–Siadat Theorem 1.15, read), and independently for finite signals and finite Hermite expansions. Realness is exactly the property that forces the conjugacy', 'lock 5: the converse source-locked and carded')
SOURCE[0]['cards'] = ['P17Fa', 'FB4a', 'P17Lc', 'P17Ld', 'P17Le']
FORCED_BY = supersede('B. what forces the conjugacy', FORCED_BY, FORCED_BY.replace('and v̂ ≡ 0 only for v = 0 (P17Fa).', 'and v̂ ≡ 0 only for v = 0 a.e. (P17Fa; uniqueness on L¹, Zhou–Siadat Theorem 1.15; exact without imported theorems for finite signals, P17Lc, and finite Hermite expansions, P17Ld).'), 'lock 5')

MASSIVE[1] = dict(MASSIVE[1], statement=supersede('F. massive level set, row 2', MASSIVE[1]['statement'], W_BOOST + ' Each branch is one SO⁺(1,1) orbit: the boost with tanh φ = ck/ω (= v_g/c) carries a positive-energy point to (μ, 0) and a negative-energy point to (−μ, 0). Not claimed for the full Lorentz group: time reversal S_t and −I preserve q and exchange the branches (P17La, P17Ca)', 'lock 1: boost scope'), cards=['P17De', 'P17La', 'P17Ca'])
MASSIVE[4] = dict(MASSIVE[4], statement=supersede('F. massive level set, row 5', MASSIVE[4]['statement'], W_PHASERATE + ' — ' + PHASE_ASSUMPTIONS + ' m = 0: the phase is constant along the light ray. ' + W_NOTDUAL, 'lock 3 and lock 4: scoped; no Fourier-duality claim'), cards=['P17Dg', 'P17Lb', 'P17Lf'], status='DERIVED (under the stated assumptions)')
MASSIVE[5] = dict(MASSIVE[5], statement=supersede('F. massive level set, row 6', MASSIVE[5]['statement'], 'mass selects the level: ' + W_LEVEL + ' ' + W_LEVELS + ' The form and the group SO⁺(1,1) are the same for every m; μ = mc/ħ labels the invariant level as r labels a rotation orbit (#14 chart: Kᵀη + ηK = 0, JᵀI + IJ = 0); μ is not a form parameter like c', 'lock 2: mass selects the level; no change of geometry'), cards=['P17Di', 'P17Lg', 'A8Wb'])
MASS_ANSWER = supersede('F. answer', MASS_ANSWER, 'Does mass appear as a parameter selecting a non-null level set of the same quadratic form whose m=0 case is null? Yes, exactly: ' + W_LEVEL + ' ' + W_LEVELS + ' The form q = (ω/c)² − k² and the group acting on it are the same for every m; m does not change the geometry, it selects the level (P17Db, P17Dc, P17De, P17Lg). Consequences of the selected level (derived): a frequency gap at mc²/ħ, a rest frame, and the proper-time phase rate stated below. This does not say that mass is a wave.', 'lock 2')

for c_ in CANDIDATES:
    if c_['id'] == 'PC-4':
        c_['notShared'] = supersede('C. PC-4 not shared', c_['notShared'], 'no transformation or involution relating the levels; the null level and a timelike level of the same form carry different SO⁺(1,1) orbit structure (four null half-lines vs two branches); m selects the level, the form is unchanged', 'lock 2')
    if c_['id'] == 'PC-6':
        old = dict(c_)
        c_.update(name='rest frequency mc²/ħ and the proper-time phase', relation='phase accumulation at mc²/ħ per unit proper time along the worldline of the same on-shell momentum (up to sign convention)',
                  kind='a proper-time phase rate — not a demonstrated pairing', criteria=dict(TC1='yes', TC2='no', TC3='yes', TC4='no', TC5='no', TC6='yes', TC7='partial'),
                  level='L1: a phase-rate equation; no Fourier-conjugate pairing of m and τ is established (P17Lf)', shared='the character structure of #18 (an unbounded parameter in a bounded phase)',
                  notShared='no antilinear involution; no spectral family in which m is a variable; restricted to the worldline of the same on-shell momentum', cards=['P17Dg', 'P17Lb', 'P17Lf', 'A8Fa'])
        SUPERSEDED.append(dict(where='C. PC-6', old=f'{old["name"]}; kind: {old["kind"]}; level: {old["level"]}', new=f'{c_["name"]}; kind: {c_["kind"]}; level: {c_["level"]}', why='lock 4: the Fourier-duality claim is withdrawn'))
for k_ in KINDS:
    if k_['kind'] == 'Fourier duality':
        k_['examples'] = supersede('H. kinds: Fourier duality examples', k_['examples'], '(t, ω), (x, k). Not established for mass and proper time (P17Lf)', 'lock 4')
        k_['cards'] = ['P17Cf', 'P17Lf']

for m_ in MW:
    if m_['id'] == 'MW-A':
        m_['basis'] = supersede('I. MW-A basis', m_['basis'], 'RESTRICTED to the physical setting where E = ħω and p = ħk apply (identifications used as inputs). Derived under them, with assumptions explicit: v_g = dω/dk = c²k/ω = pc²/E; for a relativistic particle with p = γmv and E = γmc², pc²/E = v; ω₀ = mc²/ħ at k = 0 (P17Eb); the level-set geometry is rescaled by ħ (P17Ea). Not classical identities; no physical data carded here', 'lock 6: assumptions explicit')
    if m_['id'] == 'MW-B':
        m_['basis'] = supersede('I. MW-B basis', m_['basis'], 'exact: one Lorentzian quadratic form; ' + W_LEVELS + ' Spectral variables, not spacetime (P17Dc, P17De, P17Di, P17Lg, FB8b)', 'lock 2')
        m_['cards'] = ['P17Dc', 'P17De', 'P17Di', 'P17Lg', 'FB8b']
    if m_['id'] == 'MW-C':
        m_['basis'] = supersede('I. MW-C basis', m_['basis'], 'FAIL: complex conjugation maps the mass-m shell to itself and never relates m to (ω, k) (P17Ch). What survives: ' + SURVIVES + ' (P17Lb, P17Lg). That is not a conjugate pairing, and no Fourier-duality claim replaces the failure (P17Lf). The further question is kept separately as OPEN and not investigated: ' + Q_SPECTRAL, 'lock 4 and lock 6: the failure is not softened')
        m_['cards'] = ['P17Ch', 'P17Lf']
    if m_['id'] == 'MW-D':
        m_['basis'] = supersede('I. MW-D basis', m_['basis'], 'OPEN, not promoted: a physics interpretation that requires exact theory-specific wording. The classical elastic-foundation counterexample stays in the record because the same dispersion equation alone cannot establish particle ontology (P17Mx)', 'lock 6')

def _row(item):
    return next(r for r in STATUS_TABLE if r['item'] == item)
r_ = _row('Fourier conjugacy (real signal; continuous and DFT)')
r_['basis'] = supersede('K. Fourier conjugacy basis', r_['basis'], 'for x ∈ L¹(ℝ): Hermitian symmetry ⟺ x real a.e. (forward P17Fa; converse by uniqueness on L¹, Zhou–Siadat Theorem 1.15, read; exact without imported theorems for finite signals and finite Hermite expansions, P17Lc, P17Ld); DC/Nyquist self-paired; complex signals fail', 'lock 5')
r_['cards'] = r_['cards'] + ['P17Lc', 'P17Ld', 'P17Le']
r_ = _row('massive mass-shell level set')
r_['basis'] = supersede('K. massive level set basis', r_['basis'], 'm selects a nonzero timelike level of the same form; each branch is one SO⁺(1,1) orbit, preserved by proper orthochronous boosts (not by the full Lorentz group); gap; rest frame; proper-time phase rate along the worldline of the same on-shell momentum', 'lock 1 and lock 2')
r_['cards'] = ['P17De', 'P17Df', 'P17Dg', 'P17Di', 'P17La', 'P17Lb', 'P17Lg']
r_ = _row('MW-C (conjugate pairing)')
r_['basis'] = supersede('K. MW-C basis', r_['basis'], 'as complex conjugacy (P17Ch); what survives: ' + SURVIVES + ' No Fourier-duality claim (P17Lf)', 'lock 4')
r_['cards'] = ['P17Ch', 'P17Lf']
_i = STATUS_TABLE.index(_row('MW-C′ (rest frequency and proper time, Fourier duality)'))
_old_row = STATUS_TABLE[_i]
STATUS_TABLE[_i] = dict(item='proper-time phase rate ω_C = mc²/ħ (worldline of the same on-shell momentum)', status='DERIVED', basis=W_PHASERATE + ' ' + PHASE_ASSUMPTIONS, cards=['P17Dg', 'P17Lb'])
SUPERSEDED.append(dict(where='K. status table', old=f'{_old_row["item"]}: {_old_row["status"]} — {_old_row["basis"]}', new=f'{STATUS_TABLE[_i]["item"]}: DERIVED', why='lock 3 and lock 4'))
STATUS_TABLE.insert(_i + 1, dict(item='mass / rest energy as a genuine spectral variable conjugate to proper time', status='OPEN', basis='not established (P17Lf); kept as Q17-4 and not investigated', cards=['P17Lf']))
STATUS_TABLE.insert(_i + 2, dict(item='boost scope on the mass shell', status='ESTABLISHED', basis=W_BOOST + ' Not claimed for the full Lorentz group (S_t, −I exchange the branches)', cards=['P17La', 'P17Ca']))

for st in STORY:
    if st['result'] == 'massive level set':
        st['relation'] = supersede('L. story: massive level set', st['relation'], 'yes: ' + W_LEVEL + ' ' + W_LEVELS + ' Proper orthochronous boosts preserve each branch; gap; rest frame (#14 ⇢ #17, #19 ⇢ #17)', 'lock 1 and 2')
    if st['result'] == 'MW-C tested':
        st['relation'] = supersede('L. story: MW-C', st['relation'], 'FAIL as complex conjugacy. What survives: ' + SURVIVES + ' The phase e^{−imc²τ/ħ} along that worldline is a character of proper time, as in #18 (#18 ⇢ #17); it is a phase rate, not a Fourier-conjugate pairing', 'lock 4')
        st['next'] = supersede('L. story: MW-C next', st['next'], 'Q17-4 (OPEN, not investigated): ' + Q_SPECTRAL + ' MW-D stays OPEN', 'lock 4')
NEXT_QUESTIONS.append('Q17-4: ' + Q_SPECTRAL + ' (OPEN; recorded at the #17 lock, not investigated)')
for rt in RATINGS:
    if rt['item'].startswith('MW-C′'):
        SUPERSEDED.append(dict(where='N. ratings', old=f'{rt["item"]}: {rt["bs"]}% / {rt["slop"]}%, {rt["td"]}', new='proper-time phase rate (P17C): 15% / 10%, TRIVIAL CONSEQUENCE', why='lock 4'))
        rt.update(item='proper-time phase rate (P17C)', bs=15, slop=10, td='TRIVIAL CONSEQUENCE', breadth=2, why='exact under the stated assumptions (P17Lb); a phase rate, not a Fourier-conjugate pairing (P17Lf)')
    if rt['item'].startswith('mass shell'):
        rt['why'] = supersede('N. ratings: mass shell', rt['why'], 'the #14 chart (preserved form → generator → orbit) applies unchanged in spectral variables: m selects the invariant level (P17Lg), each branch is one SO⁺(1,1) orbit (P17La); m plays the orbit-invariant role, not the role of c', 'lock 1 and 2')
for e_ in list(PLACEMENT_EDGES):
    if e_[0] == 'M18':
        i_ = PLACEMENT_EDGES.index(e_)
        PLACEMENT_EDGES[i_] = (e_[0], e_[1], e_[2], supersede('L. edge M18 ⇢ M17', e_[3], 'later mathematical connection: along the worldline of the same on-shell momentum the phase e^{−imc²τ/ħ} is a character of an unbounded parameter in the bounded circle, as in #18 (P17Lb, A8Fa); a phase rate, not a Fourier-conjugate pairing', 'lock 3 and 4'))
    if e_[0] == 'M19':
        i_ = PLACEMENT_EDGES.index(e_)
        PLACEMENT_EDGES[i_] = (e_[0], e_[1], e_[2], supersede('L. edge M19 ⇢ M17', e_[3], 'later mathematical connection: boosts act on (ω/c, k) as on (ct, x); proper orthochronous boosts preserve each mass-shell branch; Doppler on the null cone; tanh φ = ck/ω brings a positive-energy mode to rest (P17De, P17Dh, P17La)', 'lock 1'))

STORY_PATH = 'Fourier conjugacy → question about physical pairings → candidate mass/wave investigation → exact mass-shell relation → failed conjugacy interpretation → more precise open question.'
AUDIT = [
 ('physical pairs are generally complex conjugates', 'none live; T-CONJUGACY OPEN; the only exact conjugate pairing found is the reality constraint of a real field (P17R)'),
 ('mass is a wave', 'none live; stated only as what is not established (T-MASS-WAVE-SEED stays a HYPOTHESIS)'),
 ('mass and wave are Fourier-conjugate', 'withdrawn: the construction-pass wording "mc²/ħ and proper time are a Fourier-dual pair" is superseded (P17Lf); the further question is Q17-4 (OPEN)'),
 ('positive and negative frequency automatically mean particle/antiparticle', 'none live; the quantum reading is "NOT USED" (G)'),
 ('the spectral mass shell is physical spacetime', 'none live; "spectral variables, not spacetime" (D, E)'),
 ('every Lorentz transformation preserves an energy branch', 'corrected: only proper orthochronous boosts; S_t and −I exchange branches (P17La)'),
 ('mass changes the shape of the geometry', 'corrected: mass selects the level; the form and the group are the same for every m (P17Lg)'),
]
MATH_LOCK = [
 ('Fourier conjugacy: x ∈ L¹, Hermitian symmetry ⟺ x real a.e.', 'P17Fa, P17Lc, P17Ld, P17Le, FB4a, FB4b, FB4c', 'converse by uniqueness on L¹ (Zhou–Siadat Th. 1.15, read); exact without imported theorems for finite signals and finite Hermite expansions'),
 ('real-field reality pairing P ↦ −P', 'P17Rb, P17Rc, P17Rd, P17Re, P17Cg', 'a real field; the partner of (ω, k) is (−ω, −k)'),
 ('massless null level (spectral)', 'P17Dc, P17Dd, P17Dh, FB8b', 'spectral variables; distinct from the spacetime null and every other zero / null'),
 ('m selects the level: m = 0 ⇒ q(P) = 0; m > 0 ⇒ q(P) = (mc/ħ)² > 0', 'P17Db, P17De, P17Lg', 'the form and the group do not depend on m'),
 ('proper orthochronous boosts preserve each branch', 'P17La, P17De', 'not the full Lorentz group'),
 ('proper-time phase rate mc²/ħ', 'P17Dg, P17Lb', 'single free plane wave; worldline of the same on-shell momentum; sign convention'),
 ('MW-C FAIL', 'P17Ch, P17Lf', 'no Fourier-duality claim replaces it'),
 ('MW-D OPEN; the dispersion equation alone cannot establish particle ontology', 'P17Mx', 'the elastic-foundation string'),
]
LOCK = dict(choice='LOCK #17 — STORY AND MATHEMATICS ALIGNED',
 why='The four flagged statements are corrected (boost scope, mass selects the level, the scoped proper-time phase rate, the withdrawn Fourier-duality claim); the Fourier converse is source-locked from a text actually read and proved exactly on finite signals and finite Hermite expansions; MW-A–MW-D keep separate statuses with the MW-C failure unsoftened; the live-text audit finds no remaining claim of the six flagged kinds; #12 → #17 stays the only historical edge into #17, and #13, #14, #18, #19 stay cross-references.',
 storyPath=STORY_PATH, stop='Research is paused after the #17 lock. No subsequent branch has been started. The preview represents the current canonical state of the project.')
RECOMMENDATION = dict(RECOMMENDATION, why=RECOMMENDATION['why'] + ' (Construction-pass recommendation, kept as history; the lock verdict is below.)')

data = dict(about='Master Map #17, first construction (2026-11-17). Generated by research/tools/p17_source.py.', cards=CARDS, earlierCards=EARLIER, statuses=STATUSES,
            history=HISTORY, source=SOURCE, forcedBy=FORCED_BY, criteria=[dict(id=a, text=b) for a, b in CRITERIA], levels=[dict(id=a, name=b, meaning=c) for a, b, c in LEVELS], levelRule=LEVEL_RULE,
            candidates=[dict(c, candidateCommonRelation=None) for c in CANDIDATES], dispersion=DISPERSION, nulls=NULLS, nullLink=NULL_LINK, massive=MASSIVE, massAnswer=MASS_ANSWER,
            posNeg=POSNEG, kinds=KINDS, comparison=[dict(pairing=a, verdict=b) for a, b in COMPARISON], mw=MW, seedNote=SEED_NOTE, counterexamples=COUNTER, supportingCounterexamples=SUPPORTING_COUNTER,
            statusTable=STATUS_TABLE, placementEdges=[dict(src=a, dst=b, type=c, why=d) for a, b, c, d in PLACEMENT_EDGES], story=STORY, nextQuestions=NEXT_QUESTIONS, futureBranches=FUTURE,
            notEstablished=NOT_ESTABLISHED, ratings=RATINGS, breadth=BREADTH, recommendation=RECOMMENDATION,
            words=dict(realField=W_REALFIELD, massLevel=W_MASSLEVEL, kinds=W_KINDS, restClock=W_RESTCLOCK, boost=W_BOOST, level=W_LEVEL, levels=W_LEVELS, phaseRate=W_PHASERATE, notDual=W_NOTDUAL, spectralQ=Q_SPECTRAL),
            lockCards=LOCK_CARDS, converse=CONVERSE, audit=[dict(claim=a, result=b) for a, b in AUDIT], mathLock=[dict(statement=a, cards=b, assumptions=c) for a, b, c in MATH_LOCK], superseded=SUPERSEDED, lock=LOCK)
(ROOT / 'research/p17.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')

# ── render ───────────────────────────────────────────────────────────────────────────────────────────
cell = lambda x: '—' if x in (None, '', []) else str(x).replace('|', '\\|')
cs = lambda l: ', '.join(l)
L = ['# Master Map #17: conjugacy and physical pairs (first construction; locked 2026-11-17)', '', f'**{LOCK["choice"]}** (2026-11-17). Lock cards: `verify/verify_P17L.py` (P17La–P17Lg). The lock section and the superseded construction-pass wording are at the end.', '',
     'Generated from `research/tools/p17_source.py` (`research/p17.json`). Do not edit by hand. Cards: `verify/verify_P17.py` (34, one ledger run), with FB4a–FB4c and FB8a–FB8c. Decisions: `docs/restructure_decisions.md`, "Pre-#17 story patches and the first #17 construction".', '',
     f'Discovery order kept: {HISTORY["path"]} {HISTORY["notAssumed"]}', '',
     '## A. The historical #17 question', '', f'- Node: **{HISTORY["node"]}**; historical predecessor: **{HISTORY["predecessor"]}** (EARLIER PREDECESSOR edge #12 → #17).', f'- Question: {HISTORY["question"]}',
     '- The Master Map scene (verbatim):'] + [f'  - "{s}"' for s in HISTORY['scene']] + [f'- Seed for one candidate route: {HISTORY["seed"]}', '',
     '## B. Fourier conjugacy: the source relation for #17', '', 'Convention: x̂(ω) = ∫x(t)e^{−iωt}dt; DFT X_k = Σx_n e^{−2πikn/N}.', '', '| Item | Exact statement | Cards |', '|---|---|---|']
L += [f'| {s["item"]} | {cell(s["statement"])} | {cs(s["cards"])} |' for s in SOURCE]
L += ['', f'**What forces the conjugacy:** {FORCED_BY}', '',
      '## C. What "same structure" would have to mean', '', 'Transfer criteria (Nadia\'s list, 2026-11-17): ' + '; '.join(f'**{a}** {b}' for a, b in CRITERIA) + '.', '',
      'Levels: ' + '; '.join(f'**{a} {b}** — {c}' for a, b, c in LEVELS) + '. ' + LEVEL_RULE, '',
      '### Candidate pairs (questions, not answers: no deeper common relation is filled in)', '',
      '| ID | Candidate | Object | Representation | Relation | Transformation | Invariant | Zero / null | Kind | ' + ' | '.join(a for a, _ in CRITERIA) + ' | Level | Genuinely shared | Not shared | Cards |', '|' + '---|' * 20]
L += [f'| {c["id"]} | {cell(c["name"])} | {cell(c["object"])} | {cell(c["representation"])} | {cell(c["relation"])} | {cell(c["transformation"])} | {cell(c["invariant"])} | {cell(c["null"])} | {cell(c["kind"])} | ' + ' | '.join(c['criteria'][a] for a, _ in CRITERIA) + f' | {cell(c["level"])} | {cell(c["shared"])} | {cell(c["notShared"])} | {cs(c["cards"])} |' for c in CANDIDATES]
L += ['', '## D. Dispersion and mass-shell mathematics (spectral variables, not spacetime)', '', '| Statement | Cards | Status |', '|---|---|---|'] + [f'| {cell(d["statement"])} | {cs(d["cards"])} | {d["status"]} |' for d in DISPERSION]
L += ['', '## E. The massless null case', '', 'm = 0: ω² = c²k² ⟺ (ω/c)² − k² = 0 ⟺ ω = ±ck, a null relation of the Lorentzian form in the spectral plane (P17Dc). They are not one kind of zero:', '',
      '| Object | Where it lives | Relation | Kind of zero (#13) | Cards |', '|---|---|---|---|---|'] + [f'| {n["object"]} | {n["where"]} | {cell(n["relation"])} | {n["zeroKind"]} | {cs(n["cards"])} |' for n in NULLS]
L += ['', NULL_LINK, '', '## F. The massive level-set case', '', '| Statement | Cards | Status |', '|---|---|---|'] + [f'| {cell(d["statement"])} | {cs(d["cards"])} | {d["status"]} |' for d in MASSIVE]
L += ['', f'**{MASS_ANSWER}**', '', W_LEVEL + ' ' + W_LEVELS, '', W_BOOST, '', W_PHASERATE + ' ' + W_NOTDUAL, '', f'Assumptions: {PHASE_ASSUMPTIONS}', '', f'Open, not investigated (Q17-4): {Q_SPECTRAL}', '',
      '## G. Positive and negative frequency', '', f'- **Mathematics.** {POSNEG["math"]}', f'- **When it holds.** {POSNEG["condition"]}', f'- **Classical physical reading.** {POSNEG["physical"]}', f'- **Quantum reading.** {POSNEG["quantum"]}', '', W_REALFIELD, '',
      '## H. Comparison with true Fourier conjugacy', '', W_KINDS, '', '| Kind | Meaning | Examples | Cards |', '|---|---|---|---|'] + [f'| {k["kind"]} | {cell(k["meaning"])} | {cell(k["examples"])} | {cs(k["cards"])} |' for k in KINDS]
L += ['', '| Pairing asked about | Verdict |', '|---|---|'] + [f'| {cell(a)} | {cell(b)} |' for a, b in COMPARISON]
L += ['', '## I. The mass/wave seed: exact readings', '', SEED_NOTE, '', '| Reading | Words (2026-11-17 decisions) | Precise form | Status | Basis | Cards |', '|---|---|---|---|---|---|']
L += [f'| {m["id"]} — {m["name"]} | {cell(m["words"])} | {cell(m["reading"])} | **{m["status"]}** | {cell(m["basis"])} | {cs(m["cards"])} |' for m in MW]
L += ['', '## J. Counterexamples', '', '| ID | Required (verbatim) | Example | What it breaks | Cards |', '|---|---|---|---|---|'] + [f'| {x["id"]} | {cell(x["words"])} | {cell(x["example"])} | {cell(x["breaks"])} | {cs(x["cards"])} |' for x in COUNTER]
L += ['', 'Supporting: ' + '; '.join(f'{x["id"]}: {x["example"]}' for x in SUPPORTING_COUNTER) + '.']
L += ['', '## K. Status table (separate statuses; no umbrella status)', '', 'Statuses: ' + ', '.join(STATUSES) + '.', '', '| Item | Status | Basis | Cards |', '|---|---|---|---|'] + [f'| {s["item"]} | **{s["status"]}** | {cell(s["basis"])} | {cs(s["cards"])} |' for s in STATUS_TABLE]
L += ['', '## L. Canonical-story placement', '', 'No new story node. The Master Map order is unchanged. Edges (in `research/canonical_story.md`): ', ''] + [f'- {a} → {b} ({c}): {d}' for a, b, c, d in PLACEMENT_EDGES]
L += ['', '### Story contribution', '', '| Result | Historical question answered | Relation discovered | Next question it creates |', '|---|---|---|---|'] + [f'| {s["result"]} | {cell(s["answers"])} | {cell(s["relation"])} | {cell(s["next"])} |' for s in STORY]
L += ['', 'Next questions created (not begun):', ''] + [f'- {q}' for q in NEXT_QUESTIONS] + ['', 'Future branches (marked, not expanded): ' + '; '.join(FUTURE) + '.']
L += ['', '## M. What the branch does NOT establish', ''] + [f'- {x}' for x in NOT_ESTABLISHED]
L += ['', '## N. Ratings (secondary metadata)', '', '| Item | Backbone Support | AI Slop / Delusion Risk | Transfer Depth | Application Breadth | Why |', '|---|---|---|---|---|---|'] + [f'| {r["item"]} | {r["bs"]}% | {r["slop"]}% | {r["td"]} | {r["breadth"]} | {cell(r["why"])} |' for r in RATINGS]
L += ['', BREADTH, '', '## O. Files', '', '- `verify/verify_P17.py` (34 cards, one ledger run); `research/tools/p17_source.py` → `research/p17.json`, this record.',
      '- Registry: T-P17-GOV, T-P17-CRITERIA, T-P17-DEPTH, T-MW-A, T-MW-B, T-MW-C, T-MW-D, T-P17-REALFIELD, T-P17-MASS-LEVEL, T-P17-PAIRING-KINDS, T-P17-REST-CLOCK; notes on T-CONJUGACY, T-MASS-WAVE-SEED, T-MASS-WAVE, T-MASS-WAVE-Q, T-MATTER-FIELD.',
      '- Foundation: objects P17F, P17R, P17N, P17M, P17E, P17K, P17C, P17MW, P17X; bridges BR87–BR92; domain D41; sources SRC-FOLLAND-1995, SRC-SCOTT-1969, SRC-WIGNER-1939 (bears on only).',
      '- Canonical story: cross-reference edges #13, #14, #18, #19 ⇢ #17; chain P17. Master map: Part III block "#17: conjugacy and physical pairs"; Parts X, XII, XIII, XV. Application matrix: version 5.', '',
      '## P. Recommendation', '', f'**{RECOMMENDATION["choice"]}**', '', RECOMMENDATION['why'], '', 'Lock targets: ' + '; '.join(RECOMMENDATION['lockTargets']) + '.', '', f'Limits: {RECOMMENDATION["limits"]}',
      '', '## Q. Final adversarial lock (2026-11-17)', '', f'**{LOCK["choice"]}**', '', LOCK['why'], '', f'Story order kept: {STORY_PATH}', '',
      '### The Fourier converse', '', f'- Statement: {CONVERSE["statement"]}.', f'- Forward: {CONVERSE["forward"]}.', f'- Converse: {CONVERSE["converse"]}.', f'- Independent exact proofs: {CONVERSE["independent"]}.', '',
      '### Mathematical lock', '', '| Live statement | Cards | Assumptions / scope |', '|---|---|---|'] + [f'| {cell(a)} | {b} | {cell(c)} |' for a, b, c in MATH_LOCK] + [
      '', '### Live-text audit', '', '| Wording searched for | Result |', '|---|---|'] + [f'| {cell(a)} | {cell(b)} |' for a, b in AUDIT] + [
      '', '### Superseded construction-pass wording (kept)', '', 'The two sentences below were the original wording of registry records T-P17-REST-CLOCK (superseded by T-P17-PHASE-RATE) and T-P17-MASS-LEVEL (normalized statement corrected). They are kept as provenance, not as live claims.', '',
      '> ' + W_RESTCLOCK, '', '> ' + W_MASSLEVEL, '', '| Where | Old | New | Why |', '|---|---|---|---|'] + [f'| {x["where"]} | {cell(x["old"])} | {cell(x["new"])} | {x["why"]} |' for x in SUPERSEDED] + [
      '', '### Stopping point', '', LOCK['stop']]
(ROOT / 'research/constructions/p17_conjugacy_physical_pairs.md').write_text('\n'.join(L) + '\n')
print(f'{len(CARDS)} + {len(LOCK_CARDS)} cards; {len(CANDIDATES)} candidate pairs; {len(STATUS_TABLE)} status rows; {len(SUPERSEDED)} superseded; lock: {LOCK["choice"]}')
