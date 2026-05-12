# Domain Model

The agent reads this file before writing or reviewing CRM code. **Do not invent fields.** If a slice needs a new field, the model is updated here first, in a commit reviewed before any code changes.

## Account

| Field         | Type                   | Notes                                                          |
| ------------- | ---------------------- | -------------------------------------------------------------- |
| `id`          | string                 | UUID. Stable across renames.                                   |
| `name`        | string                 | Legal entity name. Display in lists.                           |
| `industry`    | string                 | Free-text for v0.1. May become an enum in v0.2.                |
| `renewalDate` | string (ISO 8601 date) | Used by the renewal-risk dashboard. May be null for prospects. |
| `contacts`    | `Contact[]`            | Embedded.                                                      |

## Contact

| Field       | Type   | Notes                                        |
| ----------- | ------ | -------------------------------------------- |
| `id`        | string | UUID.                                        |
| `accountId` | string | FK to `Account.id`.                          |
| `name`      | string | Full name.                                   |
| `role`      | string | Free text (e.g., "CTO", "Procurement Lead"). |
| `email`     | string | Work email.                                  |

## Opportunity

| Field       | Type   | Notes                                                                                         |
| ----------- | ------ | --------------------------------------------------------------------------------------------- |
| `id`        | string | UUID.                                                                                         |
| `accountId` | string | FK to `Account.id`.                                                                           |
| `name`      | string | Short label (e.g., "Q3 platform expansion").                                                  |
| `stage`     | enum   | One of: `Prospect`, `Qualified`, `Proposal`, `Closed Won`, `Closed Lost`. **Case-sensitive.** |
| `value`     | number | In EUR. Internal — see [Forbidden in API](#forbidden-in-api).                                 |

## Activity

| Field       | Type                       | Notes                                       |
| ----------- | -------------------------- | ------------------------------------------- |
| `id`        | string                     | UUID.                                       |
| `accountId` | string                     | FK to `Account.id`.                         |
| `type`      | enum                       | One of: `Call`, `Email`, `Meeting`, `Note`. |
| `at`        | string (ISO 8601 datetime) | When the activity happened.                 |
| `summary`   | string                     | One-line description.                       |

---

## Empty-state contracts

Endpoints that return collections **must return `[]`** when the collection is empty. **`null` is not allowed.** Returning `null` for an empty contact list (etc.) breaks the contract.

## Forbidden in API

Some fields exist in the data model but **must never appear in API responses or UI**. They are tracked for internal accounting only:

- `Opportunity.value` — leak risk; internal sales-ops field.
- `invoiceAmount` — **does not exist in this domain.** It is named here so reviewers can flag it on sight: any code that introduces a field literally called `invoiceAmount` is a privacy violation and must be rejected.

The Lab S2.3 hook fallback (`scripts/lab-s2-3-wrapper.sh`) refuses commits that introduce the literal `invoiceAmount` in `src/`.

## Versioning

Changes to this file require:

1. A note in the commit body explaining what's added or removed and why.
2. A test in `tests/` that demonstrates the new field's contract.
3. A reviewer pass that confirms no forbidden fields were added.
