import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "seeds", "accounts.json");
const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as Array<
  Record<string, unknown>
>;

describe("GET /accounts", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("returns the seeded accounts", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;

    expect(body).toHaveLength(seeds.length);

    for (const account of body) {
      expect(account).toHaveProperty("id");
      expect(account).toHaveProperty("name");
      expect(account).toHaveProperty("industry");
      expect(account).toHaveProperty("contacts");
      expect(Array.isArray(account.contacts)).toBe(true);
    }

    const seedIds = new Set(seeds.map((s) => s.id));
    const responseIds = new Set(body.map((a) => a.id));
    expect(responseIds).toEqual(seedIds);
  });

  it("list — email is absent from every embedded contact (PII strip)", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;

    for (const account of body) {
      const contacts = account.contacts as Array<Record<string, unknown>>;
      for (const contact of contacts) {
        expect(contact).not.toHaveProperty("email");
      }
    }
  });

  it("list — Cetus Agri has contacts equal to [] not null", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;
    const cetus = body.find((a) => a.id === "33333333-3333-4333-8333-333333333333");
    expect(cetus).toBeDefined();
    expect(cetus!.contacts).toEqual([]);
  });

  it("list — no account has an invoiceAmount property", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;
    for (const account of body) {
      expect(account).not.toHaveProperty("invoiceAmount");
    }
  });
});

describe("GET /accounts/:id", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("known id returns full account including contact email", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/11111111-1111-4111-8111-111111111111",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;
    expect(body.id).toBe("11111111-1111-4111-8111-111111111111");
    const contacts = body.contacts as Array<Record<string, unknown>>;
    expect(contacts.length).toBeGreaterThan(0);
    for (const contact of contacts) {
      expect(contact).toHaveProperty("email");
    }
  });

  it("unknown id returns 404", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-0000-0000-000000000000",
    });
    expect(response.statusCode).toBe(404);
  });
});
