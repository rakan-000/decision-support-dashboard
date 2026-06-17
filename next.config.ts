import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / heavy node-only packages must not be bundled by Turbopack.
  // They are used exclusively in server route handlers and server-side code.
  serverExternalPackages: [
    "better-sqlite3",
    "pdf-parse",
    "pdfjs-dist",
    "mammoth",
    "xlsx",
    "@anthropic-ai/sdk",
    "pptxgenjs",
  ],
};

export default nextConfig;
