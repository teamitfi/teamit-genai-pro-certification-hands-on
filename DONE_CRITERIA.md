# Done Criteria: Accounts & Contacts

## Slice
Accounts & Contacts (Slice 1)

## Acceptance conditions

- [ ] `npm test` exits 0 with no skipped tests.
- [ ] A reviewer sub-agent returns `accept` when run against `TASK.md` and `DONE_CRITERIA.md`.
- [ ] No forbidden fields (`Opportunity.value`, `invoiceAmount`) appear in any API response, test assertion, or seed row introduced in this slice.

## Reviewer checklist

- [ ] `GET /accounts` returns all 5 seeded accounts; each has `id`, `name`, `industry`, `renewalDate`, `contacts`.
- [ ] `GET /accounts/:id` returns a single account or 404.
- [ ] `GET /accounts/:id/contacts` returns the contacts array or `[]` (never `null`) or 404 for unknown account.
- [ ] Cetus Agri Co-op contact list returns `[]`, not `null`.
- [ ] No field outside `DOMAIN_MODEL.md` appears in route responses.
- [ ] All tasks in `TASK.md` have a corresponding test assertion.
