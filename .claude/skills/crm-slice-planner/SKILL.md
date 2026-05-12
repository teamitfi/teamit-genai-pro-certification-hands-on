---
name: crm-slice-planner
description:
  Plan a single build-plan slice and write TASK.md + DONE_CRITERIA.md so the
  implementing session starts with a concrete checklist. Use before touching
  any src/ or tests/ files for a new slice. Stops immediately if the request
  spans more than one slice or conflicts with DOMAIN_MODEL.md or the product
  boundary.
---

Inputs:

- `BUILD_PLAN.md` — slice order and scope descriptions
- `DOMAIN_MODEL.md` — authoritative field and enum definitions
- `PRODUCT_BRIEF.md` — product boundary, privacy rules, done-definition
- The user's slice request (a slice name or number, optionally with a focus area)

Workflow:

1. Read `BUILD_PLAN.md` and identify the slice the user is requesting. Confirm
   the slice name and number in one sentence before continuing.
2. Check that no earlier slice is unfinished: if `HANDOFF.md` references an
   open slice that is not the one being planned, surface it and stop.
3. Read `DOMAIN_MODEL.md` and list every entity and field the slice will touch.
   Flag any field the slice appears to need that is not yet in the model —
   those require a `crm-domain-modeler` pass before this plan can proceed.
4. Read `PRODUCT_BRIEF.md` and check the request against the hard-stop
   non-goals and forbidden fields. Note any privacy constraint that applies to
   the slice's API shape.
5. Break the slice into ordered implementation tasks. Each task must be:
   - Scoped to a single file or a logically atomic change.
   - Testable in isolation or as part of `npm test`.
   - Sequenced so no task depends on a later one.
6. For each task, name the file(s) affected and describe the change in one
   sentence. Do not write code.
7. Derive the done criteria directly from `PRODUCT_BRIEF.md`'s slice-done
   definition plus any slice-specific API contracts (endpoint paths, response
   shapes, empty-state rules, forbidden fields).
8. Write `TASK.md` and `DONE_CRITERIA.md` to the repo root.

Constraints:

- Plan exactly one slice per invocation. "Slice N + a bit of slice N+1" is not
  allowed — stop and ask the user to choose one.
- Do not invent fields. If a required field is missing from `DOMAIN_MODEL.md`,
  stop and say which field needs to be added there first.
- `Opportunity.value` must never appear in a planned API response shape.
  Flag it and stop if the slice design would expose it.
- `invoiceAmount` does not exist in this domain. Any plan that references it
  must be rejected outright.
- Empty collections return `[]`, never `null`. State this explicitly in
  `DONE_CRITERIA.md` for every collection endpoint in the slice.
- Do not plan writes for the Renewal-Risk Dashboard slice (Slice 4).

Output:

**`TASK.md`** — implementation checklist for the slice, written as a markdown
task list (`- [ ]`). Each item is one file-scoped change. Ordered from
data-layer to route to test. Include a section header with the slice name and
number.

**`DONE_CRITERIA.md`** — acceptance checklist, also `- [ ]` items, derived
from `PRODUCT_BRIEF.md` plus slice-specific contracts. Must include at minimum:

- `npm test` passes with no failures
- No forbidden field (`Opportunity.value`, `invoiceAmount`) in any response
- All collection endpoints return `[]` for empty (never `null`)
- `crm-handoff-writer` skill has been run and `HANDOFF.md` is written

Stop conditions:

- The request names more than one slice → stop and ask the user to pick one.
- An unfinished prior slice is detected in `HANDOFF.md` → stop and name it.
- A required field is absent from `DOMAIN_MODEL.md` → stop and name the field
  and the entity it belongs to.
- The slice design would expose a forbidden field → stop and describe the
  violation.
- `BUILD_PLAN.md` does not exist or is unreadable → stop and ask the user to
  check the repo state.
