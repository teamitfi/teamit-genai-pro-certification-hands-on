---
name: crm-slice-planner
description:
  Plan one CRM vertical slice from PRODUCT_BRIEF.md and BUILD_PLAN.md.
  Use when starting accounts, contacts, pipeline, activity, or renewal-risk work.
  Output TASK.md and DONE_CRITERIA.md with tests and non-goals.
---

Inputs:

- `PRODUCT_BRIEF.md` (boundary, non-goals, acceptance evidence)
- `BUILD_PLAN.md` (slice order — the next slice to plan)
- `DOMAIN_MODEL.md` (field shapes and forbidden-in-UI markers)
- The current user request naming the slice

Workflow:

1. Read `PRODUCT_BRIEF.md` for the boundary and the acceptance-evidence list.
2. Read `BUILD_PLAN.md` and identify the next slice. If the user named a slice, confirm it matches plan order.
3. Read `DOMAIN_MODEL.md` for the entities the slice touches; note forbidden-in-UI fields.
4. State the slice in one sentence — entity, surface (route or endpoint), what success looks like.
5. List files likely to change, grouped by directory (`src/routes/`, `tests/`, `seeds/`, plus `src/server.ts` for registration).
6. Define the test strategy: which fixtures back the response shape, and which assertions cover happy / empty / boundary cases.
7. State non-goals — what this slice explicitly does not do.
8. Write `TASK.md` and `DONE_CRITERIA.md` at repo root, overwriting any prior versions.

`TASK.md` contains:

- **Slice** — one sentence (entity, surface, success).
- **Files to change** — bullets grouped by directory.
- **Test strategy** — fixtures consumed, assertions covered (happy, empty, boundary).
- **Non-goals** — explicit list of what stays out.

`DONE_CRITERIA.md` contains (derived from `PRODUCT_BRIEF.md` acceptance evidence):

- `npm test` green and `npm run typecheck` clean.
- ≥3 tests for any new endpoint (happy, empty, boundary).
- Privacy assertion: any forbidden-in-UI field for the entity is verified absent in the response.
- Fixture provenance: response shape round-trips a named `seeds/*.json` file.
- Lint clean.
- Empty-state returns `[]`, never `null`.

Constraints:

- Stay within the product boundary in `PRODUCT_BRIEF.md`. Reject scope that maps to a non-goal.
- Never invent fields outside `DOMAIN_MODEL.md`. Field changes route to `crm-domain-modeler` first.
- Synthetic data only — new fixture rows route to `crm-test-fixtures`.
- Plan one slice per invocation. `BUILD_PLAN.md` order is canonical; don't merge or skip.
- API-only on day one — no UI work in any `TASK.md` until `AGENTS.md` is rewritten.

Output:

- `TASK.md` at repo root.
- `DONE_CRITERIA.md` at repo root.

Stop conditions:

- The request would span more than one `BUILD_PLAN.md` slice → stop and ask which slice.
- The request requires a field not in `DOMAIN_MODEL.md` → stop and route to `crm-domain-modeler`.
- The request maps to a non-goal in `PRODUCT_BRIEF.md` → stop and surface the conflict.
- The user has not named the slice and the next slice in `BUILD_PLAN.md` is ambiguous from context → stop and ask.
