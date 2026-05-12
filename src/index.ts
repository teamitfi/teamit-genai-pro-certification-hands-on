import { buildServer } from "./server.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const server = buildServer();

server
  .listen({ port, host })
  .then((address) => {
    server.log.info(`CRM API listening at ${address}`);
  })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });
