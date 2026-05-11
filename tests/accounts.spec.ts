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
      expect(account).toHaveProperty("renewalDate");
      expect(account).toHaveProperty("contacts");
      expect(Array.isArray(account.contacts)).toBe(true);
    }

    const seedIds = new Set(seeds.map((s) => s.id));
    const responseIds = new Set(body.map((a) => a.id));
    expect(responseIds).toEqual(seedIds);

    const emptyContactsAccount = body.find(
      (a) => (a.contacts as unknown[]).length === 0,
    );
    expect(emptyContactsAccount).toBeDefined();
    expect((emptyContactsAccount!.contacts as unknown[]).length).toBe(0);

    const nullRenewalAccount = body.find((a) => a.renewalDate === null);
    expect(nullRenewalAccount).toBeDefined();
    expect(nullRenewalAccount!.renewalDate).toBeNull();
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

  it("returns the account for a valid id", async () => {
    const seed = seeds[0]!;
    const response = await server.inject({
      method: "GET",
      url: `/accounts/${seed.id as string}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;
    expect(body.id).toBe(seed.id);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("industry");
    expect(body).toHaveProperty("renewalDate");
    expect(body).toHaveProperty("contacts");
    expect(Array.isArray(body.contacts)).toBe(true);
  });

  it("returns 404 for an unknown id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body).toEqual({ error: "Not found" });
  });
});
