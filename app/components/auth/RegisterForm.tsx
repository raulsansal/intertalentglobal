"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { handleGoogleAuth } from "@/app/lib/auth/googleAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Registro con email + contraseña ──────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return; // honeypot

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
      // 1. reCAPTCHA v3 (invisible — sin UI)
      const recaptchaToken = executeRecaptcha
        ? await executeRecaptcha("register")
        : null;

      // 2. Crear usuario en Firebase Authentication
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      // 3. Guardar nombre completo en Firebase Auth (para el Avatar)
      await updateProfile(credential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 4. Crear perfil en Firestore
      // El campo 'role' NO se incluye aquí — la regla Firestore bloquea que el cliente
      // lo escriba. El rol "usuario" se asigna en el servidor via Admin SDK al crear sesión.
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        email,
        firstName,
        lastName,
        avatarUrl: null,
        createdAt: serverTimestamp(),
      });

      // 5. Enviar email de verificación (no bloqueante)
      // continueUrl: a dónde redirigir al usuario después de hacer clic en el enlace.
      // Debe ser un dominio autorizado en Firebase Console → Authentication → Authorized domains.
      sendEmailVerification(credential.user, {
        url: `${window.location.origin}/verificar-email`,
      }).catch((err) => {
        console.warn("[register] Failed to send verification email:", (err as { code?: string }).code);
      });

      // 6. Crear session cookie
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          ...(recaptchaToken
            ? { recaptchaToken, recaptchaAction: "register" }
            : {}),
        }),
      });

      if (!res.ok) throw new Error("session_error");

      localStorage.setItem("hasAccount", "true");
      router.push("/perfil");
      router.refresh();
    } catch (err) {
      // Si Firebase Auth creó el usuario pero el resto del flujo falló,
      // limpiar el estado de auth cliente para evitar avatar sin sesión.
      await signOut(auth).catch(() => {});
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

  // ── Google Sign-In ────────────────────────────────────────────────────────

  async function handleGoogleRegister() {
    // No hacer await antes de signInWithPopup — el contexto de gesto se pierde
    setIsPending(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      // handleGoogleAuth crea el doc Firestore si es nuevo usuario
      await handleGoogleAuth(result.user);
      localStorage.setItem("hasAccount", "true");
      router.push("/perfil");
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      console.error("[Google Auth] Error code:", code, err);
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/popup-blocked-by-browser") {
        setError("Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes para este sitio e intenta de nuevo.");
      } else if (code === "auth/account-exists-with-different-credential") {
        setError("Este correo ya está asociado a otra cuenta. Intenta con contraseña.");
      } else {
        setError("No pudimos conectar con Google. Intenta de nuevo.");
      }
    } finally {
      setIsPending(false);
    }
  }

  // ── JSX ───────────────────────────────────────────────────────────────────

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
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[#23354F] mb-1"
          >
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
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[#23354F] mb-1"
          >
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
          aria-describedby={error ? "register-error" : undefined}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      <div className="mb-4">
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
          autoComplete="new-password"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
        <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
      </div>

      <div className="mb-6">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-[#23354F] mb-1"
        >
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
        className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60"
      >
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      {/* Separador */}
      <div className="flex items-center gap-3 my-4" aria-hidden="true">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">O continúa con</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={isPending}
        aria-label="Registrarse con Google"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 text-[#23354F] font-medium text-sm px-6 py-3 rounded hover:bg-gray-50 transition-colors disabled:opacity-60 mb-4"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-[#23354F] underline hover:text-[#EEC073] transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

// ── Logo oficial de Google (SVG inline, sin dependencia de imagen externa) ────
function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.226 17.64 11.917 17.64 9.2Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
