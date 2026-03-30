# Spec 00 — Sistema de Autenticación
## Proyecto: Intertalent Global

---

### Problema

El sitio no tiene mecanismo de autenticación. Hay dos necesidades concretas:

1. **Panel administrativo para Gabriela**: Las colecciones `subscribers` y `questions` acumulan datos sin ninguna interfaz de gestión. Las preguntas tienen `status: "pending"` que implica un flujo de revisión que nunca se construyó.
2. **Seguridad de Firestore**: Las Server Actions escriben en Firestore usando el SDK de cliente sin verificar identidad. Cualquier script puede llamarlas en bucle.

**Usuario objetivo**: exclusivamente Gabriela como administradora. Los visitantes del sitio público no se autentican.
**Fuera de alcance**: autenticación de visitantes, roles múltiples, sistema de comentarios.

---

### Impacto Arquitectónico

#### Archivos modificados

```
app/lib/firebase.ts                                → Añadir export de getAuth()
app/layout.tsx                                     → Añadir skip-to-main (gap pendiente)
next.config.ts                                     → Reforzar CSP header
app/components/sections/Newsletter.tsx             → Añadir <label> visible (gap pendiente)
app/components/sections/PreguntaleExperta.tsx      → Añadir <label> al textarea (gap pendiente)
```

#### Archivos nuevos

```
middleware.ts                           → Edge Runtime, protege /admin/:path*
app/api/auth/session/route.ts           → POST: crea session cookie via Admin SDK
app/api/auth/logout/route.ts            → POST: revoca sesión y borra cookie
app/lib/firebase-admin.ts               → Admin SDK (server-only, sin NEXT_PUBLIC_)
app/lib/auth/session.ts                 → createSession(), verifySession(), revokeSession()
app/login/page.tsx                      → Server Component + redirect si ya hay sesión
app/components/auth/LoginForm.tsx       → "use client" — formulario accesible
app/admin/layout.tsx                    → Verifica sesión server-side (2a línea de defensa)
app/admin/page.tsx                      → Dashboard: conteos de preguntas y suscriptores
app/admin/preguntas/page.tsx            → Gestión de questions (pending/answered/published)
app/admin/suscriptores/page.tsx         → Lista paginada de subscribers
```

#### Modelo de datos

No se necesita colección `users`. Gabriela es el único admin, creado directamente en Firebase Console con custom claim `admin: true`.

```typescript
// Extensión de la colección questions (campos nuevos)
interface Question {
  // ...campos existentes...
  answeredAt?: Timestamp;   // NUEVO
  answerText?: string;      // NUEVO
}
```

#### Colecciones Firestore

Firebase Security Rules — cambio crítico y urgente:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /subscribers/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                  && request.auth.token.admin == true;
    }
    match /questions/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                  && request.auth.token.admin == true;
    }
  }
}
```

#### Decisiones de renderizado

| Componente | Tipo | Justificación |
|---|---|---|
| `app/login/page.tsx` | Server Component (wrapper) | Redirect si ya hay sesión activa |
| `LoginForm.tsx` | Client Component | `signInWithEmailAndPassword` requiere Firebase Auth SDK en cliente |
| `middleware.ts` | Edge Runtime | Intercepta requests antes del render, mínima latencia |
| `app/admin/layout.tsx` | Server Component | Segunda línea de defensa: verifica cookie con Admin SDK |
| `app/admin/*/page.tsx` | Server Components | Leen Firestore via Admin SDK, sin exponer credenciales al cliente |

El sitio público (`/`, `/blog`, `/servicios`, etc.) **no se toca en absoluto**.

---

### Propuesta de Solución

#### Enfoque adoptado: Firebase Session Cookie + Admin SDK

Se usa `adminAuth.createSessionCookie()` — **no** el `idToken` directamente en la cookie. Esta es la diferencia de seguridad clave:

| | idToken como cookie | Session Cookie (elegido) |
|---|---|---|
| Expiración | 1 hora (fija) | 1 hora a 14 días (configurable) |
| Revocación | No revocable individualmente | Revocable con `revokeRefreshTokens()` |
| Verificación | `verifyIdToken()` | `verifySessionCookie(cookie, { checkRevoked: true })` |
| Rotación | El cliente debe renovarlo | El servidor la controla completamente |
| Superficie de ataque | Mayor (token de acceso directo) | Menor (opaco para el cliente) |

##### Flujo completo de autenticación

```
1. LOGIN
   LoginForm (cliente)
     → signInWithEmailAndPassword(auth, email, password)
     → idToken = await user.getIdToken()
     → POST /api/auth/session  { idToken }
         Route Handler (servidor)
           → adminAuth.verifyIdToken(idToken)          ← valida el token primero
           → token.admin === true?  No → 403
           → adminAuth.createSessionCookie(idToken, {
               expiresIn: 7 * 24 * 60 * 60 * 1000     ← 7 días en ms
             })
           → cookies().set("__session", sessionCookie, {
               httpOnly: true,
               secure: true,            ← solo HTTPS
               sameSite: "strict",      ← no se envía en requests cross-site
               maxAge: 60 * 60 * 24 * 7,
               path: "/",
             })
     → redirect "/admin"

2. REQUEST AUTENTICADO
   Request /admin/preguntas
     → middleware.ts (Edge): ¿cookie __session presente?
         No  → NextResponse.redirect("/login")
         Sí  → continúa (verificación ligera de existencia)
     → admin/layout.tsx (Server Component):
         → adminAuth.verifySessionCookie(cookie, { checkRevoked: true })
             Error o revocada → redirect "/login"
             Válida → decoded token con uid + admin claim
         → render layout del panel

3. LOGOUT
   POST /api/auth/logout
     → cookie = cookies().get("__session")
     → decoded = adminAuth.verifySessionCookie(cookie)
     → adminAuth.revokeRefreshTokens(decoded.sub)    ← invalida TODAS las sesiones del usuario
     → cookies().delete("__session")
     → redirect "/login"
```

##### Por qué dos líneas de verificación (middleware + layout)

- **Middleware** (Edge Runtime): verificación ligera — solo comprueba que la cookie existe. No puede usar el Admin SDK porque el Edge Runtime no soporta el SDK completo de Node.js.
- **Admin layout** (Server Component): verificación autoritativa — llama a `verifySessionCookie({ checkRevoked: true })` contra Firebase. Esta es la barrera real. Si el token fue revocado (ej. Gabriela cerró sesión en otro dispositivo), aquí se detecta.

#### Alternativas descartadas

| Alternativa | Por qué se descarta |
|---|---|
| idToken directamente en cookie | No revocable; expiración fija de 1 hora obliga al cliente a renovar |
| NextAuth / Auth.js | Overhead innecesario — Firebase Auth ya está en el stack |
| localStorage para el token | Vulnerable a XSS — el token debe vivir en cookie HttpOnly |
| Verificar token solo en middleware | El Edge Runtime no soporta Admin SDK completo; verificación superficial no es suficiente |
| Firestore SDK de cliente desde admin | Admin SDK es más adecuado y bypasa Security Rules de forma controlada |
| Google Sign-In / OAuth | Más fricción de setup para un solo usuario conocido |

#### Diagrama de componentes

```
SITIO PÚBLICO (sin cambios)
  / → page.tsx (Server)
       └── Newsletter.tsx ("use client")           → actions/newsletter.ts → Firestore
       └── PreguntaleExperta.tsx ("use client")    → actions/questions.ts  → Firestore

AUTENTICACIÓN
  /login → page.tsx (Server)  [redirect si cookie válida]
            └── LoginForm.tsx ("use client")
                 └── signInWithEmailAndPassword()
                 └── getIdToken()
                 └── POST /api/auth/session
                      └── verifyIdToken() + createSessionCookie()
                      └── Set-Cookie: __session (HttpOnly, Secure, SameSite=Strict)

  /api/auth/logout (POST)
    └── verifySessionCookie()
    └── revokeRefreshTokens()     ← invalida todas las sesiones del usuario
    └── Delete-Cookie: __session

MIDDLEWARE (Edge Runtime)
  matcher: ["/admin/:path*"]
  Cookie __session presente? → continúa
  Cookie ausente?             → redirect /login

PANEL ADMIN
  /admin/layout.tsx (Server)
    └── verifySessionCookie(cookie, { checkRevoked: true })
    └── token.admin === true?
         No  → redirect /login
         Sí  → render layout con nav + logout button
  /admin/page.tsx (Server)               → adminDb → Firestore (conteos)
  /admin/preguntas/page.tsx (Server)     → adminDb → Firestore (questions)
  /admin/suscriptores/page.tsx (Server)  → adminDb → Firestore (subscribers)
```

---

### Plan de Implementación

#### Fase 0 — Prerequisitos (configuración externa, sin código)

**Objetivo:** Infraestructura de Firebase lista para autenticación admin

Pasos:
1. Crear usuario `gabriela@intertalentglobal.com` en Firebase Authentication console.
2. Asignar custom claim `admin: true` via script Node local (única vez):
   ```js
   // scripts/set-admin-claim.js — ejecutar con: node scripts/set-admin-claim.js
   const admin = require("firebase-admin");
   const serviceAccount = require("./service-account.json");

   admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

   const uid = "UID_DE_GABRIELA"; // copiar de Firebase Console → Authentication

   admin.auth().setCustomUserClaims(uid, { admin: true }).then(() => {
     console.log("Custom claim admin:true asignado correctamente");
     process.exit(0);
   });
   ```
3. Generar Service Account key: Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada.
4. Añadir al `.env.local` (nunca en git):
   ```bash
   FIREBASE_ADMIN_PROJECT_ID=
   FIREBASE_ADMIN_CLIENT_EMAIL=
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```
5. Actualizar Firebase Security Rules en la consola con las reglas documentadas arriba.

**Criterio de completitud:** Al verificar el token del usuario con Admin SDK, el decoded token incluye `{ admin: true }`.

---

#### Fase 1 — Firebase Admin SDK y capa de session management

**Objetivo:** Capa de infraestructura server-only lista y testeable

**Archivos:**

`app/lib/firebase-admin.ts`
```typescript
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const adminApp =
  getApps().find((app) => app.name === "admin") ??
  initializeApp(
    {
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    },
    "admin"
  );

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
```

`app/lib/auth/session.ts`
```typescript
import { adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "__session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días
const SESSION_DURATION_S = SESSION_DURATION_MS / 1000;

/** Crea la session cookie a partir del idToken del cliente. */
export async function createSession(idToken: string): Promise<NextResponse> {
  // 1. Verificar el idToken antes de crear la session cookie
  const decoded = await adminAuth.verifyIdToken(idToken);

  if (!decoded.admin) {
    return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
  }

  // 2. Crear session cookie — opaco para el cliente, revocable desde el servidor
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_DURATION_S,
    path: "/",
  });

  return response;
}

/** Verifica la session cookie y retorna el decoded token o null. */
export async function verifySession(
  cookieValue: string
): Promise<import("firebase-admin/auth").DecodedIdToken | null> {
  try {
    return await adminAuth.verifySessionCookie(cookieValue, {
      checkRevoked: true, // detecta sesiones revocadas por logout
    });
  } catch {
    return null;
  }
}

/** Revoca todas las sesiones del usuario y borra la cookie. */
export async function revokeSession(): Promise<NextResponse> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      // Revocar todos los refresh tokens del usuario → invalida TODAS sus sesiones activas
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Si la cookie ya era inválida, continuar con el logout de todas formas
    }
  }

  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL));
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

/** Lee la session cookie del request actual (para uso en Server Components). */
export function getSessionCookie(): string | undefined {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}
```

**Criterio de completitud:** `createSession()` y `verifySession()` funcionan sin errores con un idToken válido de Gabriela.

---

#### Fase 2 — Route Handlers de sesión y middleware

**Prerequisito:** Fase 1 completada

**Objetivo:** Rutas `/admin/*` protegidas — cualquier acceso sin cookie redirige a `/login`

`app/api/auth/session/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/app/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken requerido" }, { status: 400 });
    }

    return await createSession(idToken);
  } catch (error) {
    console.error("[auth/session] Error:", error);
    return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 });
  }
}
```

`app/api/auth/logout/route.ts`
```typescript
import { revokeSession } from "@/app/lib/auth/session";

export async function POST() {
  return await revokeSession();
}
```

`middleware.ts` (raíz del proyecto, junto a `next.config.ts`)
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("__session");

  // Verificación ligera en Edge Runtime: solo comprueba existencia de la cookie.
  // La verificación autoritativa (checkRevoked) se hace en admin/layout.tsx con Admin SDK.
  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Criterio de completitud:** `curl -I /admin` sin cookie retorna `HTTP 307` con `Location: /login`.

---

#### Fase 3 — Página de Login

**Prerequisito:** Fase 2 completada

**Objetivo:** Gabriela puede autenticarse desde el navegador

`app/login/page.tsx`
```typescript
import { redirect } from "next/navigation";
import { getSessionCookie } from "@/app/lib/auth/session";
import { verifySession } from "@/app/lib/auth/session";
import LoginForm from "@/app/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso | Intertalent Global",
  // noindex: evitar que buscadores indexen la página de login
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const cookie = getSessionCookie();
  if (cookie) {
    const session = await verifySession(cookie);
    if (session) redirect("/admin");
  }

  return (
    <main id="main-content" className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-6">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-[#23354F] mb-6">Acceso al panel</h1>
        <LoginForm />
      </div>
    </main>
  );
}
```

`app/components/auth/LoginForm.tsx`
```typescript
"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // 1. Autenticar con Firebase Auth (cliente)
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // 2. Obtener idToken para enviarlo al servidor
      const idToken = await credential.user.getIdToken();

      // 3. Crear session cookie en el servidor
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al iniciar sesión");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Credenciales incorrectas";
      // Mensaje genérico al usuario — no revelar si es email o password el incorrecto
      setError("Email o contraseña incorrectos. Intenta de nuevo.");
      console.error("[LoginForm]", message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de acceso">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-[#23354F] mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-[#23354F] mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073] disabled:opacity-60"
        />
      </div>

      {error && (
        <p
          id="login-error"
          role="alert"
          className="text-red-600 text-sm mb-4"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60"
      >
        {isPending ? "Verificando..." : "Ingresar"}
      </button>
    </form>
  );
}
```

> **Nota de seguridad:** El mensaje de error es deliberadamente genérico ("Email o contraseña incorrectos") para no revelar si el email existe en el sistema (user enumeration attack).

**Criterio de completitud:** Gabriela puede iniciar sesión y es redirigida a `/admin`.

---

#### Fase 4 — Panel administrativo

**Prerequisito:** Fase 3 completada

**Objetivo:** Gabriela puede ver y gestionar preguntas y suscriptores

`app/admin/layout.tsx`
```typescript
import { redirect } from "next/navigation";
import { getSessionCookie, verifySession } from "@/app/lib/auth/session";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Segunda línea de defensa: verificación autoritativa con checkRevoked
  const cookie = getSessionCookie();
  if (!cookie) redirect("/login");

  const session = await verifySession(cookie);
  if (!session || !session.admin) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <nav className="bg-[#23354F] text-white px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-sm">Panel Intertalent</span>
        <div className="flex items-center gap-6 text-sm">
          <a href="/admin/preguntas" className="hover:text-[#EEC073] transition-colors">
            Preguntas
          </a>
          <a href="/admin/suscriptores" className="hover:text-[#EEC073] transition-colors">
            Suscriptores
          </a>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="border border-white px-3 py-1 rounded text-xs hover:bg-white hover:text-[#23354F] transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </nav>
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  );
}
```

**Archivos restantes de la Fase 4:**
- `app/admin/page.tsx` — dashboard con conteos: preguntas pendientes, total suscriptores. Lee via `adminDb`.
- `app/admin/preguntas/page.tsx` — tabla con filtro por `status`, botones para marcar `answered` / `published`. Actualiza via Server Action que usa `adminDb`.
- `app/admin/suscriptores/page.tsx` — lista paginada con email + `createdAt`.

**Criterio de completitud:** Gabriela puede cambiar el `status` de una pregunta y ver el cambio reflejado inmediatamente (revalidación de la página).

---

#### Fase 5 — Correcciones de accesibilidad (gaps preexistentes)

**Prerequisito:** ninguno — puede ejecutarse en paralelo con Fases 1-2

**Objetivo:** Cerrar los gaps de accesibilidad conocidos documentados en CLAUDE.md

**Archivos:**
- `app/layout.tsx` — añadir skip-to-main como primer elemento del `<body>`:
  ```tsx
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
               bg-[#EEC073] text-[#23354F] px-4 py-2 rounded font-semibold z-50"
  >
    Saltar al contenido principal
  </a>
  ```
- `app/components/sections/Newsletter.tsx` — añadir `<label htmlFor="newsletter-email" className="sr-only">` y `id="newsletter-email"` al input.
- `app/components/sections/PreguntaleExperta.tsx` — añadir `<label htmlFor="question-text">` visible al textarea.

**Criterio de completitud:** Sin advertencias de accesibilidad en axe DevTools para los formularios públicos.

---

### Estimación de complejidad

| Fase | Complejidad | Archivos nuevos | Archivos modificados |
|------|-------------|-----------------|----------------------|
| Fase 0 | Baja (config) | — | — |
| Fase 1 | Media | 2 | 1 |
| Fase 2 | Media | 3 | 0 |
| Fase 3 | Baja | 2 | 0 |
| Fase 4 | Media | 4 | 0 |
| Fase 5 | Baja | 0 | 3 |
| **Total** | **Media** | **11** | **4** |

---

### Decisiones Confirmadas

- [x] **Duración de sesión**: **14 días** (`SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000`)
- [x] **URL de login**: **`/login`** público (el panel no está enlazado desde el sitio público)
- [x] **Recuperación de contraseña**: **Incluida en v1** — enlace "¿Olvidaste tu contraseña?" en el LoginForm, llama a `sendPasswordResetEmail()`
- [x] **Rate limiting en Server Actions públicas**: **Honeypot incluido en v1** — campo oculto `name="website"` en Newsletter y PreguntaleExperta; si tiene valor, la Server Action retorna `{ success: true }` silenciosamente sin escribir a Firestore

### Decisiones Pospuestas para v2

- [ ] **`RecursoDownloadForm`**: tiene un `// TODO: connect to email service`. Queda fuera de este alcance — historia separada.
- [ ] **Audit log**: Log de accesos al panel admin en Firestore. Recomendado para v2.

---

> **Plan de implementación detallado:** ver `spec/01_plan_implementacion_autenticacion.md`
