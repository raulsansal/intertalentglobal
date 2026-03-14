"use server";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) return { success: false, error: "El email es requerido." };
  if (!isValidEmail(trimmed)) return { success: false, error: "Email inválido." };

  try {
    await addDoc(collection(db, "subscribers"), {
      email: trimmed,
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("[newsletter] Error:", error);
    return { success: false, error: "Error al suscribirse. Intenta de nuevo." };
  }
}
