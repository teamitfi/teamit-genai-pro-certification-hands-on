---
name: crm-slice-planner
description:
  Plan one BUILD_PLAN.md slice. Reads project docs, outputs TASK.md and
  DONE_CRITERIA.md. Stops if the request spans more than one slice or
  requires a field not in DOMAIN_MODEL.md.
---

*Lab S1.3 build target.*

## Inputs

- `BUILD_PLAN.md`
- `PRODUCT_BRIEF.md`
- `DOMAIN_MODEL.md`
- The user's slice request

## Workflow

1. Read all inputs.
2. Confirm the request maps to exactly one slice in `BUILD_PLAN.md`.
3. List routes needed: method, path, response fields.
4. Check every field against `DOMAIN_MODEL.md`.
5. Define the test cases: happy path, edge cases, empty state.
6. State what the slice does *not* include (non-goals).

## Constraints

- One slice per run.
- No fields outside `DOMAIN_MODEL.md`.
- `Opportunity.value` and `invoiceAmount` must not appear in routes or tests.
- Seeds come from `seeds/` only.

## Output

- `TASK.md` at repo root.
- `DONE_CRITERIA.md` at repo root.

## Stop conditions

- Request spans more than one slice.
- Required field missing from `DOMAIN_MODEL.md` — route to `crm-domain-modeler` first.
