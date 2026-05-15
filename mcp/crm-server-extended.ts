/**
 * CRM MCP server — Lab S2.4 *scope-creep sandbox*.
 *
 * This file is a deliberate copy of `mcp/crm-server.ts` with a SECOND
 * read-only tool (`get_account_by_id`) bolted on. It exists so the lab
 * can demonstrate, in writing, how a "harmless" second tool starts
 * eroding the single-tool MCP contract documented in
 * `lab-s2-4-mcp-evidence.md` § Contract conformance.
 *
 * Constraints carried over from the canonical server:
 *   - No write surface.
 *   - Field projection through an explicit allow-list (no forbidden
 *     fields can leak even if the seed grows new columns).
 *   - Empty `contacts` returned as `[]`, never `null`.
 *   - Stable JSON Schema (input schema declared via zod).
 *
 * Run directly:   npx tsx mcp/crm-server-extended.ts
 *
 * NOTE: This file is intentionally NOT registered in `.mcp.json`. The
 * canonical single-tool server at `mcp/crm-server.ts` is the only one
 * a fresh Claude Code session sees. Treat this file as scope-creep
 * evidence, not a deployment target.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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
  name: "crm-extended",
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

server.registerTool(
  "get_account_by_id",
  {
    title: "Get CRM account by id",
    description:
      "Returns a single synthetic CRM account (with embedded contacts) by its UUID id. Read-only. Errors if no account matches the id.",
    inputSchema: {
      id: z
        .string()
        .uuid()
        .describe("UUID of the Account to fetch (Account.id from the domain model)."),
    },
  },
  async ({ id }) => {
    const account = loadAccounts().find((a) => a.id === id);
    if (!account) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "not_found", id }),
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(account, null, 2),
        },
      ],
      structuredContent: { account },
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("crm-extended MCP server failed:", error);
  process.exit(1);
});
