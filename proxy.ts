import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session");

  // Verificación ligera en Edge Runtime: solo comprueba existencia de la cookie.
  // El Edge Runtime no soporta el Admin SDK completo de Node.js, por lo que no
  // podemos verificar la firma aquí. La verificación autoritativa (checkRevoked)
  // ocurre en app/admin/layout.tsx con adminAuth.verifySessionCookie().
  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
