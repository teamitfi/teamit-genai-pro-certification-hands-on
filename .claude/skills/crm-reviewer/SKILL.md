---
name: crm-reviewer
description:
  Review a CRM diff against PRODUCT_BRIEF.md, DOMAIN_MODEL.md, TASK.md,
  DONE_CRITERIA.md, and test output, and return an explicit decision.
  Use when reviewing a slice, a pull request, a working-tree diff, or any
  prompt like "review this diff", "review the slice", "review the PR",
  or "is this slice done." Output four sections — Findings, Missing
  evidence, Privacy risks, Decision — with the decision exactly one of
  `accept`, `revise`, or `reject`.
---

Inputs:

- `PRODUCT_BRIEF.md`
- `DOMAIN_MODEL.md`
- `TASK.md`
- `DONE_CRITERIA.md`
- the diff under review (working-tree diff, staged diff, or a PR diff)
- test output (`npm test`) and where useful `npm run lint` and `npm run typecheck`

Workflow:

1. Read `PRODUCT_BRIEF.md` for target user, non-goals, privacy constraints, and acceptance evidence.
2. Read `DOMAIN_MODEL.md` for entities, fields, enums, empty-state contracts, and forbidden fields.
3. Read `TASK.md` and `DONE_CRITERIA.md` for the slice scope, non-goals, tests required, and the explicit done checks.
4. Read the diff line by line. Do not trust the author's summary; read the actual changes.
5. **Hallucination audit.** Enumerate every type, interface, field, JSON key, enum value, route, and seed-data column introduced or referenced by the diff. For each one, find the matching entry in `DOMAIN_MODEL.md`. Any field, key, enum value, or response shape with no match is a hallucination; record it under `## Findings` with `file:line` and tag `hallucinated-field`. Common shapes: invented fields (`accountTier`, `lastBilledAt`, `tier`), invented enum values (`Closed-Won` vs spec `Closed Won`, lowercased `prospect`), shape drift (object where the model declares `Contact[]`), or fake seed rows whose columns the model never declared.
6. **Scope audit.** Build two lists from `TASK.md` and `DONE_CRITERIA.md`: (a) **in-scope behaviors** the slice must deliver, (b) **non-goals** the slice must not deliver. Walk the diff:
   - For every change, mark it `in-scope`, `out-of-scope`, or `unrelated`. Any `out-of-scope` change (new write endpoint, search, pagination, UI added when the slice is API-only, a second slice's entity touched) is a finding tagged `scope-creep`.
   - For every in-scope behavior, mark whether the diff actually delivers it (code path + test). Anything claimed-but-not-delivered or partially delivered is a finding tagged `scope-shortfall`. A missing required test counts as `scope-shortfall`, not just missing evidence.
7. Run or read the output of `npm test`, `npm run lint`, and `npm run typecheck`. Treat missing test output as missing evidence, not as a pass.
8. Cross-check the diff against the four boundaries: product scope, domain model, privacy, and slice done criteria.
9. Write the four output sections, citing files and line numbers from the diff. Carry forward the `hallucinated-field`, `scope-creep`, and `scope-shortfall` tags so reviewers can scan classes of failure at a glance.
10. End with a single explicit decision: `accept`, `revise`, or `reject`. No "needs work", no "looks good", no "LGTM".

Constraints:

- Decision must be exactly one of `accept`, `revise`, or `reject`.
- Apply the same rules whether the author is the user, a sub-agent, or an external contributor; do not soften findings based on who wrote the diff.
- Every finding cites a file path and, where applicable, a line number or diff hunk.
- **Hallucinated fields are not accepted as "obvious additions".** If `DOMAIN_MODEL.md` does not declare a field, type, enum value, or response shape, the diff cannot introduce it. The fix is to update `DOMAIN_MODEL.md` first (via `crm-domain-modeler`) in a separate reviewed commit, then re-submit. No silent extensions.
- **Test-driven hallucination still counts.** A passing test that asserts an invented field is a finding, not evidence. Author-written tests do not legitimize undeclared shape.
- **Scope shortfall is not accepted as "good enough for now".** Every behavior listed in `TASK.md` § Implementation Tasks and every check in `DONE_CRITERIA.md` must be delivered or the slice is not done. Partial delivery → `revise` with the missing items listed by name.
- **Scope creep is not accepted as "while we were in there".** Every change outside the slice's named files and behaviors must be reverted or split into its own slice. Bonus work is a finding, not a feature.
- Flag any exposure of `Opportunity.value` in API or UI as a privacy risk.
- Flag any literal `invoiceAmount` anywhere in `src/` as a privacy risk and reject.
- Flag any collection endpoint that returns `null` instead of `[]` as a domain-contract finding.
- Flag any use of non-enum stage values (e.g., `prospect` instead of `Prospect`) as a domain-contract finding.
- Reject any read or write of `.env`, `.env.*`, `secrets/`, production configs, or real customer data.
- Reject any production data, hidden integrations, vague AI features, billing surfaces, or scope outside `PRODUCT_BRIEF.md`.

Output:

Produce exactly these four sections, in this order:

1. `## Findings` — concrete issues with `file:line` refs. One bullet per issue, prefixed with a tag from this set: `hallucinated-field`, `scope-creep`, `scope-shortfall`, `domain-contract`, `enum-case`, `empty-state`, `test-fidelity`, `other`. Group by file. If none, write "None."
2. `## Missing evidence` — claims in `TASK.md` / `DONE_CRITERIA.md` / commit message that were not demonstrated by tests, diff, or attached output (e.g., tests not run, lint not shown, evidence file not committed). If none, write "None."
3. `## Privacy risks` — any forbidden field, off-limits read, real data, or invoicing surface that appears in the diff. If none, write "None."
4. `## Decision` — exactly one line: `accept`, `revise`, or `reject`. Optionally one short sentence on what would flip the decision.

Decision rules:

- `accept` — tests pass, every behavior in `TASK.md` and every check in `DONE_CRITERIA.md` is delivered, no `hallucinated-field` / `scope-creep` / `scope-shortfall` findings, no missing evidence, no privacy risks.
- `revise` — `scope-shortfall` or `scope-creep` findings present, or other findings exist that are recoverable with concrete fixes; list those fixes in Findings.
- `reject` — privacy risk present, scope outside `PRODUCT_BRIEF.md`, forbidden field introduced, off-limits file touched, the slice is fundamentally wrong against `DOMAIN_MODEL.md`, or a `hallucinated-field` finding extends the public response shape (API/UI) — caller contracts must not be broken via undeclared fields.

Stop conditions:

- Diff is not readable or not provided → stop and ask for the diff (e.g., `git diff` output or a PR ref).
- `TASK.md` or `DONE_CRITERIA.md` is missing for the slice under review → stop and ask the user to run `crm-slice-planner` first.
- Diff requires reading `.env`, `secrets/`, or any off-limits file to judge → stop and reject the review request as out of scope.
- Diff spans more than one slice → stop and ask the user to split the review.
