/**
 * Standalone migration runner (CLI): `npm run db:migrate`.
 * The app also auto-migrates on first DB access; this script is for explicit
 * control in CI / deployment pipelines.
 */
import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const dbUrl = process.env.DATABASE_URL ?? "./data/app.db";
const dbPath = path.isAbsolute(dbUrl) ? dbUrl : path.join(process.cwd(), dbUrl.replace(/^file:/, ""));
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
console.log(`[db] migrations applied to ${dbPath}`);
sqlite.close();
