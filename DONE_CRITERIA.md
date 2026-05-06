# Done Criteria — Slice 1

## Tests

- [x] `tests/accounts.spec.ts` passes (`npm test` exits 0)
- [x] Response contains all 5 seed accounts by ID
- [x] Each account has `id`, `name`, `industry`, `contacts` (array, never null)

## Build

- [x] `npm run typecheck` — zero errors
- [x] `npm run lint` — zero errors

## Privacy

- [x] No `Opportunity.value` or `invoiceAmount` in any response

## Review

- [ ] `crm-reviewer` Skill returns **Accept** on the diff
