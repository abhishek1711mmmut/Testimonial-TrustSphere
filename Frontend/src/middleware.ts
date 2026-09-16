import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

export function middleware(request: NextRequest) {
  // Presence is a navigation hint; Flask validates the JWT for protected APIs.
  const isLoggedIn = Boolean(request.cookies.get("access_token")?.value);
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next();
}
