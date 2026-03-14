"use client";

import { useActionState } from "react";
import { submitQuestion } from "@/app/actions/questions";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialState: ActionState = { status: "idle", message: "" };

async function formAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const text = formData.get("question") as string;
  const result = await submitQuestion(text);

  if (result.success) {
    return { status: "success", message: "¡Gracias por tu pregunta! La revisaremos pronto." };
  }
  return { status: "error", message: result.error ?? "Error inesperado. Intenta de nuevo." };
}

export default function PreguntaleExperta() {
  const [state, action, isPending] = useActionState(formAction, initialState);

  return (
    <section className="bg-[#F3F4F6] py-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-3">
          Pregúntale a la Experta
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          ¿Tienes una pregunta sobre RH? Envíala y podría ser respondida en nuestro blog
        </p>

        {state.status === "success" ? (
          <p className="text-[#23354F] font-medium">{state.message}</p>
        ) : (
          <form action={action} className="flex flex-col gap-4">
            <textarea
              name="question"
              placeholder="¿Cuál es tu pregunta sobre recursos humanos?"
              required
              rows={4}
              disabled={isPending}
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073] resize-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#23354F] hover:bg-[#1a2840] text-white font-semibold text-sm px-8 py-3 rounded transition-colors mx-auto disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Enviar Pregunta"}
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
