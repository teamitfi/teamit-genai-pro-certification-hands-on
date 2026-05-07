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
      expect(account).toHaveProperty("renewalDate");
    }

    const seedIds = new Set(seeds.map((s) => s.id));
    const responseIds = new Set(body.map((a) => a.id));
    expect(responseIds).toEqual(seedIds);
  });

  it("GET /accounts/:id returns a single account", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/22222222-2222-4222-8222-222222222222",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.id).toBe("22222222-2222-4222-8222-222222222222");
    expect(body.name).toBe("Brahe Maritime Ltd");
    expect(body).toHaveProperty("industry");
    expect(body).toHaveProperty("renewalDate");
    expect(Array.isArray(body.contacts)).toBe(true);
  });

  it("GET /accounts/:id returns 404 for unknown id", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-0000-0000-000000000000",
    });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "Account not found" });
  });

  it("GET /accounts/:id/contacts returns contacts for Brahe Maritime", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/22222222-2222-4222-8222-222222222222/contacts",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
    body.forEach((contact: Record<string, unknown>) => {
      expect(contact).toHaveProperty("id");
      expect(contact).toHaveProperty("accountId");
      expect(contact).toHaveProperty("name");
      expect(contact).toHaveProperty("role");
      expect(contact).toHaveProperty("email");
    });
  });

  it("GET /accounts/:id/contacts returns [] for Cetus Agri (0 contacts)", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/33333333-3333-4333-8333-333333333333/contacts",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it("GET /accounts/:id/contacts returns 404 for unknown account", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-0000-0000-000000000000/contacts",
    });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "Account not found" });
  });

  it("GET /accounts/:id/contacts handles strange urls properly", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/accounts/<nbsp>;&nbsp</contacts",
    });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toEqual({ error: "Account not found" });
  });
});
