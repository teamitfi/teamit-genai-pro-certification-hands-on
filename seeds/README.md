# Seeds

Synthetic JSON fixtures used by tests and the dev server. All data is fabricated — no real names, emails, domains, or amounts.

## accounts.json

| Row id (prefix) | Name | Purpose |
|---|---|---|
| `11111111-...` | Aurora Logistics Oy | Happy-path account: one contact, non-null renewalDate. Used by `GET /accounts/:id` shape test. |
| `22222222-...` | Brahe Maritime Ltd | Multi-contact account: two contacts. Used to verify contacts array length. |
| `33333333-...` | Cetus Agri Co-op | Boundary row: `renewalDate` is `null`, `contacts` is `[]`. Used by the null/empty boundary test. |
| `44444444-...` | Draco Energy Holdings | Additional happy-path account with a far-future renewalDate. |
| `55555555-...` | Equuleus Health Networks | Additional happy-path account; contact has a CISO role. |

## accounts.empty.json

| Content | Purpose |
|---|---|
| `[]` | Empty-list contract fixture. Used by `GET /accounts (empty fixture)` test to assert that the endpoint returns `200` and `[]` (not `null`) when the seed source contains no account rows. |
