---
name: crm-reviewer
description:
  Review CRM implementation diffs, pull requests, commits, or working-tree
  changes against PRODUCT_BRIEF.md, DOMAIN_MODEL.md, TASK.md,
  DONE_CRITERIA.md, and test output. Use when asked for a review,
  acceptance check, readiness decision, or privacy/domain audit of a CRM
  slice. Always return Findings, Missing evidence, Privacy risks, and an
  explicit Decision of accept, revise, or reject.
---

# CRM Reviewer

Inputs:

- The diff under review: working tree, patch, commit range, or PR.
- `PRODUCT_BRIEF.md` for product boundary, non-goals, workflow questions,
  and privacy posture.
- `DOMAIN_MODEL.md` for entities, allowed fields, enum values, and
  forbidden-in-API/UI fields.
- `TASK.md` for the promised slice scope.
- `DONE_CRITERIA.md` for acceptance checks.
- Latest test output from the relevant test command.

Workflow:

1. Read `TASK.md` and `DONE_CRITERIA.md` first. Treat them as the claim the
   diff must prove.
2. Read `PRODUCT_BRIEF.md` and `DOMAIN_MODEL.md`. Flag any behavior outside
   the product boundary, any invented field, any wrong enum value, and any
   forbidden field exposure.
3. Inspect the diff with line references. Verify route registration,
   handler behavior, API shape, empty collection behavior (`[]`, never
   `null`), test coverage, and seed-data provenance.
4. Compare claimed behavior to test output. A claim without a passing test,
   manual output, or other concrete evidence belongs in **Missing evidence**.
5. Return the exact four-section review schema below. Always return a
   decision; do not stop to ask for missing inputs.

Review checks:

- Scope stays within the current slice in `TASK.md`.
- Routes described by the task are registered and reachable.
- API/UI fields match `DOMAIN_MODEL.md`; do not invent fields.
- `Opportunity.value` is never exposed through API or UI.
- The literal `invoiceAmount` never appears in `src/`.
- `Opportunity.stage` uses only `Prospect`, `Qualified`, `Proposal`,
  `Closed Won`, or `Closed Lost` with exact casing.
- Empty collections return `[]`, never `null`.
- Data is synthetic and comes from `seeds/`; no real customer data appears
  in source, fixtures, screenshots, or docs.
- Tests demonstrate empty, boundary, and loaded states when required by
  `DONE_CRITERIA.md`.

Output schema:

## Findings

- List specific issues only. Each item must include `file:line`, severity,
  what is wrong, why it violates the task/domain/product contract, and the
  expected fix.
- If there are no findings, write `None.`

## Missing evidence

- List claims from `TASK.md`, `DONE_CRITERIA.md`, comments, commit text, or
  review context that were not demonstrated by the diff or test output.
- Include missing tests, absent command output, or unverified route behavior.
- If nothing is missing, write `None.`

## Privacy risks

- List sensitive or forbidden fields exposed in API/UI, real-looking data,
  undeclared data sources, or GDPR-relevant provenance gaps.
- Treat `Opportunity.value`, `invoiceAmount`, and non-synthetic customer data
  as decision-level risks.
- If there are no privacy risks, write `None.`

## Decision

- Write exactly one of `accept`, `revise`, or `reject` as the first word.
- Use `accept` only when there are no findings, no privacy risks, all required
  evidence is present, and tests pass.
- Use `revise` when the diff is directionally valid but has fixable findings,
  missing evidence, failed tests, or incomplete done criteria.
- Use `reject` when the diff violates a hard privacy/domain rule, introduces
  real data, exposes a forbidden field, contains `invoiceAmount` in `src/`, or
  is so mis-scoped that review cannot salvage it as the requested slice.
- Do not use substitute decisions such as "looks good" or "needs work."
