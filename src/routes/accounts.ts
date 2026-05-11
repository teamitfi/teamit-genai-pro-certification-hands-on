import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const accounts = JSON.parse(
  readFileSync(join(__dirname, "../../seeds/accounts.json"), "utf-8"),
) as Array<Record<string, unknown>>;

export async function accountsRoutes(server: FastifyInstance): Promise<void> {
  server.get("/accounts", async () => {
    return accounts;
  });

  server.get<{ Params: { id: string } }>(
    "/accounts/:id",
    async (request, reply) => {
      const account = accounts.find((a) => a.id === request.params.id);
      if (!account) {
        return reply.code(404).send({ error: "Not found" });
      }
      return account;
    },
  );
}
