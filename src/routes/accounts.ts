import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";

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

const accountsPath = new URL("../../seeds/accounts.json", import.meta.url);
const accounts = JSON.parse(readFileSync(accountsPath, "utf-8")) as Account[];

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return accounts;
  });

  server.get<{ Params: { id: string } }>("/accounts/:id", async (request, reply) => {
    const account = accounts.find((candidate) => candidate.id === request.params.id);

    if (!account) {
      return reply.code(404).send({ error: "Account not found" });
    }

    return account;
  });
}
