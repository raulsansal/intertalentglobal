"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Verificar honeypot
    if (formData.get("website")) return;

    const firstName = (formData.get("firstName") as string).trim();
    const lastName = (formData.get("lastName") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsPending(true);
    try {
      // 1. Crear usuario en Firebase Authentication
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Guardar nombre completo en Firebase Auth (para el Avatar)
      await updateProfile(credential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Crear perfil en Firestore
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email,
        firstName,
        lastName,
        avatarUrl: null,
        createdAt: serverTimestamp(),
      });

      // 4. Crear session cookie
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("session_error");

      localStorage.setItem("hasAccount", "true");
      router.push("/perfil");
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      const errorMessages: Record<string, string> = {
        "auth/email-already-in-use":
          "Este correo ya tiene una cuenta registrada. Puedes iniciar sesión.",
        "auth/invalid-email":
          "El correo que ingresaste no tiene un formato válido. Revísalo e intenta de nuevo.",
        "auth/weak-password":
          "La contraseña es demasiado débil. Usa al menos 8 caracteres combinando letras y números.",
        "auth/network-request-failed":
          "No pudimos conectarnos. Verifica tu conexión a internet e intenta de nuevo.",
        "auth/too-many-requests":
          "Demasiados intentos seguidos. Espera unos minutos antes de intentarlo de nuevo.",
        "auth/operation-not-allowed":
          "El registro con correo y contraseña no está disponible en este momento.",
      };
      setError(
        errorMessages[code ?? ""] ??
          "Algo salió mal al crear tu cuenta. Intenta de nuevo en unos momentos."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Crear cuenta">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        autoComplete="off"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[#23354F] mb-1">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[#23354F] mb-1">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-[#23354F] mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          aria-describedby={error ? "register-error" : undefined}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-[#23354F] mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#23354F] mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      {error && (
        <p id="register-error" role="alert" className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60 mb-4"
      >
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[#23354F] underline hover:text-[#EEC073] transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
