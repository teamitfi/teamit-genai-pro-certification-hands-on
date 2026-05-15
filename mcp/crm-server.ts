/**
 * CRM MCP server — Lab S2.4.
 *
 * Exposes one read-only tool, `list_accounts`, backed by the same
 * synthetic seed data as the Slice 1 API (`seeds/accounts.json`).
 * No write tools. No forbidden fields. Stable empty input schema.
 *
 * Run directly:   npx tsx mcp/crm-server.ts
 * Register with Claude Code (project-scoped, committed to .mcp.json):
 *   claude mcp add --scope project crm -- npx tsx mcp/crm-server.ts
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "seeds", "accounts.json");

interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
}

interface Account {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: Contact[];
}

const ALLOWED_ACCOUNT_FIELDS = [
  "id",
  "name",
  "industry",
  "renewalDate",
  "contacts",
] as const;

function loadAccounts(): Account[] {
  const raw = JSON.parse(readFileSync(seedsPath, "utf-8")) as unknown[];
  if (!Array.isArray(raw)) {
    throw new Error("seeds/accounts.json is not an array");
  }
  return raw.map((entry) => {
    const account = entry as Record<string, unknown>;
    const projected: Record<string, unknown> = {};
    for (const field of ALLOWED_ACCOUNT_FIELDS) {
      projected[field] = account[field];
    }
    if (!Array.isArray(projected.contacts)) {
      projected.contacts = [];
    }
    return projected as unknown as Account;
  });
}

const server = new McpServer({
  name: "crm",
  version: "0.1.0",
});

server.registerTool(
  "list_accounts",
  {
    title: "List CRM accounts",
    description:
      "Returns all synthetic CRM accounts with embedded contacts, including renewalDate so renewal questions can be answered. Read-only; no arguments.",
    inputSchema: {},
  },
  async () => {
    const accounts = loadAccounts();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(accounts, null, 2),
        },
      ],
      structuredContent: { accounts },
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("crm MCP server failed:", error);
  process.exit(1);
});
