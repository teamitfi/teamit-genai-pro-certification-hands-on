# Agent Context

Read this file first. It describes the repo so you can work without asking clarifying questions.

## Stack

- **Runtime:** Node 20+ (ESM, `"type": "module"`)
- **Language:** TypeScript 5 — strict mode, `noImplicitAny`, `noUncheckedIndexedAccess`
- **Framework:** Fastify 5
- **Test runner:** Vitest 4
- **Module resolution:** NodeNext — always use `.js` extensions in imports, even for `.ts` source files

## Folder layout

```
src/
  index.ts          # Entry point — starts the server on PORT (default 3000)
  server.ts         # buildServer() factory — registers routes, exposes /health
  routes/
    accounts.ts     # GET /accounts — currently returns []; Lab S1.4 fixes this
seeds/
  accounts.json     # Synthetic seed data — the only permitted data source
tests/
  accounts.spec.ts  # Vitest tests — one failing test on main
.claude/
  settings.json     # Harness permission policy
  skills/           # Reusable Skills (crm-domain-modeler, crm-handoff-writer, crm-test-fixtures)
```

## Dev-loop commands

```bash
npm run dev        # tsx watch — live reload
npm test           # vitest run — single pass
npm run test:watch # vitest — watch mode
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
```

Always run `npm test` before declaring a slice done.

## Conventions

- Route handlers live in `src/routes/<resource>.ts` and are registered in `src/server.ts`.
- New fields require updating `DOMAIN_MODEL.md` first, in a separate commit, before touching `src/`.
- Endpoints returning collections must return `[]` for empty — never `null`.
- Seed data is loaded at startup from `seeds/accounts.json`; no database in v0.1.
- Read `PRODUCT_BRIEF.md` before planning any slice. Read `DOMAIN_MODEL.md` before writing or reviewing any CRM code.
- API-only on day one — no frontend exists. When a UI is added, document component conventions here.

## Off-limits files — do not read or write

- `.env` and `.env.*`
- `secrets/`
- Anything in production configs

These are enforced in `.claude/settings.json`. Do not attempt to work around them.
