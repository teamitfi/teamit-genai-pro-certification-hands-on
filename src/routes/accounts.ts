import { FastifyInstance } from "fastify";
import { getAccounts, getAccountById } from "../data/accounts.js";

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return getAccounts();
  });

  server.get<{ Params: { id: string } }>("/accounts/:id", async (request, reply) => {
    const account = getAccountById(request.params.id);
    if (!account) {
      return reply.code(404).send();
    }
    return account;
  });
}
