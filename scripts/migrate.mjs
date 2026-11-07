// Applies db/migrations/*.sql in order. DSQL allows one DDL statement per
// transaction, so each file holds a single statement and runs in autocommit.
// Usage: PGHOST=<cluster endpoint> PGUSER=admin npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { AuroraDSQLPool } from "@aws/aurora-dsql-node-postgres-connector";

const dir = join(import.meta.dirname, "..", "db", "migrations");
const pool = new AuroraDSQLPool({ host: process.env.PGHOST, user: process.env.PGUSER ?? "admin" });

try {
  for (const file of (await readdir(dir)).filter((name) => name.endsWith(".sql")).sort()) {
    await pool.query(await readFile(join(dir, file), "utf8"));
    console.log(`applied ${file}`);
  }
} finally {
  await pool.end();
}
