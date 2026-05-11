# Agent Context

## Repo purpose

Small CRM for account managers. The CRM is the vehicle; the Skill library is the deliverable.
Read `PRODUCT_BRIEF.md` before planning any slice. Read `DOMAIN_MODEL.md` before writing or reviewing code.

## Framework + folders + entry points

- **Runtime:** Node 20+ / TypeScript (`"type": "module"`)
- **Framework:** Fastify 5
- **Test runner:** Vitest
- **Entry point:** `src/index.ts` -> calls `buildServer()` in `src/server.ts`
- **Routes:** `src/routes/accounts.ts` - currently `GET /accounts`; new routes added here per slice
- **Seed data:** `seeds/accounts.json` - the only allowed data source; never replace with real data
- **Tests:** `tests/accounts.spec.ts` - one failing test on `main`; more added per slice
- **Skills:** `.claude/skills/<name>/SKILL.md`

## Dev-loop commands

```
npm run dev        # tsx watch - live reload
npm test           # vitest run (one-shot, CI mode)
npm run test:watch # vitest watch
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## UI conventions

API-only on day one. No frontend framework, no HTML, no CSS. If a UI is added, note it here.

## Off-limits files - never read or write

- `.env` and `.env.*`
- `secrets/` (any path under it)
- Any production config file
- Do not replace `seeds/accounts.json` with real customer data

## Domain rules

- All entities and fields are defined in `DOMAIN_MODEL.md`. Do not invent fields.
- New fields require a `DOMAIN_MODEL.md` update first, reviewed before any code change.
- `Opportunity.value` and `invoiceAmount` must never appear in API responses or UI. Reject on sight.
- Empty collections return `[]`, never `null`.
- `Opportunity.stage` is case-sensitive: `Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost`.

## Slice order (see `BUILD_PLAN.md`)

1. Accounts & Contacts
2. Opportunity Pipeline
3. Activity Timeline
4. Renewal-Risk Dashboard
5. Handoff polish

Build one slice at a time. The planner Skill stops if a request spans more than one slice.

## Skills

- `crm-slice-planner` - plan one vertical slice; outputs `TASK.md` and `DONE_CRITERIA.md`
- `crm-reviewer` - review a diff; returns `accept`, `revise`, or `reject`
- `crm-domain-modeler` - maintain `DOMAIN_MODEL.md`
- `crm-test-fixtures` - generate synthetic seed data
- `crm-handoff-writer` - write `HANDOFF.md` at end of a slice
