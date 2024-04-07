"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pool = new pg_1.Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "libreria",
});
const db = (0, node_postgres_1.drizzle)(pool);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Migrating...");
        yield (0, migrator_1.migrate)(db, { migrationsFolder: "drizzle" });
        console.log("Migration done.");
        process.exit(0);
    });
}
main().catch(err => {
    console.log(err);
    process.exit(0);
});
