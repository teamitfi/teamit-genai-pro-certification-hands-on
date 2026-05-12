import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

function loadAccounts(): Account[] {
  const raw = readFileSync(seedsPath, "utf-8");
  return JSON.parse(raw) as Account[];
}

const server = new McpServer({ name: "crm-server", version: "1.0.0" });

server.registerTool(
  "list_accounts",
  {
    description:
      "List all CRM accounts. Returns id, name, industry, renewalDate, and embedded contacts. " +
      "No forbidden fields (invoiceAmount, Opportunity.value) are included.",
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
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
