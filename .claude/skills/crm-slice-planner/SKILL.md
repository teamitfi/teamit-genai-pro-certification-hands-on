---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use when starting accounts, contacts, pipeline, activity, or renewal-risk work.
  Output TASK.md and DONE_CRITERIA.md with tests and non-goals.
---

Inputs:

- `PRODUCT_BRIEF.md` — product boundary, privacy constraints, acceptance evidence
- `BUILD_PLAN.md` — ordered slice list; current slice is the first one not yet committed
- `DOMAIN_MODEL.md` — field names, types, enums, and forbidden-in-API fields
- current user request — the specific slice to plan

Workflow:

1. Read `PRODUCT_BRIEF.md` to confirm the request is inside the product boundary.
2. Read `BUILD_PLAN.md` to identify the target slice and confirm no earlier slice is incomplete.
3. Read `DOMAIN_MODEL.md` to confirm all fields needed by the slice are declared; note any forbidden fields (`Opportunity.value`, `invoiceAmount`) that must not appear in responses.
4. Identify the smallest implementation that satisfies the slice — list files likely to change under `src/`, `tests/`, and `seeds/`.
5. Write `TASK.md`: one-sentence slice goal, ordered implementation steps, files to change.
6. Write `DONE_CRITERIA.md`: named test assertions (including empty-state `[]` contract and forbidden-field absence), the reviewer command to run, and explicit non-goals for this slice.

Constraints:

- Stay within the product boundary defined in `PRODUCT_BRIEF.md`. If the request would add a feature not listed there, stop and ask.
- Never invent fields outside `DOMAIN_MODEL.md`. If the slice needs a new field, stop and ask the developer to update the model first.
- Enum values must match `DOMAIN_MODEL.md` exactly and are case-sensitive (`Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost` for Opportunity; `Call`, `Email`, `Meeting`, `Note` for Activity).
- Collection endpoints must return `[]` when empty — `DONE_CRITERIA.md` must include this assertion.
- `Opportunity.value` and `invoiceAmount` must be called out in `DONE_CRITERIA.md` as fields that must not appear in any API response.
- One slice at a time. If the request spans more than the named slice, stop and ask which one to plan first.

Output:

- `TASK.md` — slice goal, ordered steps, files to change
- `DONE_CRITERIA.md` — named test assertions, reviewer command, non-goals

Stop conditions:

- Request is outside the product boundary → stop and ask.
- A prerequisite slice is not yet committed → stop and name the blocking slice.
- The request would require a new field not in `DOMAIN_MODEL.md` → stop and ask for a model update first.
- Scope would span more than one slice → stop and ask which slice to plan.
