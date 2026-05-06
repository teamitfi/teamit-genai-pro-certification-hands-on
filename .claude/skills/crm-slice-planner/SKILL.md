---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use when starting accounts, contacts, pipeline, activity, or renewal-risk
  work, including prompts like "plan the next CRM slice" or "let's plan the
  Accounts & Contacts slice." Output TASK.md and DONE_CRITERIA.md with tests
  and non-goals.
---

Inputs:

- `PRODUCT_BRIEF.md`
- `BUILD_PLAN.md`
- `DOMAIN_MODEL.md`
- current user request

Workflow:

1. Read `PRODUCT_BRIEF.md` to confirm the target user, core workflow, non-goals, privacy constraints, demo-data assumptions, and acceptance evidence.
2. Read `BUILD_PLAN.md` and identify the smallest valuable slice matching the request: Accounts & Contacts, Opportunity Pipeline, Activity Timeline, Renewal-Risk Dashboard, or Handoff polish.
3. Read `DOMAIN_MODEL.md` and list the entities, fields, enums, empty-state contracts, and forbidden fields that constrain the slice.
4. State the slice goal in one sentence tied to an account-manager question from the product brief.
5. List the files likely to change and the files that must be read or reviewed before implementation.
6. Define the tests and review evidence needed before the slice can be called done.
7. State non-goals and privacy constraints for the slice, including any forbidden fields that must not appear in API or UI.
8. Write `TASK.md` and `DONE_CRITERIA.md` for the selected slice.

Constraints:

- Stay within the product boundary in `PRODUCT_BRIEF.md`.
- Plan exactly one vertical slice at a time.
- Never invent fields outside `DOMAIN_MODEL.md`; new fields require a domain-model change before implementation.
- Never expose forbidden fields in API or UI, especially `Opportunity.value` and any literal `invoiceAmount`.
- Use synthetic data only; `seeds/` is the allowed data source.
- Keep implementation tasks small enough for one agent session and one reviewer pass.

Output:

- `TASK.md`
- `DONE_CRITERIA.md`

`TASK.md` must include:

- slice name
- user value / account-manager question answered
- scope
- likely files to change
- implementation tasks
- non-goals
- risks or open questions

`DONE_CRITERIA.md` must include:

- automated tests to run or add
- acceptance evidence from `PRODUCT_BRIEF.md`
- domain-model checks
- privacy checks
- reviewer decision format: `accept`, `revise`, or `reject`

Stop conditions:

- Slice spans more than the named files or more than one build-plan slice -> stop and ask the user to split it.
- Brief does not cover the user's request -> stop and ask for a product-boundary update.
- Request needs fields, enum values, or data not declared in `DOMAIN_MODEL.md` -> stop and ask whether to update the domain model first.
- Request requires production data, hidden integrations, invoicing, or forbidden fields -> stop and reject that scope.
