/**
 * Database client (server-only).
 *
 * MVP: better-sqlite3 + Drizzle, with a lazy singleton so Next.js hot-reload
 * does not open multiple connections. Migrations run automatically on first
 * access from the generated ./drizzle folder.
 *
 * Enterprise upgrade path: replace the driver below with
 * `drizzle-orm/postgres-js` (or Neon's serverless driver). The exported `db`
 * surface and all query code remain unchanged.
 */

import "server-only";
import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { config } from "@/lib/config";
import { schema } from "./schema";

type DB = BetterSQLite3Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  __di_db?: DB;
  __di_sqlite?: Database.Database;
};

function resolveDbPath(): string {
  const url = config.database.url;
  // Strip an optional file: prefix; resolve relative to project root.
  const clean = url.replace(/^file:/, "");
  return path.isAbsolute(clean) ? clean : path.join(process.cwd(), clean);
}

function createDb(): DB {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const instance = drizzle(sqlite, { schema });

  // Apply migrations if the generated folder exists.
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if (fs.existsSync(migrationsFolder)) {
    try {
      migrate(instance, { migrationsFolder });
    } catch (err) {
      console.error("[db] migration failed:", err);
    }
  }

  globalForDb.__di_sqlite = sqlite;
  return instance;
}

export const db: DB = globalForDb.__di_db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__di_db = db;
}

export { schema };
