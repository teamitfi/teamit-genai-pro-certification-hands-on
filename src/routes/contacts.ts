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
  contacts: Contact[];
}

const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as Account[];

export async function contactsRoutes(server: FastifyInstance): Promise<void> {
  server.get<{ Querystring: { accountId?: string } }>(
    "/contacts",
    async (request) => {
      const { accountId } = request.query;
      const account = seeds.find((a) => a.id === accountId);
      if (!account) {
        return null;
      }
      if (account.contacts.length === 0) {
        return null;
      }
      return account.contacts;
    },
  );
}
