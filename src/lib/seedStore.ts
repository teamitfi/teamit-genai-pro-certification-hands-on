import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  renewalDate: string | null;
  contacts: Contact[];
}

export interface SeedStore {
  listAccounts(): Account[];
  getAccount(id: string): Account | undefined;
  listContacts(accountId: string): Contact[] | undefined;
  getContact(accountId: string, contactId: string): Contact | undefined;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DEFAULT_SEEDS_PATH = join(
  __dirname,
  "..",
  "..",
  "seeds",
  "accounts.json"
);

export function loadSeedStore(seedsPath: string): SeedStore {
  const accounts: Account[] = JSON.parse(
    readFileSync(seedsPath, "utf-8")
  ) as Account[];

  return {
    listAccounts(): Account[] {
      return accounts;
    },

    getAccount(id: string): Account | undefined {
      return accounts.find((a) => a.id === id);
    },

    listContacts(accountId: string): Contact[] | undefined {
      const account = accounts.find((a) => a.id === accountId);
      return account?.contacts;
    },

    getContact(accountId: string, contactId: string): Contact | undefined {
      const account = accounts.find((a) => a.id === accountId);
      return account?.contacts.find((c) => c.id === contactId);
    },
  };
}
