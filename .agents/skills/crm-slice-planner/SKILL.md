---
name: crm-slice-planner
description:
  Plan exactly one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use before implementation when choosing or scoping the next slice. Output
  TASK.md and DONE_CRITERIA.md with the slice goal, bounded tasks, tests,
  acceptance evidence, and explicit non-goals.
---

## Inputs

- `PRODUCT_BRIEF.md`, `BUILD_PLAN.md`
- Existing `TASK.md`, `DONE_CRITERIA.md`, `HANDOFF.md`
- User-named slice, if any

## Workflow

1. Read `PRODUCT_BRIEF.md` for the product boundary.
2. Identify the smallest valuable slice using `BUILD_PLAN.md`.
3. List files likely to change.
4. Define required tests and acceptance evidence.
5. State explicit non-goals.
6. Write `TASK.md` and `DONE_CRITERIA.md`.

## Constraints

- One slice only; no milestone mixing or skipping unmet dependencies.
- Stay inside the brief: no platform creep, AI, integrations, invoicing, production data, forbidden fields, or undeclared enums.
- Outputs must be concise and runnable without chat context.

## Output

- `TASK.md`: slice name, core question, user story, tasks, likely files, tests, non-goals.
- `DONE_CRITERIA.md`: acceptance criteria, required tests, UI checks, product-boundary checks, handoff evidence.
- Final response: planned slice or stop condition.

## Stop Conditions

- Multi-slice request.
- Brief conflict.
- Missing domain field, enum, or concept.
- Next slice cannot be determined.
