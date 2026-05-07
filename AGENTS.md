# Agent Context

## Stack

- **Runtime:** Node 20+ / TypeScript (ESM, `"type": "module"`)
- **Framework:** Fastify 5 (`fastify@^5`)
- **Test runner:** Vitest 4 (`vitest run` for CI, `vitest` for watch)
- **Dev runner:** `tsx watch` (no compile step needed during development)

## Folder layout

```
src/
  index.ts          # entry point — starts the server on PORT (default 3000)
  server.ts         # buildServer() factory — registers routes, returns FastifyInstance
  routes/
    accounts.ts     # GET /accounts (and future account routes)
tests/
  accounts.spec.ts  # Vitest specs — inject via server.inject(), no network
seeds/
  accounts.json     # Synthetic seed data — source of truth for tests
.claude/
  settings.json     # Harness permissions (deny .env / secrets reads & writes)
  skills/           # Reusable Skill files (crm-slice-planner, etc.)
```

## Dev-loop commands

```bash
npm run dev        # tsx watch src/index.ts — hot-reload dev server
npm test           # vitest run — single-pass test run (use for CI checks)
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
```

Always run `npm test` before declaring a slice done.

## Conventions

- Routes are registered as Fastify plugins in `src/routes/` and imported in `server.ts`.
- Tests use `server.inject()` — do not start a live HTTP server in tests.
- Seed data is loaded from `seeds/accounts.json` at test time; do not hard-code fixture data inline.
- Empty collections must return `[]`, never `null`.
- **API-only on day one.** There is no UI yet. Do not scaffold a frontend without a new product-brief update.

## Off-limits files — never read or write

- `.env` and `.env.*` — environment secrets
- `secrets/` — any file under this path
- Production config files (anything outside the repo that configures a live environment)

These are enforced in `.claude/settings.json`. Do not bypass or modify those deny rules.

## Key reference files

Read these before writing or reviewing code:

- `PRODUCT_BRIEF.md` — product boundary, non-goals, privacy constraints
- `DOMAIN_MODEL.md` — canonical entity definitions; forbidden fields (`Opportunity.value`, `invoiceAmount`)
- `BUILD_PLAN.md` — slice order
