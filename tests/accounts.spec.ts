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

const accountFields = ["id", "name", "industry", "renewalDate", "contacts"];
const contactFields = ["id", "accountId", "name", "role", "email"];

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
      expect(Object.keys(account).sort()).toEqual([...accountFields].sort());
      expect(Array.isArray(account.contacts)).toBe(true);

      for (const contact of account.contacts as Array<Record<string, unknown>>) {
        expect(Object.keys(contact).sort()).toEqual([...contactFields].sort());
      }
    }

    const seedIds = new Set(seeds.map((s) => s.id));
    const responseIds = new Set(body.map((a) => a.id));
    expect(responseIds).toEqual(seedIds);
  });

  it("returns one seeded account with embedded contacts", async () => {
    const seed = seeds.find((account) => account.contacts instanceof Array && account.contacts.length > 1);

    expect(seed).toBeDefined();

    const response = await server.inject({
      method: "GET",
      url: `/accounts/${seed?.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body).toEqual({
      id: seed?.id,
      name: seed?.name,
      industry: seed?.industry,
      renewalDate: seed?.renewalDate,
      contacts: seed?.contacts,
    });
    expect(Object.keys(body).sort()).toEqual([...accountFields].sort());
  });

  it("returns 404 for an unknown account detail request", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
  });

  it("returns an empty contacts array instead of null", async () => {
    const seed = seeds.find((account) => account.contacts instanceof Array && account.contacts.length === 0);

    expect(seed).toBeDefined();

    const response = await server.inject({
      method: "GET",
      url: `/accounts/${seed?.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body.contacts).toEqual([]);
  });
});
