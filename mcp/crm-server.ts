import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "seeds", "accounts.json");

interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
}

interface RawAccount {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: Contact[];
  [key: string]: unknown;
}

const raw: RawAccount[] = JSON.parse(readFileSync(seedsPath, "utf-8"));

// Project only declared Account fields so forbidden fields never leak.
const accounts = raw.map(({ id, name, industry, renewalDate, contacts }) => ({
  id,
  name,
  industry,
  renewalDate,
  contacts,
}));

const server = new McpServer({ name: "crm-server", version: "1.0.0" });

server.registerTool(
  "list_accounts",
  {
    description:
      "List all CRM accounts with contacts and renewal dates. Use this to answer: who are our customers, who should we contact next, which renewals are at risk.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(accounts, null, 2) }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
