import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia_jwt_anda");

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value || null;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard/admin")) {
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/users", req.url));
    }
  }
  if (pathname.startsWith("/dashboard/users")) {
    if (payload.role !== "user") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};