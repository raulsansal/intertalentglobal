"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

type View = "login" | "recovery";

export default function LoginForm() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Verificar honeypot — si tiene valor es un bot
    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return;

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsPending(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Si el usuario no tiene documento en Firestore, crearlo
      // (cubre usuarios creados manualmente en Firebase Console)
      const userRef = doc(db, "users", credential.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const displayName = credential.user.displayName ?? "";
        const nameParts = displayName.trim().split(/\s+/);
        await setDoc(userRef, {
          uid: credential.user.uid,
          email: credential.user.email ?? "",
          firstName: nameParts[0] ?? "",
          lastName: nameParts[1] ?? "",
          avatarUrl: null,
          createdAt: serverTimestamp(),
        });
      }

      const idToken = await credential.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("session_error");

      const data = await res.json();
      localStorage.setItem("hasAccount", "true");
      router.push(data.isAdmin ? "/admin" : "/perfil");
      router.refresh();
    } catch {
      // Mensaje genérico — no revelar si el email existe (anti-enumeration)
      setError("Email o contraseña incorrectos. Intenta de nuevo.");
    } finally {
      setIsPending(false);
    }
  }

  async function handleRecovery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    setIsPending(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch {
      // Silencioso — no confirmar si el email existe (anti-enumeration)
    } finally {
      setIsPending(false);
      // Mensaje genérico independientemente del resultado
      setRecoverySuccess(true);
    }
  }

  if (view === "recovery") {
    return (
      <form onSubmit={handleRecovery} noValidate aria-label="Recuperar contraseña">
        <p className="text-sm text-gray-500 mb-4">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <div className="mb-6">
          <label
            htmlFor="recovery-email"
            className="block text-sm font-medium text-[#23354F] mb-1"
          >
            Correo electrónico
          </label>
          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
          />
        </div>

        {recoverySuccess && (
          <p role="status" aria-live="polite" className="text-sm text-[#23354F] mb-4">
            Si ese correo está registrado, recibirás un enlace en los próximos minutos.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || recoverySuccess}
          className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60 mb-3"
        >
          {isPending ? "Enviando..." : "Enviar enlace"}
        </button>

        <button
          type="button"
          onClick={() => {
            setView("login");
            setError(null);
            setRecoverySuccess(false);
          }}
          className="w-full text-sm text-[#23354F] underline hover:text-[#EEC073] transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} noValidate aria-label="Iniciar sesión">
      {/* Campo honeypot — invisible para humanos, visible para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        autoComplete="off"
      />

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#23354F] mb-1"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-describedby={error ? "login-error" : undefined}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#23354F] mb-1"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => {
            setView("recovery");
            setError(null);
          }}
          className="text-sm text-[#23354F] underline hover:text-[#EEC073] transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {error && (
        <p
          id="login-error"
          role="alert"
          className="text-red-600 text-sm mb-4"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60 mb-4"
      >
        {isPending ? "Verificando..." : "Ingresar"}
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Aún no te has registrado?{" "}
        <a
          href="/registro"
          className="text-[#23354F] underline hover:text-[#EEC073] transition-colors"
        >
          Registrarme
        </a>
      </p>
    </form>
  );
}
