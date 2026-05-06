# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is a hands-on lab repository for the Teamit GenAI Pro Certification. You'll build a small CRM API as the vehicle for learning to write reusable Skill libraries that can be deployed to client engagements.

## Quick Start

**Verify your environment:**
```bash
node --version   # Must be 20+
npm install
npm test         # One test fails: GET /accounts should return seeded accounts
```

**Dev loop commands:**
```bash
npm run dev      # Start server in watch mode (port 3000)
npm test         # Run Vitest; will show one failing test on main
npm run test:watch   # Run tests in watch mode
npm run lint     # Check code with ESLint
npm run typecheck # Check types with tsc
```

## Stack

- **Runtime:** Node.js 20+
- **Framework:** Fastify (HTTP, logging)
- **Language:** TypeScript (strict mode)
- **Testing:** Vitest
- **Linting:** ESLint with TypeScript support
- **Build tool:** tsx (TypeScript executor, no build step needed)

## Repo Structure

```
.
├── README.md                    # Full lab instructions (100+ lines)
├── PRODUCT_BRIEF.md             # Target user, workflows, constraints (filled by Lab S1.1)
├── AGENTS.md / CLAUDE.md        # This file (filled by Lab S1.2)
├── ARCHITECTURE.md              # Optional: data flow when repo grows
├── BUILD_PLAN.md                # Slice order with 2-line descriptions
├── DOMAIN_MODEL.md              # Entity definitions (read before writing code)
├── WORKFLOW.md                  # Team's day-to-day flow (optional)
├── .claude/
│   ├── settings.json            # Permissions: blocks .env, secrets/ reads/writes
│   └── skills/                  # Reusable Skills for CRM work
│       ├── crm-domain-modeler/  # Maintain DOMAIN_MODEL.md
│       ├── crm-test-fixtures/   # Generate synthetic seed data
│       ├── crm-handoff-writer/  # Write HANDOFF.md at slice end
│       ├── crm-slice-planner/   # Plan one CRM slice (you build in Lab S1.3)
│       └── crm-reviewer/        # Review diffs (you build in Lab S2.1)
├── src/
│   ├── index.ts                 # Entry point: parse env, start server
│   ├── server.ts                # Fastify setup, health check
│   └── routes/
│       └── accounts.ts          # GET /accounts (returns [] on main)
├── tests/
│   └── accounts.spec.ts         # Vitest suite; one failing test
├── seeds/
│   └── accounts.json            # Synthetic seed data (3 accounts + contacts)
├── scripts/
│   ├── lab-s2-3-wrapper.sh      # Pre-commit hook (fallback)
│   └── pre-commit.sample        # Activate with: cp scripts/pre-commit.sample .git/hooks/pre-commit
├── eslint.config.js             # ESLint flat config
├── tsconfig.json                # TypeScript config (strict, ES2022)
└── package.json                 # Dependencies, scripts
```

## Development Workflow

### Adding a feature or route:

1. **Read `DOMAIN_MODEL.md`** to confirm your field names and types exist.
2. **Add the route** to `src/routes/` or extend an existing one.
3. **Update `seeds/accounts.json`** if you need new test data; never use real customer data.
4. **Write a test** in `tests/`. The test must:
   - Load seed data from `seeds/`
   - Verify the route's output matches the contract in `DOMAIN_MODEL.md`
   - Check for empty-state handling (return `[]`, not `null`)
5. **Run `npm test`** — all tests must pass before commit.

### Modifying the domain model:

1. **Use the `crm-domain-modeler` Skill** to propose the change.
2. **Update `DOMAIN_MODEL.md`** with the new field, type, and any privacy notes.
3. **Add a test** that exercises the new field.
4. **Update routes and fixtures** to match the model.

## Off-Limits Files

The following files and directories are protected from agent reads and writes. Attempting to access them will trigger a permission warning:

- `.env` and `.env.*` (all environment variable files)
- `secrets/` (entire directory)

These protections are enforced by `.claude/settings.json`. If your harness is Cursor or OpenCode, the equivalent rules are in `.cursorrules` or your harness's config.

## Key Contracts

**Empty collections:** Endpoints that return a list must return `[]` when empty, never `null`.

**Forbidden fields in API responses:**
- `Opportunity.value` — internal sales-ops only; leak risk
- `invoiceAmount` — does not exist in this domain; any code introducing it is a privacy violation

The pre-commit hook (`lab-s2-3-wrapper.sh`) refuses commits that introduce `invoiceAmount` in `src/`.

## Domain Model Reference

### Account
- `id` — UUID
- `name` — Display name
- `industry` — Free-text (may become enum in v0.2)
- `renewalDate` — ISO 8601 date or null (for prospects)
- `contacts` — embedded `Contact[]`

### Contact
- `id` — UUID
- `accountId` — FK to Account
- `name` — Full name
- `role` — Free text (e.g., "CTO")
- `email` — Work email

### Opportunity (Slice 2)
- `id` — UUID
- `accountId` — FK to Account
- `name` — Short label
- `stage` — Enum: `Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost` (case-sensitive)
- `value` — EUR amount, **forbidden in UI responses**

### Activity (Slice 3)
- `id` — UUID
- `accountId` — FK to Account
- `type` — Enum: `Call`, `Email`, `Meeting`, `Note`
- `at` — ISO 8601 datetime
- `summary` — One-line description

## Build Plan (Slice Order)

1. **Accounts & Contacts** (Session 1, Lab S1.4) — list and detail
2. **Opportunity Pipeline** (Session 2 stretch) — grouped by stage
3. **Activity Timeline** (stretch) — newest first, per account
4. **Renewal-Risk Dashboard** (stretch) — flags at-risk renewals
5. **Handoff polish** (final pass) — HANDOFF.md, full review

One slice per session; don't skip ahead. Each slice depends on the previous one's boundary work.

## Lab Sessions

| Phase | Goal | Output |
|-------|------|--------|
| **Lab S1.1** (10 min) | Write product boundary | `PRODUCT_BRIEF.md` |
| **Lab S1.2** (12 min) | Populate this repo guide; add `context7` MCP | `CLAUDE.md` / `AGENTS.md` + `.mcp.json` |
| **Lab S1.3** (15 min) | Build `crm-slice-planner` Skill | `.claude/skills/crm-slice-planner/SKILL.md` |
| **Lab S1.4** (17 min) | Plan & start Accounts slice with dual sub-agents | `TASK.md`, `DONE_CRITERIA.md`, first test pass |
| **Lab S2.1** (13 min) | Build `crm-reviewer` Skill | `.claude/skills/crm-reviewer/SKILL.md` |
| **Lab S2.2** (15 min) | Test reviewer fidelity on `seeded-bad-build` | `lab-s2-2-evidence.md` |
| **Lab S2.3** (10 min) | Add one safety hook (e.g., block `.env` writes) | Hook activated, evidence saved |
| **Lab S2.4** (12 min) | Build MCP server with `list_accounts` tool | MCP server, `.mcp.json`, evidence file |

## Git Branches

- `main` — starter state (one failing test on accounts)
- `seeded-bad-build` — for Lab S2.2 (do not merge, do not fix)

## Conventions

**Testing:** Tests load seed data from `seeds/` and verify contracts. One account per test slice.

**Commits:** One slice per commit. Include a one-line description of what the slice delivers.

**Naming:** Use plural for collection endpoints (`/accounts`, not `/account`). Use singular in domain model. Use UUIDs for IDs.

**Privacy:** Never paste real customer data, emails, or account numbers into the repo. `seeds/` is synthetic only.

## If You Get Stuck

1. **Run the test first:** `npm test` tells you exactly what's missing.
2. **Read `DOMAIN_MODEL.md`:** The model is the contract.
3. **Read `BUILD_PLAN.md`:** Slices are ordered; don't skip.
4. **Read `README.md` § Rules of the lab:** Explains the philosophy behind decisions.

## Session 2 Checklist (6-item walkthrough)

At the end of the certification, you'll answer these in 60 seconds:

1. **Data residency** — What changes if the client needs EU-only inference?
2. **Permissions & hooks** — What blocks a `.env` write?
3. **Logging** — Where would agent actions go for a 90-day audit?
4. **MCP whitelist** — What's installed? Which are vetted?
5. **Insurance** — What's the "Silent AI" PI exclusion question?
6. **Incident response** — Who is notified in 24 hours under Kyberturvallisuuslaki 124/2025?

Have one-line answers ready. "I don't know" is acceptable for at most one item.

---

Last updated: Lab S1.2. Keep this file ≤ 200 lines; the agent must read it fresh every session.
