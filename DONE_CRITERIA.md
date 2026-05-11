# DONE CRITERIA — Slice 1: Accounts & Contacts

All items must be true before this slice is declared done.

## Tests

- [ ] `npm test` passes — zero failures.
- [ ] `GET /accounts` returns 200 with an array.
- [ ] Each account has `id`, `name`, `industry`, `renewalDate`, `contacts`.
- [ ] `contacts` is always an array (never `null`).
- [ ] Account with empty contacts returns `contacts: []`.
- [ ] Account with no renewal date returns `renewalDate: null`.
- [ ] All seed `id` values are present in the response.
- [ ] `GET /accounts/:id` with a valid id returns 200 with that account.
- [ ] `GET /accounts/:id` with an unknown id returns 404.
- [ ] No account or contact object contains `value` or `invoiceAmount`.

## Quality gates

- [ ] `npm run lint` — no errors.
- [ ] `npm run typecheck` — no errors.

## Review

- [ ] `crm-reviewer` returns `accept` (not "looks good").
- [ ] Diff contains no forbidden fields in any response path.
