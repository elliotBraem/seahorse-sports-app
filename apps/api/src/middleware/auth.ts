import { jwtVerify } from 'jose';
import { AuthenticatedRequest, createErrorResponse } from "../types/api";
import { Env } from "../types/env";

export async function authenticateUser(
  request: Request,
  env: Env,
): Promise<AuthenticatedRequest> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(env.JWT_SECRET)
    );

    if (!payload.sub) {
      throw new Error("UNAUTHORIZED");
    }

    // Check if user is in admin whitelist
    const adminWhitelist = env.ADMIN_WHITELIST.split(",").map((id) =>
      id.trim(),
    );
    const isAdmin = adminWhitelist.includes(payload.sub);

    // Add user data to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: payload.sub,
      isAdmin,
      email: payload.email as string | undefined,
      publicAddress: payload.publicAddress as string | undefined
    };

    return authenticatedRequest;
  } catch (error) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function requireAuth(
  request: Request,
  env: Env,
  requireAdmin: boolean = false,
  corsHeaders: Record<string, string> = {},
): Promise<AuthenticatedRequest> {
  try {
    const authenticatedRequest = await authenticateUser(request, env);

    if (requireAdmin && !authenticatedRequest.user?.isAdmin) {
      throw new Error("FORBIDDEN");
    }

    return authenticatedRequest;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "UNAUTHORIZED";
    throw createErrorResponse(
      errorMessage,
      errorMessage === "FORBIDDEN"
        ? "Admin access required"
        : "Authentication required",
      errorMessage === "FORBIDDEN" ? 403 : 401,
      corsHeaders,
    );
  }
}
