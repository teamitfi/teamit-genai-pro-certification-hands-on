---
name: crm-slice-planner
description:
  Plan the next CRM slice before implementation begins. Use at the start of a
  session to produce TASK.md (step-by-step implementation plan) and
  DONE_CRITERIA.md (acceptance checklist). Enforces the one-slice-at-a-time
  rule from BUILD_PLAN.md and surfaces domain-model gaps before any code is
  written.
---

Inputs:

- `BUILD_PLAN.md` — slice definitions and ordering rules
- `PRODUCT_BRIEF.md` — user workflows, non-goals, privacy constraints
- `DOMAIN_MODEL.md` — entities, fields, enums, forbidden-in-API fields
- Current repo state: `src/`, `tests/`, `seeds/`, recent `git log`
- **Current user request** — the slice or feature the user has asked to plan

Workflow:

1. **Read the product boundary.** Read `PRODUCT_BRIEF.md` and `DOMAIN_MODEL.md`.
   Note the privacy constraints, non-goals, and any forbidden fields. These are
   the hard limits the plan must stay inside.
2. **Identify the smallest valuable slice.** Match the user request against
   `BUILD_PLAN.md`. Confirm it is exactly one slice. State the slice number,
   name, and the user workflow from `PRODUCT_BRIEF.md` it satisfies.
3. **List files likely to change.** Name every file under `src/`, `tests/`, and
   `seeds/` that the slice will create or modify. Flag any field required by the
   slice that is not yet declared in `DOMAIN_MODEL.md`.
4. **Define tests and review evidence.** For each changed route or behaviour,
   state the test case (happy path + at least one edge case) and the curl
   smoke-test command that confirms the contract is met.
5. **State non-goals.** List any feature from `PRODUCT_BRIEF.md` non-goals that
   the slice might appear to touch but will not implement. One line each.

Constraints:

- Plan exactly one slice per invocation. If the user asks for two slices in
  one session, stop and ask which one to plan first.
- Never invent fields, enums, or seed rows — surface the gap and stop.
- `TASK.md` steps must be small enough that each can be completed and tested
  independently before moving to the next.
- Do not write or suggest any production code. Output planning documents only.
- Respect the non-goals in `PRODUCT_BRIEF.md`. If a proposed task would add
  a feature listed there, name it as out of scope and drop it.

Output:

**`TASK.md`** at repo root. Sections:

```
# Slice N — <name>

## Goal
One sentence linking this slice to the workflow it satisfies.

## Pre-conditions
Bullet list: what must be true before coding starts (prior slice passing, seed
files present, domain model up to date).

## Steps
Numbered checklist. Each step is one atomic unit of work:
- [ ] 1. …
- [ ] 2. …
…

## Out of scope
Bullet list of things that will NOT be done in this slice (prevent scope creep).
```

**`DONE_CRITERIA.md`** at repo root. Sections:

```
# Done criteria — Slice N

## Tests
- [ ] `npm test` exits 0 with no skipped tests.
- [ ] <named spec file> exists and contains tests for <route or behaviour>.
- [ ] Edge case: <specific null or empty-collection case> covered by a test.

## Smoke test
- [ ] `curl` against the running server returns correct shape for happy path.
- [ ] Edge case: <specific null or empty-collection case> handled without 500.

## Privacy
- [ ] `Opportunity.value` absent from all responses (if slice touches opportunities).
- [ ] `invoiceAmount` does not appear anywhere in `src/`.

## Domain model
- [ ] No field is used in `src/` that is not declared in `DOMAIN_MODEL.md`.

## Non-goals confirmed
One bullet per relevant non-goal from `PRODUCT_BRIEF.md`, confirming the slice
does not implement it. Example:
- [ ] No generative summaries or AI-driven features added.
- [ ] No external data source or import flow introduced.
```

Stop conditions:

- The request spans more than one slice → stop, name both slices, ask which to
  plan.
- A required field is missing from `DOMAIN_MODEL.md` → stop, name the field,
  instruct the user to update the model first using `crm-domain-modeler`.
- A seed gap would make the happy-path test impossible → stop, name the gap,
  instruct the user to run `crm-test-fixtures` first.
- A forbidden field (`Opportunity.value`, `invoiceAmount`) would be exposed by
  the planned route → stop and surface the privacy violation.
