# Product Brief

This document describes who uses this CRM, what problems it solves, and what constraints must hold. Agents read this before planning or reviewing a slice.

---

## Target user

An **account manager at a B2B IT services firm** (e.g. Teamit). Non-technical. Manages an ongoing book of customer accounts — not closing new logos, but keeping existing relationships healthy and renewals on track. Works from a browser; does not write SQL or call APIs directly.

Primary pain: too many accounts, not enough signal about which ones need attention today.

---

## Core workflows

### 1. Who are our customers?
List all accounts with their embedded contacts. The account manager needs to quickly identify who the account belongs to and who to call. Backed by `GET /accounts`.

### 2. Who should we contact next?
The Activity Timeline surfaces accounts ordered by their most recent activity, oldest first. An account with no recent call, email, or meeting is the one that needs attention. Backed by activities per account.

### 3. Which opportunities are moving?
The Opportunity Pipeline groups open opportunities by stage (`Prospect → Qualified → Proposal → Closed Won / Closed Lost`). Stage values are an enum — case-sensitive, never free-text. The manager scans this to prioritise follow-up.

### 4. Which renewals are at risk?
The Renewal-Risk Dashboard flags accounts where:
- `renewalDate` falls within the next **90 days**, AND
- the most recent `Activity` is older than **30 days**.

This view is **read-only**. No editing, no actions — only signal.

### 5. What changed and can you trust it?
An activity log / changelog feed showing recent changes across accounts, contacts, and opportunities. The manager uses this to verify that what they see reflects reality — not stale or missing data.

---

## Non-goals

This CRM is deliberately minimal. Each item below is a hard boundary — do not add these features, do not design toward them, do not leave hooks for them.

**Not Salesforce.**
No workflow automation, approval chains, forecasting, pipeline weighting, custom objects, or configurable field layouts. If a feature sounds like it belongs in an enterprise CRM, it does not belong here. The account manager needs signal, not a platform.

**No vague AI features.**
No generative summaries, AI-written follow-up emails, lead-scoring models, sentiment analysis, or "insights" widgets. AI is used in the development toolchain (agent-driven slices, Skills), not in the product itself. If a feature requires a model call at runtime, it is out of scope.

**No production customer data.**
There is no import flow, no CSV upload, no API sync, and no mechanism to display real customer records. All data is synthetic seed fixtures. Any code path that could accept real names, real emails, or real company data from an external source is a scope violation.

**No hidden integrations.**
No connection to email (Outlook, Gmail), calendar, ERP, billing, or ticketing systems. Activities are entered manually. There are no webhooks, no OAuth flows, and no background jobs that pull from external APIs. What you see in `seeds/` is the only data source.

---

## Privacy constraints

These rules apply to all code, seeds, and API responses:

1. **`Opportunity.value` is forbidden in API responses.** It is an internal sales-ops field. Any route that exposes it must be rejected.
2. **`invoiceAmount` must never appear in code or the UI.** It does not exist in the domain. Any PR that introduces this field name in `src/` is a privacy violation and will be blocked by the pre-commit hook.
3. **No real customer data in seeds or tests.** All fixture data uses invented names, fictional emails, and fabricated companies.
4. **Invoice amounts of any kind must not appear in the UI**, regardless of field name.

See `DOMAIN_MODEL.md` for the full list of forbidden fields and the rationale.

---

## Demo-data assumptions

Agents must not write code that assumes more or less than what the seed files provide.

| Assumption | Detail |
|---|---|
| **5 accounts** | Exactly five accounts in `seeds/accounts.json`. Tests assert this count. |
| **2 contacts per account** | Each account embeds exactly 2 contacts (10 contacts total). |
| **One null `renewalDate`** | One account is a prospect with no renewal date. Code must handle `null` without throwing. |
| **All enum values represented** | The seeds exercise every valid value of `Activity.type` and `Opportunity.stage`. Tests that assert enum values should not add new ones not in `DOMAIN_MODEL.md`. |
| **Static JSON, no persistence** | Seeds are read from disk at request time. There is no database. No mutations survive a server restart. |

---

## Acceptance evidence

A workflow is considered done when:

1. **All Vitest specs pass** — `npm test` exits 0, with no skipped tests.
2. **Curl smoke test passes** — the running server (`npm run dev`) returns correct data against at least the happy path and the null-`renewalDate` edge case.
3. **No forbidden fields leak** — `Opportunity.value` and `invoiceAmount` are absent from all API responses.

The `crm-reviewer` Skill (added in S2.1) performs a structured diff review before a slice is merged. Its accept/revise/reject decision is the final gate.
