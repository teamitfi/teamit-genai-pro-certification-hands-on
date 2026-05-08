# Agent Context

Read this file before proposing scope, editing files, or judging a diff. Cross-harness:
`CLAUDE.md` in this repo is a one-line `@AGENTS.md` import, so Claude Code, Codex CLI,
and OpenCode all see the same content from a single source.

## What this repo is

A lab vehicle for the Teamit GenAI Pro Certification. The CRM (Accounts, Contacts,
Opportunities, Activities, Renewal-Risk) is the demo product; the durable output is the
reusable Skill library under `.claude/skills/`. Stack: Node 20+, TypeScript (strict,
NodeNext, ES2022), Fastify 5, Vitest, ESLint.

Upstream context to read before any non-trivial change:

- `PRODUCT_BRIEF.md` — target user, scope boundary, non-goals, privacy constraints, acceptance evidence.
- `DOMAIN_MODEL.md` — entity definitions and forbidden fields. Single source of truth for field names and types.
- `BUILD_PLAN.md` — slice order. Do not skip or merge slices.

## Folder layout

| Path                  | Contents                                                                       |
| --------------------- | ------------------------------------------------------------------------------ |
| `src/`                | Application source — `index.ts` entry, `server.ts` factory, `routes/<entity>.ts` per-entity handlers. |
| `tests/`              | Vitest specs — one file per entity, must stay green.                           |
| `seeds/`              | Synthetic JSON fixtures — the source of truth for response shapes.             |
| `scripts/`            | Lab helper scripts — do not modify unless a lab explicitly says to.            |
| `.claude/skills/`     | Reusable Skill library (Markdown only); each skill has its own sub-folder.     |
| `.claude/settings.json` | Runtime deny rules — see [Off-limits files](#off-limits-files).              |

## Entry points

- `npm run dev` boots `src/index.ts`, which calls `buildServer()` from `src/server.ts` and listens on port 3000 (override with `PORT`).
- `src/server.ts` exports the Fastify factory: registers `accountsRoutes` and exposes `GET /health`.
- New entity routes go in `src/routes/<entity>.ts` and must be registered in `src/server.ts`.

## Dev-loop commands

```bash
npm run dev        # tsx watch — hot-reload dev server on :3000
npm test           # vitest run — single pass, CI-style
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
```

Always run `npm test && npm run typecheck` before reporting a slice complete. Lint
should be clean too — no `--fix`-pending changes left in the diff.

## UI conventions

**API-only on day one.** No frontend ships in v0.x — no React, no static HTML, no
templates, no bundler. If a future slice introduces a UI, this section gets rewritten
with the framework choice, asset pipeline, and a11y baseline **before** any UI code
lands. Until then, every endpoint is exercised via test or `curl`.

## API conventions

- All list endpoints return `[]` (empty array), never `null` — enforced by tests.
- Routes live in `src/routes/<entity>.ts`; register them in `src/server.ts`.
- No business logic in route handlers — keep handlers thin.
- Response shapes must round-trip a fixture in `seeds/`. A test that asserts the shape names the fixture file.

## Domain constraints

These mirror `DOMAIN_MODEL.md`. The model is canonical; this section is a tripwire so an
agent reading only `AGENTS.md` still gets the rules.

- **Never expose `Opportunity.value`** in any API response or UI surface. Internal sales-ops field only.
- **The literal field name `invoiceAmount` must never appear in `src/`.** It does not exist in the domain — its mention is a tripwire and the S2.3 hook refuses commits that introduce it.
- Synthetic data only. Real names, real emails, real domains, real amounts never enter `seeds/`, tests, or commit messages.
- Update `DOMAIN_MODEL.md` (via the `crm-domain-modeler` skill) **before** changing a schema. Don't hand-edit field definitions.

## Off-limits files

Files an agent must not read, write, or edit without an explicit lab instruction. Where
applicable, deny rules in `.claude/settings.json` enforce this at the harness layer.

| Path / pattern                | Why                                                              | Enforced by                |
| ----------------------------- | ---------------------------------------------------------------- | -------------------------- |
| `.env`, `.env.*`              | Secrets / environment config; leak risk.                         | `.claude/settings.json` deny |
| `secrets/**`                  | Reserved for any secret material, even if currently empty.        | `.claude/settings.json` deny |
| `scripts/`                    | Lab helper scripts — modifying them invalidates lab evidence.    | Convention only            |
| `DOMAIN_MODEL.md`             | Schema source of truth — propose changes via the `crm-domain-modeler` skill. | Convention only |

Do not read lab sections ("Session 1 labs", "Session 2 labs") in `README.md`.

**Production configs.** None exist in this repo today (no `Dockerfile`,
`docker-compose*`, `.github/workflows/`, `terraform/`, `infra/`, `k8s/`, `serverless.yml`).
If any are added later, treat them as off-limits-by-default — touch only when a lab or
explicit user instruction names the file.

## Skills available

| Skill                  | When to use                                              |
| ---------------------- | -------------------------------------------------------- |
| `crm-domain-modeler`   | Adding or changing entities, fields, or enum values.     |
| `crm-test-fixtures`    | New fixture rows or boundary-value seeds.                |
| `crm-handoff-writer`   | End of a slice — write `HANDOFF.md`.                     |

Two more skills (`crm-slice-planner`, `crm-reviewer`) are added in Labs S1.3 and S2.1.

## Build order

Follow `BUILD_PLAN.md`: Accounts → Contacts → Opportunities → Activities → Renewal-Risk.
One slice at a time. The planner skill stops if a request would span more than one slice.
Do not merge slices unless a lab explicitly allows it.
