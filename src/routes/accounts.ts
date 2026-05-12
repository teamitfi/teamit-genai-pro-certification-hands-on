import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");

type Contact = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
};

type Account = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: Contact[];
};

function loadAccounts(): Account[] {
  return JSON.parse(readFileSync(seedsPath, "utf-8")) as Account[];
}

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return loadAccounts();
  });

  server.get("/accounts/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const accounts = loadAccounts();
    const account = accounts.find((a) => a.id === id);
    if (!account) {
      return reply.code(404).send({ error: "Not found" });
    }
    return account;
  });
}
