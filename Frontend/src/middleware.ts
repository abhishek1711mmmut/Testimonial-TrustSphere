import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

export function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.has("access_token") || request.cookies.has("ts_auth");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }
  if (!isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next();
}
