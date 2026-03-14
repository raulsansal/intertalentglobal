"use server";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function submitQuestion(
  text: string
): Promise<{ success: boolean; error?: string }> {
  const trimmed = text.trim();

  if (!trimmed) return { success: false, error: "La pregunta es requerida." };
  if (trimmed.length < 10) return { success: false, error: "La pregunta es demasiado corta." };
  if (trimmed.length > 1000) return { success: false, error: "Máximo 1000 caracteres." };

  try {
    await addDoc(collection(db, "questions"), {
      text: trimmed,
      status: "pending",
      submittedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("[questions] Error:", error);
    return { success: false, error: "Error al enviar la pregunta. Intenta de nuevo." };
  }
}
