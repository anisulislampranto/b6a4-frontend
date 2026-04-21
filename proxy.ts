import { NextRequest, NextResponse } from "next/server";


export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/verify-email")) {
        return NextResponse.next();
    }

    const sessionToken = request.cookies.get("better-auth.session_token");
    if (!sessionToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();

}


export const config = {
    matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};