# Shared Services Decision Intelligence Platform

Premium executive intelligence platform for Shared Services teams in a Saudi nonprofit context.

The platform turns organizational documents into executive summaries, governance observations, compliance findings, risk visibility, recommendations, decision support, and exportable reports.

## Current Status

This repository contains a working local MVP built with:

- Next.js App Router
- TypeScript
- Tailwind CSS
- SQLite + Drizzle ORM
- Local private file storage
- Real PDF, DOCX, and XLSX parsing
- Private Knowledge Base ingestion and retrieval
- Demo AI analysis mode with production-ready Claude integration
- PDF, summary, and PowerPoint export
- Arabic-first RTL experience with English support

## Core Modules

- Executive Home
- Intelligence Intake / Upload Center
- Private Knowledge Base
- Analysis Workspace
- Executive Dashboard
- Governance & Compliance Center
- Recommendations Center
- Decision Support Center
- Department Intelligence
- Activity History
- Platform Settings

## Key Capabilities

- Upload PDF, DOCX, and XLSX files.
- Parse text, tables, metadata, and spreadsheet sheet names.
- Classify documents by department, priority, language, and dates.
- Generate structured executive analysis.
- Ground analysis in internal Knowledge Base sources.
- Track risks, actions, recommendations, and export jobs.
- Export executive reports to print-ready PDF/HTML, summary PDF/HTML, and PowerPoint.
- Preserve sensitive files in local private storage by default.

## Privacy Model

The MVP is privacy-conscious by default:

- Uploaded files are stored locally under `storage/uploads`.
- Local parsing is used for PDF, DOCX, and XLSX.
- No raw files are sent externally by default.
- Demo analysis mode is used when `ANTHROPIC_API_KEY` is not configured.
- Real Claude analysis can be enabled later by adding environment variables.
- Embeddings are local by default; OpenAI embeddings are optional and configuration-driven.

## Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Optional production-style variables:

```bash
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-opus-4-8
EMBEDDINGS_PROVIDER=local
OPENAI_API_KEY=
DATABASE_URL=./data/app.db
STORAGE_DIR=./storage/uploads
DEFAULT_LOCALE=ar
MAX_UPLOAD_MB=50
```

Do not commit `.env.local` or real API keys.

## Local Development

Install dependencies:

```bash
npm install
```

Initialize the database:

```bash
npm run db:migrate
npm run db:seed
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:reset
```

## Repository Structure

```text
src/app                 Next.js routes and API endpoints
src/components          UI, layout, dashboard, upload, analysis, KB modules
src/lib/db              Drizzle schema, client, queries, migrations, seed
src/lib/parsers         PDF, DOCX, XLSX parsing
src/lib/pipeline        Upload processing and analysis pipeline
src/lib/ai              Claude integration, prompts, schemas, demo analysis
src/lib/rag             Knowledge Base chunking, retrieval, embeddings abstraction
src/lib/storage         Local private storage provider
src/lib/export          Executive report and PowerPoint export
```

## Design Direction

The UI is designed as a secure executive intelligence terminal:

- Arabic-first executive typography
- Dark-first cybernetic vault atmosphere
- Deep navy surfaces
- Cyan/blue intelligence accents
- Technical metadata styling
- Dense operational panels
- Premium motion and hover interactions
- English numerals only across Arabic and English modes

## Deployment Notes

For the current real working MVP, deploy to a server platform with persistent storage, such as Railway.

Recommended deployment path:

- Railway app connected to this GitHub repository.
- Persistent volume mounted to `/data`.
- `DATABASE_URL=/data/app.db`.
- `STORAGE_DIR=/data/uploads`.
- `ANTHROPIC_API_KEY` configured for real Claude analysis.

See:

```text
docs/DEPLOYMENT.md
```

The current MVP uses SQLite and local storage. The architecture is prepared for future enterprise deployment:

- SQLite can be replaced by PostgreSQL.
- Local storage can be replaced by S3 or Supabase Storage.
- Local retrieval can be upgraded to pgvector or managed vector search.
- Demo analysis automatically switches to real Claude analysis when `ANTHROPIC_API_KEY` is configured.

## License

Private project.
