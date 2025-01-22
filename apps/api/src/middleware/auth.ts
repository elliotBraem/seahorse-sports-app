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
    // Verify JWT token here using env.JWT_SECRET
    // For now, we'll just validate the token exists
    if (!token) {
      throw new Error("INVALID_TOKEN");
    }

    // Add user data to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: "user_id", // Replace with actual user ID from token
      isAdmin: false, // Replace with actual admin status from token
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
    );
  }
}
