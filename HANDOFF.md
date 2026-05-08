# HANDOFF — Slice 1: Accounts & Contacts

## Summary

Read-only Accounts and per-account Contacts surfaces are live, backed by `seeds/accounts.json`, with the `invoiceAmount` privacy tripwire and an injectable empty-state contract pinned by tests. Slice 1 meets every gate in `DONE_CRITERIA.md` and is committed.

## Endpoints live

- `GET /accounts` — list with embedded contacts.
- `GET /accounts/:id` — detail; `404` on unknown id.
- `GET /accounts/:id/contacts` — array; `[]` for zero-contact accounts; `404` on unknown account.
- `GET /accounts/:accountId/contacts/:contactId` — detail; `404` on either unknown id; no cross-account leakage.

## Files changed

- `src/lib/` — `seedStore.ts` (new; `loadSeedStore(seedsPath)` factory, `DEFAULT_SEEDS_PATH`; sole `readFileSync` of seed data).
- `src/routes/` — `accounts.ts` (all four handlers; contacts folded in; thin).
- `src/` — `server.ts` (`buildServer(options?: { seedsPath?: string })`).
- `tests/` — `accounts.spec.ts` (list + empty-fixture + detail), `contacts.spec.ts` (new), `privacy.spec.ts` (new — recursive `invoiceAmount` grep over `src/`).
- `seeds/` — `accounts.empty.json` (`[]`), `README.md` (fixture provenance, via `crm-test-fixtures`).
- Repo root — `TASK.md`, `DONE_CRITERIA.md`, `HANDOFF.md`.

## Test status

`npm test` → **12 passing** across 3 files (5 accounts, 6 contacts, 1 privacy). `npm run typecheck` clean. `npm run lint` clean. No skipped specs, no `.only`.

## Sub-agent workflow

- **Developer (`crm-feature-developer`)** was dispatched five times — one per chunk — with strict per-chunk scope; came back each time with the diff and a brief change summary, validation done by the parent.
- **Reviewer (`crm-parallel-reviewer`)** was dispatched after each chunk against a calibrated narrower bar (do not block on items deferred to later chunks); all five chunks came back **ACCEPT** with zero required actions.

## Open risks

1. **Shape tests use `toHaveProperty`, not strict key-set equality vs `DOMAIN_MODEL.md`.** An invented field smuggled into a response wouldn't trip a test today. *Mitigation:* tighten when slice 2 lands Opportunity, where invented-field risk rises.
2. **Privacy spec covers `invoiceAmount` only.** No assertion yet that `Opportunity.value` is absent from responses. *Mitigation:* extend the spec as the first chunk of slice 2.

## Decisions not to reopen

1. **Contacts routes live in `src/routes/accounts.ts`** (no separate `contacts.ts`). Contacts have no top-level URL namespace.
2. **Seed access goes through `loadSeedStore` only.** Empty-state injection is `buildServer({ seedsPath })` + closure-captured data, not mutable module state.

## Next recommended slice

**Opportunity Pipeline** (slice 2 per `BUILD_PLAN.md`). Two new constraints land with it: `Opportunity.stage` is a case-sensitive enum and `Opportunity.value` is forbidden in API responses. Extend `tests/privacy.spec.ts` with a `value` assertion as the first chunk.
