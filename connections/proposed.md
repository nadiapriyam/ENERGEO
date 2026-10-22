# Proposed connections (Claude). Not approved yet.

Under §4 you may approve, reword or reject each one. Until you do, each is a hypothesis, and it appears in an interactive only as "hypothesis". The cards are in `verify_C8_C9.py` (8 of 9 PASS; C8c FAIL, kept on the ledger).

---

## C8. An unbounded parameter reaches a bounded geometry in different ways

**Prompted by** H3, answer 8: "whether this type of relationship—an unbounded quantity expressed through a bounded geometry—has deeper mathematical analogues elsewhere."

### Statement

An unbounded parameter mapped into a bounded set behaves in at least three distinct ways at infinity:

| Kind | Example | At infinity | Card |
|---|---|---|---|
| **Wrapping** | $t \mapsto (\cos\omega t, \sin\omega t)$ | No limit. Returns exactly, forever. Your two infinities ($t$, cycle count) live here. | C8a PASS |
| **Compressing** | $s \mapsto \tanh s$; $\theta \mapsto e^{-\theta t_i}$; $c \mapsto Y(c)$ | A limit exists at the edge of the bounded set. | S5b, C8b PASS; S5d PASS for the transformations ($Y(c)$ itself uncarded) |
| **Quasi-periodic** | $\tau \mapsto$ shift of $\cos t + \cos\sqrt2\, t$ | No limit, and no exact return, but it returns arbitrarily closely. | C8d PASS |

Infinite Fourier sums sit in the compressing row in the mean-square sense, but not pointwise. The mean-square error goes to 0, while the overshoot at a jump never shrinks. Cards: C8c FAIL (threshold wrong; kept on the ledger), C8c2 PASS.

**Bears on:** H3, and H1's premise (answer 2: $S_N \to f$).
**Blocks:** 3, 4, 5, 9, 11, 14.

### Level

Each row is Level 1 (carded). That these are *the* kinds, or that H3's "common structure" spans them, is **Level 3**.

### Where it might break

The rows behave *oppositely* at infinity: recurrence vs convergence. So "a common structure" may turn out to be two or three structures rather than one. That is your H3 open question 2.

### What an interactive would show

All three side by side, each with a live "limit exists?" readout and no conclusion built in:

- **Wrapping:** the cylinder (phase × elapsed time).
- **Compressing:** the $\tanh$-compressed axis, where $\infty$ becomes a reachable edge.
- **Quasi-periodic:** the torus winding densely (Block 5).

---

## C9. $c \to \infty$ is where the invariant form degenerates, and the boost becomes a shear

**Prompted by** C1 ("$M$ itself may be the rule"), H3 answer 3 ($c \to \infty$ as a theory-space limit), and S4's trichotomy.

### Statement

Write spacetime's form with $c$ as a parameter: $M_c = \operatorname{diag}(1, -1/c^2)$ on $(t, x)$.

1. Every Lorentz boost preserves $M_c$. *(C9a PASS)*
2. As $c \to \infty$, $M_c \to \operatorname{diag}(1, 0)$: the form degenerates, and only time is still measured invariantly. *(C9b PASS)*
3. The boost generator $K_c = \begin{pmatrix}0 & -1/c^2 \\ -1 & 0\end{pmatrix}$ has $\det K_c = -1/c^2 < 0$, so it is hyperbolic. At $c = \infty$ it becomes $K_\infty$ with $K_\infty^2 = 0$, which is S4's middle case, the **shear**. *(C9c PASS)*
4. $\exp(vK_\infty)$ is the Galilean boost, and it preserves the degenerate form. *(C9d PASS)*

So the $c \to \infty$ boundary of the theory space is where:

- the invariant form loses rank, and
- the transformation crosses S4's trichotomy from hyperbolic to shear.

This is known mathematics (İnönü–Wigner contraction, not yet carded as such). The *connection* to C1, C3 and H3 is the hypothesis.

**Bears on:** H3 (open question 1: the two roles of $c$), C1, C3.
**Blocks:** 1, 9, 14.

### Level

Each step is Level 1 (carded). That this degeneration is what "an invariant variable that acts as a rule in the manifold" points at is **Level 4**. That is for you to say.

### Where it might break

Points 1–4 are about spacetime's form, which lives on the *spacetime* manifold. Your answer 4 puts $c \to \infty$ on the *model* manifold. C9 connects the two only through the shared parameter $c$. Whether that link is the one you mean is open.

### What an interactive would show

A $1/c$ slider ending at 0, with three views moving together:

- **3D height surface:** $z = t^2 - x^2/c^2$ morphs from a saddle into a flat-bottomed trough.
- **Boost orbits:** they straighten from hyperbolas into shear lines of constant $t$.
- **Generator readout:** $\det K_c$ moves to $0^-$.
