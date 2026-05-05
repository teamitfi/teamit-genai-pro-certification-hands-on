import { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsPath = join(__dirname, "..", "..", "seeds", "opportunities.json");

interface Opportunity {
  id: string;
  accountId: string;
  name: string;
  stage: string;
  value: number;
}

const seeds = JSON.parse(readFileSync(seedsPath, "utf-8")) as Opportunity[];

const KNOWN_STAGES = [
  "Prospect",
  "Qualified",
  "Proposal",
  "Closed Won",
  "Closed Lost",
];

export async function opportunitiesRoutes(
  server: FastifyInstance,
): Promise<void> {
  server.get("/opportunities", async () => {
    const grouped: Record<string, Opportunity[]> = {};
    for (const stage of KNOWN_STAGES) {
      const stageLower = stage.toLowerCase();
      grouped[stage] = seeds.filter((o) => o.stage === stageLower);
    }
    return grouped;
  });
}
