import { adminAuth, adminDb } from "@/app/lib/firebase-admin";
import Link from "next/link";

export default async function AdminPage() {
  // Leer conteos reales en paralelo via Admin SDK
  const [pendingSnap, subscribersSnap, usersResult] = await Promise.all([
    adminDb
      .collection("questions")
      .where("status", "==", "pending")
      .count()
      .get(),
    adminDb.collection("subscribers").count().get(),
    adminAuth.listUsers(1000),
  ]);

  const pendingCount = pendingSnap.data().count;
  const subscriberCount = subscribersSnap.data().count;
  const userCount = usersResult.users.length;

  const metrics = [
    {
      label: "Preguntas pendientes",
      value: pendingCount,
      href: "/admin/preguntas?status=pending",
      cta: "Ver preguntas →",
    },
    {
      label: "Suscriptores totales",
      value: subscriberCount,
      href: "/admin/suscriptores",
      cta: "Ver suscriptores →",
    },
    {
      label: "Usuarios registrados",
      value: userCount,
      href: "/admin/usuarios",
      cta: "Ver usuarios →",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.href}
            className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center text-center"
          >
            <span
              className="text-5xl font-bold text-gold mb-2"
              aria-label={`${metric.value} ${metric.label.toLowerCase()}`}
            >
              {metric.value}
            </span>
            <p className="text-sm text-gray-500 mb-6">{metric.label}</p>
            <Link
              href={metric.href}
              className="text-sm font-semibold text-primary underline hover:text-gold transition-colors"
            >
              {metric.cta}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
