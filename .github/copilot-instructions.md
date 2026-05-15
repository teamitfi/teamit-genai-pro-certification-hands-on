# Copilot Instructions

This file is the Copilot equivalent of `AGENTS.md` / `CLAUDE.md`. Copilot Chat and Copilot Code Review pick it up automatically for this repo. Keep it tight; the durable agent context lives in `AGENTS.md`.

## Read first

- `PRODUCT_BRIEF.md` — product scope, non-goals, privacy constraints, acceptance evidence.
- `DOMAIN_MODEL.md` — entities, fields, enums, empty-state contracts, forbidden fields.
- `BUILD_PLAN.md` — slice order. Work one slice at a time.
- `AGENTS.md` — repo conventions for any agent (Claude, Copilot, Cursor, others).

## Stack

Node 20+ · TypeScript ESM · Fastify · Vitest · ESLint · `tsc --noEmit`. API entry `src/index.ts`; testable factory `src/server.ts`; routes in `src/routes/`; synthetic seeds in `seeds/`; tests in `tests/`.

## Dev loop

`npm install` · `npm run dev` · `npm test` · `npm run lint` · `npm run typecheck`. Run the narrowest relevant check first; run the full set before declaring a slice done.

## Hard rules

- **No invented fields.** If a needed field is not in `DOMAIN_MODEL.md`, update the model first, in a separate reviewed commit, then write code.
- **No forbidden fields in API or UI.** Never expose `Opportunity.value`. Reject any literal `invoiceAmount` anywhere in `src/`.
- **Collections return `[]`, never `null`.** Empty-state contract from `DOMAIN_MODEL.md`.
- **Enums are case-sensitive.** Use the exact strings in `DOMAIN_MODEL.md` (e.g., `Closed Won`, not `closed-won` or `Closed-Won`).
- **Synthetic data only.** Source from `seeds/`. No real customer data, credentials, invoices, or account numbers.
- **Off-limits files.** Do not read, write, summarize, or infer from `.env`, `.env.*`, `secrets/`, production configs, or real client exports.

## Review expectations

- Read the actual diff, not the author's summary.
- Reviews cite concrete `file:line` and end with one explicit decision: `accept`, `revise`, or `reject`. No "needs work", no "LGTM".
- Apply the same rigor whether the author is the user, a sub-agent, or an external contributor.

## Custom agents

- `crm-reviewer` (`.github/agents/crm-reviewer.md`) — Copilot translation of the Claude Skill at `.claude/skills/crm-reviewer/SKILL.md`. Invoke with `@crm-reviewer review this diff` in Copilot Chat, or assign as the Copilot Code Review agent for a PR.

## Harness translation reference

- `.claude/skills/<name>/SKILL.md` ↔ `.github/agents/<name>.md` ↔ `.cursor/rules/<name>.mdc`. Same intent; whichever lives in the diff is the one a reviewer can audit. Avoid user-global agent installs.
