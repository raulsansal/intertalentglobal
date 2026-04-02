import { adminDb } from "@/app/lib/firebase-admin";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas | Admin Intertalent",
  robots: { index: false, follow: false },
};

type QuestionStatus = "pending" | "answered" | "published";

interface Question {
  id: string;
  text: string;
  status: QuestionStatus;
  submittedAt: FirebaseFirestore.Timestamp | null;
}

const STATUS_LABELS: Record<QuestionStatus, string> = {
  pending: "Pendiente",
  answered: "Respondida",
  published: "Publicada",
};

const STATUS_BADGE_CLASSES: Record<QuestionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  answered: "bg-blue-100 text-blue-800",
  published: "bg-green-100 text-green-800",
};

// Server Actions — actualizan el status y revalidan la ruta sin reload manual
async function markAsAnswered(id: string) {
  "use server";
  await adminDb.collection("questions").doc(id).update({
    status: "answered",
    answeredAt: new Date(),
  });
  revalidatePath("/admin/preguntas");
}

async function markAsPublished(id: string) {
  "use server";
  await adminDb.collection("questions").doc(id).update({
    status: "published",
    answeredAt: new Date(),
  });
  revalidatePath("/admin/preguntas");
}

const FILTERS: { label: string; value: string }[] = [
  { label: "Todas", value: "" },
  { label: "Pendientes", value: "pending" },
  { label: "Respondidas", value: "answered" },
  { label: "Publicadas", value: "published" },
];

export default async function PreguntasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeFilter = (status ?? "") as QuestionStatus | "";

  // Traer todas las preguntas ordenadas; filtrar en memoria para evitar
  // índice compuesto (status + submittedAt) en Firestore.
  const snapshot = await adminDb
    .collection("questions")
    .orderBy("submittedAt", "desc")
    .get();

  const allQuestions: Question[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    text: doc.data().text as string,
    status: (doc.data().status ?? "pending") as QuestionStatus,
    submittedAt: doc.data().submittedAt ?? null,
  }));

  const questions = activeFilter
    ? allQuestions.filter((q) => q.status === activeFilter)
    : allQuestions;

  function formatDate(ts: FirebaseFirestore.Timestamp | null): string {
    if (!ts) return "—";
    return ts.toDate().toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-primary">Preguntas</h1>

        {/* Botones de filtro */}
        <nav aria-label="Filtrar preguntas" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value;
            const href =
              f.value === "" ? "/admin/preguntas" : `/admin/preguntas?status=${f.value}`;
            return (
              <a
                key={f.value}
                href={href}                
                className={`text-xs font-semibold px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white text-primary border border-gray-200 hover:border-primary"
                }`}
              >
                {f.label}
              </a>
            );
          })}
        </nav>
      </div>

      {questions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">
            No hay preguntas{activeFilter ? ` con estado "${STATUS_LABELS[activeFilter as QuestionStatus]}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Listado de preguntas{activeFilter ? ` — filtro: ${STATUS_LABELS[activeFilter as QuestionStatus]}` : ""}
            </caption>
            <thead className="bg-white-soft border-b border-gray-200">
              <tr>
                <th scope="col" className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Pregunta
                </th>
                <th scope="col" className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">
                  Estado
                </th>
                <th scope="col" className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32">
                  Fecha
                </th>
                <th scope="col" className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-44">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 leading-relaxed max-w-xs">
                    {q.text}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_BADGE_CLASSES[q.status]}`}
                    >
                      {STATUS_LABELS[q.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {formatDate(q.submittedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {/* pending → answered o published */}
                      {q.status === "pending" && (
                        <>
                          <form action={markAsAnswered.bind(null, q.id)}>
                            <button
                              type="submit"
                              className="text-xs font-semibold px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                            >
                              Respondida
                            </button>
                          </form>
                          <form action={markAsPublished.bind(null, q.id)}>
                            <button
                              type="submit"
                              className="text-xs font-semibold px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                            >
                              Publicar
                            </button>
                          </form>
                        </>
                      )}
                      {/* answered → published */}
                      {q.status === "answered" && (
                        <form action={markAsPublished.bind(null, q.id)}>
                          <button
                            type="submit"
                            className="text-xs font-semibold px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                          >
                            Publicar
                          </button>
                        </form>
                      )}
                      {/* published → sin acciones */}
                      {q.status === "published" && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
