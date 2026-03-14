"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialState: ActionState = { status: "idle", message: "" };

async function formAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const result = await subscribeToNewsletter(email);

  if (result.success) {
    return { status: "success", message: "¡Gracias por suscribirte! Pronto recibirás noticias." };
  }
  return { status: "error", message: result.error ?? "Error inesperado. Intenta de nuevo." };
}

export default function Newsletter() {
  const [state, action, isPending] = useActionState(formAction, initialState);

  return (
    <section className="bg-white py-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-3">
          Mantente al día con las Tendencias de RH Global
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Recibe insights exclusivos, herramientas y estrategias directamente en tu bandeja de entrada.
        </p>

        {state.status === "success" ? (
          <p className="text-[#23354F] font-medium">{state.message}</p>
        ) : (
          <form action={action} className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              name="email"
              placeholder="Tu correo electrónico"
              required
              disabled={isPending}
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-2 rounded transition-colors disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Suscribirme"}
            </button>
          </form>
        )}

        {state.status === "error" && (
          <p className="mt-3 text-sm text-red-500">{state.message}</p>
        )}
      </div>
    </section>
  );
}
