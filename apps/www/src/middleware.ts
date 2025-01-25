import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthToken, verifyToken } from "./app/actions";
import { getUserProfile } from "./lib/api";

export async function middleware(request: NextRequest) {
  const authToken = await getAuthToken();
  const pathname = request.nextUrl.pathname;

  const isAuthenticated = authToken ? await verifyToken(authToken) : null;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
    // Check isAdmin claim from JWT
    if (!isAuthenticated.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname !== "/" && !pathname.startsWith("/login")) {
    // Redirect to home for any route except home when not authenticated
    if (!isAuthenticated) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    } else {
      // Redirect to onboarding if profile doesn't exist
      try {
        const profile = await getUserProfile();
        if (!profile && pathname !== "/onboarding") {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      } catch (error) {
        // If we can't fetch the profile, redirect to onboarding
        if (pathname !== "/onboarding") {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.png).*)"],
};
