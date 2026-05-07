import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FastifyInstance } from "fastify";

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

type ContactResponse = SeedContact;

type AccountResponse = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: ContactResponse[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");
const seedAccounts = JSON.parse(readFileSync(seedsPath, "utf-8")) as SeedAccount[];

function toContactResponse(contact: SeedContact): ContactResponse {
  return {
    id: contact.id,
    accountId: contact.accountId,
    name: contact.name,
    role: contact.role,
    email: contact.email,
  };
}

function toAccountResponse(account: SeedAccount): AccountResponse {
  return {
    id: account.id,
    name: account.name,
    industry: account.industry,
    renewalDate: account.renewalDate,
    contacts: account.contacts.map(toContactResponse),
  };
}

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return seedAccounts.map(toAccountResponse);
  });

  server.get<{ Params: { accountId: string } }>(
    "/accounts/:accountId",
    async (request, reply) => {
      const account = seedAccounts.find(
        (seedAccount) => seedAccount.id === request.params.accountId,
      );

      if (!account) {
        return reply.code(404).send({ error: "Account not found" });
      }

      return toAccountResponse(account);
    },
  );
}
