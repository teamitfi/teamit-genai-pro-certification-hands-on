# Agent Context

This repo is a Teamit GenAI Pro Certification lab. The CRM is intentionally small; the durable output is the reusable Skill library and the evidence that agents respected product, domain, and safety boundaries.

## Read first

- `PRODUCT_BRIEF.md` defines product scope, non-goals, privacy constraints, and acceptance evidence.
- `DOMAIN_MODEL.md` is the source of truth for CRM entities, fields, enums, and forbidden fields.
- `BUILD_PLAN.md` defines slice order. Work one slice at a time.
- This file defines repo conventions for agents and reviewers.

## Stack and entry points

- Runtime: Node 20+ with TypeScript ESM.
- API framework: Fastify.
- Tests: Vitest.
- Lint/typecheck: ESLint and `tsc --noEmit`.
- API entry point: `src/index.ts`.
- Testable server factory: `src/server.ts`.
- Routes: `src/routes/`.
- Current account route: `src/routes/accounts.ts`.
- Synthetic seed data: `seeds/accounts.json`.
- Tests: `tests/`.

## Dev loop

- Install dependencies: `npm install`.
- Run local API: `npm run dev`.
- Run tests: `npm test`.
- Run lint: `npm run lint`.
- Run typecheck: `npm run typecheck`.

When changing behavior, run the narrowest relevant check first, then run the full test/lint/typecheck set before calling a slice done.

## Product and domain rules

- Stay within `PRODUCT_BRIEF.md`; do not add vague AI features, hidden integrations, invoicing, or Salesforce-scale scope.
- Do not invent fields. If code needs a field not in `DOMAIN_MODEL.md`, update the model first and include tests.
- Do not expose forbidden fields in API or UI. In particular, never expose `Opportunity.value`, and reject any literal `invoiceAmount`.
- Use only synthetic data from `seeds/`. Never add real customer data, credentials, invoices, or account numbers.
- Collection endpoints return `[]` when empty, not `null`.

## UI conventions

- Day one is API-only. There is no UI yet.
- If a UI is added later, it must follow the same domain and privacy rules as the API: no forbidden fields, no invoicing surface, and no production data.

## Off-limits files and data

Agents must not read, write, summarize, or infer from:

- `.env`
- `.env.*`
- `secrets/`
- production configs or production credentials
- real customer exports or real client data

If a task appears to require any off-limits file or real data, stop and ask for a synthetic or reviewed alternative.

## Review expectations

- Read the actual diff before accepting a change.
- Reviews should cite concrete files and return an explicit decision: `accept`, `revise`, or `reject`.
- A slice is not done until tests pass, domain constraints are respected, and the evidence requested by the lab or planner has been produced.
