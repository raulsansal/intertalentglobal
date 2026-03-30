import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Admin | Intertalent Global",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookie = await getSessionCookie();
  if (!cookie) redirect("/login");

  const session = await verifySession(cookie);
  if (!session || !session.admin) redirect("/login");

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-[#23354F] mb-2">Panel de administración</h1>
        <p className="text-sm text-gray-500">
          El panel completo se implementará en la siguiente fase.
        </p>
      </div>
    </main>
  );
}
