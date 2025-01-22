import { Env } from "../types/env";
import { createErrorResponse } from "../types/api";

const RATE_LIMIT_WINDOW = 60; // 1 minute
const DEFAULT_RATE_LIMIT = 60; // 60 requests per minute
const ADMIN_RATE_LIMIT = 120; // 120 requests per minute

interface RateLimitInfo {
  count: number;
  timestamp: number;
}

export async function handleRateLimit(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
  const isAdmin = request.url.includes("/admin/");
  const limit = isAdmin ? ADMIN_RATE_LIMIT : DEFAULT_RATE_LIMIT;

  const key = `ratelimit:${clientIp}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    // Get current rate limit info
    const stored = await env.CACHE.get(key);
    let info: RateLimitInfo;

    if (stored) {
      info = JSON.parse(stored);

      // Reset if window has passed
      if (now - info.timestamp >= RATE_LIMIT_WINDOW) {
        info = { count: 0, timestamp: now };
      }
    } else {
      info = { count: 0, timestamp: now };
    }

    // Increment count
    info.count++;

    // Store updated info
    await env.CACHE.put(key, JSON.stringify(info), {
      expirationTtl: RATE_LIMIT_WINDOW,
    });

    // Add rate limit headers
    const rateLimitHeaders = {
      ...corsHeaders,
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": Math.max(0, limit - info.count).toString(),
      "X-RateLimit-Reset": (info.timestamp + RATE_LIMIT_WINDOW).toString(),
    };

    // Check if rate limit exceeded
    if (info.count > limit) {
      return createErrorResponse(
        "RATE_LIMIT_EXCEEDED",
        "Too many requests, please try again later",
        429,
        rateLimitHeaders,
      );
    }

    return null;
  } catch (error) {
    console.error("[Rate Limit Error]", error);
    // Continue on rate limit errors
    return null;
  }
}
