import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DEFAULT_SEEDS_PATH, loadSeedStore } from "../lib/seedStore.js";

export function buildMcpServer(options?: { seedsPath?: string }): McpServer {
  const seedsPath = options?.seedsPath ?? DEFAULT_SEEDS_PATH;
  const store = loadSeedStore(seedsPath);

  const server = new McpServer({
    name: "crm",
    version: "0.1.0",
  });

  server.registerTool(
    "list_accounts",
    {
      title: "List Accounts",
      description:
        "Read-only. Returns every CRM account with embedded contacts, matching the shape of GET /accounts.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const accounts = store.listAccounts();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(accounts, null, 2),
          },
        ],
      };
    }
  );

  return server;
}
