# Plan de Implementación: Sistema de Autenticación
## Intertalent Global — Spec de referencia: `spec/00_sistema_autenticacion.md`

Generado con los agentes **backend 🟡** y **frontend 🔵** del proyecto.

---

## Decisiones Confirmadas

| Decisión | Valor |
|---|---|
| Duración de sesión | **14 días** (`SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000`) |
| URL de login | **`/login`** |
| Recuperación de contraseña | **Incluida en v1** — `sendPasswordResetEmail()` |
| Honeypot en formularios públicos | **Incluido en v1** — campo `name="website"` oculto |

---

## Mapa de Dependencias

```
Fase 0 (Firebase config + npm install)
    │
    ▼
Fase 1 (Admin SDK + session.ts)              ◄── Fase 5 corre en PARALELO desde el día 1
    │
    ▼
Fase 2 (Route Handlers + middleware.ts)
    │
    ▼
Fase 3 (Login page + LoginForm + Recuperación)
    │
    ▼
Fase 4 (Panel admin: layout + preguntas + suscriptores)
```

**Fase 5 (Accesibilidad pública):** Sin dependencias — corre en paralelo con Fases 1–3.

---

## Fase 0 — Prerequisitos Externos `[EXTERNO / CONFIG]`

**Objetivo:** Infraestructura Firebase lista. Sin código.

**Tareas:**
1. Crear usuario `gabriela@intertalentglobal.com` en Firebase Console → Authentication → Users
2. Copiar el UID del usuario creado
3. Generar Service Account key: Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada
4. Ejecutar script Node local (una sola vez, fuera del proyecto) para asignar `setCustomUserClaims(uid, { admin: true })`
5. Verificar que el decoded token de Gabriela incluye `{ admin: true }` antes de continuar
6. Eliminar el archivo JSON del Service Account del filesystem local
7. Añadir al `.env.local` las cuatro variables: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, `NEXT_PUBLIC_SITE_URL`
8. Actualizar Firebase Security Rules en la consola con las reglas del spec (subscribers y questions: `create: if true`, `read/update/delete: if request.auth.token.admin == true`)
9. Verificar que las reglas rechazan lecturas anónimas en el simulador de Firestore
10. Ejecutar `npm install firebase-admin` en el directorio del proyecto

**Criterio de completitud:** El decoded token de Gabriela contiene `{ admin: true }`. Las Security Rules rechazan lecturas anónimas. `firebase-admin` aparece en `dependencies` del `package.json`.

---

## Fase 1 — Firebase Admin SDK y Session Management `[BACKEND]`

**Prerequisito:** Fase 0 completada.
**Puede ejecutarse en paralelo con:** Fase 5.

**Objetivo:** Capa server-only de infraestructura lista y con tipos correctos. Ninguna de estas funciones toca el cliente.

**Tareas:**

**`app/lib/firebase-admin.ts`** _(nuevo)_
- Inicializar app Firebase Admin con nombre `"admin"` (diferenciado del SDK cliente)
- Guard de hot-reload: `getApps().find(app => app.name === "admin") ??` antes de `initializeApp`
- Leer credenciales desde `process.env.FIREBASE_ADMIN_*` sin prefijo `NEXT_PUBLIC_`
- Aplicar `replace(/\\n/g, "\n")` a la private key para decodificar saltos de línea del `.env`
- Exportar `adminAuth` (instancia de `getAuth`) y `adminDb` (instancia de `getFirestore`)

**`app/lib/auth/session.ts`** _(nuevo)_
- Constantes: `SESSION_COOKIE_NAME = "__session"`, `SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000`
- `createSession(idToken)`: verifyIdToken → si `!decoded.admin` retornar 403 → createSessionCookie con expiresIn 14 días → Set-Cookie HttpOnly, Secure (solo prod), SameSite=Strict, maxAge en segundos
- `verifySession(cookieValue)`: verifySessionCookie con `{ checkRevoked: true }` → retornar DecodedIdToken o null (nunca propagar excepción)
- `revokeSession()`: leer cookie → decodificar → revokeRefreshTokens(decoded.sub) → delete cookie → redirect /login
- `getSessionCookie()`: función síncrona para uso en Server Components — lee `__session` del store de Next.js

**`app/lib/firebase.ts`** _(modificado — cambio mínimo)_
- Añadir `import { getAuth } from "firebase/auth"`
- Añadir `export const auth = getAuth(app)` junto al export existente de `db`
- No modificar ninguna otra línea del archivo

**Criterio de completitud:** `verifySession()` con token válido retorna `{ uid, admin: true }`. Con token inválido o revocado retorna `null`. `npx tsc --noEmit` sin errores.

---

## Fase 2 — Route Handlers y Middleware Edge `[BACKEND]`

**Prerequisito:** Fase 1 completada.

**Objetivo:** Rutas `/admin/*` protegidas. Todo request sin cookie redirige a `/login`.

**Tareas:**

**`app/api/auth/session/route.ts`** _(nuevo)_
- Exportar función `POST(request: NextRequest)`
- Leer `idToken` del body JSON, validar que es string no vacío → retornar 400 si no
- Llamar `createSession(idToken)` y retornar su respuesta
- try/catch: errores retornan 500 con mensaje genérico (nunca exponer detalles internos)

**`app/api/auth/logout/route.ts`** _(nuevo)_
- Exportar función `POST()` sin parámetros
- Llamar `revokeSession()` y retornar su respuesta (ya incluye redirect + borrado de cookie)

**`middleware.ts`** _(nuevo — en la raíz del proyecto, junto a `next.config.ts`)_
- Función `middleware(request: NextRequest)`: leer `request.cookies.get("__session")`
- Si la cookie no existe: redirect a `/login?from=<pathname>`
- Si existe: `NextResponse.next()` — verificación solo de existencia (el Edge Runtime no soporta Admin SDK)
- Añadir comentario explicando por qué la verificación autoritativa ocurre en `admin/layout.tsx`
- Exportar `config.matcher = ["/admin/:path*"]` — el sitio público no se toca

**Criterio de completitud:** `GET /admin` sin cookie → `HTTP 307 Location: /login`. `POST /api/auth/session` con idToken inválido → `HTTP 403`. `POST /api/auth/logout` → cookie `__session` eliminada + redirect `/login`.

---

## Fase 3 — Página de Login y Recuperación de Contraseña `[BACKEND + FRONTEND]`

**Prerequisito:** Fase 2 completada.

**Objetivo:** Gabriela puede autenticarse y recuperar su contraseña desde el navegador.

**Tareas:**

**`app/login/page.tsx`** _(nuevo — Server Component)_
- Leer cookie y llamar `verifySession()`: si sesión válida → `redirect("/admin")` inmediatamente
- Exportar `metadata` con `robots: { index: false, follow: false }` y título "Acceso | Intertalent Global"
- Layout centrado: fondo `bg-[#F3F4F6]`, `min-h-screen`, `flex items-center justify-center`
- Card blanco: `bg-white rounded-lg shadow-sm p-8 w-full max-w-sm`
- `<main id="main-content">` con `<h1>` "Acceso al panel"
- Renderizar `<LoginForm />` como componente hijo

**`app/components/auth/LoginForm.tsx`** _(nuevo — Client Component)_
- `"use client"` obligatorio — usa `signInWithEmailAndPassword` del SDK cliente
- Estado: `isPending` (boolean), `error` (string | null)
- Campo email: `<label htmlFor="email">` visible, input con `autoComplete="email"`, `disabled={isPending}`, `aria-describedby="login-error"` cuando hay error
- Campo password: `<label htmlFor="password">` visible, input con `autoComplete="current-password"`, `disabled={isPending}`
- Campo honeypot: `<input name="website" tabIndex={-1} className="sr-only" />` — sin `<label>`, excluido del flujo de teclado
- Enlace "¿Olvidaste tu contraseña?": alineado a la derecha, debajo del campo password, llama a `sendPasswordResetEmail(auth, email)` al hacer clic
- En éxito de recuperación: mensaje genérico con `role="status"` — nunca confirmar si el email existe
- Error de login: `role="alert"` con texto fijo "Email o contraseña incorrectos. Intenta de nuevo." (anti-enumeration)
- Botón: texto dinámico "Ingresar" / "Verificando...", `disabled={isPending}`, `disabled:opacity-60`
- Flujo submit: verificar honeypot vacío → `signInWithEmailAndPassword` → `getIdToken()` → `POST /api/auth/session` → si ok: `router.push("/admin")` + `router.refresh()`

**Criterio de completitud:** Login con credenciales válidas → redirect a `/admin`. Login con credenciales incorrectas → mensaje genérico sin revelar información. Clic en recuperación → email de Firebase enviado. La UI de recuperación no confirma si el email existe.

---

## Fase 4 — Panel Administrativo `[BACKEND + FRONTEND]`

**Prerequisito:** Fase 3 completada.

**Objetivo:** Gabriela puede gestionar preguntas y ver suscriptores. Todo Server-side via `adminDb`.

**Tareas:**

**`app/admin/layout.tsx`** _(nuevo — Server Component — segunda línea de defensa)_
- Leer cookie con `getSessionCookie()` → si ausente: `redirect("/login")`
- Llamar `verifySession(cookie)` con `{ checkRevoked: true }` → si null o `!session.admin`: `redirect("/login")`
- Esta verificación captura sesiones revocadas que el middleware Edge no puede detectar
- Nav: fondo `bg-[#23354F]`, links a `/admin`, `/admin/preguntas`, `/admin/suscriptores`
- Link activo con indicador visual: `text-[#EEC073]`
- Botón logout: `<form action="/api/auth/logout" method="POST">` + `<button type="submit">` (funciona sin JS del cliente)
- `<nav aria-label="Panel de administración">` para distinguirla de la nav pública
- `<main id="main-content">` con `max-w-7xl mx-auto px-6 py-10`

**`app/admin/page.tsx`** _(nuevo — Server Component — Dashboard)_
- Leer conteos de Firestore via `adminDb`: preguntas con `status == "pending"`, total de subscribers
- Mostrar dos cards de métricas: número grande en gold, label en gris
- Links directos a `/admin/preguntas` y `/admin/suscriptores` desde cada card

**`app/admin/preguntas/page.tsx`** _(nuevo — Server Component)_
- Leer colección `questions` via `adminDb`, ordenar por `submittedAt DESC`
- Filtro por status vía `searchParams` (`?status=pending`) — Server Component lee y filtra la query
- Botones de filtro con `aria-pressed` para el estado activo
- Status badges en español: "Pendiente" (amarillo), "Respondida" (azul), "Publicada" (verde)
- Transiciones válidas de estado: pending → respondida o publicada; answered → publicada; published → sin acciones
- Botones de acción implementados como Server Actions que llaman `adminDb.doc(id).update({ status, answeredAt })` + `revalidatePath("/admin/preguntas")`
- Tabla semántica: `<table>`, `<thead>`, `<th scope="col">`, `<caption>`
- Estado vacío con mensaje descriptivo

**`app/admin/suscriptores/page.tsx`** _(nuevo — Server Component)_
- Leer colección `subscribers` via `adminDb`, ordenar por `createdAt DESC`
- Paginación via `searchParams` (`?page=N`), 25 registros por página
- Controles de paginación como `<a href="?page=N">` (sin JS) con `aria-disabled` en los extremos
- Tabla semántica con columnas: Email, Fecha de suscripción (formateada DD/MM/YYYY)

**Criterio de completitud:** Dashboard muestra conteos reales. Cambio de status en pregunta se refleja sin recarga manual. Paginación de suscriptores funciona. Logout destruye la cookie. Sesión revocada en otro dispositivo redirige a `/login` en el siguiente request.

---

## Fase 5 — Accesibilidad + Honeypot en Sitio Público `[PARALELO]`

**Prerequisito:** Ninguno — completamente independiente.
**Puede ejecutarse desde el día 1**, en paralelo con Fases 1–3.

**Objetivo:** Cerrar los gaps de accesibilidad documentados en CLAUDE.md y añadir protección honeypot.

**Tareas:**

**`app/layout.tsx`** _(modificado)_
- Añadir skip-to-main como primer hijo del `<body>`: texto "Saltar al contenido principal", `href="#main-content"`, clases `sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-[#EEC073] text-[#23354F] px-4 py-2 rounded font-semibold`

**`app/components/sections/Newsletter.tsx`** _(modificado)_
- Añadir `<label htmlFor="newsletter-email">` visible con texto "Correo electrónico"
- Añadir `id="newsletter-email"` al input existente
- Añadir campo honeypot: `<input name="website" tabIndex={-1} className="sr-only" />`
- Corregir mensaje de error: añadir `role="alert"`
- Corregir mensaje de éxito: añadir `role="status"` + `aria-live="polite"`

**`app/components/sections/PreguntaleExperta.tsx`** _(modificado)_
- Añadir `<label htmlFor="question-text">` visible con texto "Tu pregunta"
- Añadir `id="question-text"` al textarea existente
- Añadir campo honeypot: `<input name="website" tabIndex={-1} className="sr-only" />`
- Corregir `role="alert"` en error, `role="status"` + `aria-live="polite"` en éxito

**`app/actions/newsletter.ts`** _(modificado)_
- Al inicio de la función, leer `formData.get("website")` — si tiene valor: `return { success: true }` silenciosamente (el bot cree que tuvo éxito, no se escribe a Firestore)
- El resto de la lógica existente no cambia

**`app/actions/questions.ts`** _(modificado)_
- Misma lógica honeypot: si `formData.get("website")` tiene valor → `return { success: true }` silenciosamente

**Criterio de completitud:** axe DevTools sin errores en formularios públicos. Skip-to-main es primer elemento de Tab en cualquier página. Envío con honeypot relleno no genera documentos en Firestore.

---

## Tabla Resumen de Archivos

| Fase | Archivo | Operación | Responsable |
|------|---------|-----------|-------------|
| 0 | Firebase Console + `.env.local` | Config externa | — |
| 0 | `package.json` | `npm install firebase-admin` | Backend |
| 1 | `app/lib/firebase-admin.ts` | Crear | Backend |
| 1 | `app/lib/auth/session.ts` | Crear | Backend |
| 1 | `app/lib/firebase.ts` | Modificar (añadir auth) | Backend |
| 2 | `app/api/auth/session/route.ts` | Crear | Backend |
| 2 | `app/api/auth/logout/route.ts` | Crear | Backend |
| 2 | `middleware.ts` (raíz) | Crear | Backend |
| 3 | `app/login/page.tsx` | Crear | Full-stack |
| 3 | `app/components/auth/LoginForm.tsx` | Crear | Frontend |
| 4 | `app/admin/layout.tsx` | Crear | Full-stack |
| 4 | `app/admin/page.tsx` | Crear | Full-stack |
| 4 | `app/admin/preguntas/page.tsx` | Crear | Full-stack |
| 4 | `app/admin/suscriptores/page.tsx` | Crear | Full-stack |
| 5 | `app/layout.tsx` | Modificar | Frontend |
| 5 | `app/components/sections/Newsletter.tsx` | Modificar | Frontend |
| 5 | `app/components/sections/PreguntaleExperta.tsx` | Modificar | Frontend |
| 5 | `app/actions/newsletter.ts` | Modificar | Backend |
| 5 | `app/actions/questions.ts` | Modificar | Backend |

**Total: 11 archivos nuevos, 8 archivos modificados, 3 operaciones externas.**

---

## Verificación End-to-End

1. `curl -I http://localhost:3000/admin` sin cookie → `HTTP 307 Location: /login`
2. Login con credenciales de Gabriela → cookie `__session` en DevTools → redirect `/admin`
3. Dashboard muestra conteos reales de Firestore
4. Cambiar status de una pregunta en `/admin/preguntas` → cambio persiste tras reload
5. Logout → cookie eliminada → `/admin` redirige a `/login`
6. Login con email incorrecto → mensaje genérico "Email o contraseña incorrectos"
7. Clic "¿Olvidaste tu contraseña?" con email válido → email de recuperación en bandeja
8. Enviar formulario Newsletter con campo `website` relleno → sin documento nuevo en Firestore
9. axe DevTools en `/`, `/login`, `/admin` → sin errores críticos de accesibilidad
10. Tab en cualquier página → skip-to-main es el primer elemento enfocado
