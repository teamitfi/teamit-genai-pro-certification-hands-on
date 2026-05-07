import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");
const accounts: Account[] = JSON.parse(
  readFileSync(seedsPath, "utf-8")
) as Account[];

type ContactWithoutEmail = Omit<Contact, "email">;

interface AccountListItem extends Omit<Account, "contacts"> {
  contacts: ContactWithoutEmail[];
}

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    const result: AccountListItem[] = accounts.map((account) => ({
      ...account,
      contacts: account.contacts.map(({ email: _email, ...rest }) => rest),
    }));
    return result;
  });

  server.get<{ Params: { id: string } }>(
    "/accounts/:id",
    async (request, reply) => {
      const account = accounts.find((a) => a.id === request.params.id);
      if (!account) {
        return reply.status(404).send({ error: "Not found" });
      }
      return account;
    }
  );
}
