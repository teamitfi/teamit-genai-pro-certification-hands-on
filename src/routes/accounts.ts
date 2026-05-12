import { FastifyInstance } from "fastify";
import seededAccounts from "../../seeds/accounts.json" with { type: "json" };

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

type ContactResponse = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
};

type AccountResponse = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: ContactResponse[];
};

const accounts = (seededAccounts as SeedAccount[]).map(serializeAccount);

function serializeContact(contact: SeedContact): ContactResponse {
  return {
    id: contact.id,
    accountId: contact.accountId,
    name: contact.name,
    role: contact.role,
    email: contact.email,
  };
}

function serializeAccount(account: SeedAccount): AccountResponse {
  return {
    id: account.id,
    name: account.name,
    industry: account.industry,
    renewalDate: account.renewalDate,
    contacts: account.contacts.map(serializeContact),
  };
}

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return accounts;
  });

  server.get<{ Params: { id: string } }>("/accounts/:id", async (request, reply) => {
    const account = accounts.find(({ id }) => id === request.params.id);

    if (!account) {
      return reply.code(404).send({ message: "Account not found" });
    }

    return account;
  });
}
