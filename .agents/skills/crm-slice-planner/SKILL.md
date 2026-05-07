---
name: crm-slice-planner
description:
  Plan one Teamit CRM vertical slice at a time from PRODUCT_BRIEF.md,
  BUILD_PLAN.md, and DOMAIN_MODEL.md. Use when turning a requested CRM
  feature, lab session, or build-plan slice into TASK.md and
  DONE_CRITERIA.md with scope boundaries, domain-model checks, privacy
  constraints, expected files, tests, and acceptance evidence. Stop if the
  request spans multiple slices or requires undeclared fields.
---

# CRM Slice Planner

Use this skill before implementing a CRM slice. It turns the user's request into
a small, reviewable work package that fits the product boundary and build order.

Inputs:

- `PRODUCT_BRIEF.md`
- `BUILD_PLAN.md`
- `DOMAIN_MODEL.md`
- the user's requested slice or feature
- existing `TASK.md` and `DONE_CRITERIA.md`, if present

Workflow:

1. Read `PRODUCT_BRIEF.md`, `BUILD_PLAN.md`, and `DOMAIN_MODEL.md` before
   drafting the plan.
2. Identify exactly one target slice from `BUILD_PLAN.md` and state which core
   workflow question from `PRODUCT_BRIEF.md` it answers.
3. Check scope: confirm the request belongs to that one slice, respects prior
   slice boundaries, and does not pull in future-slice behavior.
4. Check the domain model: list the entities, fields, enums, empty-state rules,
   and forbidden API/UI fields the slice must respect.
5. Check the product boundary: seeds only, synthetic data only, no invoicing, no
   production data, no hidden integrations, and API-only unless the slice
   explicitly asks for UI.
6. Draft a concrete implementation task with expected route, seed, source, and
   test files. Prefer the existing Fastify route-module and Vitest patterns.
7. Draft done criteria that prove user-facing behavior, focused tests, privacy
   constraints, forbidden-field checks, and the normal verification commands:
   `npm test`, `npm run lint`, and `npm run typecheck`.
8. Write or update `TASK.md` and `DONE_CRITERIA.md` at the repo root. If the
   user asked only for planning, stop after writing those files.

Constraints:

- Plan one vertical slice at a time. Do not combine accounts, opportunities,
  activities, renewal risk, and handoff polish in one task.
- Do not invent fields, enum values, or data sources. New fields must go through
  `crm-domain-modeler` before implementation planning continues.
- `Opportunity.stage` values are case-sensitive and must come from
  `DOMAIN_MODEL.md`.
- `Opportunity.value` is internal and must not appear in API responses or UI.
- `invoiceAmount` is forbidden everywhere.
- Empty collections returned by API endpoints must be `[]`, never `null`.
- Seed data must remain small, readable, and synthetic.
- Do not read, write, display, or depend on `.env`, `.env.*`, `secrets/`, or
  production configuration files.
- Do not plan hidden integrations with CRM, billing, invoicing, accounting,
  calendar, email, marketing, analytics, or enrichment systems.

`TASK.md` format:

```markdown
# TASK

## Slice

<slice number and name from BUILD_PLAN.md>

## User Story

As an account manager, I can <capability> so that <workflow question>.

## In Scope

- <specific behavior>

## Out of Scope

- <nearby behavior intentionally deferred>

## Domain And Data Contracts

- <entities, fields, enum values, empty-state rules, forbidden fields>

## Expected Files

- `<path>` - <why this file belongs in the slice>

## Implementation Notes

- <route/module/test/fixture pattern to follow>
```

`DONE_CRITERIA.md` format:

```markdown
# DONE_CRITERIA

- [ ] The slice answers: <core workflow question>.
- [ ] API behavior matches the task and returns `[]` for empty collections.
- [ ] Tests cover the happy path plus the relevant empty-state, enum, ordering,
      or privacy edge case.
- [ ] API responses and UI, if any, do not expose `Opportunity.value`.
- [ ] No `invoiceAmount`, invoice data, production data, or hidden integration
      was introduced.
- [ ] `npm test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] The final report names changed files, user-facing behavior, checks, and
      any known residual risk.
```

Output:

- `TASK.md` at the repo root.
- `DONE_CRITERIA.md` at the repo root.
- A short note summarizing the selected slice and any stop-condition risk.

Stop conditions:

- The request spans more than one build-plan slice - stop and ask the user to
  split it.
- The request requires a field or enum not declared in `DOMAIN_MODEL.md` - stop
  and route the change to `crm-domain-modeler` first.
- The request conflicts with `PRODUCT_BRIEF.md` privacy constraints or
  non-goals - stop and state the conflict.
- The target slice cannot be identified from the user's request - stop and ask
  which slice to plan.
