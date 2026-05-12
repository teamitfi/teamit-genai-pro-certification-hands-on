import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");

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

const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as Account[];

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return seeds.map((account) => ({
      id: account.id,
      name: account.name,
      industry: account.industry,
      renewalDate: account.renewalDate,
      contacts: account.contacts.map(({ id, accountId, name, role }) => ({
        id,
        accountId,
        name,
        role,
      })),
    }));
  });
}
