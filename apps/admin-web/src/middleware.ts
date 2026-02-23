import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";

    // Define domains (In production, use env vars)
    // Localhost handling: platform.localhost:3000, institute.localhost:3000
    // Production: platform.domain.com, institute.domain.com

    const isPlatformDomain = hostname.startsWith("platform.");
    const isLocalhost = hostname.includes("localhost");

    // Determine if it's a subdomain (excluding 'platform' and 'www')
    // For localhost, we count parts. localhost:3000 -> 1 part. institute.localhost:3000 -> 2 parts.
    // robust check: splitted by '.'
    const parts = hostname.split(".");
    const isSubdomain = parts.length > (isLocalhost ? 1 : 2)
        && !hostname.startsWith("www.")
        && !hostname.startsWith("platform.");

    // 1. Determine Identity & Target
    const token = request.cookies.get("auth_token")?.value;
    const path = url.pathname;

    // Helper to verify token
    async function verifyToken(t: string | undefined): Promise<any> {
        if (!t) return null;
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(t, secret);
            return payload;
        } catch {
            return null;
        }
    }

    // 2. Auth Guards (Check before we commit to a rewrite)

    // Platform Guard
    if (isPlatformDomain && !path.startsWith("/login") && !path.startsWith("/api") && !path.startsWith("/_next")) {
        const payload = await verifyToken(token);
        if (!payload || payload.target !== "platform" || !payload.roles) {
            return NextResponse.redirect(new URL("/login?target=platform", request.url));
        }
    }

    // Institute Guard
    if (isSubdomain && !path.startsWith("/login") && !path.startsWith("/api") && !path.startsWith("/_next")) {
        const payload = await verifyToken(token);
        if (!payload || payload.target !== "institute") {
            // Special case: platform admin on institute domain
            if (payload?.target === "platform") {
                const rootDomain = hostname.includes("localhost") ? "localhost" : hostname.split('.').slice(-2).join('.');
                const port = hostname.includes(":") ? `:${hostname.split(":")[1]}` : "";
                return NextResponse.redirect(new URL(`${url.protocol}//platform.${rootDomain}${port}/platform`, request.url));
            }
            return NextResponse.redirect(new URL("/login?target=institute", request.url));
        }
    }

    // 3. Rewrite Logic (Executed after auth is verified)

    // Platform Domain -> Rewrite to /platform
    if (isPlatformDomain) {
        if (!path.startsWith("/platform") && !path.startsWith("/api") && !path.startsWith("/_next") && !path.startsWith("/login")) {
            return NextResponse.rewrite(new URL(`/platform${path === "/" ? "" : path}`, request.url));
        }
    }

    // Institute Subdomain -> Rewrite to /school
    else if (isSubdomain) {
        if (!path.startsWith("/school") && !path.startsWith("/api") && !path.startsWith("/_next") && !path.startsWith("/login")) {
            return NextResponse.rewrite(new URL(`/school${path === "/" ? "" : path}`, request.url));
        }
    }

    // Public Domain (Root) -> Rewrite to /site
    else {
        if (path === "/" || (!path.startsWith("/site") && !path.startsWith("/api") && !path.startsWith("/_next") && !path.startsWith("/login"))) {
            return NextResponse.rewrite(new URL(`/site${path === "/" ? "" : path}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
