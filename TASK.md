# Slice 2: Opportunity Pipeline — Task List

Tasks are ordered by dependency. Complete them top-to-bottom; do not skip ahead.

**Forbidden fields:** `Opportunity.value` and `invoiceAmount` must not appear in any file touched by this slice.

---

## T1 — Seed data
**Action:** Create `seeds/opportunities.json` with synthetic opportunity rows covering all five stage enum values.
**File:** `seeds/opportunities.json`
**Fields used:** `id`, `accountId`, `name`, `stage`
**Note:** `accountId` values must reference existing IDs in `seeds/accounts.json`. Do not include `value`.

---

## T2 — Shared type definitions
**Action:** Create `src/types.ts` exporting `Opportunity` and `OpportunityStage` (enum/union).
**File:** `src/types.ts`
**Fields used:** `id`, `accountId`, `name`, `stage`
**Note:** `stage` type must be a string-literal union matching the exact enum values in `DOMAIN_MODEL.md`: `"Prospect" | "Qualified" | "Proposal" | "Closed Won" | "Closed Lost"`. No `value` field.

---

## T3 — Opportunities route (schema + handlers)
**Action:** Create `src/routes/opportunities.ts` with two endpoints:
- `GET /opportunities` — returns all opportunities grouped by stage as `{ [stage: string]: Opportunity[] }`. Empty stage buckets omitted.
- `GET /opportunities/:id` — returns a single opportunity or 404.
**File:** `src/routes/opportunities.ts`
**Fields used:** `id`, `accountId`, `name`, `stage`
**Note:** Load data from `seeds/opportunities.json`. Response objects must not include `value`. Empty collection returns `{}`.

---

## T4 — Register route in server
**Action:** Import `opportunitiesRoutes` and register it in `buildServer()`.
**File:** `src/server.ts`
**Fields used:** _(none new — wiring only)_

---

## T5 — Tests
**Action:** Create `tests/opportunities.spec.ts` covering:
1. `GET /opportunities` returns HTTP 200 with all seeded rows grouped by stage.
2. Stage keys in the response exactly match `DOMAIN_MODEL.md` enum values (case-sensitive).
3. `GET /opportunities/:id` returns the correct row for a known ID.
4. `GET /opportunities/:id` returns 404 for an unknown ID.
5. No response object contains a `value` field.
**File:** `tests/opportunities.spec.ts`
**Fields used:** `id`, `accountId`, `name`, `stage`
