---
name: crm-slice-planner
description: |
  Plan a single vertical slice of the CRM (Accounts, Pipeline, Activity,
  Renewal-Risk, Handoff) before any code is written. Use at the start of a
  slice or when scope feels fuzzy. Output TASK.md and DONE_CRITERIA.md at
  repo root: what this slice covers, the routes/files it touches, the seed
  rows it needs, and the workflow-anchored tests that prove it done.
---

Inputs:

- `BUILD_PLAN.md` (slice order — do not skip ahead)
- `PRODUCT_BRIEF.md` (the five workflow questions, privacy boundary)
- `DOMAIN_MODEL.md` (entities, enums, forbidden-in-UI fields)
- the slice the user named (or the next one in `BUILD_PLAN.md`)

Workflow:

1. Identify the slice and the workflow question it answers (one of the five
   in `PRODUCT_BRIEF.md`).
2. List the entities and fields it touches. Cross-check `DOMAIN_MODEL.md` —
   if a field is missing, stop and route to `crm-domain-modeler`.
3. Name the routes and files it adds or changes (`src/routes/<x>.go`,
   templates, seeds). One file per resource.
4. Name the fixture rows the slice needs: happy path, empty state, one
   boundary case. If new rows are needed, route to `crm-test-fixtures`.
5. Write workflow-anchored tests: each test name maps to the workflow
   question, not to an internal module. Cover empty, one-row, loaded.
6. Write privacy assertions the slice must hold (no `Opportunity.value` in
   the DOM, no `invoiceAmount` anywhere in `src/`, `[]` not `null` for
   empty collections).

Constraints:

- One slice at a time. If the request spans more than one slice in
  `BUILD_PLAN.md`, stop and ask which to plan.
- Do not invent fields, enum values, or routes outside `DOMAIN_MODEL.md`
  and `BUILD_PLAN.md`.
- Tests are named after the workflow question, not the file or function.
- Keep both files under 50 lines each. Bullets, not prose.

Output:

- `TASK.md` at repo root — slice name, workflow question, entities/fields,
  files to touch, fixture rows needed, out-of-scope list.
- `DONE_CRITERIA.md` at repo root — bullet list of acceptance checks: the
  e2e test that drives the slice, the empty/boundary/loaded states, the
  privacy assertions, and "demo-able against seeded data with no manual
  setup."

Stop conditions:

- The requested slice is out of order vs. `BUILD_PLAN.md` → stop and ask.
- A required field is not in `DOMAIN_MODEL.md` → stop and route to
  `crm-domain-modeler`.
- The slice would need real customer data or a forbidden field to make
  sense → stop and surface the conflict with `PRODUCT_BRIEF.md`.
