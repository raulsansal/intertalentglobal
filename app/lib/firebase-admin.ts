import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Guard contra múltiples inicializaciones en hot reload — usa nombre "admin"
// para diferenciarlo de la app cliente inicializada en firebase.ts
const adminApp =
  getApps().find((app) => app.name === "admin") ??
  initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // La private key en .env.local tiene \n como texto — se convierten a saltos reales
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    },
    "admin"
  );

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
