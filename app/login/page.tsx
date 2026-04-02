import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import LoginForm from "@/app/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso | Intertalent Global",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Si ya hay sesión válida, redirigir directamente al panel
  const cookie = await getSessionCookie();
  if (cookie) {
    const session = await verifySession(cookie);
    if (session) redirect(session.admin ? "/admin" : "/");
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white-soft flex items-center justify-center px-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-primary mb-6">
          Iniciar Sesión
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
