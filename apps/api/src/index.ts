import { Env } from "./types/env";
import { createErrorResponse, createSuccessResponse } from "./types/api";
import { handleV1Routes } from "./routes/v1";
// import { handleRateLimit } from './middleware/rateLimit';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === "OPTIONS") {
      return createSuccessResponse(null, corsHeaders);
    }

    try {
      // Check rate limit
      // const rateLimitResponse = await handleRateLimit(request, env, corsHeaders);
      // if (rateLimitResponse) {
      //   return rateLimitResponse;
      // }

      // Handle v1 API routes
      if (path.startsWith("/api/v1/")) {
        return await handleV1Routes(request, env, corsHeaders);
      }

      return createErrorResponse(
        "NOT_FOUND",
        "Endpoint not found",
        404,
        corsHeaders,
      );
    } catch (error) {
      console.error("[Error]", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const errorCode =
        error instanceof Error && "code" in error
          ? (error as any).code
          : "INTERNAL_ERROR";

      return createErrorResponse(errorCode, errorMessage, 500, corsHeaders);
    }
  },
} satisfies ExportedHandler<Env>;
