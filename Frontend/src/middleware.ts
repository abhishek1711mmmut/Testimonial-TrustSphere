import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const hasLocalAuth = request.cookies.get("ts_auth");
  if (!token && !hasLocalAuth) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next();
}
