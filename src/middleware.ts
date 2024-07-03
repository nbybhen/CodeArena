import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const public_paths = ["/", "/login"];

    const token = request.cookies.get("token")?.value || "";

    //console.log("Token:", token);

    // Prevents logged in users from accessing public paths
    if (public_paths.includes(path) && token) {
        console.log("PUBLIC PATH DETECTED (logged in)");
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    // Prevents non-logged in users from accessing private paths
    if (!public_paths.includes(path) && !token) {
        console.log("PRIVATE PATH DETECTED (not logged in)");
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/", "/login", "/dashboard"],
};
