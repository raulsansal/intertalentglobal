"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { markEmailVerified } from "@/app/actions/profile";

type Status = "loading" | "success" | "no-session" | "error";

export default function VerificarEmailPage() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // Esperar a que Firebase Auth inicialice y luego recargar el estado del usuario
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Solo necesitamos el estado inicial

      if (!user) {
        // El usuario puede haber verificado desde otro dispositivo / navegador
        setStatus("no-session");
        return;
      }

      try {
        // Recargar el estado desde Firebase para obtener emailVerified actualizado
        await user.reload();

        if (!auth.currentUser?.emailVerified) {
          // El enlace expiró o ya fue usado anteriormente
          setStatus("error");
          return;
        }

        // Actualizar Firestore vía Server Action (Admin SDK confirma en servidor)
        await markEmailVerified();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    });
  }, []);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white-soft flex items-center justify-center px-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-10 w-full max-w-sm text-center">
        {status === "loading" && (
          <div aria-live="polite" aria-busy="true">
            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse mx-auto mb-6" />
            <p className="text-sm text-gray-500">Verificando tu correo...</p>
          </div>
        )}

        {(status === "success" || status === "no-session") && (
          <>
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-primary mb-3">
              ¡Correo verificado!
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Tu cuenta está lista. Ya puedes acceder a todas las funcionalidades
              de Intertalent Global.
            </p>
            <Link
              href={status === "no-session" ? "/login" : "/"}
              className="inline-block bg-gold hover:bg-gold-hover text-primary font-semibold text-sm px-6 py-3 rounded transition-colors"
            >
              {status === "no-session" ? "Iniciar sesión" : "Ir al inicio"}
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-primary mb-3">
              Enlace no válido
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              El enlace de verificación ya no es válido o ha caducado. Inicia
              sesión y solicita un nuevo correo desde tu perfil.
            </p>
            <Link
              href="/login"
              className="inline-block bg-primary hover:bg-[#1a2840] text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
            >
              Ir al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
