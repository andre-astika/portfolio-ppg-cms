import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, parseSessionValue } from "./lib/auth";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const username = parseSessionValue(token);
    if (!username) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
