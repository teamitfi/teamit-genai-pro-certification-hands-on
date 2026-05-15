---
name: accessibility-reviewer
description:
  Review a UI diff against WCAG 2.2 AA and the project's accessibility
  baseline, and return an explicit decision. Use when reviewing UI code,
  React components, HTML templates, design-system changes, or any prompt
  like "review this UI for a11y", "is this accessible", "WCAG check", or
  "accessibility review of the diff." Output four sections — Findings,
  Missing evidence, Risk to assistive tech, Decision — with the decision
  exactly one of `accept`, `revise`, or `reject`.
---

> Sketch Skill. Companion to `crm-reviewer`: that Skill judges product, domain, and privacy; this Skill judges accessibility. Run both on any UI diff.

Inputs:

- the UI diff under review (working-tree, staged, or PR)
- `PRODUCT_BRIEF.md` (target user; non-goals)
- `DOMAIN_MODEL.md` (forbidden-in-UI fields — must not appear regardless of a11y)
- the project's a11y baseline if present (e.g., `docs/accessibility.md` or design-system rules)
- automated check output where available (`axe`, `pa11y`, `eslint-plugin-jsx-a11y`, Storybook a11y addon)

Workflow:

1. Read the diff. List every UI surface touched: pages, components, modals, forms, tables, focusable controls.
2. For each surface, check WCAG 2.2 AA categories:
   - **Perceivable** — text alternatives for non-text, semantic structure, color contrast ≥ 4.5:1 body / 3:1 large or UI, no info-by-color-alone.
   - **Operable** — full keyboard reachability, visible focus, no keyboard traps, target size ≥ 24×24 CSS px (2.5.8), motion respects `prefers-reduced-motion`.
   - **Understandable** — labels tied to inputs, error messages name the field and the fix, consistent navigation.
   - **Robust** — valid roles, ARIA only where native semantics fall short, name/role/value exposed to AT.
3. Check forms specifically: every input has a programmatic label, required state announced, errors associated with `aria-describedby`, autocomplete tokens set where applicable.
4. Check dynamic UI: live regions for async updates, focus management on route change and modal open/close, focus return on close.
5. Cross-check `DOMAIN_MODEL.md` — even an accessible UI is rejected if it surfaces `Opportunity.value` or any literal `invoiceAmount`.
6. Read attached check output. Treat missing axe / lint / manual-test evidence as missing evidence, not as a pass.
7. Write the four output sections, citing `file:line` and the WCAG SC number (e.g., `1.4.3`, `2.4.7`, `4.1.2`).
8. End with one explicit decision: `accept`, `revise`, or `reject`.

Constraints:

- Decision is exactly one of `accept`, `revise`, or `reject`.
- Every finding cites a `file:line` plus the WCAG success-criterion number it violates.
- Do not accept "looks fine in Chrome" as evidence; require keyboard-only walkthrough notes or automated-tool output.
- ARIA is a last resort, not a substitute for native semantics — flag `role="button"` on a `<div>` when `<button>` would do.
- Color contrast is measured, not eyeballed — flag any pair without a contrast ratio in the evidence.
- Forbidden-in-UI fields from `DOMAIN_MODEL.md` are a `reject` regardless of a11y score.
- Apply same rigor to sub-agent diffs, vendor UI snippets, and human PRs.

Output:

Produce exactly these four sections, in this order:

1. `## Findings` — concrete issues, one bullet per issue, `file:line` + WCAG SC. Group by surface. If none, write "None."
2. `## Missing evidence` — what the diff or PR claims but does not show (axe run, keyboard walkthrough, screen-reader pass, contrast ratios, reduced-motion check). If none, write "None."
3. `## Risk to assistive tech` — what would break for screen-reader, keyboard-only, switch-control, voice-control, low-vision, or cognitive-load users. If none, write "None."
4. `## Decision` — exactly one line: `accept`, `revise`, or `reject`. Optional one short sentence on what would flip the decision.

Decision rules:

- `accept` — no findings, evidence present (automated + at least one manual check), no AT risk, no forbidden-in-UI field.
- `revise` — findings are fixable in place; list the concrete fixes in Findings.
- `reject` — keyboard trap, missing name/role/value on an interactive control, forbidden-in-UI field, or pattern that excludes a user group wholesale (e.g., drag-only with no keyboard alternative).

Stop conditions:

- Diff is not a UI diff (no template, JSX, HTML, CSS, or design-token change) → stop and tell the user this Skill does not apply; route to `crm-reviewer`.
- No baseline and no automated tool output available → still review, but flag "no baseline" as missing evidence.
- Diff requires manual screen-reader testing the reviewer cannot run → stop and ask the user for a recorded NVDA / VoiceOver walkthrough before final decision.
