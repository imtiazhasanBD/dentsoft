import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl;

  const isAuthPage = url.pathname === "/login" || url.pathname === "/register";

  // If user is logged in, prevent access to /login or /register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not logged in, block all other routes except public ones
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|bg-image.avif).*)",
  ],
};
