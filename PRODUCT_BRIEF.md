# Product Brief

This file is the product boundary for the CRM lab. Every coding agent, Skill, reviewer, and sub-agent must read it before planning or changing product behavior. Treat it as a source of constraints, not background context.

## 1. Objective / Problem

Account managers need a small, trustworthy CRM view that answers relationship-management questions without the weight or ambiguity of a broad enterprise CRM.

The problem to solve now: agents will use this brief as upstream context for planning, implementation, review, and handoff. If this file is vague, future sessions may invent features, fields, integrations, or data sources. The brief must make the product boundary explicit enough that a fresh coding agent can respect it without further prompting.

## 2. Target Users

The target users are account managers who manage business customer relationships.

Their key needs are:

- Identify customers and contacts quickly.
- Decide which customer to contact next.
- Track whether opportunities are progressing.
- Notice renewals that may be at risk.
- Trust that a change stayed inside the agreed product and data boundary.

## 3. Value Proposition

This CRM is valuable because it gives account managers a focused, reviewable view of customer relationships using synthetic demo data and a small, explicit domain model.

It is different from a general CRM because it is intentionally narrow:

- It answers five named account-management questions.
- It avoids hidden integrations and production data.
- It requires evidence before a slice is called done.
- It treats privacy and forbidden fields as product constraints, not later cleanup.

## 4. Solution Overview

Build a small CRM that lets account managers inspect accounts, contacts, opportunities, activity, and renewal risk.

The CRM exists to answer five core workflow questions:

1. Who are our customers?
2. Who should we contact next?
3. Which opportunities are moving?
4. Which renewals are at risk?
5. What changed, and can we trust it?

Each implementation slice should map to one of these questions and stay within `DOMAIN_MODEL.md`.

## 5. Key Features / Scope

In scope:

- Customer overview: account managers can see which customers exist and who the relevant contacts are.
- Contact prioritization: account managers can identify which customer relationships need follow-up.
- Opportunity movement: account managers can see opportunities grouped by their current pipeline stage.
- Renewal risk: account managers can see which customer renewals may need attention.
- Change trust: reviewers can tell what changed, why it changed, and whether the change stayed inside the product boundary.

Explicit non-goals:

- Not Salesforce. Do not build a broad CRM platform, marketplace, automation suite, customizable object model, or admin console.
- No vague AI features. Do not add AI summaries, scoring, recommendations, chat, forecasting, enrichment, or generated content unless a later accepted brief defines exact inputs, outputs, evidence, and privacy constraints.
- No production customer data. Do not use, import, copy, paste, generate from, or connect to real customer data.
- No hidden integrations. Do not add external APIs, background sync, webhooks, email/calendar integrations, billing systems, analytics trackers, or undocumented data sources.
- No invoicing feature. Invoicing is not in scope for the UI, API, seed data, workflows, reports, or tests.

## 6. Success Metrics

Success is measured by whether account managers can answer the five core workflow questions with confidence.

Product success means:

- Account managers can identify customers and relevant contacts without extra explanation.
- Account managers can see which customer relationships need follow-up.
- Account managers can understand opportunity movement by stage.
- Account managers can notice renewal risk early enough to act.
- Reviewers can understand what changed, why it changed, and whether the change stayed inside the agreed product boundary.

Product acceptance signals:

- Each released slice clearly supports one of the five core workflow questions.
- The demonstrated behavior is understandable from an account manager's point of view.
- Demo data is visibly synthetic and does not imply real customer records.
- Invoicing remains absent from the product experience.
- Sensitive commercial fields, including invoice amounts, are not exposed.
- Scope remains focused: no broad CRM platform features, hidden integrations, or vague AI capabilities are introduced.

## 7. Constraints & Assumptions

Product constraints:

- Keep the product narrow: this is a focused account-management CRM, not a configurable CRM platform.
- Stay within the agreed CRM concepts: accounts, contacts, opportunities, activities, and renewal risk.
- Do not add new customer, opportunity, activity, or renewal concepts unless the product boundary is updated first.
- Opportunity movement should be described using the agreed pipeline stages from `DOMAIN_MODEL.md`.

Privacy constraints:

- No production customer data may be used anywhere in the product, demo, documentation, tests, fixtures, screenshots, examples, or agent prompts.
- Customer names, contact names, email addresses, opportunity names, activities, and renewal dates must be synthetic. They must not identify real companies, real people, or real deals.
- Invoice amounts must not appear in the product experience, demo data, tests, fixtures, screenshots, documentation, generated examples, or agent-created sample output.
- The field name `invoiceAmount` is forbidden and must be treated as a privacy violation if introduced.
- Invoicing, billing, payment status, contract value, and invoice history are outside the product boundary unless a future approved brief explicitly adds them with privacy rules.
- `Opportunity.value` is internal sales-ops data and must not appear in the product experience.
- Demo contact emails must use synthetic work-style addresses only. Do not use real personal data or real customer domains.
- If a proposed change is unclear about whether data is synthetic or sensitive, treat it as out of scope until the brief is updated.

Demo-data assumptions:

- All data is synthetic demo data.
- `seeds/` is the only allowed data source unless a later slice explicitly adds another synthetic fixture location.
- Seed rows should be realistic enough to test workflows, but they must not identify real customers, contacts, invoices, or deals.
- A slice may add synthetic happy-path, boundary, or empty-state rows when needed to prove behavior.

## 8. Timeline / Milestones

Build in small vertical slices:

1. Accounts & Contacts: answer "who are our customers?"
2. Opportunity Pipeline: answer "which opportunities are moving?"
3. Activity Timeline: answer "who should we contact next?"
4. Renewal-Risk Dashboard: answer "which renewals are at risk?"
5. Handoff Polish: answer "what changed, and can we trust it?"

Do not skip ahead. Each slice should be planned, implemented, tested, reviewed, and handed off before expanding scope.

## 9. Stakeholders

- Account managers: primary users and workflow owners.
- Coding agents and sub-agents: must read this brief before planning or changing product behavior.
- Skill authors: must use this brief as an upstream input when creating or running CRM Skills.
- Reviewers: must verify that each slice stays within this brief, `DOMAIN_MODEL.md`, and the acceptance evidence.
- Lab facilitators or maintainers: own the training context and final pass criteria.
