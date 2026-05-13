# Lab S2.4 MCP Server Evidence

## Stack and wiring

- **Language:** TypeScript
- **SDK:** `@modelcontextprotocol/sdk` (installed via `npm i @modelcontextprotocol/sdk`)
- **Server file:** `mcp/crm-server.ts`
- **Wiring command:** `claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts`
- **Tracked config file:** `.mcp.json` (project-scoped, committed)

## What the server exposes

One read-only tool: `list_accounts`. No input arguments. Returns all accounts from `seeds/accounts.json` with fields projected to the declared `DOMAIN_MODEL.md` shape (`id`, `name`, `industry`, `renewalDate`, `contacts`). No write tools. No forbidden fields — `Opportunity.value` and `invoiceAmount` cannot appear because the serializer explicitly selects only declared Account fields.

## Vetting assessment

**Who I would let install this:**
Any developer or agent working within this repo on the Accounts slice. The server is read-only, serves only synthetic seed data, and is project-scoped — it is not accessible outside this repo's sessions.

**What data does it leak:**
Contact work emails (`email` field on each Contact). These are synthetic in this repo, but on a real deployment would be personal data under GDPR. The server has no auth, no rate limiting, and no filtering — any agent or user who can reach it gets all accounts and all contacts in one call.

**Questions a reviewer should ask before whitelisting:**

1. *Is the data source synthetic or real?* — This server reads `seeds/accounts.json`. If that file were ever replaced with real customer data, the MCP tool would expose it to every connected agent without any access control.
2. *Is the server project-scoped and committed?* — Yes. It is in `.mcp.json` at the repo root, visible in every diff. A user-global install would be invisible to reviewers — that is the supply-chain blind spot this lab is designed to surface.
3. *What happens when the domain model grows?* — If `Opportunity.value` or `invoiceAmount` were added to the seed data, does the server still strip them? Yes — the `serializeAccount` projection is explicit, so undeclared fields never reach the response.
4. *Does the server have any write capability?* — No. Only `list_accounts` is registered. There are no tools that mutate state.
