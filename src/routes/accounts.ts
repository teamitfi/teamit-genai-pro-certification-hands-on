import type { FastifyInstance } from "fastify";
import type { SeedStore } from "../lib/seedStore.js";

export function accountsRoutes(store: SeedStore) {
  return async function (server: FastifyInstance): Promise<void> {
    server.get("/accounts", async () => {
      return store.listAccounts();
    });

    server.get<{ Params: { id: string } }>(
      "/accounts/:id",
      async (req, reply) => {
        const account = store.getAccount(req.params.id);
        if (account === undefined) {
          return reply.code(404).send({ error: "Not found" });
        }
        return account;
      }
    );

    server.get<{ Params: { id: string } }>(
      "/accounts/:id/contacts",
      async (req, reply) => {
        const contacts = store.listContacts(req.params.id);
        if (contacts === undefined) {
          return reply.code(404).send({ error: "Not found" });
        }
        return contacts;
      }
    );

    server.get<{ Params: { accountId: string; contactId: string } }>(
      "/accounts/:accountId/contacts/:contactId",
      async (req, reply) => {
        const contact = store.getContact(
          req.params.accountId,
          req.params.contactId
        );
        if (contact === undefined) {
          return reply.code(404).send({ error: "Not found" });
        }
        return contact;
      }
    );
  };
}
