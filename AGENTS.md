# Agent Context

## Project

This repo is the Teamit GenAI Pro Certification lab CRM. The CRM is
intentionally small: it helps account managers answer the product questions in
`PRODUCT_BRIEF.md` while the repo also demonstrates reusable agent Skills.

Read `PRODUCT_BRIEF.md`, `DOMAIN_MODEL.md`, and `BUILD_PLAN.md` before planning
or changing CRM behavior.

## Stack

- Runtime: Node 20+
- Language: TypeScript, ES modules, `NodeNext`
- API framework: Fastify
- Tests: Vitest
- Linting: ESLint with `@typescript-eslint`
- Day-one UI convention: API-only. Do not add frontend UI unless a slice
  explicitly asks for it.

## Folders And Entry Points

- `src/index.ts` starts the API server. It reads `PORT`, `HOST`, and `LOG_LEVEL`
  from the environment.
- `src/server.ts` builds the Fastify server, registers routes, and exposes
  `/health`.
- `src/routes/` contains route modules. `src/routes/accounts.ts` owns
  `/accounts`.
- `tests/` contains Vitest tests. `tests/accounts.spec.ts` covers the seeded
  accounts endpoint.
- `seeds/` contains synthetic demo data only. Do not replace it with real
  customer data.
- `DOMAIN_MODEL.md` is the source of truth for CRM entities, fields, enums,
  empty-state rules, and forbidden API/UI fields.
- `BUILD_PLAN.md` defines the vertical-slice order. Work one slice at a time.
- `PRODUCT_BRIEF.md` defines the product boundary, non-goals, privacy
  constraints, and acceptance evidence.
- `.claude/skills/` is for reusable lab Skills.
- `scripts/lab-s2-3-wrapper.sh` and `scripts/pre-commit.sample` are safety-hook
  helpers.

## Dev Loop Commands

Use these commands from the repo root:

```bash
npm run dev
npm test
npm run lint
npm run typecheck
```

Additional commands:

```bash
npm run test:watch
npm start
```

Before declaring code changes done, normally run `npm test`, `npm run lint`, and
`npm run typecheck`. If you cannot run one, say why in the final response.

## Product And Domain Rules

- The primary user is an account manager.
- The five core workflows are: customers, next contact, moving opportunities,
  renewal risk, and trusted changes.
- This is not Salesforce and not a general CRM platform.
- Do not add vague AI features.
- Do not add hidden integrations.
- Do not use production customer data.
- `seeds/` is the only allowed data source.
- Do not invent fields outside `DOMAIN_MODEL.md`.
- New fields require updating `DOMAIN_MODEL.md` first.
- Empty collections must return `[]`, not `null`.
- `Opportunity.value` is internal and must not appear in API responses or UI.
- `invoiceAmount` is forbidden. Invoicing is out of scope.

## Off-Limits Files And Data

Do not read, write, display, or depend on:

- `.env`
- `.env.*`
- `secrets/`
- production configuration files
- real customer exports
- real contact details
- real invoice, billing, accounting, calendar, email, marketing, analytics, or
  CRM integrations

The committed `.claude/settings.json` also denies `.env`, `.env.*`, and
`secrets/**`.

## Implementation Guidance

- Prefer the existing Fastify route-module pattern.
- Keep changes scoped to the requested vertical slice.
- Keep seed data synthetic, small, and readable.
- Add or update focused tests with each behavior change.
- Preserve privacy constraints in tests and responses.
- Do not refactor unrelated files during a slice.
- If the work touches API responses, check that forbidden fields are not leaked.

## Review And Handoff Expectations

For each completed slice, report:

- What user-facing behavior changed.
- Which files changed and why.
- Which checks passed.
- Whether forbidden fields, invoice data, production data, and hidden
  integrations were avoided.
- Any known limitation or residual risk.

## Harness Naming

This repo uses `AGENTS.md` for Codex/OpenCode/Copilot-style harnesses. The same
content can be used as `CLAUDE.md` for Claude Code or `.cursorrules` for Cursor.
