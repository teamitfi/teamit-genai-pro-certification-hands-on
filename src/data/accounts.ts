import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Account } from "../types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "accounts.json");
const accounts: Account[] = JSON.parse(readFileSync(seedsPath, "utf-8")) as Account[];

export function getAccounts(): Account[] {
  return accounts;
}

export function getAccountById(id: string): Account | undefined {
  return accounts.find((a) => a.id === id);
}
