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

  it("includes renewalDate on each account", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;
    for (const account of body) {
      expect(account).toHaveProperty("renewalDate");
    }
  });

  it("returns [] (not null) for contacts when the account has no contacts", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;
    const emptyContactsAccount = body.find(
      (a) => Array.isArray(a.contacts) && (a.contacts as unknown[]).length === 0
    );
    expect(emptyContactsAccount).toBeDefined();
    if (!emptyContactsAccount) throw new Error("No account with empty contacts found");
    expect(emptyContactsAccount.contacts).toEqual([]);
    expect(emptyContactsAccount.contacts).not.toBeNull();
  });

  it("does not include Opportunity.value or invoiceAmount on any account", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;
    for (const account of body) {
      expect(account).not.toHaveProperty("value");
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

  it("returns the matching account for a known seed id", async () => {
    const firstSeed = seeds[0];
    if (!firstSeed) throw new Error("Seed data is empty");
    const knownId = firstSeed.id as string;
    const response = await server.inject({
      method: "GET",
      url: `/accounts/${knownId}`,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;
    expect(body.id).toBe(knownId);
    expect(typeof body.name).toBe("string");
    expect(typeof body.industry).toBe("string");
    expect(body).toHaveProperty("renewalDate");
    expect(Array.isArray(body.contacts)).toBe(true);
    expect(body).not.toHaveProperty("value");
    expect(body).not.toHaveProperty("invoiceAmount");
  });

  it("returns 404 for an unknown id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-0000-0000-000000000000",
    });
    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body.error).toBe("Not found");
  });
});
