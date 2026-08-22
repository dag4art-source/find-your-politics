# Construct-purity review - 2026-08-22

## Scope
This review follows the Reddit reference-point audit and examines four questions that were not safe to fix with simple comparative wording alone: Q004, Q010, Q011 and Q024.

The goal is not to make each political dimension philosophically perfect. It is to make each individual question measure one coherent construct as closely as possible while preserving the current V2 dimensions and party-coordinate model.

## Q004 - Tax on large accumulated assets
Dimension: `tax_wealth_property`
Model anchor: more tax on wealth/property/capital <-> lower tax on wealth/property/capital.

### Problem
The existing question grouped expensive property and very large fortunes, while its wording mixed broad tax-level preferences with undefined relative language. The dimension itself is intentionally composite, so pretending this is a precise single-tax instrument would be misleading.

### Decision
Retain the composite dimension, keep the existing lower V2 weight (0.8), and make the question explicitly a broad directional estimate of the **overall tax burden on large accumulated assets compared with today's system**.

The explainer now says different asset taxes can be designed differently. This reduces false precision rather than hiding the composite nature of the dimension.

Scoring unchanged.

## Q010 - Unemployment insurance
Dimension: `unemployment_security`
Model anchor: more generous unemployment insurance <-> stronger work incentive / less generous insurance.

### Problem
The old answer scale mixed three separate policy levers:
- replacement level,
- duration,
- activity requirements.

A respondent might support generous income replacement together with strict job-search requirements, making the old options difficult to answer consistently.

### Decision
Narrow Q010 to one primary construct: **how much previous income unemployment insurance should replace for someone who has worked and then loses their job**.

The explainer explicitly says job-search requirements are a separate issue. The high end still mentions the work-incentive logic because that is part of the existing model anchor, but the scored scale is now primarily about replacement generosity.

Scoring unchanged.

## Q011 - Sickness insurance
Dimension: `sickness_social_insurance`
Model anchor: more generous/easier access <-> stricter eligibility/faster return to work.

### Problem
The dimension itself combines income protection, eligibility and return-to-work orientation. The old question additionally mixed rehabilitation, time limits and generosity in ways that made some answer combinations difficult to interpret.

### Decision
Keep the composite dimension, but frame the question around one coherent policy trade-off: **income protection during medically justified inability to work versus stricter eligibility and return-to-work requirements when work may be possible**.

The answer scale now follows that single trade-off consistently. It no longer independently varies time limits, rehabilitation and benefit generosity across different options.

Scoring unchanged.

## Q024 - Rent regulation
Dimension: `rent_regulation`
Model anchor: stronger regulated rents <-> more market-based rents.

### Problem
The old scale partly measured the rent-setting principle and partly measured expected effects on construction. Housing supply already has its own dimension and Q025 separately tests the construction-versus-rent trade-off.

### Decision
Make Q024 a clean measure of the **rent-setting principle itself**:
- strong regulated/collective rent setting,
- mostly regulated with more differentiation,
- more market-responsive with tenant protection,
- mostly market-determined.

The explainer explicitly states that effects on housing construction are tested separately.

Scoring unchanged.

## Result
All four questions now have cleaner internal constructs without changing:
- dimension assignment,
- score direction,
- score values,
- party coordinates,
- V2 weighting.

This is a wording/measurement-quality correction, not a recalibration of the political model.

## Remaining methodological limitation
`tax_wealth_property` and `sickness_social_insurance` remain composite dimensions. That is acceptable for the current experimental model, but it should remain documented as a limitation rather than described as a psychometrically pure scale.