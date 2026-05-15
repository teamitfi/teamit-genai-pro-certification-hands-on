# Lab S2.4 — second-language sketch evidence

Second-language port of the canonical CRM MCP server (`mcp/crm-server.ts`).
Sketch file: `mcp/crm_server.py`. Not executed, not installed — shape only.

## Language and SDK

- **Language:** Python (3.11+).
- **SDK:** [`mcp`](https://pypi.org/project/mcp/) — the official Model Context
  Protocol Python SDK, using its `FastMCP` decorator-style server (the closest
  ergonomic match to the TS `McpServer.registerTool` shape).
- **Install command a reader would run:**
  ```bash
  uv add "mcp[cli]>=1.2"
  ```
  (Equivalently `pip install "mcp[cli]>=1.2"` for a non-uv setup.)

Why Python over Go for a Teamit engagement: most Teamit client work that
touches CRM-shaped data already lives in Python (ETL glue, notebooks,
Pydantic models, FastAPI back-ends). A Python MCP sketch is something a
client engineer can read and extend on day one. Go (`metoro-io/mcp-golang`)
would be the right pick if we were embedding the server into an existing
Go service, but that is not the typical Teamit context.

## Where the SDK shape diverges

| Concern              | TypeScript (`@modelcontextprotocol/sdk@1.29.0`)                  | Python (`mcp` / FastMCP)                                                  |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Imports              | `McpServer` from `@modelcontextprotocol/sdk/server/mcp.js`       | `from mcp.server.fastmcp import FastMCP`                                  |
| Server construction  | `new McpServer({ name: "crm", version: "0.1.0" })`               | `FastMCP("crm")` — version is sourced from package metadata, not a kwarg  |
| Tool registration    | `server.registerTool(name, { title, description, inputSchema }, handler)` imperative call | `@mcp.tool(name=..., title=..., description=...)` decorator on the handler |
| Input-schema declaration | Explicit `inputSchema: {}` object in the registration call   | Implicit — derived from the function signature; no params → empty schema  |
| Transport class      | `new StdioServerTransport()` + `await server.connect(transport)` | `mcp.run()` (defaults to stdio); `mcp.run("stdio")` to be explicit         |
| Error-handling idiom | `main().catch(err => { console.error(...); process.exit(1) })`   | Exceptions propagate; SDK serialises them to JSON-RPC tool errors. A bare `if __name__ == "__main__": mcp.run()` is enough |
| Return shape         | `{ content: [{ type: "text", text: ... }], structuredContent }` hand-built | Plain `dict` return — FastMCP wraps it into the same `content` + `structuredContent` envelope automatically |

The single most load-bearing divergence: **tool registration moves from an
imperative `registerTool(name, schemaObject, handler)` call to a
`@mcp.tool(...)` decorator that reads the input schema from the handler's
signature.** Empty input schema is expressed by writing a parameterless
function rather than by passing `inputSchema: {}`.

## What stayed identical — the portable contract

Despite every line of wiring differing, the contract a client sees is
byte-for-byte the same. Both servers speak JSON-RPC 2.0 over stdio per the
MCP spec; both expose exactly one tool whose name is the literal string
`list_accounts`; both advertise an empty input schema as an empty object
(`{}` in TS via the explicit declaration, `{}` in Python via the parameterless
function); both project seed rows through the same five-field allow-list
(`id`, `name`, `industry`, `renewalDate`, `contacts`) so forbidden fields
are stripped defensively regardless of what the seed file later grows; both
honour the empty-contacts-as-`[]` rule so consumers never see `null` where
they expect an array; and neither exposes any write tool, mutation
endpoint, or side-effecting capability. The lesson the lab is making
visible: **the MCP contract is portable across SDKs — only the wiring
differs.** A reviewer comparing the two files should see the same tool
name, the same field set, the same empty-array contract, and the same
read-only surface, with the SDK ergonomics as the only delta.
