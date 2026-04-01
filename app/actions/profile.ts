"use server";

import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import { adminDb, adminAuth } from "@/app/lib/firebase-admin";

const VALID_TOPICS = [
  "Desarrollo humano",
  "Desarrollo organizacional",
  "Herramientas tecnológicas",
  "Inteligencia comercial",
  "Legalidad y ética",
  "Rentabilidad comercial",
  "Tendencias globales",
  "Ventas",
  "Visión estratégica",
] as const;

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  country: string;
  organization: string;
  jobTitle: string;
  topicsOfInterest: string[];
  email?: string;
}

/**
 * Confirma en Firestore que el email del usuario ha sido verificado.
 * Verifica contra Firebase Auth (fuente de verdad) antes de escribir.
 * Llamada desde /verificar-email después de que Firebase completa la verificación.
 */
export async function markEmailVerified(): Promise<{ success: boolean; error?: string }> {
  const cookie = await getSessionCookie();
  if (!cookie) return { success: false, error: "Sesión no válida. Inicia sesión de nuevo." };

  const session = await verifySession(cookie);
  if (!session) return { success: false, error: "Sesión no válida. Inicia sesión de nuevo." };

  // Confirmar con Admin SDK — no confiar en el estado del cliente
  const authUser = await adminAuth.getUser(session.uid);
  if (!authUser.emailVerified) {
    return { success: false, error: "El email aún no ha sido verificado." };
  }

  try {
    await adminDb.doc(`users/${session.uid}`).set(
      { emailVerified: true },
      { merge: true }
    );
    return { success: true };
  } catch (err) {
    console.error("[markEmailVerified] Error:", err);
    return { success: false, error: "No se pudo actualizar el perfil." };
  }
}

export async function updateUserProfile(
  data: ProfileUpdateData
): Promise<{ success: boolean; error?: string }> {
  const cookie = await getSessionCookie();
  if (!cookie) return { success: false, error: "Sesión no válida. Inicia sesión de nuevo." };

  const session = await verifySession(cookie);
  if (!session) return { success: false, error: "Sesión no válida. Inicia sesión de nuevo." };

  // Validar campos requeridos
  const requiredFields: Array<keyof ProfileUpdateData> = [
    "firstName", "lastName", "country", "organization", "jobTitle",
  ];
  for (const field of requiredFields) {
    const value = data[field];
    if (typeof value === "string" && !value.trim()) {
      return { success: false, error: "Todos los campos son obligatorios." };
    }
  }

  if (!data.topicsOfInterest || data.topicsOfInterest.length === 0) {
    return { success: false, error: "Selecciona al menos un tema de interés." };
  }

  // Filtrar topics válidos (defensa contra valores inyectados desde el cliente)
  const sanitizedTopics = data.topicsOfInterest.filter((t) =>
    (VALID_TOPICS as readonly string[]).includes(t)
  );
  if (sanitizedTopics.length === 0) {
    return { success: false, error: "Selecciona al menos un tema de interés válido." };
  }

  try {
    await adminDb.doc(`users/${session.uid}`).set(
      {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        country: data.country.trim(),
        organization: data.organization.trim(),
        jobTitle: data.jobTitle.trim(),
        topicsOfInterest: sanitizedTopics,
        ...(data.email ? { email: data.email.trim() } : {}),
      },
      { merge: true }
    );

    return { success: true };
  } catch (err) {
    console.error("[updateUserProfile] Error:", err);
    return { success: false, error: "No se pudo guardar el perfil. Intenta de nuevo." };
  }
}
