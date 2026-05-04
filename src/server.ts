import Fastify, { FastifyInstance } from "fastify";
import { accountsRoutes } from "./routes/accounts.js";

export function buildServer(): FastifyInstance {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  server.register(accountsRoutes);

  server.get("/health", async () => ({ status: "ok" }));

  return server;
}
