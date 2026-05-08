// Acceptance evidence #5 (PRODUCT_BRIEF.md): "For any slice touching files under
// `src/`, a grep for `invoiceAmount` returns no matches."
//
// The literal field name `invoiceAmount` is a domain tripwire — it does not exist
// in the CRM model (DOMAIN_MODEL.md) and must never appear in application source.
// The S2.3 pre-commit hook enforces this at commit time; this test enforces it at
// runtime so any violation is caught immediately by `npm test`.

import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "..", "src");

function* walkTs(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walkTs(full);
    } else if (stat.isFile() && extname(full) === ".ts") {
      yield full;
    }
  }
}

describe("privacy tripwire — invoiceAmount must not appear in src/", () => {
  it("contains no occurrence of invoiceAmount in any .ts file under src/", () => {
    for (const file of walkTs(srcDir)) {
      const content = readFileSync(file, "utf-8");
      // Second arg to expect() is the failure label — names the offending file
      // so a future agent can locate the violation instantly.
      expect(content, `invoiceAmount found in ${file}`).not.toContain(
        "invoiceAmount",
      );
    }
  });
});
