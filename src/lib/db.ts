import { AuroraDSQLPool } from "@aws/aurora-dsql-node-postgres-connector";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

let instance: NodePgDatabase | undefined;

// Server-only: the PG* variables come from the Amplify Gen 3 DSQL integration at
// runtime, and the pool mints and refreshes the IAM auth token itself. Created on
// first use so `next build` doesn't need a database.
export function db(): NodePgDatabase {
  instance ??= drizzle({
    client: new AuroraDSQLPool({ host: process.env.PGHOST, user: process.env.PGUSER }),
  });
  return instance;
}
