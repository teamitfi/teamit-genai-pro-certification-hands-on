import Fastify, { FastifyInstance } from "fastify";
import { accountsRoutes } from "./routes/accounts.js";
import { DEFAULT_SEEDS_PATH, loadSeedStore } from "./lib/seedStore.js";

export function buildServer(options?: {
  seedsPath?: string;
}): FastifyInstance {
  const seedsPath = options?.seedsPath ?? DEFAULT_SEEDS_PATH;
  const store = loadSeedStore(seedsPath);

  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  server.register(accountsRoutes(store));

  server.get("/health", async () => ({ status: "ok" }));

  return server;
}
