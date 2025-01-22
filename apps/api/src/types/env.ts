export interface Env {
  // D1 Database binding
  DB: D1Database;

  // Environment variables
  JWT_SECRET: string;
  ENVIRONMENT: "development" | "production";

  // KV Namespaces (if needed)
  CACHE: KVNamespace;
}

// Re-export for convenience
export type { D1Database, KVNamespace } from "@cloudflare/workers-types";
