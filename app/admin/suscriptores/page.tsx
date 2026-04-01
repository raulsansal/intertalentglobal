import { adminDb } from "@/app/lib/firebase-admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suscriptores | Admin Intertalent",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 25;

interface Subscriber {
  id: string;
  email: string;
  createdAt: FirebaseFirestore.Timestamp | null;
}

export default async function SuscriptoresPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // Obtener total y página actual en paralelo
  const [countSnap, snapshot] = await Promise.all([
    adminDb.collection("subscribers").count().get(),
    adminDb
      .collection("subscribers")
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(PAGE_SIZE)
      .get(),
  ]);

  const total = countSnap.data().count;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const subscribers: Subscriber[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    email: doc.data().email as string,
    createdAt: doc.data().createdAt ?? null,
  }));

  function formatDate(ts: FirebaseFirestore.Timestamp | null): string {
    if (!ts) return "—";
    return ts.toDate().toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold text-[#23354F]">Suscriptores</h1>
        <p className="text-sm text-gray-500">
          {total} {total === 1 ? "suscriptor" : "suscriptores"} en total
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">Aún no hay suscriptores registrados.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Lista de suscriptores — página {page} de {totalPages}
              </caption>
              <thead className="bg-[#F3F4F6] border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Correo electrónico
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-40"
                  >
                    Fecha de suscripción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-700">{sub.email}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación — funcionan sin JS del cliente */}
          {totalPages > 1 && (
            <nav
              aria-label="Paginación de suscriptores"
              className="flex items-center justify-center gap-2"
            >
              <a
                href={isFirstPage ? undefined : `/admin/suscriptores?page=${page - 1}`}
                aria-disabled={isFirstPage}
                aria-label="Página anterior"
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  isFirstPage
                    ? "border-gray-100 text-gray-300 pointer-events-none"
                    : "border-gray-200 text-[#23354F] hover:border-[#23354F]"
                }`}
              >
                ← Anterior
              </a>

              <span className="text-sm text-gray-500 px-2">
                Página {page} de {totalPages}
              </span>

              <a
                href={isLastPage ? undefined : `/admin/suscriptores?page=${page + 1}`}
                aria-disabled={isLastPage}
                aria-label="Página siguiente"
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors ${
                  isLastPage
                    ? "border-gray-100 text-gray-300 pointer-events-none"
                    : "border-gray-200 text-[#23354F] hover:border-[#23354F]"
                }`}
              >
                Siguiente →
              </a>
            </nav>
          )}
        </>
      )}
    </>
  );
}
