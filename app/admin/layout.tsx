import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Admin | Intertalent Global",
  robots: { index: false, follow: false },
};

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/preguntas", label: "Preguntas" },
  { href: "/admin/suscriptores", label: "Suscriptores" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segunda línea de defensa: verifica la sesión con checkRevoked: true.
  // El proxy Edge solo comprueba existencia de cookie; este componente
  // verifica que no haya sido revocada (logout en otro dispositivo).
  const cookie = await getSessionCookie();
  if (!cookie) redirect("/login");

  const session = await verifySession(cookie);
  if (!session || !session.admin) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Barra de navegación del panel */}
      <header className="bg-[#23354F] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo — mismo texto que el Navbar público, adaptado al fondo navy */}
          <Link
            href="/"
            className="text-xl font-bold text-white hover:text-[#EEC073] transition-colors"
            aria-label="Ir al sitio principal — Intertalent Global"
          >
            Logo
          </Link>

          {/* Navegación principal */}
          <nav aria-label="Panel de administración" className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-[#EEC073] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-white border border-white/30 px-4 py-1.5 rounded hover:bg-white/10 transition-colors"
            >
              Volver al sitio
            </Link>
            {/* Botón de cierre de sesión — funciona sin JS del cliente */}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="text-sm font-medium text-gray-300 hover:text-[#EEC073] transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
