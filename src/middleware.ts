import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth";
import { getJwtSecretBytes } from "@/lib/jwt-secret";

function safeFrom(pathname: string): string {
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/duzenle")) &&
    !pathname.startsWith("//")
  ) {
    return pathname;
  }
  return "/admin";
}

/** Common scanner / CMS probe paths — never wake full Next+MySQL. */
const SCANNER_RE =
  /^\/(?:wp-admin|wp-content|wp-includes|wp-login\.php|xmlrpc\.php|wordpress|wlwmanifest\.xml|\.env|phpmyadmin|adminer|vendor\/phpunit|cgi-bin|\.git|actuator|laravel|telescope)/i;

function isUptimeProbe(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") || "";
  if (
    /GuzzleHttp|UptimeRobot|StatusCake|Pingdom|Hetrix|Site24x7|Better Uptime|Hostinger/i.test(
      ua
    )
  ) {
    return true;
  }
  return request.nextUrl.searchParams.has("nocache");
}

/**
 * Auth for admin/editor + cheap short-circuits for bots/probes.
 * Host canonicalization stays on Hostinger (hcdn) to avoid double redirects.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SCANNER_RE.test(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Hostinger/Guzzle `/?nocache=` must not render full ISR+MySQL home.
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    (pathname === "/" || pathname === "") &&
    isUptimeProbe(request)
  ) {
    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const isEditor = pathname.startsWith("/duzenle");
  const isAdmin =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (!isEditor && !isAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", safeFrom(pathname));
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, getJwtSecretBytes());
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/duzenle",
    "/duzenle/:path*",
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-login.php",
    "/xmlrpc.php",
    "/wordpress/:path*",
    "/phpmyadmin/:path*",
    "/.env",
    "/.env/:path*",
    "/.git/:path*",
  ],
};
