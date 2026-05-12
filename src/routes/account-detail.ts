import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");

interface Account {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: unknown[];
}

const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as Account[];

export async function accountDetailRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.get<{ Params: { id: string } }>(
    "/accounts/:id",
    async (request, reply) => {
      const account = seeds.find((a) => a.id === request.params.id);
      if (!account) {
        reply.code(404);
        return { error: "not found" };
      }
      return account;
    },
  );
}
