# Product Brief

## Product Boundary

Build a small CRM for account managers. The product helps account managers inspect synthetic customer data, decide what to do next, and explain why the displayed data is trustworthy.

This is an internal demo CRM, not a full sales platform. Every agent, Skill, and sub-agent must treat this file as the product boundary before planning or implementing a slice.

## Target User

The target user is an account manager who owns customer relationships and needs a clear daily view of accounts, contacts, opportunities, activity, and renewal risk.

## Core Workflows

The product exists to answer these five questions:

1. Who are our customers?
   Show accounts and contacts clearly enough for an account manager to identify each customer and the people attached to that customer.

2. Who should we contact next?
   Surface recent activity and contact context so the account manager can decide which customer needs follow-up.

3. Which opportunities are moving?
   Show opportunity pipeline status using the stages defined in `DOMAIN_MODEL.md`. Do not invent stages or fields.

4. Which renewals are at risk?
   Flag accounts with renewal risk using renewal dates and activity recency. Renewal-risk views are read-only.

5. What changed, and can we trust it?
   Provide acceptance evidence for each completed slice: tests, lint/typecheck where applicable, reviewed data contracts, and a short summary of changed files and behavior.

## Non-Goals

- Not Salesforce. Do not build a general-purpose CRM, admin console, workflow engine, reporting suite, or marketplace.
- No vague AI features. Do not add chatbots, scoring, recommendations, summaries, enrichment, or automation unless a specific future brief names exact inputs, outputs, and acceptance evidence.
- No production customer data. Do not read, import, paste, commit, or display real customer, invoice, contact, opportunity, or activity data.
- No hidden integrations. Do not call external CRMs, billing systems, email systems, calendars, analytics tools, or enrichment APIs unless a future reviewed brief explicitly adds that integration.
- No invoicing workflow. Invoices, invoice lists, invoice detail pages, payment status, billing history, and invoice amounts are out of scope.

## Privacy Constraints

- Demo data must be synthetic only.
- Invoice amounts must not appear in the UI, API responses, seed data, tests, logs, screenshots, or generated fixtures.
- `Opportunity.value` is internal sales-ops data and must not appear in API responses or UI.
- Do not introduce fields that look like billing or production financial data, including `invoiceAmount`.
- Work emails in demo data must be fake addresses created for this repo, not real personal or customer addresses.

## Demo-Data Assumptions

- `seeds/` is the only allowed data source for the demo.
- Seed data must be synthetic and safe to show in a classroom, demo, screenshot, or review report.
- Agents may add or adjust synthetic fixtures only when the slice requires it and the data still follows `DOMAIN_MODEL.md`.
- Agents must not infer missing production-like details. If a field is not in `DOMAIN_MODEL.md`, it is not available until the domain model is reviewed and updated first.

## Acceptance Evidence

Before declaring a slice done, show:

- The user workflow or product question the slice answers.
- The files changed and why they changed.
- Tests added or updated for the behavior and data contract.
- Results from the relevant dev-loop commands, especially `npm test`, `npm run lint`, and `npm run typecheck` when available.
- Evidence that forbidden fields and out-of-scope workflows were not introduced.
- Any residual risk or skipped verification, stated explicitly.

## Agent-Readability Check

A fresh agent reading only this file must answer:

- This product is for account managers.
- The core workflows are the five questions: who are our customers; who should we contact next; which opportunities are moving; which renewals are at risk; what changed and can we trust it.
- Invoicing is not in scope. Invoice workflows and invoice amounts are explicitly forbidden.
