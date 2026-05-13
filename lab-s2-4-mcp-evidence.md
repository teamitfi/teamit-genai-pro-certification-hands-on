## Who would I let install this MCP?

Data "leaks" PII (contacts), business secrets (renewal dates) and internal IDs which might be abusable under certain conditions. I would only give access to people who have well reasoned grounds to access the data, such as people working in sales that need the data to conduct their work. By default, no outside org access and only vetted individuals from within the organisation.

## What would a reviewer ask me before whitelisting?

Whitelisting what? Where? What does this mean?

Assumption: whitelisting as a public MCP server with access through api token/auth

- Does the MCP expose private data?
- Is auth correctly scoped?
- If agent is prompt injected, what's the most harmful action this MCP allows?

## Name your stack, the wiring command you used, and the tracked config file (e.g., .mcp.json).

- ts/`@modelcontextprotocol/sdk` (`mcp/crm-server.ts`)
- `claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts`
- `.mcp.json`
