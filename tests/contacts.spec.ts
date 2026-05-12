import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildServer } from "../src/server.js";
import type { FastifyInstance } from "fastify";

describe("GET /contacts", () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it("returns contacts for a valid accountId without email", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/contacts?accountId=11111111-1111-4111-8111-111111111111",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as Array<Record<string, unknown>>;
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const contact of body) {
      expect(contact).toHaveProperty("id");
      expect(contact).toHaveProperty("name");
      expect(contact).toHaveProperty("role");
      expect(contact).not.toHaveProperty("email");
    }
  });

  it("returns [] when the account has no contacts", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/contacts?accountId=33333333-3333-4333-8333-333333333333",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toEqual([]);
  });

  it("returns [] when the accountId does not exist", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/contacts?accountId=00000000-0000-0000-0000-000000000000",
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toEqual([]);
  });
});
