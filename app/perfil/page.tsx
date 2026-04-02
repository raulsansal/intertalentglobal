import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import EmailVerificationBanner from "@/app/components/auth/EmailVerificationBanner";
import ProfileForm from "@/app/perfil/ProfileForm";
import type { ProfileInitialData } from "@/app/perfil/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil | Intertalent Global",
  robots: { index: false, follow: false },
};

export default async function PerfilPage() {
  const cookie = await getSessionCookie();
  if (!cookie) redirect("/login");

  const session = await verifySession(cookie);
  if (!session) redirect("/login");

  // email_verified viene del DecodedIdToken de Firebase — true para usuarios Google,
  // false para usuarios email/contraseña que aún no han verificado su correo.
  // El banner desaparece tras cerrar sesión e iniciar de nuevo después de verificar.
  const isEmailVerified = session.email_verified === true;

  // Leer datos actuales del perfil desde Firestore
  const userDoc = await adminDb.doc(`users/${session.uid}`).get();
  const userData = userDoc.data() ?? {};

  // Detectar si el usuario se autenticó con Google
  const authUser = await adminAuth.getUser(session.uid);
  const isGoogleUser = authUser.providerData[0]?.providerId === "google.com";

  const profileData: ProfileInitialData = {
    uid: session.uid,
    email: (userData.email as string) || (session.email ?? ""),
    firstName: (userData.firstName as string) || "",
    lastName: (userData.lastName as string) || "",
    country: (userData.country as string) || "",
    organization: (userData.organization as string) || "",
    jobTitle: (userData.jobTitle as string) || "",
    topicsOfInterest: (userData.topicsOfInterest as string[]) || [],
    avatarUrl: (userData.avatarUrl as string | null) || null,
    isGoogleUser,
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-white-soft py-12 px-6"
    >
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-2xl mx-auto">
        {!isEmailVerified && (
          <div className="mb-6">
            <EmailVerificationBanner />
          </div>
        )}

        <h1 className="text-xl font-bold text-primary mb-6">Mi perfil</h1>

        <ProfileForm initialData={profileData} />
      </div>
    </main>
  );
}
