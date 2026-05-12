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
