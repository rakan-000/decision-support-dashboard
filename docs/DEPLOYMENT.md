# Production-Ready Deployment Path

This platform uses server-side upload, parsing, local private storage, SQLite, and native Node packages such as `better-sqlite3`.

For the current real working version, use a server platform with persistent storage.

## Recommended Now: Railway With Persistent Volume

Railway is the best immediate deployment target for this MVP because it can run the Next.js server and keep uploaded files plus the SQLite database on a persistent volume.

Vercel is excellent for Next.js frontends, but this project currently needs durable server-side file storage and a persistent database file. Vercel serverless storage is not suitable for this stage without moving storage/database to external services.

## Required Railway Variables

Create a persistent volume mounted at:

```text
/data
```

Set these variables:

```bash
DATABASE_URL=/data/app.db
STORAGE_DIR=/data/uploads
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-opus-4-8
EMBEDDINGS_PROVIDER=local
DEFAULT_LOCALE=ar
MAX_UPLOAD_MB=50
NEXT_TELEMETRY_DISABLED=1
```

Without `ANTHROPIC_API_KEY`, the platform still works but analysis stays in clearly labeled demo mode.

## Deployment Flow

1. Connect Railway to:

```text
https://github.com/rakan-000/decision-support-dashboard
```

2. Railway will use:

```text
Dockerfile
railway.json
```

3. On startup, the container runs:

```bash
npm run start:prod
```

This command:

- applies database migrations
- seeds the six Shared Services departments
- starts Next.js on Railway's provided port

## Health Check

Railway health check:

```text
/api/health
```

This endpoint verifies:

- app status
- database connection
- department count
- document count
- analysis count
- knowledge base count
- AI/storage provider status

## Later Enterprise Upgrade

When the platform moves beyond MVP:

- Move SQLite to Neon PostgreSQL.
- Move local storage to Supabase Storage or S3.
- Add authentication and RBAC.
- Add audit logs and file access policy.
- Add pgvector or managed vector retrieval.

The current architecture already isolates database, storage, AI, and retrieval layers so these upgrades can be done without changing the UI workflow.
