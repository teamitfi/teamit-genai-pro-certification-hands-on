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

const accounts: Account[] = JSON.parse(readFileSync(seedsPath, "utf-8"));

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return accounts;
  });

  server.get<{ Params: { id: string } }>("/accounts/:id", async (request, reply) => {
    const account = accounts.find((a) => a.id === request.params.id);
    if (!account) {
      return reply.status(404).send({ error: "Not found" });
    }
    return account;
  });
}
