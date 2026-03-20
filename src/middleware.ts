import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth0 } from "./lib/auth0";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  // Let Auth0 handle its own routes
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return auth0.middleware(req);
  }

  // For all other routes, run i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|zh)/:path*", "/auth/:path*"],
};
