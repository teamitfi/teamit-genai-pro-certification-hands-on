import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

type SeedContact = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
};

type SeedAccount = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: SeedContact[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "seeds", "accounts.json");
const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as SeedAccount[];
const expectedAccountKeys = ["contacts", "id", "industry", "name", "renewalDate"];
const expectedContactKeys = ["accountId", "email", "id", "name", "role"];

function expectAccountShape(account: Record<string, unknown>): void {
  expect(Object.keys(account).sort()).toEqual(expectedAccountKeys);
  expect(Array.isArray(account.contacts)).toBe(true);

  for (const contact of account.contacts as Array<Record<string, unknown>>) {
    expect(Object.keys(contact).sort()).toEqual(expectedContactKeys);
    expect(contact).not.toHaveProperty("invoiceAmount");
    expect(contact).not.toHaveProperty("value");
  }

  expect(account).not.toHaveProperty("invoiceAmount");
  expect(account).not.toHaveProperty("value");
}

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

    expect(body).toEqual(seeds);
    expect(body).toHaveLength(seeds.length);

    for (const account of body) {
      expectAccountShape(account);
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

  it("returns the matching seeded account with embedded contacts", async () => {
    const expectedAccount = seeds[1];
    expect(expectedAccount).toBeDefined();
    const response = await server.inject({
      method: "GET",
      url: `/accounts/${expectedAccount!.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body).toEqual(expectedAccount);
    expectAccountShape(body);
  });

  it("returns 404 for an unknown account id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ message: "Account not found" });
  });

  it("returns empty contacts as an empty array", async () => {
    const emptyContactsAccount = seeds.find((account) => account.contacts.length === 0);
    expect(emptyContactsAccount).toBeDefined();

    const response = await server.inject({
      method: "GET",
      url: `/accounts/${emptyContactsAccount!.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body).toEqual(emptyContactsAccount);
    expect(body.contacts).toEqual([]);
    expectAccountShape(body);
  });

  it("exposes only declared account and contact fields", async () => {
    const expectedAccount = seeds[0];
    expect(expectedAccount).toBeDefined();
    const response = await server.inject({
      method: "GET",
      url: `/accounts/${expectedAccount!.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expectAccountShape(body);
  });
});
