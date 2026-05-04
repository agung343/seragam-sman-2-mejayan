import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("session")?.value
    const session = token ? await verifyToken(token) : null
    const {pathname} = req.nextUrl;

    if (!session) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    const userRole = session.role

    const adminRoutes = ["/", "/daftar"]
    const isTryingAccessToAdmin = adminRoutes.some(route => pathname === route)
    if (userRole === "STUDENT" && isTryingAccessToAdmin) {
        return NextResponse.redirect(new URL("/status", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/daftar", "/status"]
}