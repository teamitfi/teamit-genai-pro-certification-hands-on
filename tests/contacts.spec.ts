import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

describe("GET /accounts/:id/contacts", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  // Happy path: Brahe Maritime Ltd has two contacts
  // Fixture: seeds/accounts.json, row id 22222222-2222-4222-8222-222222222222 (Brahe Maritime Ltd)
  it("returns 200 and both contacts in order for an account with multiple contacts", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/22222222-2222-4222-8222-222222222222/contacts",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);

    for (const contact of body) {
      expect(contact).toHaveProperty("id");
      expect(contact).toHaveProperty("accountId");
      expect(contact).toHaveProperty("name");
      expect(contact).toHaveProperty("role");
      expect(contact).toHaveProperty("email");
    }

    // Order preserved: Mikael Lindberg first, Anna Saari second
    expect(body[0]!.name).toBe("Mikael Lindberg");
    expect(body[1]!.name).toBe("Anna Saari");
  });

  // Empty contacts (200, not 404): Cetus Agri Co-op has zero contacts
  // Fixture: seeds/accounts.json, row id 33333333-3333-4333-8333-333333333333 (Cetus Agri Co-op)
  it("returns 200 and [] for an account with zero contacts", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/33333333-3333-4333-8333-333333333333/contacts",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  // Account 404: unknown account id returns 404
  it("returns 404 for an unknown account id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/does-not-exist/contacts",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body.error).toBe("Not found");
  });
});

describe("GET /accounts/:accountId/contacts/:contactId", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  // Happy path: known account + known contact
  // Fixture: seeds/accounts.json, row id 11111111-1111-4111-8111-111111111111 (Aurora Logistics Oy),
  //          contact id c1111111-1111-4111-8111-111111111111 (Liisa Korhonen)
  it("returns 200 and the matching contact for known account and contact ids", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/11111111-1111-4111-8111-111111111111/contacts/c1111111-1111-4111-8111-111111111111",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as Record<string, unknown>;

    expect(body.id).toBe("c1111111-1111-4111-8111-111111111111");
    expect(body.accountId).toBe("11111111-1111-4111-8111-111111111111");
    expect(body.name).toBe("Liisa Korhonen");
    expect(body.role).toBe("Procurement Lead");
    expect(body.email).toBe("liisa.korhonen@aurora.example");
  });

  // Unknown contact 404: known account + unknown contact id returns 404
  // Fixture: seeds/accounts.json, row id 11111111-1111-4111-8111-111111111111 (Aurora Logistics Oy)
  it("returns 404 for a known account with an unknown contact id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/11111111-1111-4111-8111-111111111111/contacts/zzz",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body.error).toBe("Not found");
  });

  // Unknown account 404: unknown account id returns 404 regardless of contact id
  it("returns 404 for an unknown account id", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/accounts/does-not-exist/contacts/c1111111-1111-4111-8111-111111111111",
    });

    expect(response.statusCode).toBe(404);
    const body = response.json() as Record<string, unknown>;
    expect(body.error).toBe("Not found");
  });
});
