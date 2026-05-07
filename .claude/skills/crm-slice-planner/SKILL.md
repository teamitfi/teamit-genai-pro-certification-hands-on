# Skill: crm-slice-planner

Plan one vertical slice of the CRM. Outputs `TASK.md` and `DONE_CRITERIA.md` for the slice. Stops immediately if the request spans more than one slice.

## When to use

Invoke this skill at the start of every slice before writing any code. Do not skip it.

## Inputs

The agent invoking this skill must provide:
- Which slice number (1–5) is being planned
- A short description of what the user wants to build or change

## Pre-flight checks

Before planning, the agent must verify:

1. **Read `PRODUCT_BRIEF.md`** — confirm the request is within the product boundary. If it is out of scope, stop and explain why.
2. **Read `DOMAIN_MODEL.md`** — confirm every field the slice touches is already declared. If a new field is needed, stop and tell the user to update `DOMAIN_MODEL.md` first (reviewed commit required before any code).
3. **Read `BUILD_PLAN.md`** — confirm the requested slice is the next slice in order. If a previous slice is incomplete, stop and say which slice must be finished first.

## Slice scope guard

If the request would touch more than one slice from `BUILD_PLAN.md`, stop immediately:

> "This request spans slices N and M. Plan and implement one slice at a time. Which slice do you want to start with?"

Do not attempt a partial plan that covers part of two slices.

## Slice reference

| # | Name | Core question answered | Seed file | Test file |
|---|------|----------------------|-----------|-----------|
| 1 | Accounts & Contacts | Who are our customers? | `seeds/accounts.json` | `tests/accounts.spec.ts` |
| 2 | Opportunity Pipeline | Which opportunities are moving? | `seeds/opportunities.json` | `tests/opportunities.spec.ts` |
| 3 | Activity Timeline | Who should we contact next? | `seeds/activities.json` | `tests/activities.spec.ts` |
| 4 | Renewal-Risk Dashboard | Which renewals are at risk? | — (derives from accounts + activities) | `tests/renewal-risk.spec.ts` |
| 5 | Handoff polish | What changed, and can we trust it? | — | — |

## Forbidden field check

Before outputting any plan, scan the planned API responses and confirm that neither of the following appears:

- `Opportunity.value`
- `invoiceAmount`

If either would appear, reject the plan and explain the privacy rule.

## Outputs

Write two files to the repo root:

### TASK.md

```markdown
# Slice <N>: <Name>

## Goal
<One sentence: which product question this slice answers.>

## Files to create or modify
- `<path>` — <why>

## API contract
<List each endpoint: method, path, request shape, response shape. Reference DOMAIN_MODEL.md field names exactly. Mark any field omitted from responses due to forbidden-field rules.>

## Seed data
<What fixtures are needed and which file they go in. If crm-test-fixtures is needed, say so.>

## Tests
<What scenarios tests/*.spec.ts must cover. Include at least one empty-collection case returning [] not null.>

## Dev-loop commands to run before declaring done
- npm test
- npm run lint
- npm run typecheck
```

### DONE_CRITERIA.md

```markdown
# Done Criteria — Slice <N>: <Name>

A slice is done when ALL of the following are true:

- [ ] The product question "<question>" can be answered using only the new endpoints.
- [ ] `npm test` passes with no skipped tests.
- [ ] `npm run lint` exits 0.
- [ ] `npm run typecheck` exits 0.
- [ ] No forbidden field (`Opportunity.value`, `invoiceAmount`) appears in any API response or test fixture.
- [ ] Empty collections return `[]`, not `null`.
- [ ] All `Opportunity.stage` values used in code and fixtures match the case-sensitive enum exactly.
- [ ] `DOMAIN_MODEL.md` was not changed by this slice (or, if it was, the change was reviewed and committed separately before any code).
- [ ] Seed data is synthetic only — no real customer, contact, or financial data.
- [ ] <Any slice-specific criterion the planner identified.>
```

## Domain rules to enforce in every plan

- `Opportunity.stage` enum values are case-sensitive: `Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost`. Flag any deviation.
- Empty collections → `[]` not `null`.
- `seeds/` is the only allowed data source. No external APIs, no production data.
- New fields require a `DOMAIN_MODEL.md` update committed and reviewed before any code.

## What this skill does NOT do

- It does not write code.
- It does not update `DOMAIN_MODEL.md` — that requires the `crm-domain-modeler` skill.
- It does not generate seed fixtures — that requires the `crm-test-fixtures` skill.
- It does not review diffs — that requires the `crm-reviewer` skill.
