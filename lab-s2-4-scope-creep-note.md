# Lab S2.4 — Scope-creep note (the second tool that "felt fine")

## What I added

I copied the canonical `mcp/crm-server.ts` to a new file `mcp/crm-server-extended.ts` and added a second read-only tool, `get_account_by_id`, that takes a single `id` argument (zod `z.string().uuid()`) and returns the matching synthetic account or an `isError: true` `not_found` payload. The new tool reuses `loadAccounts()` so the same `ALLOWED_ACCOUNT_FIELDS` projection runs — no forbidden fields can leak even if `seeds/accounts.json` grows new columns later — and the empty-`contacts`-is-`[]` invariant is preserved. The extended file is intentionally NOT registered in `.mcp.json`: the canonical single-tool server is still the only one a real Claude Code session sees, so the existing `lab-s2-4-mcp-evidence.md` stays accurate. The extended file is the scope-creep sandbox the lab is exercising, nothing more.

## Smoke test

Command run from repo root:

```bash
(printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_account_by_id","arguments":{"id":"33333333-3333-4333-8333-333333333333"}}}'; sleep 2) \
  | npx tsx mcp/crm-server-extended.ts
```

Observed stdout (line-delimited JSON-RPC, lightly reflowed for readability — actual frames were single-line):

```jsonc
// initialize
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{"listChanged":true}},
           "serverInfo":{"name":"crm-extended","version":"0.1.0"}},"jsonrpc":"2.0","id":1}

// tools/list — now TWO tools, which is the whole point of this note
{"result":{"tools":[
  {"name":"list_accounts","title":"List CRM accounts",
   "description":"Returns all synthetic CRM accounts with embedded contacts, including renewalDate so renewal questions can be answered. Read-only; no arguments.",
   "inputSchema":{"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{}},
   "execution":{"taskSupport":"forbidden"}},
  {"name":"get_account_by_id","title":"Get CRM account by id",
   "description":"Returns a single synthetic CRM account (with embedded contacts) by its UUID id. Read-only. Errors if no account matches the id.",
   "inputSchema":{"$schema":"http://json-schema.org/draft-07/schema#","type":"object",
                  "properties":{"id":{"type":"string","format":"uuid",
                                      "pattern":"^([0-9a-fA-F]{8}-…)$",
                                      "description":"UUID of the Account to fetch (Account.id from the domain model)."}},
                  "required":["id"]},
   "execution":{"taskSupport":"forbidden"}}
]},"jsonrpc":"2.0","id":2}

// tools/call get_account_by_id — empty-contacts row, contract held
{"result":{"content":[{"type":"text","text":
  "{\n  \"id\": \"33333333-3333-4333-8333-333333333333\",\n  \"name\": \"Cetus Agri Co-op\",\n  \"industry\": \"Agriculture\",\n  \"renewalDate\": null,\n  \"contacts\": []\n}"}],
  "structuredContent":{"account":{"id":"33333333-3333-4333-8333-333333333333",
                                  "name":"Cetus Agri Co-op","industry":"Agriculture",
                                  "renewalDate":null,"contacts":[]}}},"jsonrpc":"2.0","id":3}
```

Observed stderr: **empty**. Process exit code: **0**.

The Cetus Agri Co-op row exercises both contract edges in a single call: `renewalDate: null` (prospect, allowed by `DOMAIN_MODEL.md` § Account) and `contacts: []` (the empty-state contract from `DOMAIN_MODEL.md` § Empty-state contracts — `null` would have been a contract violation).

## What I'd be tempted to add next, and why a reviewer should push back

| Tool I might add next | Why it "feels harmless" | What the reviewer should say |
| --- | --- | --- |
| `search_accounts(query)` | "It's still read-only, just a filter on top of `list_accounts`." | Push back: nothing in PRODUCT_BRIEF.md § Core workflows asks for fuzzy/free-text search, the existing `list_accounts` already returns the whole synthetic set (5 rows!) which the model can filter itself, and a query parameter is the first step toward an opaque server-side ranker no diff will ever capture. |
| `list_opportunities` | "Opportunities are in DOMAIN_MODEL.md, this just mirrors what Slice 3 will eventually expose." | Push back: `Opportunity.value` is explicitly listed in DOMAIN_MODEL.md § Forbidden in API and PRODUCT_BRIEF.md § Privacy and data-handling constraints; an Opportunity tool needs its own allow-list and its own privacy review, not a quiet bundling under "we already have an MCP." Until Slice 3 lands with TASK.md/DONE_CRITERIA.md, this tool has no business existing. |
| `list_recent_activity(accountId)` | "Workflow #2 in PRODUCT_BRIEF.md is literally 'who should we contact next' — surely activity belongs in the MCP." | Push back: the workflow is real but the slice isn't built yet; exposing an Activity tool before there is an Activity API, fixture rows, and tests means the MCP becomes the de-facto spec and the slice planner's TASK.md gets bypassed. Wait for the Activity slice, then add the tool with its own evidence file. |
| `update_account(id, patch)` | "It's just one mutation, gated to the synthetic seed, easy to add a write tool." | Reject outright: the canonical S2.4 contract is "no write surface." A write tool changes the threat model entirely (prompt-injection-driven data corruption, no audit log, no auth) and there is no PRODUCT_BRIEF.md workflow that asks for in-MCP edits — the API surface in `src/routes/` is the only mutation path. |
| `delete_account(id)` | "Same shape as the others, useful for cleaning up demo data." | Reject outright: destructive, write-surface, and irreversible against a shared fixture file; PRODUCT_BRIEF.md § Demo-data assumptions says the seeds are the shared training corpus, not a scratch DB. A reviewer should refuse to even discuss this tool. |
| `bulk_export(format)` | "It's just `list_accounts` with a CSV switch — convenience for AMs." | Push back: export endpoints are exfiltration endpoints. Today the seed is synthetic so the risk is low, but the moment this MCP is pointed at anything real, a single tool call dumps the whole table; PRODUCT_BRIEF.md § Non-goals says "no hidden integrations" and an export tool is the first hop in one. If export is needed, it belongs in the audited API surface with its own slice. |

## How the creep started

The second read-only tool felt harmless because it reused the same loader, the same allow-list, the same empty-state guard, and the same `seeds/accounts.json` file — every safety property of the canonical server transferred mechanically, and the JSON Schema for the new `id` argument was generated by the SDK from a one-line zod definition. From inside the diff it looks like ten extra lines that obey every rule in `lab-s2-4-mcp-evidence.md` § Contract conformance. The thing that's actually happening, though, is that the MCP grew from "one declared capability" to "two declared capabilities" without a TASK.md, without a DONE_CRITERIA.md, without a domain-model check, and without a reviewer pass — every safeguard PRODUCT_BRIEF.md § Acceptance evidence relies on was skipped because the change was framed as "extending an existing slice" rather than as its own slice. The rule I'd commit to next time: **every additional MCP tool is its own vertical slice with its own `TASK.md`, its own `DONE_CRITERIA.md`, its own test (an actual `tests/` file that calls the tool over stdio and asserts on the contract, not just a smoke transcript), and a fresh `crm-reviewer` decision of `accept` / `revise` / `reject` before `.mcp.json` is touched.** No tool gets added "while I'm in there."
