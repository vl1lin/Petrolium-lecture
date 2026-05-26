# Lecture: Correlations for Calculating PVT Properties of Oils

## What Are PVT Properties and How Are They Classified?

### PVT Properties of Oil: Physics, Classification, and Significance

**Why "PVT"?**
- $P$ (Pressure) — pressure
- $V$ (Volume) — volume
- $T$ (Temperature) — temperature

In the reservoir, oil is not simply a liquid but a complex multicomponent system: dissolved gas + liquid hydrocarbons + sometimes nitrogen, CO₂, H₂S. When $P$ and $T$ change, this system can separate, evolve gas, or change viscosity by orders of magnitude.

#### Classification of PVT Properties by Physical Role
We divide the properties into three groups:

**Group 1. Phase Behavior** (transition "liquid → gas + liquid")

| Property | Notation | Physical Meaning |
| :--- | :--- | :--- |
| Bubble Point Pressure | $P_b$ (or $P_{\text{sat}}$) | Pressure at which the last bubble of gas remains dissolved. Below $P_b$, massive gas evolution begins. |
| Solution Gas-Oil Ratio | $R_s$ | Volume of gas (at standard conditions) dissolved in one unit of dead oil. The function $R_s(P)$ is the "solubility curve". |

**Group 2. Volumetric Properties** (shrinkage and expansion)

| Property | Notation | Physical Meaning |
| :--- | :--- | :--- |
| Oil Formation Volume Factor | $B_o$ | $\dfrac{V_{\text{reservoir oil}}}{V_{\text{dead oil at surface}}}$ |

**Why is $B_o$ always $>1$?** Because reservoir oil contains dissolved gas. Upon degassing at the surface, the gas "escapes", causing the liquid phase to shrink.

**Dependence of $B_o$ on Pressure:**
- At $P > P_b$ — $B_o$ gradually decreases as pressure drops (the oil slightly compresses; the effect is small, but actually, as pressure approaches $P_b$, reservoir oil volume slightly increases due to expansion of dissolved gas — a liquid anomaly).
- At $P < P_b$ — sharp drop in $B_o$ as gas evolves and the liquid "collapses".

**Group 3. Transport Properties**

| Property | Notation | Physics |
| :--- | :--- | :--- |
| Live Oil Viscosity | $\mu_o$ | Resistance to shear. In reservoir conditions, viscosity can be 10–100 times **lower** than dead oil viscosity due to dissolved gas. |
| Live Oil Density | $\rho_o$ | Mass per unit volume under reservoir conditions. Always **lower** than dead oil density (gas is lighter). |
| API Gravity | $^\circ\text{API}$ | $^\circ\text{API} = \dfrac{141.5}{\gamma_{\text{oil}}} - 131.5$ (standardized density scale developed by the American Petroleum Institute) |
| Isothermal Compressibility | $c_o$ | $-\dfrac{1}{V}\dfrac{\partial V}{\partial P}$ at $T = \text{const}$. Above $P_b$, compressibility is small ($\sim 10^{-5}$ psi⁻¹). Below $P_b$, the concept loses meaning (gas is evolving). |

#### Interrelation of Properties
All PVT properties are linked through an equation of state (in its simplest form, via material balance):
$$
R_s(P) \cdot \gamma_g + \gamma_o = \rho_o(P) \cdot B_o(P)
$$
Here, $\gamma_g$ and $\gamma_o$ are the specific gravities of gas and dead oil at standard conditions.

**Consequence:** Knowing three properties allows calculation of the fourth. Therefore, correlations are typically built for $R_s(P)$ and $B_o(P)$, while viscosity and density are derived via simpler relations.

#### Example for Understanding: Light vs Heavy Oil
| Parameter | Light Oil (Western Siberia, API 40) | Heavy Oil (Tatarstan, API 18) |
| :--- | :--- | :--- |
| $P_b$, atm | 200–250 | 50–80 |
| $R_s$, m³/m³ | 200–500 | 20–60 |
| $B_o$ | 1.4–1.9 | 1.05–1.15 |
| $\mu_o$ (live), cP | 0.5–1.5 | 10–80 |

---

## 2. Why Are PVT Correlations Needed? Their Nature and Requirements

### 2.1. What Is a Correlation in the PVT Context?
A correlation is an empirical (experience-derived, not strictly derived from first principles of physics) mathematical expression that links a hard-to-measure PVT property ($Y$) to easily measurable parameters ($X_1, X_2, \dots$):
$$
Y = f(X_1, X_2, \dots) + \varepsilon
$$
where $\varepsilon$ is the unavoidable approximation error.

> **Key Feature:** Correlations are not strictly derived from thermodynamic laws. They result from regression analysis of large datasets of laboratory PVT measurements across multiple fields. Essentially, they represent an "averaged portrait" of a specific oil type's behavior.

### 2.2. Why Are They Needed?
| Reason | Explanation |
| :--- | :--- |
| 1. Lack of bottomhole samples | During exploration or in low-rate wells, obtaining a representative bottomhole sample is technically impossible. |
| 2. High cost of PVT experiments | A full PVT analysis of one sample costs \$5,000–\$20,000 and takes 2–4 weeks. Correlations provide estimates instantly and free of charge. |
| 3. Need for rapid assessment | During operational analysis (e.g., deciding whether to run a pump tomorrow), waiting for the lab is not feasible. |
| 4. Large-scale project calculations | In reservoir simulators (Eclipse, tNavigator) for hundreds of wells and dozens of layers, it is physically impossible to have individual PVT data for every cell — correlations calibrated to 2–3 field samples are used instead. |

### 2.3. Statistical Nature of Correlations
- **Single-parameter** — e.g., viscosity dependence on API only for dead oil.
- **Multi-parameter** — Standing, Vasquez-Beggs use $R_s$, $\gamma_g$, $T$, $\text{API}$.
- **Statistical reality:** A correlation describes the center of the distribution (mean) but does not provide confidence intervals unless specified by the author. Data scatter around the curve can be substantial.
- *Real-world example:* For the same $\text{API} = 30^\circ$ and $R_s = 100$ m³/m³, different correlations yield $P_b$ from 120 to 210 atm. This scatter reflects the original dataset that authors "averaged" differently.

### 2.4. What Should Support Correlations? (Critical Section)
Simply taking a formula from a textbook and plugging in your numbers is a serious error. A correlation must be justified for your specific case.

#### 2.4.1. Laboratory Data from Your Field
No correlation replaces at least 2–3 PVT experiments on your own samples. These data are used for:
- Selecting the correlation (which gives the minimum error for your oils).
- `Tuning` — adjusting correlation coefficients to match your data points.
> **Rule:** A correlation without local calibration is guessing. With calibration, it becomes an engineering tool.

#### 2.4.2. Regional Affiliation
Oils from different basins have different dissolved gas compositions and polar components (resins, asphaltenes). Standing's correlation (California) performs poorly in the North Sea, which led to the development of Glasø. Russian oils (Western Siberia, Volga-Ural) are better described by VNIINeftekhim or Krylov correlations (adapted to local conditions).
> **Action:** Look for regional correlations in literature for your basin. If none exist, use a global one and tune it.

#### 2.4.3. Range Coverage
Extrapolating a correlation beyond its training range is strictly prohibited.
- Standing (1947) was built for $R_s < 1400$ scf/bbl. At $R_s = 2000$ scf/bbl, errors can exceed 50%.
- Petrosky-Farshad (1993) covers API $8–25^\circ$. At API $40^\circ$, it yields nonsensical results.
> Always verify the applicability table in the original publication.

---

## 3. Classification and Overview of Main Correlations

Correlations are grouped into generations:
1. **First generation (1940s–50s):** Simple, for undersaturated oils. *(Standing, Lasater)*
2. **Second generation (1970s–80s):** More accurate, account for fluid composition. *(Glasø, Vasquez-Beggs)*
3. **Third generation (1990s–present):** Global, wide-range applicability. *(Petrosky-Farshad, Dindoruk-Christman, Al-Marhoun)*

**Key correlations for calculation:**
- Bubble point & $R_s$: Standing, Vasquez-Beggs, Glasø.
- $B_o$: Standing, Glasø, Petrosky-Farshad.
- Viscosity: Beggs-Robinson, Kartoatmodjo-Schmidt.

---

## 4. Detailed Review of Key Correlations

### 4.1. Bubble Point Pressure $P_b$
| Correlation | Year | Dataset | Range | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Standing | 1947 | 105 samples, California | $13–60^\circ\text{API}$, $15–600$ scf/bbl | First universal correlation. Often used as a benchmark for light oils. |
| Glasø | 1980 | 45 samples, North Sea | $17–50^\circ\text{API}$ | Better captures oils rich in intermediate hydrocarbons. |
| Vasquez & Beggs | 1980 | $>6000$ samples, global | Split into $\text{API} \le 30$ and $> 30$ | Accounts for temperature and gas specific gravity effects. |
| Petrosky & Farshad | 1990 | 144 samples, Gulf of Mexico | $17–44^\circ\text{API}$ | High accuracy for medium and heavy oils. |

**General form** (Standing example):
$$
P_b = 18.2 \left( \frac{R_s}{\gamma_g} \right)^{0.83} \cdot 10^{\left(0.00091 T - 0.0125 \gamma_{\text{API}}\right)}
$$
where:
- $R_s$ — scf/bbl (or m³/m³),
- $\gamma_g$ — gas specific gravity (air = 1),
- $T$ — °F,
- $\gamma_{\text{API}}$ — API gravity.

### 4.2. Oil Formation Volume Factor $B_o$
- At $P \le P_b$: Standing, Glasø, Vasquez-Beggs express $B_o$ as a function of $R_s$, $\gamma_g$, $\gamma_{\text{API}}$, $T$.
- At $P > P_b$:
  $$B_o = B_{ob} \cdot \exp\left[c_o (P_b - P)\right]$$
  where $B_{ob}$ is $B_o$ at $P_b$.

**Example formula (Standing):**
$$
B_o = 0.972 + 0.000147 \left[ R_s \sqrt{\frac{\gamma_g}{\gamma_{\text{API}}}} + 1.25 T \right]^{1.175}
$$
*(in bbl/STB, $T$ in °F)*

---

## 5. Practical Algorithm: How to Choose a Correlation?

No "universal" correlation exists. Selection depends on:
1. **Region & geological history** — correlations are calibrated to specific basins. North Sea $\ne$ Western Siberia $\ne$ Venezuela.
2. **Oil type** — light ($>30^\circ\text{API}$), medium ($20–30$), heavy ($<20$), volatile, bituminous.
3. **Gas composition** — presence of CO₂, H₂S, N₂ significantly shifts $P_b$ and $\mu_o$. Most classical correlations assume hydrocarbon gas only.
4. **Parameter range** — extrapolation beyond the training dataset yields errors $>30\%$.
5. **Calculation purpose** — 10–15% error is acceptable for sensitivity analysis; $<5\%$ is required for separator or ESP design.

---

## 6. Conclusion and Warnings

**Summary:**
- Correlations are not a replacement for PVT experiments but tools for rapid assessment.
- Never apply a correlation "blindly". Validate it against 2–3 data points from your field.
- For design documentation (FEED, PDP), field-specific PVT or a tuned correlation is mandatory.

> 💡 **Golden Rule of Engineering:**  
> *"All models are wrong, but some are useful."* (George Box)  
> Correlations typically carry a 10–25% error. Factor this into your safety margins.
