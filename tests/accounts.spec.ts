import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

type ContactResponse = {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
};

type AccountResponse = {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: ContactResponse[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "seeds", "accounts.json");
const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as AccountResponse[];

const accountFields = ["contacts", "id", "industry", "name", "renewalDate"];
const contactFields = ["accountId", "email", "id", "name", "role"];

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
    const body = response.json() as AccountResponse[];

    expect(body).toHaveLength(seeds.length);

    for (const account of body) {
      expect(Object.keys(account).sort()).toEqual(accountFields);
      expect(Array.isArray(account.contacts)).toBe(true);
    }

    const seedIds = new Set(seeds.map((s) => s.id));
    const responseIds = new Set(body.map((a) => a.id));
    expect(responseIds).toEqual(seedIds);
  });

  it("returns contacts with the domain-model fields", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as AccountResponse[];
    const accountWithContacts = body.find((account) => account.contacts.length > 0);

    if (!accountWithContacts) {
      throw new Error("Expected at least one seeded account with contacts");
    }

    for (const contact of accountWithContacts.contacts) {
      expect(Object.keys(contact).sort()).toEqual(contactFields);
      expect(contact.accountId).toBe(accountWithContacts.id);
    }
  });

  it("returns an empty contacts array when an account has no contacts", async () => {
    const response = await server.inject({ method: "GET", url: "/accounts" });
    const body = response.json() as AccountResponse[];
    const accountWithoutContacts = body.find((account) => account.contacts.length === 0);

    if (!accountWithoutContacts) {
      throw new Error("Expected at least one seeded account without contacts");
    }

    expect(accountWithoutContacts.contacts).toEqual([]);
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

  it("returns a seeded account by id", async () => {
    const seedAccount = seeds.find((account) => account.contacts.length > 1);

    if (!seedAccount) {
      throw new Error("Expected at least one seeded account with multiple contacts");
    }

    const response = await server.inject({
      method: "GET",
      url: `/accounts/${seedAccount.id}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as AccountResponse;

    expect(body).toEqual(seedAccount);
    expect(Object.keys(body).sort()).toEqual(accountFields);
    expect(body.contacts).toHaveLength(seedAccount.contacts.length);
  });

  it("returns 404 when the account does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/00000000-0000-4000-8000-000000000000",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: "Account not found" });
  });
});
