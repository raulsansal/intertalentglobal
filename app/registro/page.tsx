import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import RegisterForm from "@/app/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | Intertalent Global",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  // Si ya hay sesión activa, redirigir según rol
  const cookie = await getSessionCookie();
  if (cookie) {
    const session = await verifySession(cookie);
    if (session) redirect(session.admin ? "/admin" : "/perfil");
  }

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white-soft flex items-center justify-center px-6 py-12"
    >
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-primary mb-2">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mb-6">
          Regístrate para agendar consultas y acceder a contenido exclusivo.
        </p>
        <RegisterForm />
      </div>
    </main>
  );
}
