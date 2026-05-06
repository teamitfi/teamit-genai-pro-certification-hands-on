# HANDOFF — Slice 1: Accounts & Contacts

**Completed:** `GET /accounts` and `GET /accounts/:id` now serve all accounts with embedded contacts from seed data; the previously failing test passes and five new assertions were added.

## Changed files

```
src/
  routes/accounts.ts     — load seeds/accounts.json; implement list + detail routes
tests/
  accounts.spec.ts       — add renewalDate, empty-contacts, forbidden-field, and :id tests
.nvmrc                   — updated 20 → 22 (packages require Node 22)
TASK.md                  — slice plan produced by crm-slice-planner
DONE_CRITERIA.md         — acceptance criteria produced by crm-slice-planner
```

## Test status

6 passed, 0 failed. Run with `PATH=~/.nvm/versions/node/v22.14.0/bin:$PATH npm test`.

## Sub-agent contributions

**Implementer sub-agent** — implemented `src/routes/accounts.ts` (seed loading, list route, detail route with 404); confirmed 1/1 tests passing. Flagged that `.nvmrc` says 20 but packages require Node 22.

**Reviewer sub-agent** — returned **revise** with three concrete findings: `renewalDate` not asserted in the existing test; `GET /accounts/:id` (200 + 404) had no test coverage; forbidden-field checks unverifiable by `npm test` alone. All three findings were addressed before commit.

## Open risks

1. **Node version mismatch** — `.nvmrc` now says 22, but `nvm use` must be run manually per shell; CI or a new contributor on Node 20 will see a startup error. Mitigation: add `engines: { "node": ">=22" }` to `package.json` to surface the requirement early.
2. **Seed data is the only data source** — routes load seeds at module start; there is no in-memory store or DB. Any future slice that writes data will need a different approach. Mitigation: decide on storage strategy before starting Slice 2.

## Decisions not to reopen

- Contacts are embedded in every account response (not a separate `/contacts` endpoint). This is intentional per `PRODUCT_BRIEF.md` workflow 1.
- Forbidden-field checks use `JSON.stringify` scanning rather than per-field type assertions. Acceptable for this seed-only stage.

## Next recommended slice

**Slice 2 — Opportunity Pipeline** (`GET /opportunities` grouped by stage). Read `BUILD_PLAN.md` § 2 before starting; `DOMAIN_MODEL.md` already declares all required fields. Remember `Opportunity.value` is forbidden in API responses.
