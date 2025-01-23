import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth");
  const pathname = request.nextUrl.pathname;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url);
    }
    const accountId = request.cookies.get("auth")?.value;
    if (accountId !== "efiz.testnet") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect to login for any route except login and home when not authenticated
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/") {
    const url = new URL("/login", request.url);
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if accessing login while authenticated
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/quests", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
