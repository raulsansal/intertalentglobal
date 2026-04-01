import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth/session";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
// Threshold recomendado por Google. 1.0 = humano muy probable, 0.0 = bot muy probable.
const RECAPTCHA_SCORE_THRESHOLD = 0.5;

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

/**
 * Verifica un token de reCAPTCHA v3 contra la API de Google.
 * Retorna true si el token es válido, el score supera el threshold y la acción coincide.
 * Si RECAPTCHA_SECRET_KEY no está configurada (desarrollo), retorna true con un warning.
 */
async function verifyRecaptchaToken(
  token: string,
  expectedAction: string
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("[auth/session] RECAPTCHA_SECRET_KEY no configurada — omitiendo verificación");
    return true;
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  const res = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) return false;

  const data = (await res.json()) as RecaptchaVerifyResponse;

  if (!data.success) return false;
  if (data.score < RECAPTCHA_SCORE_THRESHOLD) return false;
  // La verificación de acción es defensa en profundidad, no el único boundary de seguridad
  if (data.action !== expectedAction) return false;

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      idToken?: unknown;
      recaptchaToken?: unknown;
      recaptchaAction?: unknown;
    };

    const { idToken, recaptchaToken, recaptchaAction } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken requerido" }, { status: 400 });
    }

    // Verificar reCAPTCHA solo cuando el token está presente (flujos email/contraseña).
    // Los flujos de Google Sign-In no envían token — el popup de Google es la verificación.
    if (recaptchaToken && typeof recaptchaToken === "string") {
      const action =
        typeof recaptchaAction === "string" ? recaptchaAction : "login";
      const isHuman = await verifyRecaptchaToken(recaptchaToken, action);
      if (!isHuman) {
        return NextResponse.json(
          { error: "Verificación de seguridad fallida. Intenta de nuevo." },
          { status: 403 }
        );
      }
    }

    return await createSession(idToken);
  } catch (error) {
    console.error("[auth/session] Error:", error);
    return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 });
  }
}
