import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL!;

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";

  const cookieStore = await cookies();
  const allCookies = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: allCookies },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = NextResponse.redirect(new URL(redirectTo, request.url));

    // Forward the new Set-Cookie headers from the API to the browser
    const setCookies = res.headers.getSetCookie();
    setCookies.forEach((cookie) => {
      response.headers.append("Set-Cookie", cookie);
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
