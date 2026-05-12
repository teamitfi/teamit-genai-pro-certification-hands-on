# Agent Context

## What this repo is

Hands-on lab repo for Teamit's **GenAI Pro Certification**. Participants build a
small CRM across two sessions; the CRM is the *vehicle*. The lasting deliverable
is a reusable Skill library under `.agents/skills/` (planner, reviewer, domain
modeler, fixtures, handoff writer) that's portable into a real client
engagement. `.claude` is a compatibility symlink to `.agents`, matching
`CLAUDE.md -> AGENTS.md`.

`README.md` describes the original TypeScript/Fastify starter; the current
branch is a **Go rewrite** — trust this file and `go.mod`, not the README's
stack section, when they disagree.

## Product context

The CRM serves Teamit **Account Managers** (and secondarily sales leadership /
CSMs). It is deliberately stripped down — *not* a Salesforce. See
`PRODUCT_BRIEF.md` for the full boundary. The five workflow questions, one
screen each:

1. Who are our customers — browseable account list.
2. Who should we contact next — ranked contacts with reasons.
3. Which opportunities are moving — pipeline view surfacing stage *changes*.
4. Which renewals are at risk — filtered by signal, not just date.
5. What changed and can we trust it — activity feed with provenance.

Non-goals are explicit: no Salesforce-style bloat, no hidden integrations, no
financial system, no real customer data ever.

## Domain rules

Entities (`Account`, `Contact`, `Opportunity`, `Activity`) and their fields are
defined in `DOMAIN_MODEL.md`. **Do not invent fields.** A new field requires a
`DOMAIN_MODEL.md` update first, in a separate reviewed commit.

Hard rules enforced on review:

- **Forbidden in API/UI:** `Opportunity.value` (leak risk, internal only).
- **Tripwire string:** the literal `invoiceAmount` must never appear in `src/`.
  It is not a real field — its presence is a privacy violation by definition,
  and the S2.3 pre-commit hook (`scripts/lab-s2-3-wrapper.sh`) refuses commits
  that introduce it.
- **Empty collections return `[]`, never `null`.** API contract.
- **Synthetic data only.** `seeds/` is the only allowed data source. No
  production data in dev, staging, screenshots, or commits — ever. GDPR posture
  applies to the synthetic data as if every row were a real EU subject (see
  `PRODUCT_BRIEF.md` § Data Privacy).
- **`Opportunity.stage` is a case-sensitive enum:** `Prospect`, `Qualified`,
  `Proposal`, `Closed Won`, `Closed Lost`.

## Build slices

Work proceeds one vertical slice at a time, in `BUILD_PLAN.md` order:

1. Accounts & Contacts (Slice 1, started in Lab S1.4) — list + detail.
2. Opportunity Pipeline — grouped by `stage`.
3. Activity Timeline — chronological per account.
4. Renewal-Risk Dashboard — read-only; `renewalDate` ≤ 90d AND last activity > 30d.
5. Handoff polish — `HANDOFF.md` + reviewer-skill end-to-end pass.

If a request would span more than one slice, stop and ask.

## Tech stack

- **Backend:** Go (stdlib `net/http`, module `crmapi`, see `go.mod`).
- **Storage:** SQLite in production (single file, embedded — no separate DB server).
- **Frontend:** Server-rendered HTML powered from the Go backend, using HTMX for
  interactivity, plain CSS, and plain HTML. Alpine.js may be sprinkled in
  `<script>` tags when HTMX alone is awkward. **No frontend build step** — no
  bundler, no transpiler, no `npm run build`. If you reach for one, stop and
  reconsider what your future might look if you do.

## Folders + entry points

Atypical for Go: **all source lives under `src/`** in the repo root (not at the
module root). Imports are therefore `crmapi/src/...`.

- `src/main.go` — process entry point. Reads `PORT` / `HOST` env vars, calls
  `buildServer()`, starts listener.
- `src/server.go` — `buildServer()` wires the `http.ServeMux`, registers routes,
  exposes `GET /health`.
- `src/routes/` — one file per resource (`accounts.go`, …). Each exposes a
  `RegisterXxx(mux *http.ServeMux)` function called from `buildServer()`.
- `tests/` — test files (currently `accounts.spec.ts` from earlier scaffolding;
  Go tests live alongside the code they cover, `*_test.go`).
- `seeds/` — JSON seed data (e.g. `accounts.json`) for local dev / fixtures.
- `scripts/` — repo-level shell helpers; not part of the build.
- `DOMAIN_MODEL.md`, `ARCHITECTURE.md`, `PRODUCT_BRIEF.md`, `BUILD_PLAN.md`,
  `WORKFLOW.md` — read these for product/domain context before making
  non-trivial design choices.

## Dev loop

Run from the repo root.

- `go test ./...` — run all unit tests.
- `go test -tags=integration ./...` — include integration tests (use the
  `//go:build integration` tag on tests that hit SQLite or the network).
- `go build ./src/...` — compile-check everything.
- `go run ./src` — start the server locally (defaults to `0.0.0.0:3000`,
  override with `PORT` / `HOST`).
- `go mod tidy` — after adding/removing imports.
- `go vet ./...` and `gofmt -w src/` — before committing.

`curl http://localhost:3000/health` should return `{"status":"ok"}` once the
server is up.

## UI conventions

**API-only on day one.** No HTML routes, templates, or static assets exist yet.
When the first UI lands, follow these conventions:

- Server returns full HTML pages (and HTMX partials for swaps) — no JSON-only
  pages, no client-side router.
- This is a backend-driven multipage application, use a new page when adding something new.
  Use an anchor to a new page instead of a modal for example.
- HTMX attributes (`hx-get`, `hx-post`, `hx-swap`, …) drive interactivity.
- Alpine.js is the fallback for purely-local UI state (toggles, dropdowns) and
  lives inline in `<script>` tags or `x-data` attributes — no separate JS
  modules, no build pipeline.
- CSS is plain CSS in static files served by the Go server. No Tailwind, no
  PostCSS, no Sass.

## Off-limits files

Do not read, edit, or commit:

- `.env`, `.env.*` — local secrets and env overrides.
- `secrets/` — anything under this directory, ever.
- Production config files: anything matching `*.prod.*`, `config/production.*`,
  or files explicitly marked as production deployment configs.
- The SQLite database file(s) themselves (e.g. `*.db`, `*.sqlite`) — schema
  changes go through migrations, not by editing the binary.

If a task seems to require touching one of these, stop and ask the user.
