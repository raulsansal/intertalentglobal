import { adminAuth, adminDb } from "@/app/lib/firebase-admin";
import { getRoleFromClaims } from "@/app/lib/auth/roles";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { DecodedIdToken } from "firebase-admin/auth";

const SESSION_COOKIE_NAME = "__session";
const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 días
const SESSION_DURATION_S = SESSION_DURATION_MS / 1000;

/**
 * Verifica el idToken del cliente y crea una session cookie HttpOnly de 14 días.
 * Válido para cualquier usuario autenticado (admin y público).
 * Retorna isAdmin: true si el usuario tiene el custom claim admin.
 * Usado en: POST /api/auth/session
 */
export async function createSession(idToken: string): Promise<NextResponse> {
  const decoded = await adminAuth.verifyIdToken(idToken);

  // Sincronizar emailVerified y, si falta, inicializar role.
  // El cliente no puede escribir 'role' (regla de seguridad lo bloquea);
  // el Admin SDK bypassa esas reglas por diseño.
  const firestoreUpdate: Record<string, unknown> = {
    emailVerified: decoded.email_verified === true,
  };
  if (!decoded.role) {
    firestoreUpdate.role = "usuario";
  }
  await adminDb.doc(`users/${decoded.uid}`).set(firestoreUpdate, { merge: true });

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });

  const role = getRoleFromClaims(decoded as Record<string, unknown>);

  const response = NextResponse.json({
    success: true,
    isAdmin: decoded.admin === true,
    role,
  });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    // En desarrollo (HTTP) secure debe ser false para que el navegador acepte la cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_S,
    path: "/",
  });

  return response;
}

/**
 * Verifica la session cookie contra Firebase con checkRevoked: true.
 * Retorna el decoded token o null si la cookie es inválida o fue revocada.
 * Usado en: admin/layout.tsx (segunda línea de defensa)
 */
export async function verifySession(
  cookieValue: string
): Promise<DecodedIdToken | null> {
  try {
    return await adminAuth.verifySessionCookie(cookieValue, true);
  } catch {
    return null;
  }
}

/**
 * Revoca todos los refresh tokens del usuario y elimina la cookie.
 * Invalida TODAS las sesiones activas del usuario en cualquier dispositivo.
 * Usado en: POST /api/auth/logout
 */
export async function revokeSession(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Si la cookie ya era inválida, continuar con el logout de todas formas
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const response = NextResponse.redirect(new URL("/login", siteUrl));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

/**
 * Lee la session cookie del request actual.
 * Usado en Server Components (login/page.tsx, admin/layout.tsx).
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
