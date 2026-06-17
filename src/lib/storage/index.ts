/**
 * Private file storage (server-only).
 *
 * Files are stored on the local server filesystem by default and are NEVER
 * sent to any external service. The provider interface is deliberately small
 * so a SupabaseStorageProvider / S3Provider can be dropped in for enterprise
 * deployments without changing any calling code.
 */

import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { config } from "@/lib/config";

export type StoredFile = {
  /** Opaque key persisted on the document record. */
  key: string;
  /** Absolute path on disk (local provider only). */
  path: string;
  /** Size in bytes. */
  size: number;
};

export interface StorageProvider {
  /** Persist bytes; returns an opaque key + metadata. */
  save(buffer: Buffer, originalName: string): Promise<StoredFile>;
  /** Read bytes back by key. */
  read(key: string): Promise<Buffer>;
  /** Remove a stored file. */
  remove(key: string): Promise<void>;
  /** Resolve an absolute filesystem path for a key (local provider only). */
  resolve(key: string): string;
  /** True when bytes for the key exist. */
  exists(key: string): Promise<boolean>;
}

function sanitize(name: string): string {
  // Keep extension, strip path traversal and unsafe characters.
  const base = path.basename(name);
  return base.replace(/[^\w.\-]+/g, "_").slice(-180);
}

class LocalStorageProvider implements StorageProvider {
  private root: string;

  constructor(root: string) {
    this.root = path.isAbsolute(root) ? root : path.join(process.cwd(), root);
    if (!existsSync(this.root)) mkdirSync(this.root, { recursive: true });
  }

  resolve(key: string): string {
    // Keys are flat, prefixed uuids; reject anything that escapes the root.
    const resolved = path.join(this.root, key);
    if (!resolved.startsWith(this.root)) {
      throw new Error("Invalid storage key");
    }
    return resolved;
  }

  async save(buffer: Buffer, originalName: string): Promise<StoredFile> {
    const key = `${randomUUID()}__${sanitize(originalName)}`;
    const filePath = this.resolve(key);
    await fs.writeFile(filePath, buffer);
    return { key, path: filePath, size: buffer.byteLength };
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async remove(key: string): Promise<void> {
    const filePath = this.resolve(key);
    if (existsSync(filePath)) await fs.unlink(filePath);
  }

  async exists(key: string): Promise<boolean> {
    return existsSync(this.resolve(key));
  }
}

const globalForStorage = globalThis as unknown as {
  __di_storage?: StorageProvider;
};

/** Singleton storage provider. Local-only and private by default. */
export const storage: StorageProvider =
  globalForStorage.__di_storage ?? new LocalStorageProvider(config.storage.dir);

globalForStorage.__di_storage = storage;
