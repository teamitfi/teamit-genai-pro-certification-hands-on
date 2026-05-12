# Product Brief

## Target user

Account Managers and other sales staff at Teamit are the key users. They are not power users of CRM tooling — most have lived with a heavyweight system before and want less, not more.

* **Primary** — Account Managers running a book of named accounts; they need to know who to call, what changed, and what's at risk before their next 1:1.
* **Secondary** — Sales leadership and CSMs who dip in for pipeline and renewal context, not for daily data entry.
* **Out of scope as users** — finance, marketing ops, external partners; the app is not a system of record for them.
* **Working context** — keyboard-first, used between meetings, often on a laptop with one hand on coffee. Snappy beats feature-rich.

## Core workflows

The five questions an AM should be able to answer in one screen each:

* **Who are our customers** — browseable account list with enough context to recognise who matters.
* **Who should we contact next** — a ranked list of contacts with a reason attached to each.
* **Which opportunities are moving** — pipeline view that surfaces stage changes, not just current stage.
* **Which renewals are at risk** — renewals filtered by signal (usage, sentiment, days-to-renew), not just date.
* **What changed and can we trust it** — an activity feed with provenance for every entry.

## Non-goals

* Not a Salesforce — stripped down for snappy day-to-day use, no bloat.
* No hidden integrations or vague LLM-invented features.
* Not a financial system — exact invoice amounts must not appear in the frontend.
* No real customer data, ever.

## Data Privacy

GDPR applies — even with synthetic data, the app is built as if every record were a real EU data subject.

* **Cookies & tracking** — purely functional cookies only, no cookie banner, no analytics or third-party tracking.
* **Data minimisation** — collect and display only fields that serve one of the five workflows; no "just in case" columns.
* **Purpose limitation** — personal data shown to AMs is for sales follow-up only, not profiling or scoring beyond what the workflows need.
* **Data residency** — all storage and processing stays in the EU; no transfers to non-adequate jurisdictions.
* **Sub-processors** — no hidden third-party calls; any external service (incl. LLM providers) must be EU-hosted or covered by an explicit SCC and listed in the repo.
* **Subject rights** — every contact and account record must be reachable by ID for access, rectification, and erasure; deletion is hard-delete, not soft-delete.
* **Retention** — activity and audit entries have an explicit retention window; nothing is kept "forever".
* **Auditability** — reads and writes against personal data are logged with actor and reason so "what changed and can we trust it" has a real answer.

## Demo Data

Only synthetic data, no production data ever — not in dev, not in staging, not in screenshots.

* **Generation** — fixtures live in the repo under `seeds/` and are reproducible from a script; no manual hand-edits in the database.
* **Realism** — names, domains, and amounts must look plausible (Finnish/EU companies, EUR currency, sensible deal sizes) without resembling any real Teamit customer.
* **Coverage** — every workflow needs at least one happy-path row, one empty-state case, and one boundary/edge row (e.g. a renewal due tomorrow, an opportunity with no activity).
* **No leakage** — generated data must not include real email addresses, phone numbers, or domains; use reserved TLDs (`.example`, `.test`) and `+demo` aliases.
* **Resettable** — a single command wipes and reseeds; nothing about the demo should require manual setup steps.

## Acceptance

Show e2e proof that a feature is done via tests before declaring it done. If it ain't tested, it ain't merged bro.

* **End-to-end first** — each workflow ships with at least one e2e test that drives it through the UI the way an AM would; unit tests support but don't replace this.
* **Workflow-anchored** — tests are named after the five questions, so coverage gaps map directly to product gaps, not to internal modules.
* **Empty and boundary states** — every screen is tested with no data, with one row, and with a realistic loaded dataset; "looks fine on my fixture" is not acceptance.
* **Privacy assertions** — tests assert the privacy rules hold (no invoice amounts in the DOM, hard-delete actually removes the row, audit log entry exists for personal-data reads).
* **CI-gated merges** — tests run in CI on every PR; a red build blocks merge, and skipping or `.only` markers are treated as failures.
* **Demo-able** — a feature is only "done" when it can be shown end-to-end against the seeded demo data without manual setup.

