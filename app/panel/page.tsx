import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import { getRoleFromClaims, ROLE_LABELS } from "@/app/lib/auth/roles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel | Intertalent Global",
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const cookie = await getSessionCookie();
  if (!cookie) redirect("/login");

  const session = await verifySession(cookie);
  if (!session) redirect("/login");

  const role = getRoleFromClaims(session as Record<string, unknown>);

  // Solo usuarios con rol de staff acceden a este panel
  if (role === "usuario") redirect("/");

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Barra de navegación del panel */}
      <nav aria-label="Panel de staff" className="bg-[#23354F] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="text-sm font-medium text-gray-300">
            {ROLE_LABELS[role]}
          </span>
          <Link
            href="/"
            className="text-sm font-medium text-white border border-white/30 px-4 py-1.5 rounded hover:bg-white/10 transition-colors"
          >
            Volver al sitio
          </Link>
        </div>
      </nav>

      <main
        id="main-content"
        className="flex items-center justify-center px-6 py-16"
      >
      <div className="bg-white rounded-lg shadow-sm p-10 w-full max-w-lg text-center">
        <div className="w-16 h-16 bg-[#EEC073]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-[#EEC073]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        <p className="text-xs font-semibold text-[#EEC073] uppercase tracking-widest mb-2">
          {ROLE_LABELS[role]}
        </p>
        <h1 className="text-2xl font-bold text-[#23354F] mb-3">
          Panel de {ROLE_LABELS[role]}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          Esta sección está en construcción. Próximamente encontrarás aquí todas
          las herramientas para gestionar el contenido que te corresponde.
        </p>

        <Link
          href="/"
          className="inline-block bg-[#23354F] hover:bg-[#1a2840] text-white font-semibold text-sm px-6 py-3 rounded transition-colors"
        >
          Volver al sitio
        </Link>
      </div>
      </main>
    </div>
  );
}
