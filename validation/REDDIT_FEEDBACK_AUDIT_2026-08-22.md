# Reddit feedback audit - 2026-08-22

This document separates confirmed product decisions from issues that still require evidence before changing the political model.

## Confirmed and implemented

### Priority topics can fail to appear early
Classification: valid adaptive-selection bug.
Reason: the original first-batch selector allowed any still-unmeasured discovery dimension to compete with selected priority dimensions, so a selected priority such as Climate & energy was not guaranteed to appear.
Fix: selected priority areas are now guaranteed at least one sampled dimension during the early policy-question phase before the selector returns to normal adaptive behavior.

### Live current-match notifications
Classification: philosophy conflict / anchoring risk.
Reason: naming or signaling the current leading party during the blind test can influence later answers and contradicts the project's principle of discovering the user's views before showing parties.
Fix: live match-movement insight banners are suppressed during the blind quiz. Party comparison remains available after results.

### Neutral / none-fit answer is too easy to miss
Classification: valid UX issue.
Fix: a separate light-grey, full-width button now appears below the scored answers: "I'm not sure / none of these fit" / "Jag är osäker / inget av dessa passar", with an explicit note that it does not affect the result.
Decision: no free-text political answer is added because unscored free text would create the impression that it affects the model when it does not. Free-text feedback may be added later as question feedback, not as an answer.

### Blue outline can look like a recommended answer
Classification: valid perception/accessibility issue.
Fix: mouse/touch answers no longer receive a blue default focus treatment. Keyboard focus remains visible with a neutral dark outline.

### Accidental rapid answering after a question changes
Classification: plausible interaction bug.
Fix: a short 350ms input guard prevents an immediate second tap/click from answering a newly rendered question by accident.

### Mobile comparison cards are hard to remember
Classification: valid mobile UX issue.
Fix: every comparison cell now includes a small user/party label.

### Comparison dimensions are too terse
Classification: valid comprehension issue.
Fix: each comparison dimension now includes a short narrative explaining what the axis actually means instead of showing only labels such as "Tax" or "Integration".

### Save result/profile
Classification: useful feature request consistent with privacy model.
Fix: users can save a locally generated PNG containing their political profile and strongest practical match. Generation happens in-browser; nothing is uploaded.

## Deliberate scope decision

### Non-Riksdag parties
Decision: do not add them to the current model.
Reason: the product is intentionally scoped to the eight parliamentary parties. Adding small parties would require the same source audit and 27-dimension coding while materially increasing complexity for a small share of users. This is not treated as a missing feature for the 2026 release.

## Audit next - do not change blindly

### Beginner mode may still be too difficult
Status: open.
Need: review question wording and beginner explainers against the beginner promise. Do not reduce political nuance without identifying specific comprehension problems.

### Absolute vs relative wording
Status: open and important.
Need: audit all questions that use terms such as higher, lower, more, less, generous, stricter or today's level and verify that the reference point is explicit enough for the user to answer consistently.

### Language-switch/rendering issue
Status: open.
Need: obtain/reproduce the exact UI state that does not update when switching language before changing code.

### Reviewing answers after results
Status: feature candidate.
Need: design a review screen that does not accidentally alter state or imply post-hoc score manipulation.

## Principle for future Reddit feedback

Each item should be classified as one of:
1. confirmed bug,
2. valid methodology criticism,
3. wording/comprehension improvement,
4. UX/feature request,
5. political disagreement that does not itself require a model change.

Changes to scoring, party coordinates or political dimensions should require stronger evidence than UI/copy fixes.
