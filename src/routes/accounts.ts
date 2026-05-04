import { FastifyInstance } from "fastify";

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return [];
  });
}
