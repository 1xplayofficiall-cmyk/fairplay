import { NextResponse } from "next/server";

export function middleware(request) {
  const host = request.headers.get("host");

  if (host === "fair-play.co") {
    const url = request.nextUrl.clone();
    url.host = "www.fair-play.co";
    url.port = "";
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
