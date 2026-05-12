# Build Plan

The build is delivered as five vertical slices. Each slice is small enough to plan, implement, and review inside a single agent session. Don't skip ahead — every slice depends on the boundary work in the previous one.

## Slice order

### 1. Accounts & Contacts (Session 1, Lab S1.4 starts this)

List and detail for `Account` and `Contact`. The minimum that lets an account manager answer "who are our customers?" Backed by `seeds/accounts.json`. Tests live in `tests/accounts.spec.ts`.

### 2. Opportunity Pipeline (Session 2 stretch)

`Opportunity` records grouped by `stage`. The list answers "which opportunities are moving?" Stage values are an enum defined in `DOMAIN_MODEL.md` — do not invent new ones. String comparison must be case-sensitive against the enum.

### 3. Activity Timeline (stretch)

`Activity` log per account: calls, emails, meetings, notes. Chronological order, newest first. Answers "who should we contact next?" by surfacing accounts with the oldest most-recent activity.

### 4. Renewal-Risk Dashboard (stretch)

A read-only summary view that flags accounts whose `renewalDate` falls within the next 90 days and whose most recent `Activity` is older than 30 days. Answers "which renewals are at risk?" Read-only on purpose — no writes from this slice.

### 5. Handoff polish (final pass)

`HANDOFF.md` lists what's done, what's open, and one risk per open item. The reviewer skill runs end-to-end on the diff. The 6-item Teamit checklist is walkable for this project.

## Rules

- Stay within `DOMAIN_MODEL.md`. New fields require updating the model first.
- One slice at a time. The planner skill stops if a request would span more than one slice.
- No production data. `seeds/` is the only allowed data source.
