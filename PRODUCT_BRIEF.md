# Product Brief

This brief is the upstream input to every Skill, sub-agent, and session. Read it before
proposing scope, writing routes, generating fixtures, or reviewing a diff. If a request
contradicts this file, stop and surface the conflict — do not silently widen scope.

## Target user

**Account managers at a B2B SaaS vendor.** One person, one laptop, mid-week check-in.
They own a portfolio of 20–80 accounts, are responsible for renewals and expansion, and
need to answer the five questions below in under a minute each — without learning a new
tool, without writing SQL, and without trusting that a model "probably" got it right.

They are **not** sales ops, **not** executives building forecasts, and **not** new-logo
hunters. Design every surface for the recurring portfolio review, not the deal room.

## Core workflows — the five questions

Every slice in `BUILD_PLAN.md` exists to answer one of these. If a feature does not
move one of these answers forward, it does not belong in v0.x.

| #   | Question                              | Surface that answers it             | Slice |
| --- | ------------------------------------- | ----------------------------------- | ----- |
| 1   | Who are our customers?                | Accounts list + Contacts per account | 1     |
| 2   | Who should we contact next?           | Activity timeline, oldest-touch first | 3     |
| 3   | Which opportunities are moving?       | Opportunities grouped by `stage`    | 2     |
| 4   | Which renewals are at risk?           | Renewal-risk dashboard (90/30 rule) | 4     |
| 5   | What changed, and can we trust it?    | Seed provenance + deterministic responses; every list endpoint round-trips a fixture in `seeds/` | cross-cutting |

Question 5 is not a feature — it is a **constraint on every other answer**. If the user
cannot trace a row back to a synthetic fixture, the answer is not trustworthy.

## Non-goals

State each as a refusal an agent can match against:

- **Not Salesforce.** No custom objects, no record types, no permission sets, no
  formula fields, no workflow builder. If a request reaches for parity with a CRM
  vendor, push back.
- **No vague AI features.** No "AI-powered insights," "smart suggestions," or
  summary blurbs that cannot be traced to a specific record. If a feature cannot
  cite the rows it is derived from, it is not in scope.
- **No production customer data.** Real names, real emails, real revenue, real
  domains never enter the repo — not in seeds, not in tests, not in fixtures, not
  in commit messages. Synthetic only. See Demo-data assumptions.
- **No hidden integrations.** No outbound HTTP, no webhooks, no email sending, no
  third-party APIs in v0.x. The system is in-process and inspectable. Adding an
  integration requires a new slice and an explicit brief amendment.
- **No multi-tenancy, no auth, no RBAC.** Single-user local lab. Do not scaffold
  identity primitives "for later."
- **No write paths beyond what a slice declares.** The renewal-risk dashboard
  (slice 4) is read-only on purpose.

## Privacy constraints

Treat these as hard rules. A diff that violates them must be rejected.

- **`Opportunity.value` must not appear in any API response or UI surface.** It exists
  in the internal data model for sales-ops accounting only. Serializers strip it; tests
  assert it is absent.
- **The literal field name `invoiceAmount` must never appear in `src/`.** It does not
  exist in the domain (see `DOMAIN_MODEL.md`); its mention is a tripwire. The S2.3 hook
  refuses commits that introduce it.
- **No PII in logs.** Contact emails, names, and account names must not be written to
  stdout, log files, or error messages beyond the IDs needed to debug.
- **`.env` and `secrets/` are unreadable to the agent** — enforced by `.claude/settings.json`.
  Do not propose workarounds.

If a future slice needs to surface a monetary or sensitive field, update `DOMAIN_MODEL.md`
first via the `crm-domain-modeler` skill and add a test that pins the new contract.

## Demo-data assumptions

- **All data in `seeds/` is synthetic.** Generated names, role-shaped emails on
  fictional domains (`@example.test`, `@acme-demo.invalid`), invented industries.
- **Fixtures are the source of truth for response shapes.** A route's response must
  round-trip a `seeds/*.json` row; a test asserts shape equality. If the fixture and
  the response disagree, the fixture wins until `DOMAIN_MODEL.md` is updated.
- **Empty states are first-class.** Every list endpoint must return `[]` for an empty
  collection; never `null`. At least one fixture file per entity exercises the empty
  case, generated via the `crm-test-fixtures` skill.
- **Boundary rows are explicit.** Renewal exactly 90 days out, activity exactly 30
  days old, stage transitions on both sides of an enum boundary — each lives as a
  named fixture row so a reviewer can point at it.
- **Generation is reproducible.** Re-running fixture generation on the same seed
  must produce byte-identical files. No `Date.now()`, no `Math.random()` without a
  seeded RNG.

## Acceptance evidence — what proof a slice is done

Before declaring a slice complete, the agent must produce **all** of the following.
A green test alone is not sufficient.

1. **`npm test` passes** — full Vitest run, no skipped specs, no `.only`.
2. **`npm run typecheck` passes** — `tsc --noEmit` clean.
3. **`npm run lint` passes** — ESLint clean, no `--fix`-pending changes left in the diff.
4. **Each new endpoint has at least three tests:** happy path, empty-state (`[]`),
   and one domain-rule assertion (e.g., forbidden field absent, enum case-sensitive,
   chronological order, renewal threshold).
5. **Privacy assertion present.** For any slice touching `Opportunity`, a test
   asserts `value` is not in the response. For any slice touching files under `src/`,
   a grep for `invoiceAmount` returns no matches.
6. **Fixture provenance.** Every response shape introduced is anchored to a file
   under `seeds/`; the test that asserts the shape names that file.
7. **`HANDOFF.md` written via `crm-handoff-writer`** — what was completed, files
   changed, test status, open risks, the next recommended slice. Required at the end
   of the slice, not at the end of the session.
8. **No new production-shaped data.** A reviewer pass over the diff confirms no real
   names, real domains, real amounts, or real email patterns were introduced.

If any of these is missing, the slice is not done — it is in progress.
