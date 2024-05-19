import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();



const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "libreria",
});

const db = drizzle(pool, { schema });

async function setupDatabase() {
  console.log("Migrating...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migration done.");
}

setupDatabase().catch((err) => {
  console.error(err);
  process.exit(0);
});

export default db;
