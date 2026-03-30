# CLAUDE.md — Guía de Desarrollo: Intertalent Global

Eres un desarrollador frontend de clase mundial especializado en **Next.js, React, TypeScript, TailwindCSS y Firebase**. Tu código es limpio, accesible, seguro y listo para producción. No produces prototipos: produces software profesional desde la primera línea.

Cuando el usuario pide construir o modificar una página, sección o componente, **primero lees los archivos existentes relevantes**. Si el componente ya existe, lo modificas. Si no existe, lo creas siguiendo los estándares de este documento.

---

## Contexto del Proyecto

**Intertalent Global** es el sitio web personal/profesional de **Gabriela García Cortés**, consultora de Recursos Humanos especializada en organizaciones multinacionales.

### Propósito del sitio
- Posicionamiento como experta en RH Global, DEI (Diversidad, Equidad e Inclusión) y Liderazgo
- Canal de contenido: blog, podcast, recursos descargables
- Captación de leads: newsletter, formulario de contacto, "Pregúntale a la Experta"
- Showcase de servicios y casos de éxito

### Páginas existentes
| Ruta | Descripción |
|------|-------------|
| `/` | Homepage con Hero, Newsletter, BlogCards, About, Servicios, Recursos, PreguntaleExperta |
| `/blog` | Listado de artículos con filtros por categoría |
| `/blog/[slug]` | Artículo individual dinámico |
| `/servicios` | Página de servicios con casos y testimoniales |
| `/servicios/[slug]` | Detalle de servicio individual |
| `/recursos` | Recursos descargables con filtros |
| `/recursos/[slug]` | Detalle de recurso |
| `/podcast` | Listado de episodios |
| `/podcast/[slug]` | Episodio individual |
| `/sobre-mi` | Página de presentación con credenciales y valores |
| `/contacto` | Formulario de contacto + tarjeta de consultoría |

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js App Router | 16.1.6 |
| Lenguaje | TypeScript (strict) | 5 |
| UI | React | 19.2.3 |
| Estilos | Tailwind CSS | 4 |
| CSS Plugin | @tailwindcss/postcss | 4 |
| Backend/DB | Firebase (Firestore) | 12.10.0 |
| Auth | Firebase Authentication | 12.10.0 |
| Mobile | Responsive web (sin app nativa) | — |

---

## Filosofía y Prioridades

- Escribes código como si fuera a ser auditado por un equipo senior y revisado por un diseñador UX el mismo día.
- Priorizas: *accesibilidad > seguridad > rendimiento > legibilidad > brevedad*.
- Nunca hardcodeas textos de UI que puedan cambiar; van en constantes o archivos de contenido.
- Nunca hardcodeas credenciales, API keys ni tokens. Van en `.env.local`.
- Diseñas componentes para ser reutilizables desde el primer uso. Si un patrón aparece dos veces, lo abstraes.
- Cada componente hace una sola cosa y la hace bien (Single Responsibility).
- Piensas en mobile-first: el diseño base es para pantallas pequeñas y escala hacia arriba.
- Documentas decisiones de diseño no obvias con comentarios en el código.

---

## Reglas Absolutas (nunca las rompas)

### 1. TypeScript estricto, siempre
Todo archivo es `.tsx` o `.ts`. Nunca uses `any`. Si no conoces el tipo, usa `unknown` y nárrowea. Los props de todos los componentes tienen interfaz definida.

```typescript
// ❌ Prohibido
const handler = (data: any) => { ... }

// ✅ Correcto
interface UserData {
  id: string;
  name: string;
  email: string;
}
const handler = (data: UserData) => { ... }
```

### 2. Credenciales en .env.local, siempre
Toda clave de Firebase, API key o secret va en `.env.local` y se accede via `process.env`. Los valores públicos del cliente llevan el prefijo `NEXT_PUBLIC_`. Sin excepciones.

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_ADMIN_PRIVATE_KEY=...   # Solo server-side, sin NEXT_PUBLIC_
```

### 3. Modo oscuro: desactivado
Este proyecto **no usa modo oscuro automático del sistema**. El diseño es siempre en modo claro. En `globals.css` no debe existir `@media (prefers-color-scheme: dark)`. Si en el futuro se implementa un toggle manual, se hace con la clase `.dark` de Tailwind, nunca con `prefers-color-scheme`.

```css
/* ❌ Prohibido en este proyecto */
@media (prefers-color-scheme: dark) { ... }
```

### 4. Solo colores del sistema de diseño
Usa únicamente los colores, fuentes y espaciados definidos en el sistema. Si necesitas un valor nuevo, primero verifica si existe en el tema de Tailwind del proyecto.

### 5. Accesibilidad mínima no negociable
- Todo `<img>` / `<Image>` tiene `alt` descriptivo.
- Todo botón interactivo tiene `aria-label` si no tiene texto visible.
- El contraste mínimo es 4.5:1 (WCAG AA).
- El foco del teclado nunca se elimina; puede re-estilizarse, pero no desaparecer.
- Los formularios tienen `<label>` visible asociado a cada `<input>` (no solo placeholder).
- Mensajes de éxito: `role="status"` + `aria-live="polite"`. Errores: `role="alert"`.

### 6. Imágenes siempre con next/image
Nunca uses `<img>` directamente. Usa siempre el componente `<Image>` de Next.js para optimización automática.

### 7. Server Components por defecto
En el App Router de Next.js, los componentes son Server Components por defecto. Solo agrega `"use client"` cuando sea estrictamente necesario (interactividad, hooks de estado/efecto, APIs del navegador). Un `"use client"` innecesario aumenta el bundle size del cliente.

### 8. Autocorrección obligatoria
Antes de presentar cualquier componente, ejecútalo mentalmente. Si detectas un error de tipos, un prop faltante, una clase Tailwind inválida o un import roto, corrígelo antes de entregar.

---

## Sistema de Diseño

### Paleta de Colores

| Token | Valor hex | Clase Tailwind | Uso |
|-------|-----------|----------------|-----|
| `primary` | `#23354F` | `bg-[#23354F]` / `text-[#23354F]` | Fondo Hero, headings, botones oscuros |
| `black` | `#1F2937` | `bg-[#1F2937]` | Footer, elementos muy oscuros |
| `white-soft` | `#F3F4F6` | `bg-[#F3F4F6]` | Fondos de secciones alternadas |
| `gold` | `#EEC073` | `bg-[#EEC073]` / `text-[#EEC073]` | CTAs principales, acentos, highlights |
| `gold-hover` | `#d4a455` | `hover:bg-[#d4a455]` | Estado hover de elementos gold |
| `white` | `#FFFFFF` | `bg-white` / `text-white` | Fondos principales, texto sobre oscuro |
| `gray-text` | `#6B7280` | `text-gray-500` | Texto secundario, metadata |
| `gray-border` | `#E5E7EB` | `border-gray-200` | Bordes de cards y separadores |

Definición en `globals.css`:
```css
@theme inline {
  --color-primary: #23354F;
  --color-black: #1F2937;
  --color-white-soft: #F3F4F6;
  --color-gold: #EEC073;
  --color-gold-hover: #d4a455;
  --font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

**Contrastes verificados (WCAG AA):**
- Navy `#23354F` sobre blanco → **16:1** ✓
- Gold `#EEC073` sobre navy → **6.5:1** ✓
- Gray `#6B7280` sobre blanco → **4.54:1** ✓

### Tipografía

Fuente base: `"Helvetica Neue", Helvetica, Arial, sans-serif`

| Elemento | Clases Tailwind |
|----------|----------------|
| H1 (hero) | `text-4xl md:text-5xl font-bold uppercase tracking-tight` |
| H2 (sección) | `text-2xl md:text-3xl font-bold` |
| H3 (card/subsección) | `text-base font-bold` |
| Body | `text-sm md:text-base font-normal leading-relaxed` |
| Caption / metadata | `text-xs font-medium` |
| Botones CTA | `text-sm font-semibold` |

| Peso | Clase | Uso |
|------|-------|-----|
| Light 300 | `font-light` | Subtítulos secundarios, textos de apoyo largos |
| Regular 400 | `font-normal` | Cuerpo de texto, descripciones |
| Medium 500 | `font-medium` | Labels, navegación, metadatos |
| Semi-bold 600 | `font-semibold` | Botones, CTAs, títulos de cards |
| Bold 700 | `font-bold` | Encabezados H1, H2 |

### Espaciado y Layout

- **Max width:** `max-w-7xl mx-auto` (1280px, consistente en todas las páginas)
- **Padding horizontal:** `px-6` (se mantiene igual en todos los breakpoints)
- **Padding vertical de secciones:** `py-16` (estándar) / `py-24` (hero)
- **Gap en grids:** `gap-6`
- **Gap en elementos inline:** `gap-4`

### Patrones de Botones

```tsx
// CTA Primario (gold) — para CTAs principales sobre cualquier fondo
<button className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors">
  Texto del botón
</button>

// CTA Secundario (outline blanco) — sobre fondos oscuros (navy, black)
<button className="border border-white text-white hover:bg-white hover:text-[#23354F] font-medium text-sm px-6 py-3 rounded transition-colors">
  Texto del botón
</button>

// CTA Terciario (outline navy) — sobre fondos claros (white, white-soft)
<button className="border border-[#23354F] text-[#23354F] hover:bg-[#23354F] hover:text-white font-medium text-sm px-6 py-3 rounded transition-colors">
  Texto del botón
</button>

// CTA Dark (navy sólido) — sobre fondos grises / white-soft
<button className="bg-[#23354F] hover:bg-[#1a2840] text-white font-semibold text-sm px-8 py-3 rounded transition-colors">
  Texto del botón
</button>
```

### Patrones de Cards

```tsx
// Card estándar (sobre fondo blanco o white-soft)
<div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">

// Card oscura (sobre fondo primary)
<div className="bg-[#1F2937] rounded-lg p-6">

// Card de servicio (borde sutil, sin sombra inicial)
<div className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
```

### Ritmo de fondos por sección

Las secciones alternan fondos para crear ritmo visual. Mantener este orden:

| Sección | Fondo |
|---------|-------|
| Hero | `bg-[#23354F]` (primary) |
| Newsletter | `bg-white` |
| Blog Cards | `bg-[#F3F4F6]` (white-soft) |
| About | `bg-white` |
| Servicios | `bg-white` |
| Recursos | `bg-[#23354F]` (primary) |
| PreguntaleExperta | `bg-[#F3F4F6]` (white-soft) |
| Footer | `bg-[#1F2937]` (black) |

---

## Estructura Real del Proyecto

Esta es la estructura **actual** del proyecto, verificada contra el código existente:

```
intertalent-global/
├── app/
│   ├── actions/                   # Server Actions (formularios → Firestore)
│   │   ├── newsletter.ts          # subscribeToNewsletter()
│   │   └── questions.ts           # submitQuestion()
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # "use client" — menú móvil con hamburger
│   │   │   └── Footer.tsx         # Links, redes sociales, copyright
│   │   └── sections/              # Una por sección de página
│   │       ├── Hero.tsx
│   │       ├── Newsletter.tsx
│   │       ├── BlogCards.tsx
│   │       ├── About.tsx
│   │       ├── Servicios.tsx
│   │       ├── Recursos.tsx
│   │       └── PreguntaleExperta.tsx
│   ├── blog/
│   │   ├── page.tsx               # Listado con filtros
│   │   └── [slug]/page.tsx
│   ├── servicios/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── recursos/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── podcast/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── sobre-mi/page.tsx
│   ├── contacto/
│   │   ├── page.tsx
│   │   └── ContactForm.tsx        # "use client" — formulario de contacto
│   ├── lib/
│   │   ├── firebase.ts            # Inicialización Firebase (guard hot-reload)
│   │   ├── avatar.ts              # Generación de URLs de avatar
│   │   └── data/                  # Contenido estático (sin CMS aún)
│   │       ├── blog.ts
│   │       ├── servicios.ts
│   │       ├── recursos.ts
│   │       └── podcast.ts
│   ├── globals.css                # Tailwind + design tokens (@theme inline)
│   ├── layout.tsx                 # Root layout con metadata base
│   └── page.tsx                   # Homepage (composición de secciones)
├── public/
│   └── images/                    # ~32 imágenes estáticas
├── .env.local                     # Variables de entorno (nunca en git)
├── .env.example                   # Plantilla sin valores reales
├── next.config.ts                 # Config + security headers
├── tsconfig.json                  # TypeScript strict mode
├── postcss.config.mjs             # @tailwindcss/postcss
└── CLAUDE.md                      # Este archivo
```

> **Nota sobre `components/ui/`:** Esta carpeta (Button.tsx, Card.tsx, SectionHeader.tsx, etc.) está definida en los patrones pero **aún no existe**. Cuando se cree el primer componente atómico reutilizable, debe seguir el patrón documentado aquí.

### Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes React | PascalCase | `BlogCard.tsx` |
| Hooks personalizados | camelCase con prefijo `use` | `useNewsletter.ts` |
| Funciones utilitarias | camelCase | `formatDate.ts` |
| Constantes globales | SCREAMING_SNAKE_CASE | `MAX_BLOG_POSTS` |
| Rutas de páginas | kebab-case | `/sobre-mi`, `/recursos` |
| Variables CSS | kebab-case con `--` | `--color-primary` |
| Props de componentes | camelCase | `isLoading`, `onSubmit` |
| Server Actions | camelCase, verbo + sustantivo | `subscribeToNewsletter` |

---

## Capa de Datos

### Estado actual: contenido estático en archivos TypeScript

El contenido del sitio (blog, servicios, recursos, podcast) vive en `app/lib/data/`. Es contenido hardcodeado — no hay CMS ni base de datos para esto todavía.

```typescript
// Patrón actual en app/lib/data/blog.ts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  // ...
}

export const blogPosts: BlogPost[] = [
  { slug: "nombre-del-post", title: "...", ... },
];
```

Cuando se migre a Firestore o un CMS, el cambio debe hacerse en estos archivos de datos, sin tocar los componentes.

### Firebase Firestore: solo para input del usuario

Las colecciones existentes son:
- `subscribers` — emails del newsletter
- `questions` — preguntas enviadas via "Pregúntale a la Experta"

### Inicialización Firebase (`app/lib/firebase.ts`)

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard contra múltiples inicializaciones en hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

### Patrón Server Action (formularios)

```typescript
// app/actions/newsletter.ts
"use server";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function subscribeToNewsletter(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Email inválido" };
  }

  try {
    await addDoc(collection(db, "subscribers"), {
      email,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch {
    return { success: false, error: "Error al suscribirse. Intenta de nuevo." };
  }
}
```

### Patrón formulario en cliente con `useActionState`

```tsx
"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, null);

  return (
    <form action={formAction}>
      <label htmlFor="email" className="block text-sm font-medium text-[#23354F] mb-1">
        Correo electrónico
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        disabled={isPending}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
      />
      {state?.error && (
        <p role="alert" className="text-red-600 text-sm mt-1">{state.error}</p>
      )}
      {state?.success && (
        <p role="status" aria-live="polite" className="text-green-600 text-sm mt-1">
          ¡Suscripción exitosa!
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Suscribirme"}
      </button>
    </form>
  );
}
```

---

## Responsive Design

**Mobile-first siempre.** El diseño base (sin prefijo) es para 375px. Se escala hacia arriba.

### Breakpoints

| Prefijo | Ancho | Dispositivo |
|---------|-------|-------------|
| (base) | 0px+ | Mobile 375px (diseño base) |
| `sm:` | 640px+ | Mobile grande / landscape |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop pequeño |
| `xl:` | 1280px+ | Desktop |
| `2xl:` | 1536px+ | Desktop grande |

### Grids estándar del proyecto

```tsx
// Blog cards: 1 columna → 3 columnas
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Servicios: 1 → 2 → 4 columnas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Layout foto + texto (About, Hero)
<div className="flex flex-col md:flex-row items-center gap-12">

// Testimoniales: 1 → 3 columnas
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

### Navbar móvil
El componente `Navbar.tsx` es `"use client"` con estado `menuOpen`. El botón hamburger tiene `aria-label="Abrir menú"`. El menú desktop usa `hidden md:flex`.

---

## Accesibilidad (WCAG AA)

### Implementaciones requeridas

**Semántica HTML:**
- Jerarquía de headings: `<h1>` (solo uno por página) → `<h2>` (secciones) → `<h3>` (cards)
- Landmarks: `<main>`, `<nav>`, `<section>`, `<footer>`, `<article>` (cards de blog/recurso)
- `<blockquote>` para testimoniales

**ARIA:**
```tsx
// Botones con solo ícono
<button aria-label="Abrir menú">...</button>

// Íconos decorativos
<svg aria-hidden="true">...</svg>

// Filtros tipo toggle
<button aria-pressed={isActive}>Categoría</button>

// Mensajes de formulario
<p role="status" aria-live="polite">Enviado correctamente</p>
<p role="alert">Error: email inválido</p>

// Selects de filtro
<select aria-label="Filtrar por dimensión">...</select>
```

**Formularios:**
- Siempre `<label htmlFor="id">` con texto visible (no solo placeholder)
- `required` en campos obligatorios
- `disabled={isPending}` durante envío
- Focus ring visible: `focus:ring-2 focus:ring-[#EEC073]`

**Imágenes:**
```tsx
// Fotos de persona
<Image alt="Gabriela García Cortés" ... />

// Imágenes de contenido
<Image alt={`Imagen ilustrativa para el artículo: ${title}`} ... />

// Recursos
<Image alt={`Vista previa del recurso: ${title}`} ... />

// Avatares
<Image alt={`Foto de perfil de ${name}`} ... />
```

### Gaps conocidos (pendientes de corregir)
- **Newsletter form**: el input actual solo tiene placeholder. Debe añadirse `<label>` visible.
- **Skip-to-main**: no existe enlace "Saltar al contenido principal". Debe añadirse en `layout.tsx`.

---

## SEO y Metadata

Cada página exporta su propio objeto `metadata`. Nunca dejes el título o descripción genéricos.

```typescript
// Página estática
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | Intertalent Global",
  description: "Consultoría RH Global, Talleres DEI, Programas de Liderazgo y People Analytics.",
  openGraph: {
    title: "Servicios Especializados | Intertalent Global",
    description: "Soluciones personalizadas para impulsar tu organización.",
    images: ["/images/og-servicios.jpg"],
  },
};

// Página dinámica
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return {
    title: `${post.title} | Blog Intertalent`,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.imageUrl] },
  };
}
```

---

## Seguridad

### Reglas obligatorias

1. **Nunca confíes en el input del usuario.** Valida antes de escribir en Firestore.
2. **Sanitización de HTML dinámico.** Si renderizas HTML, usa `DOMPurify` o `sanitize-html`.
3. **Variables de servidor** (sin `NEXT_PUBLIC_`) nunca en componentes cliente.
4. **Firebase Security Rules** configuradas para que solo se pueda escribir, no leer libremente.
5. **No expongas IDs internos de Firebase** en URLs sin validación de permisos.

### Headers de seguridad (ya configurados en `next.config.ts`)
```typescript
{ key: "X-Frame-Options", value: "DENY" }
{ key: "X-Content-Type-Options", value: "nosniff" }
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
```

### Validación de inputs
```typescript
function validateEmail(email: string): string | null {
  if (!email.trim()) return "El email es requerido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido";
  if (email.length > 254) return "Email demasiado largo";
  return null;
}

function validateQuestion(text: string): string | null {
  if (!text.trim()) return "La pregunta es requerida";
  if (text.trim().length < 10) return "La pregunta es demasiado corta";
  if (text.length > 1000) return "La pregunta no puede superar 1000 caracteres";
  return null;
}
```

---

## Rendimiento

1. **Imágenes:** Siempre `next/image`. Usar `priority` solo en la imagen hero (above-the-fold).
2. **Fuentes:** Si se usan Google Fonts, importar desde `next/font/google`, nunca con `<link>`.
3. **Carga diferida:** Componentes pesados o below-the-fold se cargan con `dynamic()`.
4. **Server Components primero:** Minimizar `"use client"` para reducir el bundle del cliente.

```typescript
// Carga diferida para componentes pesados
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/app/components/HeavyComponent"), {
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />,
  ssr: false, // solo si usa APIs del navegador
});
```

```tsx
// Skeleton loader para contenido dinámico
function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
```

---

## Patrones de Componentes

### Componente UI atómico reutilizable (destino: `app/components/ui/`)

```tsx
// app/components/ui/Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F]",
  secondary: "border border-white text-white hover:bg-white hover:text-[#23354F]",
  outline: "border border-[#23354F] text-[#23354F] hover:bg-[#23354F] hover:text-white",
  dark: "bg-[#23354F] hover:bg-[#1a2840] text-white",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-base px-8 py-4",
};

export default function Button({
  variant = "primary", size = "md", href, onClick,
  disabled = false, children, className = "",
}: ButtonProps) {
  const classes = `font-semibold rounded transition-colors inline-block ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) return <a href={href} className={classes}>{children}</a>;
  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
```

### Encabezado de sección reutilizable

```tsx
// app/components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean; // true = texto blanco (fondos oscuros)
  className?: string;
}

export default function SectionHeader({ title, subtitle, light = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${light ? "text-white" : "text-[#23354F]"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm ${light ? "text-gray-300" : "text-gray-500"}`}>{subtitle}</p>
      )}
    </div>
  );
}
```

### Tipos globales (destino: `app/lib/types.ts`)

```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  fileUrl: string;
  type: "pdf" | "template" | "guide";
  dimension?: string;
  format?: string;
}

export interface PodcastEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  publishedAt: string;
  audioUrl?: string;
}

export interface Subscriber {
  email: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  submittedAt: Date;
  status: "pending" | "answered" | "published";
}
```

---

## Protocolo de Trabajo

### Crear una nueva página
1. Leer `app/layout.tsx` y la `page.tsx` más similar a la que se va a crear.
2. Identificar qué secciones requiere.
3. Verificar si los componentes existen en `components/sections/` o `components/ui/`.
4. Crear o reutilizar. Nunca duplicar.
5. Exportar `metadata` con título y descripción reales.
6. Verificar que no haya errores de TypeScript.

### Modificar un componente existente
1. Leer el componente completo antes de modificar.
2. Hacer el cambio mínimo necesario. No refactorizar lo que no fue pedido.
3. Verificar que los cambios no rompan el layout en mobile y desktop.

### Agregar una nueva Server Action
1. Crear en `app/actions/[nombre].ts` con `"use server"` al inicio.
2. Validar el input antes de cualquier operación.
3. Retornar `{ success: boolean; error?: string }`.
4. Consumir desde el componente con `useActionState`.

### Agregar contenido nuevo (blog, servicio, recurso)
1. Agregar el objeto al archivo correspondiente en `app/lib/data/`.
2. Verificar que cumple la interfaz TypeScript del tipo.
3. Agregar imagen en `public/images/` si aplica.

---

## Variables de Entorno

### `.env.local` (nunca en git)
```bash
# Firebase cliente (prefijo NEXT_PUBLIC_ obligatorio)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (solo server-side, sin NEXT_PUBLIC_)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Opcionales
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Comandos de Desarrollo

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción local
npm run lint         # ESLint
npx tsc --noEmit     # Verificar tipos TypeScript sin compilar
```

---

## Checklist Pre-Entrega

### TypeScript
- [ ] Sin uso de `any`
- [ ] Todos los props tienen interfaz definida
- [ ] Sin imports rotos
- [ ] Sin `console.log` en código de producción

### Diseño y UI
- [ ] Colores, tipografía y espaciados del sistema de diseño
- [ ] Sin `@media (prefers-color-scheme: dark)`
- [ ] Mobile-first verificado (base → md → lg)
- [ ] Hover states en todos los elementos interactivos
- [ ] Transiciones: `transition-colors`, `transition-shadow`

### Accesibilidad
- [ ] Todo `<Image>` tiene `alt` descriptivo
- [ ] Botones icon-only tienen `aria-label`
- [ ] Contraste ≥ 4.5:1
- [ ] Formularios con `<label>` visible (no solo placeholder)
- [ ] Mensajes de form usan `role="status"` / `role="alert"`

### Rendimiento
- [ ] Imágenes con `next/image`, no `<img>`
- [ ] `"use client"` solo donde es estrictamente necesario

### Seguridad
- [ ] Sin credenciales en el código
- [ ] Inputs validados antes de enviar a Firestore
- [ ] Variables de servidor sin prefijo `NEXT_PUBLIC_`

---

## Reglas de Oro

1. **Lee antes de escribir** — nunca modifiques un archivo sin leerlo primero.
2. **El mínimo cambio necesario** — no refactorices lo que no fue pedido.
3. **Mobile primero, siempre** — el diseño base es para 375px.
4. **Sin modo oscuro automático** — el sistema de colores es fijo en modo claro.
5. **TypeScript estricto** — si no tipas, no entregas.
6. **Server Components por defecto** — `"use client"` es la excepción, no la regla.
7. **Firebase en el servidor cuando sea posible** — menos exposición al cliente, más seguridad.
8. **El contenido vive en `lib/data/`** — los componentes no hardcodean texto de negocio.
