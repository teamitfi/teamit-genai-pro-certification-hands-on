# DONE — Slice 1: Accounts & Contacts

## End-to-end (the workflow drive-through)
- `who_are_our_customers__lists_seeded_accounts` — `GET /accounts` returns
  HTML containing every account name from `seeds/accounts.json`, with
  industry and renewal date visible per row.
- `who_are_our_customers__detail_shows_account_and_contacts` —
  `GET /accounts/{id}` renders the account header and every contact
  (name, role, email).
- `who_are_our_customers__unknown_id_is_404` — `GET /accounts/does-not-exist`
  returns HTTP 404, no template crash.

## State coverage
- **Empty:** with an empty seed, `/accounts` renders an empty-state
  message ("No accounts yet"), HTTP 200, no error.
- **One row:** with only Aurora, `/accounts` shows exactly one row and
  the detail page lists its single contact.
- **Loaded:** with the full seed, list shows 5 accounts; Brahe detail
  shows both contacts; Cetus detail shows the empty-contacts message
  and no renewal-date row (null handled, not printed as "null").

## Privacy assertions (must hold in tests)
- No `value`, `invoiceAmount`, or any euro/€ amount appears in any
  rendered HTML for this slice.
- `grep -r invoiceAmount src/` is empty (S2.3 hook also enforces this).
- Any JSON endpoint touched by this slice returns `[]` (never `null`)
  for empty `contacts`; verified by a unit test on the seed loader.
- No third-party scripts, no analytics, no cookies set beyond a session
  cookie (none expected in this slice).

## Demo-ability
- `go run ./src` then visiting `http://localhost:3000/accounts` shows
  the seeded accounts; clicking through to a detail page works with
  zero manual setup beyond the repo checkout.
- `go test ./...` is green; `go vet ./...` and `gofmt -l src/` clean.
- `tests/accounts.spec.ts` is removed; no TS toolchain is reintroduced.
