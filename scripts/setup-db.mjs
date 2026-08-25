/**
 * One-shot database setup.
 *
 *   DATABASE_URL="postgres://..." node scripts/setup-db.mjs
 *
 * Safe to run more than once — every statement is idempotent.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

const withoutComments = schema
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");

const statements = withoutComments
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

let failed = 0;

for (const statement of statements) {
  const label = statement.split("\n")[0].slice(0, 68);
  try {
    await sql(statement);
    console.log("  ok  ", label);
  } catch (error) {
    failed += 1;
    console.error("  fail", label);
    console.error("       ", error.message);
  }
}

console.log(
  failed === 0
    ? "\nDatabase ready."
    : `\nFinished with ${failed} failed statement(s).`,
);
