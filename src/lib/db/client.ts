/**
 * Database client (server-only).
 *
 * MVP: better-sqlite3 + Drizzle, opened on first query rather than import.
 * Next.js imports route modules in parallel during builds; opening SQLite and
 * running migrations at module evaluation can lock the database on Railway.
 * Production migrations run explicitly via `npm run db:migrate` before start.
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
  const buildOnly = process.env.DI_BUILD === "1";
  const dbPath = buildOnly ? ":memory:" : resolveDbPath();
  if (!buildOnly) fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  if (!buildOnly) sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  const instance = drizzle(sqlite, { schema });

  // Local development keeps the convenience of automatic migrations.
  // Production uses the explicit, single-process start:prod migration step.
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  if ((buildOnly || process.env.NODE_ENV !== "production") && fs.existsSync(migrationsFolder)) {
    migrate(instance, { migrationsFolder });
  }

  globalForDb.__di_sqlite = sqlite;
  return instance;
}

function getDb(): DB {
  if (!globalForDb.__di_db) {
    globalForDb.__di_db = createDb();
  }
  return globalForDb.__di_db;
}

// Preserve the existing typed `db.select(...)` call sites while deferring the
// connection until a route or server component actually executes a query.
export const db: DB = new Proxy({} as DB, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
