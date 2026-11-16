# ROYAL SCOUT — STATISTICAL METHODOLOGY & MATHEMATICAL FORMULATION
## Deep-Dive Technical Specification | Rajasthan Royals SupeRR Selector Season 2

---

## 1. Philosophical Framework: Defining Cricket Pressure

Traditional cricket analytics often relies on static heuristic proxies to identify pressure situations:
- Arbitrary temporal cutoffs (e.g., overs 16–20 labeled "death overs").
- Fixed run rate thresholds (e.g., Required Run Rate $> 10.0$ RPO).
- Tournament stage labels (e.g., Playoff matches).

These heuristics fail because they ignore the dynamic, probabilistic state of a T20 match. A match where a team requires 30 runs from 30 balls with 9 wickets in hand is low pressure despite being in the "death overs." Conversely, an innings-one collapse where a team is 45/4 in the 8th over of a qualifier represents extreme existential pressure.

**ROYAL SCOUT** resolves this fundamental flaw by introducing a vectorized, delivery-by-delivery **Match Pressure Index (MPI)**, mapping every ball to a continuous jeopardy score:
$$P \in [0, 100]$$

---

## 2. Match Pressure Index (MPI) Mathematical Specification

The MPI engine processes each ball $i$ conditionally based on the match innings and contextual variables.

### 2.1 Innings 2: Target Chase Formulation

In a run chase, pressure is a direct function of current run-rate deficits, resource exhaustion, and game closeness:

$$P_{\text{inn2}}(i) = 0.35 \cdot P_{\text{RRR}}(i) + 0.25 \cdot P_{\text{WIH}}(i) + 0.20 \cdot P_{\text{Stage}}(i) + 0.20 \cdot P_{\text{Close}}(i) + \text{Bonus}_{\text{KO}}(i)$$

#### Component Formulations:

1. **Required Run Rate Pressure ($P_{\text{RRR}}$):**
   Let $R_{\text{req}}$ be runs required, and $B_{\text{rem}}$ be legal balls remaining. The Required Run Rate is $\text{RRR} = \frac{R_{\text{req}}}{B_{\text{rem}} / 6}$.
   $$P_{\text{RRR}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\text{RRR} - 6.0}{14.0 - 6.0} \times 100.0\right)\right)$$
   *Anchor points:* $\text{RRR} \le 6.0 \implies 0.0$; $\text{RRR} \ge 14.0 \implies 100.0$.

2. **Wickets in Hand Resource Pressure ($P_{\text{WIH}}$):**
   Let $W_{\text{down}}$ be current wickets lost ($0 \le W_{\text{down}} \le 10$).
   $$P_{\text{WIH}} = \min\left(100.0, \; \max\left(0.0, \; \frac{W_{\text{down}} - 2}{8 - 2} \times 100.0\right)\right)$$
   *Anchor points:* $\le 2$ wickets lost $\implies 0.0$; $\ge 8$ wickets lost $\implies 100.0$.

3. **Stage of Innings Pressure ($P_{\text{Stage}}$):**
   Let $O_{\text{elapsed}}$ be completed overs ($0 \le O_{\text{elapsed}} < 20$).
   $$P_{\text{Stage}} = \min\left(100.0, \; \max\left(0.0, \; \frac{O_{\text{elapsed}} - 6.0}{19.0 - 6.0} \times 100.0\right)\right)$$
   *Anchor points:* Powerplay ($O \le 6$) $\implies 0.0$; Final over ($O \ge 19$) $\implies 100.0$.

4. **Game Closeness Index ($P_{\text{Close}}$):**
   Evaluates how closely the Current Run Rate ($\text{CRR} = \frac{\text{Runs}}{O_{\text{elapsed}}}$) tracks the Required Run Rate:
   $$\Delta_{\text{rate}} = |\text{RRR} - \text{CRR}|$$
   $$P_{\text{Close}} = \max\left(0.0, \; 100.0 - 15.0 \cdot \Delta_{\text{rate}}\right)$$
   *When RRR and CRR are neck-and-neck ($\Delta_{\text{rate}} \approx 0$), $P_{\text{Close}} \to 100.0$.*

5. **Knockout Match Leverage Bonus ($\text{Bonus}_{\text{KO}}$):**
   $$\text{Bonus}_{\text{KO}} = \begin{cases} +5.0 & \text{if Match Type } \in \{\text{Playoff, Qualifier, Eliminator, Semi-Final, Final}\} \\ 0.0 & \text{if Regular League Match} \end{cases}$$

---

### 2.2 Innings 1: Par-Setting Under Risk Formulation

In the first innings, there is no explicit target or required rate. Pressure represents the trade-off between maximizing totals and preserving wickets under collapse risk:

$$P_{\text{inn1}}(i) = 0.40 \cdot P_{\text{Death}}(i) + 0.35 \cdot P_{\text{Collapse}}(i) + 0.15 \cdot P_{\text{CRR}}(i) + 3.0 + \text{Bonus}_{\text{KO}}(i)$$

#### Component Formulations:

1. **Death Over Acceleration Pressure ($P_{\text{Death}}$):**
   $$P_{\text{Death}} = \begin{cases} 0.0 & \text{if } O_{\text{elapsed}} < 12.0 \\ \frac{O_{\text{elapsed}} - 12.0}{20.0 - 12.0} \times 100.0 & \text{if } 12.0 \le O_{\text{elapsed}} \le 20.0 \end{cases}$$

2. **Top-Order Collapse & Resource Risk ($P_{\text{Collapse}}$):**
   A collapse is defined by wickets lost relative to balls bowled:
   $$\text{Expected Wickets Lost}(O) = \frac{O_{\text{elapsed}}}{20.0} \times 6.5$$
   $$\text{Collapse Deficit} = W_{\text{down}} - \text{Expected Wickets Lost}(O)$$
   $$P_{\text{Collapse}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\text{Collapse Deficit}}{3.5} \times 100.0\right)\right)$$

3. **Current Scoring Rate Par Pressure ($P_{\text{CRR}}$):**
   Penalizes below-par scoring rates where batters must take disproportionate risks:
   $$P_{\text{CRR}} = \min\left(100.0, \; \max\left(0.0, \; \frac{9.0 - \text{CRR}}{9.0 - 5.5} \times 100.0\right)\right)$$

4. **Super Overs:**
   Every legal delivery or extra in a Super Over is assigned an absolute pressure score:
   $$P_{\text{SuperOver}} = 100.0$$

---

### 2.3 The High-Pressure Crucible: Empirical Threshold ($P \ge 70.0$)

Across the entire dataset of 200,999 deliveries:
- **Mean MPI ($\mu_{\text{MPI}}$):** 39.42
- **Median MPI:** 36.18
- **Standard Deviation ($\sigma_{\text{MPI}}$):** 21.08
- **80th Percentile:** 58.40
- **90th Percentile:** 70.00

Deliveries with $P \ge 70.0$ represent the top **9.16%** of high-stakes moments (**18,414 deliveries across 883 matches**). This threshold provides sufficient statistical power while isolating truly game-defining crises.

---

## 3. Empirical Bayesian Shrinkage Framework

### 3.1 The Small-Sample Dilemma in Cricket

In high-pressure cricket, sample sizes are inherently constrained. A player may face only 45 high-pressure deliveries in a two-season window. A raw strike rate of 250.0 based on 40 balls (e.g., 100 runs) could be driven by two fortunate edges or dropped catches. Unadjusted rankings would be dominated by low-sample flukes.

Conversely, a player who has faced 250 high-pressure deliveries with a strike rate of 210.0 has demonstrated robust, repeatable excellence.

### 3.2 Mathematical Derivation of Shrinkage

We model individual player ability $\theta_j$ under an empirical Bayes hierarchical formulation. 

Let $y_j$ be the observed performance metric (e.g., strike rate), $N_j$ be the number of sample exposures (balls faced or legal balls bowled), and $\mu$ be the overall cohort prior mean:

$$\hat{\theta}_j = \lambda_j \cdot y_j + (1 - \lambda_j) \cdot \mu$$

The shrinkage coefficient $\lambda_j \in [0, 1]$ represents the signal-to-noise ratio:

$$\lambda_j = \frac{N_j}{N_j + K}$$

Where $K$ is the prior pseudo-sample size determining shrinkage velocity.

#### Asymmetric Prior Formulations:

1. **Batting Strike Rate Shrinkage ($K_B = 25$ balls):**
   - Cohort High-Pressure Prior Mean: $\mu_{\text{SR}} = 142.34$
   - Shrinkage Formula:
     $$\lambda_{\text{bat}} = \frac{N_{\text{balls}}}{N_{\text{balls}} + 25.0}$$
     $$\text{SR}_{\text{adj}} = \lambda_{\text{bat}} \cdot \text{SR}_{\text{obs}} + (1 - \lambda_{\text{bat}}) \cdot 142.34$$
   - *Example (Rinku Singh, $N=167, \text{SR}=225.75$):*
     $$\lambda_{\text{bat}} = \frac{167}{167 + 25} = \frac{167}{192} \approx 0.8698$$
     $$\text{SR}_{\text{adj}} = 0.8698 \times 225.75 + 0.1302 \times 142.34 = 196.36 + 18.53 = 214.89$$

2. **Bowling Economy Rate Shrinkage ($K_{BW} = 35$ balls / 5.83 overs):**
   - Bowling sample variance is higher due to extra-dependent runs and boundary volatility; thus, a stronger prior $K_{BW} = 35.0$ is applied.
   - Cohort High-Pressure Prior Mean: $\mu_{\text{Econ}} = 8.85$ RPO
   - Shrinkage Formula:
     $$\lambda_{\text{bowl}} = \frac{N_{\text{balls}}}{N_{\text{balls}} + 35.0}$$
     $$\text{Econ}_{\text{adj}} = \lambda_{\text{bowl}} \cdot \text{Econ}_{\text{obs}} + (1 - \lambda_{\text{bowl}}) \cdot 8.85$$
   - *Example (Rashid Khan, $N=249, \text{Econ}=6.87$):*
     $$\lambda_{\text{bowl}} = \frac{249}{249 + 35} = \frac{249}{284} \approx 0.8768$$
     $$\text{Econ}_{\text{adj}} = 0.8768 \times 6.87 + 0.1232 \times 8.85 = 6.02 + 1.09 = 7.11$$

---

## 4. Player Reliability Composite Index

### 4.1 Batter Pressure-Performance Rating ($R_{\text{bat}}$)

The final batter rating synthesizes four critical dimensions of high-pressure execution:

$$R_{\text{bat}} = 0.40 \cdot S_{\text{SR\_adj}} + 0.25 \cdot S_{\Delta\text{SR}} + 0.15 \cdot S_{\text{Bound}} + 0.20 \cdot S_{\text{Dot\_Inv}}$$

Where:
1. **$S_{\text{SR\_adj}}$ (Adjusted Strike Rate Score):**
   $$S_{\text{SR\_adj}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\text{SR}_{\text{adj}} - 100.0}{220.0 - 100.0} \times 100.0\right)\right)$$
2. **$S_{\Delta\text{SR}}$ (Elevated Output / Differential Score):**
   $$\Delta\text{SR} = \text{SR}_{\text{pressure}} - \text{SR}_{\text{normal}}$$
   $$S_{\Delta\text{SR}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\Delta\text{SR} - (-20.0)}{70.0 - (-20.0)} \times 100.0\right)\right)$$
3. **$S_{\text{Bound}}$ (Boundary Generation Rate):**
   $$S_{\text{Bound}} = \min\left(100.0, \; \frac{\text{Boundary \%}}{38.0} \times 100.0\right)$$
4. **$S_{\text{Dot\_Inv}}$ (Dot Ball Minimization / Running Efficiency):**
   $$S_{\text{Dot\_Inv}} = \max\left(0.0, \; \frac{45.0 - \text{Dot \%}}{45.0 - 20.0} \times 100.0\right)$$

---

### 4.2 Bowler Pressure-Performance Rating ($R_{\text{bowl}}$)

The bowler rating rewards boundary denial, economy control relative to normal baselines, and attacking wicket-taking under pressure:

$$R_{\text{bowl}} = 0.35 \cdot S_{\text{Econ\_adj}} + 0.25 \cdot S_{\Delta\text{Econ}} + 0.20 \cdot S_{\text{Dot}} + 0.20 \cdot S_{\text{Wkt}}$$

Where:
1. **$S_{\text{Econ\_adj}}$ (Adjusted Economy Score — Inverted):**
   $$S_{\text{Econ\_adj}} = \min\left(100.0, \; \max\left(0.0, \; \frac{11.5 - \text{Econ}_{\text{adj}}}{11.5 - 6.0} \times 100.0\right)\right)$$
2. **$S_{\Delta\text{Econ}}$ (Suppression Differential Score):**
   $$\Delta\text{Econ} = \text{Econ}_{\text{normal}} - \text{Econ}_{\text{pressure}}$$
   $$S_{\Delta\text{Econ}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\Delta\text{Econ} - (-2.0)}{2.0 - (-2.0)} \times 100.0\right)\right)$$
3. **$S_{\text{Dot}}$ (Dot Ball Mastery):**
   $$S_{\text{Dot}} = \min\left(100.0, \; \max\left(0.0, \; \frac{\text{Dot \%} - 25.0}{50.0 - 25.0} \times 100.0\right)\right)$$
4. **$S_{\text{Wkt}}$ (Wicket Strike Rate & Threat):**
   $$S_{\text{Wkt}} = \min\left(100.0, \; \max\left(0.0, \; \frac{22.0 - \text{Bowling SR}}{22.0 - 7.5} \times 100.0\right)\right)$$

---

## 5. Qualification Thresholds & Statistical Significance

To ensure rigorous sample power, the following minimum inclusion thresholds were applied:

| Role | Minimum High-Pressure Exposure | Eligible Cohort Size | Top 10 Selection Percentage |
|:---|:---:|:---:|:---:|
| **Batters** | $\ge 40$ deliveries faced ($P \ge 70.0$) | 118 players | Top 8.47% |
| **Bowlers** | $\ge 24$ legal overs / 144 balls ($P \ge 70.0$) | 92 players | Top 10.87% |

Statistical validation confirms that with $N \ge 40$ balls for batters, the standard error of the estimated strike rate is $\text{SE} \le 12.8$ points. For bowlers with $N \ge 144$ legal balls, the standard error of economy is $\text{SE} \le 0.42$ RPO.

---

## 6. Cricket Accounting Rules & Law Conformity

In full adherence to official Marylebone Cricket Club (MCC) Laws of Cricket and ICC Playing Conditions:
- **Batter Balls Faced:** Excludes Wides. Includes No-Balls and all legal deliveries.
- **Bowler Legal Balls:** Excludes both Wides and No-Balls. Overs are reported as $O.B$ (e.g., 41.3 overs = $41 \times 6 + 3 = 249$ legal balls).
- **Bowler Runs Conceded:** Includes off-the-bat runs, wides, and no-balls. Excludes byes and leg-byes.
- **Bowler-Credited Wickets:** Includes bowled, caught, lbw, stumped, and hit wicket. Strictly excludes run-outs, obstructing the field, and retired out.
- **Batting Average:** Computed as $\text{Runs} / \text{Dismissals}$. If dismissals $= 0$, average is capped at total runs scored.

---

## 7. Automated Audit & Reconciliation Proofs

The analytical pipeline is backed by an automated reconciliation suite (`scripts/validate_results.py` and `scripts/test_bug_fix.py`):
1. **SSOT Invariance:** Confirms $0$ variance across `top_10_batters.csv`, SQLite cache, React UI state, and ReportLab PDF tables.
2. **Formula Soundness:** Validates all Bayesian shrinkage bounds ($\lambda_j \in [0, 1]$) and composite scores ($R \in [0, 100]$).
3. **Extreme Anomaly Justification:** Validates why Rinku Singh scores 97.01 (historical anomaly: $+73.07$ SR elevation, $125.67$ average, $37.13\%$ boundary rate under pressure) without algorithmic distortion.

---

**ROYAL SCOUT Analytics Team**  
*Rajasthan Royals SupeRR Selector Season 2 Documentation*

