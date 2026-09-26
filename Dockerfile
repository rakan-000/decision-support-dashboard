FROM node:22-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# better-sqlite3 may need native build tooling when prebuilt binaries are not available.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Build workers use isolated in-memory SQLite databases; the real database is
# migrated once at runtime before the server starts.
RUN DI_BUILD=1 npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
