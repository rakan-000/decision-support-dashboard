import type { Config } from "drizzle-kit";

/**
 * Local MVP uses SQLite. For an enterprise deployment, switch `dialect` to
 * "postgresql" and point `dbCredentials.url` at the managed Postgres instance.
 */
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "./data/app.db",
  },
} satisfies Config;
