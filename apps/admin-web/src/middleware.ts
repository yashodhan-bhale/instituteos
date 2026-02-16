import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Identify if we are in the platform management area
    const isPlatformRoute = pathname.startsWith("/platform");

    // 2. Get the token from cookies
    const token = request.cookies.get("auth_token")?.value;

    if (isPlatformRoute) {
        // Platform routes require a valid Platform token
        if (!token) {
            return NextResponse.redirect(new URL("/login?target=platform", request.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            // Verify it's a platform token
            if (payload.target !== "platform" || !payload.roles) {
                return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
            }

            // Check for Super Admin role if it's a sensitive route
            // (For now allow all platform staff)
            return NextResponse.next();
        } catch (err) {
            console.error("JWT Verification failed:", err);
            return NextResponse.redirect(new URL("/login?target=platform&error=expired", request.url));
        }
    }

    // Regular Institute routes (Subdomain checking)
    // This is where we could eventually handle subdomain-based tenant verification
    // For now, let it pass and let components handle auth

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
