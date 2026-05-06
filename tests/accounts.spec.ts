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

  it("includes renewalDate on every account (may be null for prospects)", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;

    for (const account of body) {
      expect(account).toHaveProperty("renewalDate");
    }
  });

  it("returns [] not null for an account with no contacts", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;

    const noContacts = body.find((a) => a.id === "33333333-3333-4333-8333-333333333333");
    expect(noContacts).toBeDefined();
    expect(Array.isArray(noContacts!.contacts)).toBe(true);
    expect(noContacts!.contacts).toHaveLength(0);
  });

  it("does not expose forbidden fields in responses", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as Array<Record<string, unknown>>;
    const raw = JSON.stringify(body);

    expect(raw).not.toContain('"invoiceAmount"');
    expect(raw).not.toContain('"value"');
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

  it("returns the matching account for a valid seed ID", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/11111111-1111-4111-8111-111111111111",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;
    expect(body.id).toBe("11111111-1111-4111-8111-111111111111");
    expect(body.name).toBe("Aurora Logistics Oy");
    expect(Array.isArray(body.contacts)).toBe(true);
  });

  it("returns 404 for an unknown ID", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-0000-0000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body).toHaveProperty("error");
  });
});
