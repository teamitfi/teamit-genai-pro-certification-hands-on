import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import seededAccounts from "../seeds/accounts.json" with { type: "json" };

type SeedContact = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
};

type SeedAccount = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: SeedContact[];
};

const accounts = (seededAccounts as SeedAccount[]).map((account) => ({
  id: account.id,
  name: account.name,
  industry: account.industry,
  renewalDate: account.renewalDate,
  contacts: account.contacts.map((contact) => ({
    id: contact.id,
    accountId: contact.accountId,
    name: contact.name,
    role: contact.role,
    email: contact.email,
  })),
}));

const server = new McpServer({ name: "crm-server", version: "0.1.0" });

server.registerTool(
  "list_accounts",
  {
    description:
      "Return all CRM accounts including their contacts and renewal dates.",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(accounts, null, 2) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
