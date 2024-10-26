import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: ["/dashboard/:path*"],
};

export function middleware(request: NextRequest) {
  const token = cookies().get("access_token");
  if (!token) {
    // Respond with JSON indicating an error message
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  return NextResponse.next();
}
