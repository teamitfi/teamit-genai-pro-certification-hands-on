# Product Brief

**For:** Account managers at a B2B services company. Not developers, not finance.

**WCore workflows:** A read-only CRM that answers five questions:

1. Who are our customers? — account + contact list and detail
2. Who should we contact next? — accounts with oldest most-recent activity
3. Which opportunities are moving? — opportunities grouped by stage
4. Which renewals are at risk? — accounts renewing within 90 days with no activity in 30 days
5. What changed and can we trust it? — every slice is reviewed before it ships

**Non-goals (hard stops):**

- Not Salesforce — no automation, email integration, or forecasting
- No invoicing, billing, or financial data of any kind — `invoiceAmount` does not exist in this domain; any code introducing it is rejected
- No AI product features — the agent assists developers, it is not a feature
- No writes from the Renewal-Risk Dashboard
- No user authentication
- No production data — `seeds/accounts.json` only

**Privacy:** `Opportunity.value` is internal — forbidden in API responses and UI. Contact emails must not be logged.

**Data:** Synthetic only (`seeds/accounts.json`). Null `renewalDate` and empty `contacts[]` are valid.

**A slice is done when:** `npm test` passes, reviewer Skill returns `accept`, no forbidden fields in responses, `DONE_CRITERIA.md` is ticked, `HANDOFF.md` is written.
