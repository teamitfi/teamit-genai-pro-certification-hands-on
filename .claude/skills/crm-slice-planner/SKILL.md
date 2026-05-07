---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use when starting accounts, contacts, pipeline, activity, or renewal-risk work.
  Output TASK.md and DONE_CRITERIA.md with tests and non-goals.
---

## Inputs

- `PRODUCT_BRIEF.md` — product boundary, non-goals, privacy constraints, acceptance evidence
- `BUILD_PLAN.md` — slice order and per-slice scope rules
- `DOMAIN_MODEL.md` — entity definitions, forbidden fields, empty-state contracts
- Current user request

## Workflow

1. **Read the product boundary.** Open `PRODUCT_BRIEF.md`. Confirm the request maps to one of the five core workflows (customers / next-contact / opportunities / renewals / trust). If it doesn't, stop and ask.
2. **Identify the smallest valuable slice.** Check `BUILD_PLAN.md` for the next unstarted slice. Scope to exactly that slice — do not combine slices or skip ahead.
3. **List files likely to change.** Name each file in `src/routes/`, `tests/`, and `seeds/` that the slice will touch. If the list spans more than one slice boundary, stop and ask.
4. **Check domain constraints.** Open `DOMAIN_MODEL.md`. Confirm every field the slice will use is declared there. Flag any field not in the model — it must be added to the model in a separate commit before the slice proceeds. Explicitly confirm that `Opportunity.value` and `invoiceAmount` will not appear in any API response or UI component.
5. **Define tests and review evidence.** For each route or feature, list: (a) the Vitest spec file and the happy-path case, (b) the boundary/edge case (e.g., empty collection returns `[]` not `null`), and (c) the forbidden-field check. All five acceptance criteria from `PRODUCT_BRIEF.md` § Acceptance Evidence must be addressable by the tests listed.
6. **State non-goals.** Name at least two things this slice will not do. Pull from the non-goals in `PRODUCT_BRIEF.md` and the slice boundary in `BUILD_PLAN.md` (e.g., "does not implement write operations", "does not add UI layer").
7. **Write outputs.** Produce `TASK.md` and `DONE_CRITERIA.md` as described below.

## Constraints

- Stay within the product boundary. Every decision must be traceable to `PRODUCT_BRIEF.md` or `BUILD_PLAN.md`.
- Never invent fields outside `DOMAIN_MODEL.md`. New fields require a model update first.
- One slice at a time. Stop if the request would touch more than one slice's file set.
- No production data. All examples and seed rows use synthetic data from `seeds/`.
- Contact PII (`email`, `phone`) must not appear in list views — only on detail endpoints.

## Output

### TASK.md

```
# Task: <slice name>

## What we're building
<one paragraph tying the slice to one of the five core-workflow questions>

## Files to change
- src/routes/<resource>.ts  — <what changes>
- tests/<resource>.spec.ts  — <what tests to add>
- seeds/<file>.json         — <any seed additions needed>

## Domain fields in scope
<table: field | type | source in DOMAIN_MODEL.md>

## Non-goals
- <item 1>
- <item 2>
```

### DONE_CRITERIA.md

```
# Done Criteria: <slice name>

A slice is done when ALL of the following are true:

1. `npm test` passes — <name the specific spec file and key cases>
2. `npm run typecheck` passes — no type errors introduced
3. `npm run lint` passes — no lint errors introduced
4. No forbidden field appears in any API response — `Opportunity.value` and `invoiceAmount` absent from all route handlers and test assertions
5. Empty-collection endpoints return `[]`, not `null`
6. `crm-reviewer` (or human reviewer) has returned `accept` or all `revise` findings are resolved
7. `HANDOFF.md` updated with completed work and next recommended slice
```

## Stop conditions

- Request spans more than the named files for one slice → stop and ask which slice to do first.
- Brief doesn't cover the user's request → stop and ask whether a product-boundary change is needed.
- A required field is not in `DOMAIN_MODEL.md` → stop and ask for a model-update commit before continuing.
- User asks to add a write operation → stop and confirm; `PRODUCT_BRIEF.md` § Non-Goals prohibits agent-initiated writes to production configs.
