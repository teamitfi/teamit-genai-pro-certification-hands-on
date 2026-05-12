---
name: crm-reviewer
description:
  Review a diff or completed slice against the CRM acceptance criteria.
  Use when a slice is ready to merge, after an implementer sub-agent finishes,
  or before declaring DONE_CRITERIA.md satisfied.
  Output Findings, Missing evidence, Privacy risks, and an explicit accept/revise/reject Decision.
---

## Inputs

- `PRODUCT_BRIEF.md` — product boundary, non-goals, privacy constraints, acceptance criteria
- `DOMAIN_MODEL.md` — entity definitions, forbidden fields, empty-state contracts
- `TASK.md` — what the slice set out to build and which files it was allowed to touch
- `DONE_CRITERIA.md` — the specific checklist the slice must satisfy
- Test output (`npm test` result) — pass/fail evidence
- The diff (git diff, PR diff, or inline code) to be reviewed

## Workflow

1. **Read context.** Open `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, `TASK.md`, and `DONE_CRITERIA.md` before reading any code. If any of these files is missing or empty, stop and report which is absent — a review without them is invalid.

2. **Check scope.** Confirm the diff touches only the files listed in `TASK.md § Files to change`. Flag any file outside that set as an out-of-scope finding.

3. **Check forbidden fields.** Scan every changed file for `invoiceAmount` and `Opportunity.value`. Either present in an API response or UI component is an automatic `reject` — record under Privacy risks and do not proceed to a softer decision.

4. **Check empty-state contracts.** Verify that every collection endpoint returns `[]` on empty, not `null`. Flag any violation as a finding.

5. **Check contact PII exposure.** Confirm `email` and `phone` appear only on detail endpoints, not in list responses or test assertions that mirror a list shape.

6. **Check test coverage.** For each item in `DONE_CRITERIA.md`, confirm there is a passing test. Missing coverage goes under Missing evidence. The `npm test` result must be green — a failing test is an automatic `revise`.

7. **Check typecheck and lint.** If the evidence file includes `npm run typecheck` and `npm run lint` output, confirm both pass. If absent, flag under Missing evidence.

8. **Write the four output sections** (see Output below) and close with an explicit Decision.

## Constraints

- Never return "looks good" or "needs work" — the Decision must be exactly `accept`, `revise`, or `reject`.
- `reject` when: a forbidden field is present in the diff, or a test suite is not provided at all.
- `revise` when: findings exist but are correctable without a scope change (missing test, lint failure, PII in list view, out-of-scope file).
- `accept` when: all DONE_CRITERIA.md items are satisfied, no forbidden fields, tests green, and no findings remain.
- Do not invent criteria not traceable to `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, `TASK.md`, or `DONE_CRITERIA.md`.
- Review the diff as written — do not infer intent. If a line is ambiguous, flag it; do not assume it is safe.

## Output

```
# CRM Review — <slice name>

## Findings
<numbered list of specific issues, each with file path and line number if applicable.
  If none: "None.">

## Missing evidence
<numbered list of items claimed in DONE_CRITERIA.md but not demonstrated by test output or diff.
  If none: "None.">

## Privacy risks
<numbered list of forbidden-field exposures or PII violations found in the diff.
  Always explicitly state whether invoiceAmount and Opportunity.value appear.
  If none: "invoiceAmount: absent. Opportunity.value: absent. No other privacy risks found.">

## Decision
accept | revise | reject

Reason: <one sentence tying the decision to the highest-severity finding, or confirming all criteria met.>
```

## Stop conditions

- `TASK.md` or `DONE_CRITERIA.md` is missing → stop; report "Review invalid: <file> not found. Run crm-slice-planner first."
- `PRODUCT_BRIEF.md` or `DOMAIN_MODEL.md` is missing → stop; report "Review invalid: upstream context missing."
- No diff or code provided → stop and ask the user to paste or reference the diff.
- Forbidden field found → record under Privacy risks and set Decision to `reject` immediately; do not continue looking for softer findings to offset it.
