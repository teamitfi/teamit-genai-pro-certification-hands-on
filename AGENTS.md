# Agent Context

## Framework & Structure

- **Runtime:** Node ≥ 20, TypeScript (ESM), Fastify 5
- **Entry point:** `src/index.ts` — starts the HTTP server
- **Server setup:** `src/server.ts` — Fastify instance and plugin registration
- **Routes:** `src/routes/` — one file per resource (e.g. `accounts.ts`)
- **Tests:** `tests/` — Vitest spec files, one per route/domain
- **Seeds:** `seeds/` — JSON fixture data for local dev and tests
- **Scripts:** `scripts/` — one-off shell utilities, not part of the app

## Dev Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start server with hot-reload (`tsx watch`) |
| `npm start` | Start server once (no watch) |
| `npm test` | Run all tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint across the whole project |
| `npm run typecheck` | TypeScript type check, no emit |

Run `npm run lint && npm run typecheck && npm test` before committing.

## UI Conventions

This project is **API-only on day one**. There is no frontend, no HTML, no templating engine. All responses are JSON. UI conventions will be defined when a frontend is added.

## Off-Limits Files

Do **not** read, write, or modify:

- `.env` and any `.env.*` variants
- `secrets/` directory (any path containing `secrets/`)
- Any production config files (e.g. files named `*.prod.*`, `production.*`, or located under `infra/prod/`)

These files must never appear in diffs, commits, or generated code.
