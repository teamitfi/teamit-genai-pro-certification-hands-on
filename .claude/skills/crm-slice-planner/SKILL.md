---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md into
  an ordered task list and acceptance checklist. Outputs TASK.md and
  DONE_CRITERIA.md. Use when starting a new session or when the user names
  a slice to work on.
---

Inputs: `BUILD_PLAN.md`, `DOMAIN_MODEL.md`, `PRODUCT_BRIEF.md`, user's slice request.

Workflow:

1. Read `BUILD_PLAN.md` and identify the target slice.
3. Confirm the chosen slice with the user before continuing.
4. Read `DOMAIN_MODEL.md` — verify every field the slice needs exists. If not, stop.
5. Check `PRODUCT_BRIEF.md` for forbidden fields; flag conflicts before writing tasks.
6. Write tasks in dependency order. Each task = one atomic unit (one route, one component, one test file).
7. Write done criteria from the five acceptance items in `PRODUCT_BRIEF.md`, made slice-specific.

Constraints:

- One slice only. No tasks from later slices.
- Tasks reference only fields in `DOMAIN_MODEL.md`.
- Include at least one test task covering the core data path.
- `Opportunity.value` and `invoiceAmount` must not appear in any route, component, or seed task.
- Schema-first: define routes/validation before UI tasks.

Output:

`TASK.md` — numbered tasks in dependency order. Each: one-line action, file(s) to touch, domain fields used.

`DONE_CRITERIA.md` — five slice-specific checkboxes:
  1. Screenshot/recording of the UI flow on synthetic data
  2. Named tests passing (file + what it covers)
  3. Grep confirms no real customer data in `src/` or `seeds/`
  4. `DOMAIN_MODEL.md` updated for any new fields
  5. `HANDOFF.md` written by `crm-handoff-writer`

Stop conditions:

- Request spans multiple slices → ask user to pick one.
- Slice needs an undeclared field → name it, direct user to `crm-domain-modeler` first.
- No slice named → list the five slices from `BUILD_PLAN.md`, ask which to plan.
- Task would expose a forbidden field → surface the conflict, write nothing.
