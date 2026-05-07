# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Teamit GenAI Pro Certification lab repo. Goal: build a small CRM (Fastify + TypeScript) while learning agentic AI patterns by creating and using a reusable Skill library. Implementation is delivered as five vertical slices defined in `BUILD_PLAN.md`.

## Dev commands

```bash
npm run dev        # tsx watch — hot reload on src/
npm test           # vitest run (all specs)
npm run test:watch # vitest watch
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm start          # compiled dist/
```

Run a single test file: `npx vitest run tests/accounts.spec.ts`

Environment variables: `PORT` (default 3000), `HOST` (default 0.0.0.0), `LOG_LEVEL` (default "info").

## Architecture

```
src/
  index.ts          # entry point — starts Fastify, reads PORT/HOST
  server.ts         # buildServer() factory — registers route plugins, /health
  routes/           # one file per slice (accounts.ts, …)
tests/              # Vitest specs, mirroring routes/ naming
seeds/              # JSON fixture files — the only allowed data source
.claude/skills/     # Skill definitions (markdown prompts invoked via /skill-name)
```

The server uses `buildServer()` (exported from `server.ts`) so tests can inject it without binding a port.

Routes load seed JSON from `seeds/` at request time — no database. New routes follow the Fastify plugin pattern (`async function fooRoutes(server) { … }`) and register via `server.register()` in `server.ts`.

## Domain model

`DOMAIN_MODEL.md` is the single source of truth for entities, fields, and enums. **Do not invent fields.** If a slice needs a new field, update `DOMAIN_MODEL.md` first in a separate commit.

Key invariants from the model:
- Empty collections must return `[]`, never `null`.
- `Opportunity.value` is **forbidden in API responses** (internal sales-ops field).
- Any field literally named `invoiceAmount` in `src/` is a privacy violation — the pre-commit hook (`scripts/lab-s2-3-wrapper.sh`) blocks it.
- Opportunity `stage` enum values are case-sensitive: `Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost`.

## Skills

Skills live in `.claude/skills/` and are invoked via `/skill-name` in Claude Code. Current skills:

| Skill | Purpose |
|---|---|
| `crm-domain-modeler` | Maintains `DOMAIN_MODEL.md` when fields change |
| `crm-test-fixtures` | Generates/extends synthetic seed data under `seeds/` |
| `crm-handoff-writer` | Writes `HANDOFF.md` at the end of a slice |

Labs S1.3 and S2.1 add `crm-slice-planner` and `crm-reviewer`. Use the planner before starting a slice; use the reviewer before committing.

## Build plan

One slice at a time — the planner Skill enforces this. Current status: Slice 1 (Accounts & Contacts) is in progress; `GET /accounts` returns `[]` and one test is failing. Slices 2–5 are defined in `BUILD_PLAN.md` but not started.

## Off-limits

- `.env` and `.env.*` — blocked by `.claude/settings.json`
- `secrets/` directory — blocked by `.claude/settings.json`
- Production data — `seeds/` uses synthetic Finnish company names only; never substitute real customer data
