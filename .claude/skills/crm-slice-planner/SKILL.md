---
name: crm-slice-planner
description: |
  Plan the next CRM slice from BUILD_PLAN.md into concrete tasks and done
  criteria. Use when the user says "let's plan the next CRM slice", "let's
  plan the Accounts & Contacts slice", "plan the Opportunity Pipeline slice",
  or "plan the [slice name] slice". Produces TASK.md and DONE_CRITERIA.md at
  the repo root so the next implementation session starts with a clear scope.
---

Inputs:

- `BUILD_PLAN.md` — canonical slice order and per-slice description
- `PRODUCT_BRIEF.md` — acceptance evidence language and privacy constraints
- `DOMAIN_MODEL.md` — entity definitions, field names, enums, and forbidden-in-API fields
- `HANDOFF.md` (optional) — previous session's completion notes for continuity

Workflow:

1. Read `BUILD_PLAN.md` and identify the target slice by name. Confirm the slice exists in the document's ordered list before proceeding.
2. Read `DOMAIN_MODEL.md` and list every entity and field that the slice will touch. Note which fields are forbidden in API responses (`Opportunity.value`, `invoiceAmount`).
3. Enumerate one task per deliverable: one task per route file that must be created or modified, one task per seed/fixture change, and one task per test file. Keep tasks atomic — each task maps to exactly one file.
4. Cross-check every field referenced in the task list against `DOMAIN_MODEL.md`. Any field not present in the model must be flagged, not added silently.
5. Cross-check the task list against `PRODUCT_BRIEF.md` privacy constraints. Reject any task that would expose `Opportunity.value` or introduce a field named `invoiceAmount`.
6. Write `TASK.md` at the repo root with the numbered task list, the target slice name, and a one-sentence scope statement derived from `BUILD_PLAN.md`.
7. Write `DONE_CRITERIA.md` at the repo root with the three acceptance conditions from `PRODUCT_BRIEF.md`: (a) `npm test` exits 0 with no skipped tests, (b) a reviewer sub-agent returns `accept` against `TASK.md` and `DONE_CRITERIA.md`, (c) no forbidden fields appear in any API response, UI component, or seed row introduced in the slice.

Constraints:

- Stay within `DOMAIN_MODEL.md`. Every field and entity used in tasks must already exist in the model; any new field requires updating `DOMAIN_MODEL.md` in a reviewed commit before planning proceeds.
- Use synthetic data only. Tasks must reference `seeds/` as the sole data source; do not reference real customer names, emails, or contract values.
- No UI without a brief update. Do not produce tasks that scaffold a frontend unless `PRODUCT_BRIEF.md` has been updated to include UI scope.
- One slice at a time. If the request names more than one slice, stop and ask the user to choose one.
- Empty collections must return `[]`, never `null`. Any route task that returns a collection must note this contract.
- Stage enum values (`Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost`) are fixed; do not invent new values or treat comparison as case-insensitive.

Output:

- `TASK.md` at the repo root — numbered task list with slice name, scope statement, and one task per route/fixture/test file.
- `DONE_CRITERIA.md` at the repo root — the three acceptance conditions from `PRODUCT_BRIEF.md`, written verbatim, plus the slice name and a checklist for the reviewer sub-agent.

Stop conditions:

- Slice not in `BUILD_PLAN.md` → stop and list the valid slice names for the user to choose from.
- Field referenced in a proposed task is not in `DOMAIN_MODEL.md` → stop, name the missing field, and ask whether to update the model first.
- Task would expose `Opportunity.value` or introduce `invoiceAmount` → stop and surface the privacy violation with a reference to `PRODUCT_BRIEF.md`.
- `TASK.md` or `DONE_CRITERIA.md` already exists at the repo root and would be overwritten → stop and ask the user whether to replace or rename the existing file.
- The request spans more than one slice → stop and ask the user to name a single slice.
