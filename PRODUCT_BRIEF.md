# Product Brief

## Target user

Account managers.

## Core workflows

The CRM exists to answer five questions:

1. Who are our customers?
2. Who should we contact next?
3. Which opportunities are moving?
4. Which renewals are at risk?
5. What changed, and can we trust it?

A slice is in scope only if it improves the answer to one of these.

## Non-goals

- **Not Salesforce.**
- **No vague AI features.**
- **No production customer data.**
- **No hidden integrations.**

## Privacy constraints

- Invoice amounts must not appear in the UI. `invoiceAmount` and `Opportunity.value` are forbidden in API responses and rendered components (see `DOMAIN_MODEL.md` § Forbidden in API).

## Demo-data assumptions

Synthetic data only. The seeds in `seeds/` are fabricated; real customer data must never be added.

## Acceptance evidence

Before a slice is declared done:

1. Tests pass (`npm test`).
2. A reviewer (human or `crm-reviewer`) returns `accept` — not "looks good."
3. The diff contains no forbidden fields in UI code.
4. `HANDOFF.md` is updated.
