# Find Your Politics - Methodology Audit

Date: 2026-08-20
Status: INTERNAL VALIDATION - NOT YET A CLAIM OF SCIENTIFIC VALIDATION

## Executive finding

The conceptual model is strong enough to continue developing, but the live implementation currently does not fully implement the written methodology. Party-source validation should continue, but the scoring implementation should be corrected before public launch or media outreach.

## 1. Critical implementation gaps

### 1.1 Policy Alignment and Voting Fit are not yet two different calculations
The current `ranking()` function calculates one weighted vector-similarity score and returns it as `fit`.

The model documentation describes:
- Policy Alignment = weighted policy similarity
- Voting Fit = Policy Alignment minus nonlinear conflict penalties
- Explicit party veto = separate practical-shortlist layer

The live scoring code currently implements the first and the veto shortlist, but not the nonlinear conflict-penalty layer.

**Severity: critical**

### 1.2 Secondary dimensions are ignored by the live answer recorder
Question data supports `secondary_dimension`, including cross-dimensional questions such as Q058 and Q059. The live answer handler currently stores only:

`{score: x.score, dimension: q.primary_dimension}`

Therefore a question marked as cross-dimensional does not currently update its secondary dimension.

**Severity: high**

### 1.3 Dealbreaker-probe questions are not integrated into the normal adaptive engine
Q051-Q055 are tagged `dealbreaker_probe`, but `chooseNext()` excludes questions with that tag. Their intended secondary dealbreaker dimensions are also not implemented in the stored user vector.

This means the question bank contains dealbreaker logic that the ordinary test does not currently use.

**Severity: high**

### 1.4 If Q051-Q055 were scored as ordinary questions, their current numeric values would be conceptually wrong
These questions ask **how much a disagreement matters**, not **which substantive side the voter takes**. Their numeric values therefore should not update `social_values`, `eu_integration`, `climate_cost_sensitivity`, `asylum_migration`, or `surveillance_powers` as ordinary ideological coordinates.

They need a separate conviction/dealbreaker field.

**Severity: critical if activated without redesign**

### 1.5 `low_weight` and `consistency_check` tags are not respected by scoring
Q060 is explicitly tagged `low_weight` and `consistency_check`, but the current vector calculation averages it like an ordinary question on `state_scope`.

**Severity: medium-high**

## 2. Question-bank audit

### Overall assessment
The bank is generally thoughtful, balanced and much stronger than a simple agree/disagree political quiz. The strongest parts are:
- four-position answers instead of binary choices
- separation of asylum and skilled migration
- repeated measurement on important dimensions
- use of trade-off/reality-check questions
- accessible Swedish and English wording
- explicit `I don't know / skip`

However, some questions either bundle multiple constructs or use a hypothetical that can measure something adjacent to the named dimension.

### PASS / broadly sound
Q001, Q003, Q006, Q007, Q009-Q014, Q016, Q018-Q022, Q024, Q026-Q030, Q033, Q035-Q038, Q041-Q042, Q044-Q045, Q047, Q049, Q056-Q057.

These may still receive language polishing, but their core construct is defensible.

### REVIEW - wording or construct contamination

#### Q002 - Taxes versus public services
Primary dimension: `tax_work_income`
Problem: measures general tax/spending preference, not specifically tax on work.
Recommendation: either map to a broader tax-size dimension or rewrite explicitly around tax on employment income.

#### Q004 - Wealth / inheritance / property / large fortunes
Primary dimension: `tax_wealth_property`
Problem: combines several tax bases voters and parties often treat differently. A party can oppose wealth tax but support higher property tax, or vice versa.
Recommendation: split into at least two measures or narrow wording to one defensible combined concept.

#### Q005 - Inequality versus growth
Primary dimension: `inequality_focus`
Problem: the hypothetical assumes a growth cost from reducing inequality. Acceptable as a reality-check, but should not be the sole evidence on the dimension.
Recommendation: keep, but never let it dominate the dimension.

#### Q008 - Unions / collective bargaining / individual flexibility
Primary dimension: `labour_flexibility`
Problem: collective bargaining power and statutory employment protection are related but distinct.
Recommendation: keep as supporting evidence, not sole measure.

#### Q015 - Deportation after serious crime
Primary dimension: `crime_punishment`
Problem: strongly measures immigration/citizenship consequences in addition to punishment severity.
Recommendation: make it cross-dimensional (`crime_punishment` + `asylum_migration`/integration-related dimension) or replace with a pure sentencing question.

#### Q017 - Asylum and family reunification
Primary dimension: `asylum_migration`
Problem: parties can hold different positions on asylum intake and family reunification.
Recommendation: acceptable as discovery, but add/sustain separate discriminator evidence before assigning high confidence.

#### Q023 - Housing supply
Primary dimension: `housing_supply`
Problem: answer D includes market prices, which overlaps `rent_regulation`.
Recommendation: remove rent/pricing language from this question.

#### Q025 - Market rents and construction
Primary dimension: `rent_regulation`
Problem: hypothetical assumes more construction. Fine as a trade-off probe, but should not be treated as factual certainty.
Recommendation: wording should say "if you were convinced" or "suppose" to make the hypothetical explicit.

#### Q031 - Climate cost sensitivity
Primary dimension: `climate_cost_sensitivity`
Problem: answer C mixes technology preference with cost sensitivity.
Recommendation: rewrite so all answers differ only on willingness to accept cost for faster emissions cuts.

#### Q032 - Fuel prices if economists judge them efficient
Primary dimension: `climate_cost_sensitivity`
Problem: "if economists judged" introduces an authority cue.
Recommendation: use a neutral hypothetical without invoking experts.

#### Q034 - Nuclear financing
Primary dimension: `nuclear_energy`
Problem: a strongly pro-nuclear voter who opposes state subsidies could score as anti-nuclear.
Recommendation: make this cross-dimensional (`nuclear_energy` + `state_scope`/market_economy) or use it as a non-scoring stress test.

#### Q039 - NATO goals versus tax/spending trade-offs
Primary dimension: `defence_spending`
Problem: also captures tax/spending preference.
Recommendation: acceptable as supporting evidence, not sole measure.

#### Q040 - Government role in social/moral choices
Primary dimension: `social_values`
Problem: conflates progressive/conservative content with activist/libertarian government style.
Recommendation: consider splitting `social_values` into substantive social liberalism and government-value activism, or make the axis definition explicit.

#### Q043 - Government action under weak evidence
Primary dimension: `state_scope`
Problem: primarily measures epistemic/risk tolerance, not government scope.
Recommendation: remove from scoring or reframe around a concrete public/private responsibility trade-off.

#### Q046 - Work-based residence after rejected asylum
Primary dimension: `asylum_migration`
Problem: also measures rule-of-law finality and labour migration/establishment.
Recommendation: use as supporting evidence only.

#### Q048 - Municipal housing approvals against local opposition
Primary dimension: `housing_supply`
Problem: also measures local democracy/centralisation.
Recommendation: either cross-dimension or narrow to planning restrictions.

#### Q050 - Choice versus segregation
Primary dimension: `education_choice`
Problem: assumes a causal effect in the hypothetical. Valid as a stress test, but phrase explicitly as a hypothetical trade-off.

### REDESIGN REQUIRED

#### Q051-Q055 - Dealbreaker probes
These are not substantive-position questions. They should populate a separate `dealbreaker_sensitivity` structure and must not change the user's ideological coordinate on the underlying issue.

#### Q058 - Tax swap
Primary: `tax_work_income`; Secondary: `tax_wealth_property`
Problem: current live code ignores the secondary dimension. Also one answer logically implies movement in opposite directions on two axes, which cannot be represented by one shared score.
Recommendation: use separate score fields per dimension, e.g. `scores:{tax_work_income:+70,tax_wealth_property:-70}`.

#### Q059 - Generosity plus contribution qualification
Primary: `welfare_qualification`; Secondary: `unemployment_security`
Problem: explicitly designed to separate two dimensions but the current one-number format cannot represent them cleanly. Answer D scoring is especially ambiguous.
Recommendation: use per-dimension scores or make the question non-scoring and use it as a consistency diagnostic.

#### Q060 - Meta government philosophy
Primary: `state_scope`
Problem: bundles inequality, competence, economic freedom, security, institutions and minimal government. The data labels it low-weight/consistency-check, but live scoring does not honor that.
Recommendation: make it non-scoring or truly low-weight.

## 3. Numerical answer scale

The current answer values (examples: -90, -35, +55, +95) should be described as **ordinal political positions mapped to an approximate continuous scale**, not empirically measured psychological distances.

Recommended public methodology language:

> Answers are placed on directional policy scales. The numerical distance is a modelling device used to compare relative positions; it should not be interpreted as a scientific measurement of how many "units" apart two political views are.

Recommended score bands for party coding:
- -100 to -75: very strong position toward pole A
- -74 to -35: clearly toward pole A
- -34 to +34: mixed, moderate or ambiguous
- +35 to +74: clearly toward pole B
- +75 to +100: very strong position toward pole B

Exact values inside a band should be used sparingly and only when evidence supports relative strength.

## 4. First source-validation findings

### Socialdemokraterna - nuclear
Current model: +10
Current official 2026 position: supports extending existing reactors, power uprates, and allowing new nuclear on existing nuclear sites, while preferring technology-neutral state support.
Audit view: +10 is probably too close to neutral. Re-code likely in the clearly pro-new-nuclear band, but below M/KD/L.
Status: REVISE

### Moderaterna - skilled migration
Current model: +20
Current official position: wants minimal asylum migration while improving recruitment of highly qualified labour, including exemptions from tighter salary requirements for shortage occupations.
Audit view: +20 appears too low. Direction should be distinctly positive on skilled migration.
Status: REVISE

### Centerpartiet - citizenship requirements
Current model: -30
Current 2026 position: supports the general eight-year residence proposal, Swedish/civics tests and a maintenance requirement, while proposing a five-year fast track for strongly established taxpayers.
Audit view: -30 is no longer defensible as an "accessible citizenship" position. The party now appears mixed-to-moderately stricter, with a contribution-based liberal exception.
Status: REVISE

### Vänsterpartiet - nuclear
Current model: -70
Current official 2026 position: explicitly rejects nuclear expansion and supports a careful phase-out combined with renewables.
Audit view: direction is correct; strength may need to move further toward the anti-expansion pole.
Status: REVIEW STRENGTH

### Miljöpartiet - nuclear
Current model: -100
Current official 2026 position: no new nuclear and a fully renewable long-term system, but explicitly says it does not seek a politically forced rapid shutdown of existing reactors.
Audit view: direction is correct; -100 may overstate the immediate shutdown component depending on how the axis is defined.
Status: REVIEW AXIS / STRENGTH

### Liberalerna - nuclear
Current model: +95
Current 2026 manifesto: explicitly calls for more nuclear and state guarantees for reactors and other long-term investments.
Audit view: strongly supported.
Status: HIGH CONFIDENCE

### Liberalerna - skilled migration
Current model: +85
Current 2026 position: explicitly wants easier recruitment of international talent, fewer competence deportations, startup visas, better post-study routes and exemptions in shortage occupations.
Audit view: strongly supported.
Status: HIGH CONFIDENCE

### Kristdemokraterna - tax on work
Current model: +60
Current 2026 position: explicitly prioritises lower income tax, "hälften kvar", fewer people paying state income tax, and broader work-tax reductions.
Audit view: direction strongly supported; exact strength should be compared with M/L/C before final coding.
Status: HIGH DIRECTION CONFIDENCE

## 5. Source hierarchy

Use in this order:
1. Official national 2026 election manifesto / election platform
2. Current official national party policy page updated in 2026
3. Current official national budget proposal, motion or policy programme
4. Official party leader / authorised spokesperson statement
5. Older official national material only where no current source exists

Do not use newspaper interpretation as the primary source for a coordinate when an official primary source exists.

Coalition agreements and government policy must not automatically be treated as identical to a party's preferred position. The model should code what the party itself publicly says it wants.

## 6. Current official source pack - first pass

Socialdemokraterna:
- https://www.socialdemokraterna.se/val-2026
- https://www.socialdemokraterna.se/var-politik/a-till-o/skatter
- https://www.socialdemokraterna.se/var-politik/a-till-o/karnkraft

Moderaterna:
- https://moderaterna.se/var-politik/
- https://moderaterna.se/var-politik/invandring/
- https://moderaterna.se/var-politik/karnkraft-2/

Sverigedemokraterna:
- https://val2026.sd.se/

Vänsterpartiet:
- https://www.vansterpartiet.se/val2026/
- https://www.vansterpartiet.se/var-politik/politik-a-o/skattepolitik/
- https://www.vansterpartiet.se/var-politik/politik-a-o/karnkraft/
- https://www.vansterpartiet.se/var-politik/politik-a-o/eu/
- https://www.vansterpartiet.se/var-politik/politik-a-o/arbetskraftsinvandring/

Centerpartiet:
- https://val2026.centerpartiet.se/
- https://www.centerpartiet.se/centerpartiets-politik/valmanifest-2026
- https://www.centerpartiet.se/nyheter/arkiv-2026/2026-03-27-snabbspar-till-medborgarskap

Kristdemokraterna:
- https://kristdemokraterna.se/var-politik/politik-a-till-o/invandring
- https://kristdemokraterna.se/var-politik/politik-a-till-o/inkomstskatter
- https://kristdemokraterna.se/var-politik/politik-a-till-o/energi
- https://kristdemokraterna.se/arkiv/nyheter/2026/2026-07-28-sverigedrommen---4-hornstenar-for-ett-starkare-sverige

Miljöpartiet:
- https://www.mp.se/politik/politiskt-handlingsprogram-2026/
- https://www.mp.se/politik/gron-ekonomi/
- https://www.mp.se/politik/klimat/
- https://www.mp.se/politik/karnkraft/
- https://www.mp.se/politik/migration-och-lika-ratt/

Liberalerna:
- https://www.liberalerna.se/nyheter/liberalerna-presenterar-valmanifest-2026-for-din-frihet
- https://www.liberalerna.se/category/valmanifest-2026
- https://www.liberalerna.se/valmanifest-2026/3-ett-samhalle-dar-anstrangning-lonar-sig
- https://www.liberalerna.se/politik/arbetskraftsinvandring
- https://www.liberalerna.se/politik/skatter

## 7. Publication gate

Before calling the model "source-validated" publicly:

- [ ] Fix Policy Alignment vs Voting Fit implementation
- [ ] Implement or remove conflict penalties from public claims
- [ ] Implement separate dealbreaker sensitivity
- [ ] Implement per-dimension scoring for cross-dimensional questions or remove them from scoring
- [ ] Honor low-weight/non-scoring diagnostic tags
- [ ] Review/redesign flagged questions
- [ ] Trace every one of the 216 party coordinates to at least one current official source
- [ ] Assign confidence level to every coordinate
- [ ] Invite all eight parliamentary parties to flag factual inaccuracies, using the same process for every party
- [ ] Freeze and version the source matrix used for the public election build
