export interface Env {
  // D1 Database binding
  DB: D1Database;

  // Environment variables
  JWT_SECRET: string;
  ADMIN_WHITELIST: string; // Comma-separated list of admin account IDs

  // CORS Configuration
  ALLOWED_ORIGINS: string; // Comma-separated list of allowed origins (e.g. http://localhost:3000,https://app.rngfan.club)

  // KV Namespaces (if needed)
  CACHE: KVNamespace;
}

// Re-export for convenience
export type { D1Database, KVNamespace } from "@cloudflare/workers-types";
