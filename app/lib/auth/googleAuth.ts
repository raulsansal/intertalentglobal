// Lógica compartida post-signInWithPopup para LoginForm y RegisterForm.
// Centraliza: creación del doc Firestore, obtención del idToken y creación de sesión.

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { User } from "firebase/auth";

import type { Role } from "@/app/lib/auth/roles";

interface GoogleAuthResult {
  isAdmin: boolean;
  role: Role;
}

/**
 * Ejecutar después de signInWithPopup con GoogleAuthProvider.
 *
 * 1. Crea el documento users/{uid} en Firestore si no existe (nuevo usuario Google).
 * 2. Llama getIdToken(true) — forceRefresh obligatorio: Firebase Admin SDK exige
 *    que el idToken haya sido emitido hace menos de 5 minutos para createSessionCookie.
 * 3. POST /api/auth/session sin recaptchaToken — el popup de Google es la verificación.
 * 4. Retorna { isAdmin, role } para el redirect logic del caller.
 *
 * Lanza Error("session_error") si la creación de sesión falla — el caller muestra un mensaje.
 */
export async function handleGoogleAuth(user: User): Promise<GoogleAuthResult> {
  // 1. Crear doc Firestore solo si no existe (no sobreescribir datos de usuarios existentes)
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // El campo 'role' NO se incluye aquí — la regla Firestore bloquea que el cliente
    // lo escriba. El rol "usuario" se asigna en el servidor via Admin SDK al crear sesión.
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? "",
      // Google retorna displayName completo — no se separa en firstName/lastName
      // porque el formato varía por cultura y puede no ser parseable de forma confiable
      displayName: user.displayName ?? "",
      avatarUrl: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    });
  }

  // 2. Token fresco (< 5 min) requerido por createSessionCookie del Admin SDK
  const idToken = await user.getIdToken(true);

  // 3. Crear sesión — sin recaptchaToken: Google popup ES la prueba de humanidad
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) throw new Error("session_error");

  const data = (await res.json()) as { isAdmin: boolean; role: Role };
  return { isAdmin: data.isAdmin, role: data.role };
}
