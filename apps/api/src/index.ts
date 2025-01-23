import { Env } from "./types/env";
import { createErrorResponse, createSuccessResponse } from "./types/api";
import { handleV1Routes } from "./routes/v1";
// import { handleRateLimit } from './middleware/rateLimit';

const getCorsHeaders = (request: Request, env: Env): Record<string, string> => {
  const origin = request.headers.get("Origin");

  const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "",
    "Access-Control-Allow-Methods": "",
    "Access-Control-Allow-Headers": "",
    "Access-Control-Allow-Credentials": "",
    "Access-Control-Max-Age": "",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] =
      "GET, POST, PATCH, DELETE, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return headers;
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === "OPTIONS") {
      return createSuccessResponse(null, getCorsHeaders(request, env));
    }

    try {
      // Check rate limit
      // const rateLimitResponse = await handleRateLimit(request, env, corsHeaders);
      // if (rateLimitResponse) {
      //   return rateLimitResponse;
      // }

      // Handle v1 API routes
      if (path.startsWith("/api/v1/")) {
        return await handleV1Routes(request, env, getCorsHeaders(request, env));
      }

      return createErrorResponse(
        "NOT_FOUND",
        "Endpoint not found",
        404,
        getCorsHeaders(request, env),
      );
    } catch (error) {
      console.error("[Error]", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const errorCode =
        error instanceof Error && "code" in error
          ? (error as any).code
          : "INTERNAL_ERROR";

      return createErrorResponse(
        errorCode,
        errorMessage,
        500,
        getCorsHeaders(request, env),
      );
    }
  },
} satisfies ExportedHandler<Env>;
