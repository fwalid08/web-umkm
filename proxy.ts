import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "saas-saya.com";

export default function proxy(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  const isRoot = hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}` || hostname === "localhost:3000" || hostname.startsWith("localhost");
  const isAdmin = hostname.startsWith("admin.");
  if (!isRoot && !isAdmin && hostname.includes(ROOT_DOMAIN)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, "");
    if (/^[a-z0-9-]{3,50}$/.test(subdomain)) {
      const res = NextResponse.next();
      res.headers.set("x-tenant-subdomain", subdomain);
      res.headers.set("x-is-tenant", "true");
      return res;
    }
  }
  const res = NextResponse.next();
  res.headers.set("x-tenant-subdomain", "");
  res.headers.set("x-is-tenant", isAdmin ? "admin" : "false");
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};