# Lab S2.4 — MCP Server Evidence

## Stack and wiring

- **Language / runtime:** TypeScript, Node 20+, `tsx` for execution
- **MCP SDK:** `@modelcontextprotocol/sdk` (npm)
- **Server file:** `mcp/crm-server.ts`
- **Wiring command:**
  ```
  claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts
  ```
  (Alternatively, the entry was added directly to `.mcp.json` — same result.)
- **Tracked config file:** `.mcp.json` at the repo root (committed, visible in every diff)

## Tool exposed

| Tool | Args | Returns |
|---|---|---|
| `list_accounts` | none | All accounts from `seeds/accounts.json` — id, name, industry, renewalDate, contacts[] |

No forbidden fields (`invoiceAmount`, `Opportunity.value`) are present in the seed data or returned by the tool. The server description explicitly states this for reviewer confidence.

## Renewal question answer (via tool)

When asked "which account renews soonest?", the tool returns all accounts and the agent identifies:

**Brahe Maritime Ltd — renewalDate 2026-06-30** (earliest non-null renewal date).

The agent must call `list_accounts` (visible in the tool-call log) rather than reading `seeds/accounts.json` directly.

## Vetting — cert checklist item 4

**Who would I let install this MCP?**  
Any team member working on this CRM lab. The server is read-only, ships no credentials, reads only synthetic seed data, and is scoped to a local `stdio` process — it never opens a network port or writes anything.

**What data does it leak?**  
Only the content of `seeds/accounts.json`: company names, industry labels, renewal dates, and contact names/emails. All synthetic. No financial data, no `invoiceAmount`, no `Opportunity.value`. The contacts do include fictional email addresses — still worth noting that real equivalents of this data (real customer emails) must never replace the seed file.

**Two vetting questions a reviewer should ask before whitelisting:**

1. *Is the data source scoped to synthetic seeds only, or could this server be pointed at a live DB by changing one config line?*  
   Answer here: yes, currently it reads a hardcoded `seeds/accounts.json` path. A reviewer should verify the path is not configurable via an env var that could be swapped to a production data source.

2. *Does the server introduce any write tools, or could a future contributor add one without a separate review gate?*  
   Answer here: no write tools today. The lab contract explicitly forbids them. A reviewer should confirm no `write`/`update`/`delete` handler names appear in `mcp/crm-server.ts` and that the evidence file documents this constraint so future contributors know to open a new review before adding write capability.
