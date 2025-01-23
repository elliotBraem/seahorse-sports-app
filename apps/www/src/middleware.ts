import { getUserProfile } from "@/lib/api/user";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthCookie } from "./app/actions";

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth");
  const pathname = request.nextUrl.pathname;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    }
    const accountId = await getAuthCookie();
    if (accountId !== "efiz.testnet") {
      // not an admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname !== "/") {
    // Redirect to home for any route except home when not authenticated
    if (!isAuthenticated) {
      const url = new URL("/", request.url);
      return NextResponse.redirect(url);
    } else {
      // Redirect to onboarding if incomplete or missing profile
      try {
        const profile = await getUserProfile();

        // Check if profile exists and has required fields
        const isProfileComplete = profile && profile.username && profile.email;

        if (!isProfileComplete && pathname !== "/onboarding") {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
