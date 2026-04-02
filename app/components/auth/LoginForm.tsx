"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { handleGoogleAuth } from "@/app/lib/auth/googleAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type View = "login" | "recovery";

export default function LoginForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [view, setView] = useState<View>("login");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // ── Login con email + contraseña ──────────────────────────────────────────

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return; // honeypot

    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    setIsPending(true);
    try {
      // 1. reCAPTCHA v3 (invisible — sin UI)
      const recaptchaToken = executeRecaptcha
        ? await executeRecaptcha("login")
        : null;

      // 2. Autenticar con Firebase
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // 3. Crear doc Firestore si el usuario fue creado manualmente (sin RegisterForm)
      const userRef = doc(db, "users", credential.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: credential.user.uid,
          email: credential.user.email ?? email,
          displayName: credential.user.displayName ?? "",
          avatarUrl: null,
          role: "usuario",
          createdAt: serverTimestamp(),
        });
      }

      // 4. Crear session cookie
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          ...(recaptchaToken
            ? { recaptchaToken, recaptchaAction: "login" }
            : {}),
        }),
      });

      if (!res.ok) throw new Error("session_error");

      const data = (await res.json()) as { isAdmin: boolean };
      localStorage.setItem("hasAccount", "true");
      router.push(data.isAdmin ? "/admin" : "/");
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("Email o contraseña incorrectos. Intenta de nuevo.");
      } else if (code === "auth/too-many-requests") {
        setError(
          "Demasiados intentos seguidos. Espera unos minutos antes de intentarlo de nuevo."
        );
      } else if (code === "auth/network-request-failed") {
        setError(
          "No pudimos conectarnos. Verifica tu conexión a internet e intenta de nuevo."
        );
      } else {
        setError("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsPending(false);
    }
  }

  // ── Recuperación de contraseña ────────────────────────────────────────────

  async function handleRecovery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setRecoverySuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("recovery-email") as string).trim();

    setIsPending(true);
    try {
      // reCAPTCHA para disuadir enumeración masiva de emails
      if (executeRecaptcha) await executeRecaptcha("recovery");

      await sendPasswordResetEmail(auth, email);
      setRecoverySuccess(true);
    } catch {
      // Mensaje genérico también en error — nunca revelar si el email existe
      setRecoverySuccess(true);
    } finally {
      setIsPending(false);
    }
  }

  // ── Google Sign-In ────────────────────────────────────────────────────────

  async function handleGoogleLogin() {
    // No hacer await antes de signInWithPopup — el contexto de gesto se pierde
    setIsPending(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const { isAdmin } = await handleGoogleAuth(result.user);
      localStorage.setItem("hasAccount", "true");
      router.push(isAdmin ? "/admin" : "/");
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code;
      console.error("[Google Auth] Error code:", code, err);
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      if (code === "auth/popup-blocked-by-browser") {
        setError("Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes para este sitio e intenta de nuevo.");
      } else if (code === "auth/account-exists-with-different-credential") {
        setError("Este correo ya está registrado con otro método. Usa tu contraseña.");
      } else {
        setError("No pudimos conectar con Google. Intenta de nuevo.");
      }
    } finally {
      setIsPending(false);
    }
  }

  // ── Vista: recuperación de contraseña ─────────────────────────────────────

  if (view === "recovery") {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setView("login");
            setError(null);
            setRecoverySuccess(false);
          }}
          className="text-sm text-primary underline hover:text-gold transition-colors mb-4 block"
        >
          ← Volver al inicio de sesión
        </button>

        <h2 className="text-lg font-semibold text-primary mb-4">
          Recuperar contraseña
        </h2>

        {recoverySuccess ? (
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-gray-600 bg-gray-50 rounded p-4"
          >
            Si ese correo está registrado, recibirás un enlace para restablecer
            tu contraseña en los próximos minutos. Revisa también tu carpeta de spam.
          </p>
        ) : (
          <form onSubmit={handleRecovery} noValidate>
            <div className="mb-4">
              <label
                htmlFor="recovery-email"
                className="block text-sm font-medium text-primary mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="recovery-email"
                name="recovery-email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-60"
              />
            </div>

            {error && (
              <p role="alert" className="text-red-600 text-sm mb-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold hover:bg-gold-hover text-primary font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}
      </div>
    );
  }

  // ── Vista: login ──────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleLogin} noValidate aria-label="Iniciar sesión">
      {/* Honeypot */}
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
          className="block text-sm font-medium text-primary mb-1"
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
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-60"
        />
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-primary mb-1"
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
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-60"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => {
            setView("recovery");
            setError(null);
          }}
          className="text-xs text-gray-500 hover:text-primary underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {error && (
        <p id="login-error" role="alert" className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gold hover:bg-gold-hover text-primary font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60"
      >
        {isPending ? "Verificando..." : "Ingresar"}
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
        onClick={handleGoogleLogin}
        disabled={isPending}
        aria-label="Iniciar sesión con Google"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 text-primary font-medium text-sm px-6 py-3 rounded hover:bg-gray-50 transition-colors disabled:opacity-60 mb-4"
      >
        <GoogleIcon />
        Continuar con Google
      </button>

      <p className="text-center text-sm text-gray-500">
        ¿Aún no te has registrado?{" "}
        <Link
          href="/registro"
          className="text-primary underline hover:text-gold transition-colors"
        >
          Registrarme
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
