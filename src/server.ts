import Fastify, { FastifyInstance } from "fastify";
import { accountsRoutes } from "./routes/accounts.js";
import { accountDetailRoutes } from "./routes/account-detail.js";
import { contactsRoutes } from "./routes/contacts.js";
import { opportunitiesRoutes } from "./routes/opportunities.js";

export function buildServer(): FastifyInstance {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  server.register(accountsRoutes);
  server.register(accountDetailRoutes);
  server.register(contactsRoutes);
  server.register(opportunitiesRoutes);

  server.get("/health", async () => ({ status: "ok" }));

  return server;
}
