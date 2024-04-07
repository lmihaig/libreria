import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "libreria",
});

const db = drizzle(pool);

async function main() {
  console.log("Migrating...")
  await migrate(db, { migrationsFolder:"drizzle" });
  console.log("Migration done.");
  process.exit(0);
}

main().catch(err => 
{
    console.log(err); 
    process.exit(0);
});
