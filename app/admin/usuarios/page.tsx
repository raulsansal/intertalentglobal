import { adminAuth, adminDb } from "@/app/lib/firebase-admin";
import {
  ALL_ROLES,
  ROLE_LABELS,
  getRoleFromClaims,
  type Role,
} from "@/app/lib/auth/roles";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios | Admin Intertalent",
  robots: { index: false, follow: false },
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface UserRow {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  lastSignIn: string | null;
}

// ─── Helper: divide un array en lotes de N ───────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─── Server Action ────────────────────────────────────────────────────────────

async function updateUserRole(uid: string, newRole: Role) {
  "use server";

  // Validar que el rol recibido es uno de los definidos (previene inyección)
  if (!(ALL_ROLES as string[]).includes(newRole)) return;

  // 1. Actualizar documento en Firestore (fuente de verdad para la UI)
  await adminDb
    .collection("users")
    .doc(uid)
    .set({ role: newRole }, { merge: true });

  // 2. Actualizar custom claims en Firebase Auth
  //    - admin: { admin: true, role: "admin" }
  //    - staff: { role: "moderador" | "editor_*" }
  //    - usuario: {} — limpiar claims (ningún privilegio extra)
  const claims =
    newRole === "admin"
      ? { admin: true, role: "admin" }
      : newRole === "usuario"
        ? {}
        : { role: newRole };

  await adminAuth.setCustomUserClaims(uid, claims);

  revalidatePath("/admin/usuarios");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UsuariosPage() {
  // Obtener todos los usuarios de Firebase Auth (hasta 1000)
  const listResult = await adminAuth.listUsers(1000);
  const authUsers = listResult.users;

  // Obtener documentos de Firestore en lotes de 500 (límite de getAll)
  const docRefs = authUsers.map((u) =>
    adminDb.collection("users").doc(u.uid)
  );

  const BATCH = 500;
  const batches = chunk(docRefs, BATCH);
  const batchResults = await Promise.all(
    batches.map((b) => adminDb.getAll(...b))
  );
  const firestoreDocs = batchResults.flat();

  // Construir mapa uid → role desde Firestore
  const roleByUid = new Map<string, Role>();
  for (const snap of firestoreDocs) {
    if (snap.exists) {
      const data = snap.data() as Record<string, unknown>;
      roleByUid.set(snap.id, getRoleFromClaims(data));
    }
  }

  // Combinar datos Auth + Firestore
  const users: UserRow[] = authUsers.map((u) => {
    // Fallback: si no hay doc en Firestore, leer claims del token de Auth
    const roleFromFirestore = roleByUid.get(u.uid);
    const roleFromClaims = getRoleFromClaims(
      (u.customClaims ?? {}) as Record<string, unknown>
    );
    return {
      uid: u.uid,
      email: u.email ?? "—",
      displayName: u.displayName ?? "—",
      role: roleFromFirestore ?? roleFromClaims,
      lastSignIn: u.metadata.lastSignInTime ?? null,
    };
  });

  // Ordenar: admin primero, luego por email
  users.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (b.role === "admin" && a.role !== "admin") return 1;
    return a.email.localeCompare(b.email);
  });

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl font-bold text-[#23354F]">Usuarios</h1>
        <p className="text-sm text-gray-500">
          {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
        </p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">No hay usuarios registrados.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Lista de usuarios y sus roles asignados
              </caption>
              <thead className="bg-[#F3F4F6] border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Usuario
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-36"
                  >
                    Rol actual
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-32"
                  >
                    Último acceso
                  </th>
                  <th
                    scope="col"
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-72"
                  >
                    Cambiar rol
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                    {/* Nombre + email */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {user.displayName !== "—" ? user.displayName : user.email}
                      </p>
                      {user.displayName !== "—" && (
                        <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                      )}
                    </td>

                    {/* Badge de rol actual */}
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Último acceso */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(user.lastSignIn)}
                    </td>

                    {/* Select de cambio de rol */}
                    <td className="px-6 py-4">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const newRole = formData.get("role") as Role;
                          await updateUserRole(user.uid, newRole);
                        }}
                        className="flex items-center gap-2"
                      >
                        <label htmlFor={`role-${user.uid}`} className="sr-only">
                          Cambiar rol de {user.email}
                        </label>
                        <select
                          id={`role-${user.uid}`}
                          name="role"
                          defaultValue={user.role}
                          className="text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#EEC073] bg-white text-gray-700"
                        >
                          {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ROLE_LABELS[r]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="text-xs font-semibold px-3 py-1.5 rounded bg-[#23354F] text-white hover:bg-[#1a2840] transition-colors"
                        >
                          Guardar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nota sobre propagación de cambios */}
          <p className="text-xs text-gray-400 text-center">
            Los cambios de rol toman efecto en la próxima sesión del usuario afectado.
          </p>
        </>
      )}
    </>
  );
}

// ─── Badge de rol ─────────────────────────────────────────────────────────────

const ROLE_BADGE_CLASSES: Record<Role, string> = {
  admin: "bg-[#23354F] text-white",
  moderador: "bg-blue-100 text-blue-800",
  editor_blog: "bg-purple-100 text-purple-800",
  editor_podcast: "bg-orange-100 text-orange-800",
  editor_cursos: "bg-teal-100 text-teal-800",
  usuario: "bg-gray-100 text-gray-600",
};

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${ROLE_BADGE_CLASSES[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
