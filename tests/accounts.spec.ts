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
});

describe("GET /accounts (empty fixture)", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    const emptySeedsPath = join(__dirname, "..", "seeds", "accounts.empty.json");
    server = buildServer({ seedsPath: emptySeedsPath });
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  // Fixture: seeds/accounts.empty.json — empty-list contract assertion
  it("returns 200 and [] when the seed source is empty", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
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

  // Happy path: known id returns 200 + matching seed row shape
  // Fixture: seeds/accounts.json, row id 11111111-1111-4111-8111-111111111111 (Aurora Logistics Oy)
  it("returns 200 and the matching account for a known id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/11111111-1111-4111-8111-111111111111",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body.id).toBe("11111111-1111-4111-8111-111111111111");
    expect(body.name).toBe("Aurora Logistics Oy");
    expect(body.industry).toBe("Logistics");
    expect(body.renewalDate).toBe("2026-08-15");
    expect(Array.isArray(body.contacts)).toBe(true);
    const contacts = body.contacts as Array<Record<string, unknown>>;
    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toHaveProperty("id");
    expect(contacts[0]).toHaveProperty("accountId");
    expect(contacts[0]).toHaveProperty("name");
    expect(contacts[0]).toHaveProperty("role");
    expect(contacts[0]).toHaveProperty("email");
  });

  // 404 path: unknown id returns 404
  it("returns 404 for an unknown id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/does-not-exist",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body.error).toBe("Not found");
  });

  // Boundary: Cetus Agri Co-op — renewalDate is null, contacts is []
  // Fixture: seeds/accounts.json, row id 33333333-3333-4333-8333-333333333333 (Cetus Agri Co-op)
  it("returns null renewalDate and empty contacts array for the boundary account", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/33333333-3333-4333-8333-333333333333",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body.id).toBe("33333333-3333-4333-8333-333333333333");
    expect(body.name).toBe("Cetus Agri Co-op");
    expect(body.renewalDate).toBeNull();
    expect(body.contacts).toEqual([]);
  });
});
