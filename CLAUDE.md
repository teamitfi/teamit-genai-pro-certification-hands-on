# Agent Context

> Read this file at the start of every session. It is the contract between you and this repo.

## What this repo is

A small CRM API (no UI yet — API-only on day one). Built to teach Skills-first AI-assisted delivery. See
`PRODUCT_BRIEF.md` for scope and constraints.

## Stack

- **Runtime:** Node 20+, TypeScript (`"type": "module"`, ES modules throughout)
- **Framework:** Fastify 5
- **Tests:** Vitest
- **Tooling:** tsx (dev runner), ESLint, tsc

## Folder layout

```
src/
  index.ts          # Entry point — starts the Fastify server
  server.ts         # buildServer() factory — register routes here
  routes/
    accounts.ts     # GET /accounts — Accounts + Contacts slice
seeds/
  accounts.json     # Synthetic seed data — the ONLY allowed data source
tests/
  accounts.spec.ts  # Integration tests against the running server
.claude/skills/     # Reusable Skill library (SKILL.md per skill)
```

## Dev-loop commands

```bash
npm run dev        # Start server with hot-reload (tsx watch)
npm test           # Run full test suite once (vitest run)
npm run test:watch # Watch mode
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

All four must pass before a slice is considered done. See `PRODUCT_BRIEF.md` → Acceptance evidence.

## Domain model

`DOMAIN_MODEL.md` is the authoritative schema. **Read it before writing or reviewing any CRM code.**

- Never invent fields not defined there.
- New fields require updating `DOMAIN_MODEL.md` first (with a commit), then adding a test, then coding.
- `Opportunity.value` and any field named `invoiceAmount` must **never** appear in API responses — they are privacy
  violations.

## Build order

Follow `BUILD_PLAN.md`. One slice at a time. The `crm-slice-planner` Skill stops you from spanning multiple slices.

## Skills

Skills live under `.claude/skills/<name>/SKILL.md`. Each Skill has a `name`, `description`, `inputs`, `steps`, and
`output`. Invoke a Skill by name. Do not inline Skill logic into prompts — reference the Skill file.

Current Skills:

- `crm-domain-modeler` — maintains `DOMAIN_MODEL.md`
- `crm-test-fixtures` — generates synthetic seed data
- `crm-handoff-writer` — writes `HANDOFF.md` at end of a slice
- `crm-slice-planner` — plans one vertical slice _(added in Lab S1.3)_
- `crm-reviewer` — reviews a diff against acceptance criteria _(added in Lab S2.1)_

## Off-limits files — do not read or write

- `.env` and any `*.env*` file
- `secrets/` directory (if it exists)
- Any file containing API keys, tokens, or credentials
- Production database configs or connection strings
- `seeds/accounts.json` must never be replaced with real customer data

If asked to read or write any of the above, refuse and explain why.

## Harness note

This file is named `CLAUDE.md` (Claude Code convention). If you swap to a different harness:

- OpenCode / Codex CLI / Copilot custom-agents: rename to `AGENTS.md`
- Cursor: rename to `.cursorrules`
- Content is identical — only the filename changes.
