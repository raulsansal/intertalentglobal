"use client";

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function EmailVerificationBanner() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    const user = auth.currentUser;
    // Guard: Firebase restaura el estado de auth asíncronamente — si aún no está listo, salir
    if (!user) return;

    setIsSending(true);
    setError(null);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verificar-email`,
      });
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos e intenta de nuevo, o revisa tu carpeta de spam.");
      } else {
        setError("No pudimos enviar el correo. Intenta de nuevo más tarde.");
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      role="alert"
      className="bg-gold/15 border border-gold rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div>
        <p className="text-sm font-medium text-primary">
          Verifica tu correo electrónico
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Revisa tu bandeja de entrada y haz clic en el enlace de verificación.
        </p>
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
      </div>

      {sent ? (
        <p
          role="status"
          aria-live="polite"
          className="shrink-0 text-xs font-medium text-primary"
        >
          Correo enviado ✓
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          disabled={isSending}
          className="shrink-0 text-xs font-semibold text-primary underline hover:text-gold-hover transition-colors disabled:opacity-60"
        >
          {isSending ? "Enviando..." : "Reenviar correo"}
        </button>
      )}
    </div>
  );
}
