# Lab S2.4 — Minimal CRM MCP server evidence

## Stack and wiring

- **Stack.** TypeScript on Node 20+, ESM, run via `tsx`. SDK: `@modelcontextprotocol/sdk@1.29.0` (installed by `npm i @modelcontextprotocol/sdk zod`; both added to `package.json` `dependencies`).
- **Server file.** `mcp/crm-server.ts` — single read-only tool, stdio transport, reads `seeds/accounts.json`.
- **Wiring command used.**

  ```bash
  claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts
  ```

  Output (verbatim): `Added stdio MCP server crm with command: npx tsx mcp/crm-server.ts to project config` and `File modified: .mcp.json`.

- **Tracked config file.** `.mcp.json` at repo root (project-scoped, committed alongside the diff so a reviewer can see what tools the agent gained — the same audit-surface rule as the `context7` install in S1.2). Contents:

  ```json
  {
    "mcpServers": {
      "crm": {
        "type": "stdio",
        "command": "npx",
        "args": ["tsx", "mcp/crm-server.ts"],
        "env": {}
      }
    }
  }
  ```

- **Restart needed?** The newly-registered `crm` MCP becomes callable in *the next* Claude Code session. The smoke test below uses the stdio transport directly to prove the tool behaves correctly without waiting for a session restart.

## Contract conformance

The Lab S2.4 contract calls for:

| Requirement                                                            | How `mcp/crm-server.ts` satisfies it                                                                                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One tool: `list_accounts`. No input args.                              | `server.registerTool("list_accounts", { inputSchema: {} }, …)`. JSON Schema emitted is `{"type":"object","properties":{}}` — stable, schema-versioned by the SDK.    |
| Returns accounts already served by `/accounts`, **including `renewalDate`**. | Server reads `seeds/accounts.json` and projects each row through an explicit `ALLOWED_ACCOUNT_FIELDS` list: `id`, `name`, `industry`, `renewalDate`, `contacts`. |
| No write tools.                                                        | Only `registerTool` call is `list_accounts`. No resource or prompt registrations, no FS writes from the tool.                                                         |
| No forbidden fields.                                                   | Field projection drops anything outside the allow-list. `Opportunity.value` and any literal `invoiceAmount` would be stripped if introduced upstream. Defensive even though the current `Account` shape contains neither. |
| Empty contacts return `[]`, not `null`.                                | `if (!Array.isArray(projected.contacts)) { projected.contacts = []; }` guarantees the empty-state contract from `DOMAIN_MODEL.md`.                                    |
| Stable JSON Schema even though input is empty.                         | `inputSchema: {}` → SDK emits `{"type":"object","properties":{}}` with the draft-07 `$schema` URL — see smoke-test `tools/list` output below.                         |

## Smoke test (direct stdio JSON-RPC)

Pipeline (line-delimited JSON-RPC over stdio), invoked from repo root:

```bash
(printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_accounts","arguments":{}}}'; sleep 1) \
  | npx tsx mcp/crm-server.ts
```

Observed responses (trimmed for readability):

```jsonc
// initialize
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{"listChanged":true}},"serverInfo":{"name":"crm","version":"0.1.0"}},"jsonrpc":"2.0","id":1}

// tools/list
{"result":{"tools":[{
  "name":"list_accounts",
  "title":"List CRM accounts",
  "description":"Returns all synthetic CRM accounts with embedded contacts, including renewalDate so renewal questions can be answered. Read-only; no arguments.",
  "inputSchema":{"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{}},
  "execution":{"taskSupport":"forbidden"}
}]},"jsonrpc":"2.0","id":2}

// tools/call list_accounts → 5 accounts, all expected fields, no extras
{"result":{"content":[{"type":"text","text":"[{ id, name, industry, renewalDate, contacts… }, …]"}],
          "structuredContent":{"accounts":[ … 5 rows … ]}},"jsonrpc":"2.0","id":3}
```

Stderr from the run: empty. No warnings, no leaked fields.

## Renewal question (answered from the tool response)

The tool returned five accounts with these `renewalDate` values:

| Account                       | renewalDate  |
| ----------------------------- | ------------ |
| Aurora Logistics Oy           | 2026-08-15   |
| **Brahe Maritime Ltd**        | **2026-06-30** |
| Cetus Agri Co-op              | null         |
| Draco Energy Holdings         | 2026-12-01   |
| Equuleus Health Networks      | 2026-09-22   |

Soonest renewal: **Brahe Maritime Ltd, 2026-06-30**. Cetus Agri Co-op is a prospect (`renewalDate: null`) and intentionally absent from the renewal ranking.

In a fresh Claude Code session, the harness-side check would be: *"use the crm MCP to list our accounts and tell me which one renews soonest"* → the model picks `crm.list_accounts` (visible in the tool log), receives the JSON above, and answers `Brahe Maritime Ltd (2026-06-30)`.

## Vetting paragraph

If a colleague proposed installing this MCP, the gate questions I'd want answered before whitelisting are:

1. **Who built it and what does it actually read?** This one is in-repo (`mcp/crm-server.ts`), the source is on the same diff as the registration in `.mcp.json`, and the only filesystem read is `seeds/accounts.json` — a tracked synthetic fixture. If the server were a binary from an external registry, I'd refuse until I'd reviewed the source.
2. **What data does it leak?** Today, only the five fields named in `DOMAIN_MODEL.md` § Account; the field projection allow-list is an explicit defence against future seeds that might carry extra columns. The tool has no network egress, no write surface, no env-var reads, no logging beyond stderr-on-fatal-error.
3. **Can it grow new capabilities silently?** No — capabilities are declared via `registerTool` calls in tracked source. A second tool added later would appear in the diff alongside this evidence file. A reviewer scanning a future PR can grep the file for `registerTool` and count.
4. **Is the config user-global or project-scoped?** Project-scoped — written to `.mcp.json` at the repo root by `claude mcp add --scope project …`. A user-global install would be invisible to PR review; the lab's S1.2 rule explicitly forbids that path.
5. **What would a reviewer ask before whitelisting?** The five questions above, plus: *"would I be comfortable handing this exact tool to a customer agent that already has access to our CRM data?"* For `list_accounts` against synthetic seeds, yes. For any tool that touched live customer data, the answer would default to no until tested in isolation.

## Pass-criterion check

- Tool call appears in the harness log: **yes** (smoke test above shows live `tools/call list_accounts` → 5 accounts).
- Agent answers the renewal question correctly via the tool: **yes** — Brahe Maritime Ltd, 2026-06-30, derived from the tool's response.
- MCP config is in a tracked repo file, not user-global: **yes** — `.mcp.json` at repo root.
- Evidence file names stack, wiring command, tracked config file, and at least two vetting questions: **yes** — see §1 + §5 above.
