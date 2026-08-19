# Find Your Politics - Methodology Review V2

Date: 2026-08-20
Status: SECOND INTERNAL REVIEW AFTER V2 REBUILD

## Executive conclusion

V2 resolves the critical mismatch identified in the first audit. The live scoring architecture now materially matches the written methodology: Policy Alignment and Voting Fit are separate calculations, large conflicts receive a separate nonlinear penalty, dealbreaker sensitivity is kept separate from substantive political position, cross-dimensional questions can score more than one dimension, and intentionally weaker stress questions receive reduced evidentiary weight.

The model is now suitable for closed beta testing and external factual review. It should still **not** be described as scientifically validated. The most accurate public description is an **internally source-audited experimental model**.

## 1. Review of the original critical findings

### 1.1 Policy Alignment vs Voting Fit
**First audit:** critical mismatch. Both labels effectively displayed the same underlying score.

**V2:** resolved.

Policy Alignment uses weighted linear similarity across measured policy dimensions.

Voting Fit starts from Policy Alignment and subtracts a nonlinear conflict penalty only when user-party distance exceeds 60 points on a dimension. Sensitivity to that conflict is kept separate from ideological direction.

**Status: PASS**

### 1.2 Secondary dimensions
**First audit:** high severity. The live answer recorder ignored `secondary_dimension`.

**V2:** resolved structurally by allowing an answer to contain a per-dimension `scores` map. Q058 and Q059 now create distinct evidence on their two relevant dimensions rather than forcing one number onto both.

**Status: PASS**

### 1.3 Dealbreaker probes
**First audit:** high/critical. Q051-Q055 were either excluded or would have contaminated ideological coordinates if activated.

**V2:** resolved. These questions now populate a separate 0-1 dealbreaker sensitivity. They do not change `social_values`, `eu_integration`, `climate_cost_sensitivity`, `asylum_migration` or `surveillance_powers` positions.

The adaptive selector can ask a maximum of two such probes after sufficient policy evidence when one of the user's closest practical matches is far away on the relevant dimension.

**Status: PASS**

### 1.4 Low-weight and consistency questions
**First audit:** Q060 was labelled low-weight/consistency but scored normally.

**V2:** resolved. The second review caught a remaining edge case: making Q060 non-scoring meant the older challenge selector could still choose it and waste a question. Q060 was therefore rewritten into a clean, low-weight state-scope consistency question instead.

**Status: PASS AFTER SECOND-REVIEW FIX**

## 2. Scoring invariant review

The V2 formulas were checked across the full single-dimension distance range 0-200 and representative sensitivity/priority values.

Verified invariants:
- Policy Alignment remains between 0 and 100.
- Voting Fit remains between 0 and 100.
- Voting Fit never exceeds Policy Alignment.
- Conflict penalty is exactly zero when distance is 60 or less.
- Conflict penalty grows with distance above 60 and with dealbreaker sensitivity.
- Total conflict penalty is capped at 30 points.

These are implementation checks, not statistical validation of the chosen constants.

**Status: PASS**

## 3. Question-bank review after rewriting

The post-rebuild bank has:
- 40 standard policy questions
- 13 deliberately lower-weight or stress-test policy questions
- 5 separate dealbreaker probes
- 2 cross-dimensional policy questions
- 0 known redesign blockers

The lower-weight group is not considered invalid. It is explicitly downweighted because those questions contain a hypothetical, a broader construct or a secondary trade-off that makes them weaker evidence than a direct policy question.

Materially rewritten questions include Q002, Q004, Q005, Q015, Q017, Q023, Q025, Q031, Q032, Q034, Q040, Q043, Q046, Q048, Q050 and Q060.

**Status: PASS FOR INTERNAL METHODOLOGY**

## 4. Party-position source audit

V2 has a 216-coordinate party matrix: 27 policy dimensions × 8 parliamentary parties.

Each coordinate has:
- a numeric directional score
- a confidence class (H/M/L)
- an official source key

The score bands are interpretive rather than empirical:
- -100 to -75: very strong toward pole A
- -74 to -35: clearly toward A
- -34 to +34: mixed/moderate/ambiguous
- +35 to +74: clearly toward B
- +75 to +100: very strong toward B

The V2 audit materially revised several coordinates where current 2026 official material no longer supported the older model. Examples include Socialdemokraterna on nuclear power, Moderaterna on skilled migration, Centerpartiet on citizenship requirements and Liberalerna on profit in schools/welfare.

**Status: PASS AS INTERNAL SOURCE AUDIT**

## 5. Source hygiene review

The first source matrix correctly recorded source families but several deep-link aliases were fragile or had moved on party websites. A V2.1 source-pack correction file now replaces those unstable paths with current official pages or current national policy indexes.

The source model intentionally prefers a current stable official index or 2026 manifesto over a dead deep link. A URL correction alone does not alter a party coordinate; substantive score changes require substantive current evidence.

**Status: PASS, with pre-release link check still recommended**

## 6. Remaining low-confidence party coordinates

The current matrix contains a small set of **L** confidence cells. These are not necessarily wrong; they indicate that current public material is less direct, the policy is internally mixed, or the axis is broader than the evidence.

Priority external-review targets include several Sverigedemokraterna positions on sickness insurance, labour-market flexibility, public ownership, housing supply, healthcare choice, welfare profit and state scope, plus Kristdemokraterna on public ownership and rent regulation.

These should be among the first coordinates sent to the relevant parties for factual challenge.

**Status: OPEN EXTERNAL REVIEW TARGET**

## 7. Remaining conceptual limitations

### Composite dimensions
Five dimensions remain the least conceptually clean:
- `tax_wealth_property`
- `welfare_private_profit`
- `social_values`
- `state_scope`
- `housing_supply`

They remain useful, but a single scalar can hide meaningful distinctions. Example: a party can support school choice while opposing profit extraction, or support property taxation while opposing a broad wealth tax.

### Numerical constants
The following values are modelling choices, not empirically estimated parameters:
- priority multiplier 2x
- baseline conflict sensitivity 0.18
- priority conflict sensitivity 0.35
- dealbreaker levels 0 / 0.35 / 0.70 / 1.0
- conflict threshold 60
- conflict multiplier 18
- total conflict cap 30
- most individual answer coordinates such as -35, +55, +90

They are coherent and monotonic, but have not been calibrated on voter-behaviour data.

### Confidence score
The confidence number measures evidence coverage and separation in this model. It is not a statistical probability that the top party is the user's objectively correct choice.

### No psychometric validation
The question bank has not undergone formal survey-methodology testing such as cognitive interviews, test-retest reliability, factor analysis or a representative-sample validation study.

### Party claims vs enacted behaviour
The model intentionally codes what parties publicly and officially say they want. It does not systematically score parliamentary voting history, coalition compromises or predictions of what parties would actually implement in government.

These are product design choices and should remain explicit.

## 8. Technical integration review

Load order now places the V2 question patch and V2 scoring engine after the base application and before the comparison/enhancement layers. The later UX layers therefore call the V2 versions of `vector()`, `ranking()`, `renderQuestion()` and `results()`.

The comparison and result-stability features intentionally use `fit`, which in V2 means Voting Fit.

One technical weakness remains: the application still relies on several post-load wrappers and MutationObservers inherited from V1.3. This is workable but less robust than one integrated application module, particularly on mobile.

**Status: PASS FOR BETA, REFACTOR RECOMMENDED BEFORE LONG-TERM MAINTENANCE**

## 9. Publication assessment

### Safe claims now
- Independent experimental political self-discovery tool.
- Internally source-audited against current publicly available official party material.
- Same coding framework applied to all eight parliamentary parties.
- Policy Alignment and Voting Fit are genuinely separate calculations.
- User answers remain local to the browser.
- Exact scores are modelling judgements, not objective truths.

### Claims to avoid
- Scientifically validated.
- Unbiased in an absolute sense.
- Statistically proven to predict voting preference.
- Every coordinate has been verified or approved by the relevant party.
- A score difference of one or two points is meaningfully precise.

## 10. Remaining publication gates

Before broad media outreach:

- [x] Make live scoring match written methodology.
- [x] Separate Policy Alignment and Voting Fit.
- [x] Implement separate dealbreaker sensitivity.
- [x] Implement cross-dimensional answer scoring.
- [x] Downweight weaker stress/hypothetical questions.
- [x] Resolve all known redesign-blocker questions.
- [x] Build a 216-coordinate source/confidence matrix.
- [x] Recalibrate the party model against current 2026 official material.
- [x] Update public methodology language to match actual implementation.
- [ ] Run a final automated/manual link check immediately before release freeze.
- [ ] Perform a fresh full mobile/desktop regression test of the V2 build.
- [ ] Invite all eight parliamentary parties to challenge factual representation under the same evidence rule.
- [ ] Ideally obtain at least one independent political-science/survey-method review.
- [ ] Freeze and version the exact model/source matrix used for public launch.

## Final assessment

**V1.3:** thoughtful product concept with a real methodology/implementation mismatch.

**V2.0 audit candidate:** coherent internally, source-audited, substantially more defensible, and suitable for beta/external factual review.

It is not scientifically validated, and it should not present itself that way. The strongest credibility position is transparency: show the formulas, show the source rules, acknowledge modelling judgement, invite correction, and keep a visible version history.
