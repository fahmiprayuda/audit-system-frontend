import { NextResponse } from "next/server";

export function middleware(request) {

    const token =
        request.cookies.get("token")?.value;

    const role =
        request.cookies.get("role")?.value;

    const pathname =
        request.nextUrl.pathname;

    // =====================
    // BELUM LOGIN
    // =====================

    if (!token && pathname !== "/login") {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // =====================
    // SUDAH LOGIN
    // =====================

    if (token && pathname === "/login") {

        if (role === "auditee") {
            return NextResponse.redirect(
                new URL("/my-tasks", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/projects", request.url)
        );
    }

    // =====================
    // AUDITEE BLOCK
    // =====================

    if (
        role === "auditee" &&
        (
            pathname.startsWith("/projects") ||
            pathname.startsWith("/dashboard")
        )
    ) {
        return NextResponse.redirect(
            new URL("/my-tasks", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/projects/:path*",
        "/dashboard/:path*",
        "/findings/:path*",
        "/my-tasks/:path*",
        "/login",
    ],
};