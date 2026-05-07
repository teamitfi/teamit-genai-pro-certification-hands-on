import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { FastifyInstance } from "fastify";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const accounts: Account[] = JSON.parse(
  readFileSync(join(__dirname, "../../seeds/accounts.json"), "utf-8")
);

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return accounts;
  });

  server.get("/accounts/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const account = accounts.find((a) => a.id === id);
    if (!account) {
      return reply.status(404).send({ error: "Account not found" });
    }
    return account;
  });

  server.get("/accounts/:id/contacts", async (request, reply) => {
    const { id } = request.params as { id: string };
    const account = accounts.find((a) => a.id === id);
    if (!account) {
      return reply.status(404).send({ error: "Account not found" });
    }
    return account.contacts ?? [];
  });
}
