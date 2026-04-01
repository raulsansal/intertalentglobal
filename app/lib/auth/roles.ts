// ─────────────────────────────────────────────────────────────────────────────
// Roles y permisos del sistema Intertalent Global
// Fuente de verdad: spec/01_plan_implementacion_autenticacion.md — Fase 6
// ─────────────────────────────────────────────────────────────────────────────

export type Role =
  | "admin"
  | "moderador"
  | "editor_blog"
  | "editor_podcast"
  | "editor_cursos"
  | "usuario";

export type Permission =
  // Gestión de usuarios
  | "usuarios:crear_eliminar"
  | "usuarios:asignar_rol"
  | "usuarios:ver_lista"
  // Blog
  | "blog:crear_post"
  | "blog:editar_propio"
  | "blog:editar_ajeno"
  | "blog:publicar"
  | "blog:eliminar"
  | "blog:gestionar_categorias"
  | "blog:comentar"
  // Podcast
  | "podcast:subir"
  | "podcast:editar_propio"
  | "podcast:editar_ajeno"
  | "podcast:publicar"
  | "podcast:eliminar"
  | "podcast:gestionar_series"
  // Cursos
  | "cursos:gestionar"
  | "cursos:ver_estadisticas"
  // Preguntas
  | "preguntas:realizar"
  | "preguntas:leer_ajenas"
  | "preguntas:aprobar"
  | "preguntas:eliminar"
  | "preguntas:responder"
  | "preguntas:gestionar_categorias"
  | "preguntas:ver_reportes"
  // Mensajes / soporte
  | "mensajes:enviar"
  | "mensajes:ver_todos"
  | "mensajes:responder_soporte"
  | "mensajes:marcar_resuelto"
  | "mensajes:gestionar_reportes_spam"
  // Contenido general
  | "contenido:ver_publico"
  | "contenido:guardar_favoritos"
  | "contenido:reportar"
  // Newsletter
  | "newsletter:suscribirse"
  | "newsletter:recibir_comunicaciones"
  | "newsletter:gestionar_campannas"
  | "newsletter:ver_estadisticas"
  // Configuración del sitio (solo admin)
  | "config:ajustes"
  | "config:diseno"
  | "config:plugins"
  | "config:ver_logs";

// ─── Permisos por rol ─────────────────────────────────────────────────────────

const ADMIN_PERMISSIONS: Permission[] = [
  "usuarios:crear_eliminar",
  "usuarios:asignar_rol",
  "usuarios:ver_lista",
  "blog:crear_post",
  "blog:editar_propio",
  "blog:editar_ajeno",
  "blog:publicar",
  "blog:eliminar",
  "blog:gestionar_categorias",
  "blog:comentar",
  "podcast:subir",
  "podcast:editar_propio",
  "podcast:editar_ajeno",
  "podcast:publicar",
  "podcast:eliminar",
  "podcast:gestionar_series",
  "cursos:gestionar",
  "cursos:ver_estadisticas",
  "preguntas:realizar",
  "preguntas:leer_ajenas",
  "preguntas:aprobar",
  "preguntas:eliminar",
  "preguntas:responder",
  "preguntas:gestionar_categorias",
  "preguntas:ver_reportes",
  "mensajes:enviar",
  "mensajes:ver_todos",
  "mensajes:responder_soporte",
  "mensajes:marcar_resuelto",
  "mensajes:gestionar_reportes_spam",
  "contenido:ver_publico",
  "contenido:guardar_favoritos",
  "contenido:reportar",
  "newsletter:suscribirse",
  "newsletter:recibir_comunicaciones",
  "newsletter:gestionar_campannas",
  "newsletter:ver_estadisticas",
  "config:ajustes",
  "config:diseno",
  "config:plugins",
  "config:ver_logs",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ADMIN_PERMISSIONS,

  moderador: [
    "usuarios:ver_lista",
    "blog:comentar",
    "blog:eliminar",
    "podcast:eliminar",
    "preguntas:realizar",
    "preguntas:leer_ajenas",
    "preguntas:aprobar",
    "preguntas:eliminar",
    "preguntas:responder",
    "preguntas:gestionar_categorias",
    "preguntas:ver_reportes",
    "mensajes:enviar",
    "mensajes:ver_todos",
    "mensajes:responder_soporte",
    "mensajes:marcar_resuelto",
    "contenido:ver_publico",
    "contenido:guardar_favoritos",
    "contenido:reportar",
    "newsletter:suscribirse",
    "newsletter:recibir_comunicaciones",
    "newsletter:gestionar_campannas",
    "newsletter:ver_estadisticas",
    "config:ver_logs",
  ],

  editor_blog: [
    "blog:crear_post",
    "blog:editar_propio",
    "blog:publicar",
    "blog:gestionar_categorias",
    "blog:comentar",
    "preguntas:realizar",
    "preguntas:leer_ajenas",
    "preguntas:responder",
    "mensajes:enviar",
    "contenido:ver_publico",
    "contenido:guardar_favoritos",
    "contenido:reportar",
    "newsletter:suscribirse",
    "newsletter:recibir_comunicaciones",
  ],

  editor_podcast: [
    "podcast:subir",
    "podcast:editar_propio",
    "podcast:publicar",
    "podcast:eliminar",
    "podcast:gestionar_series",
    "blog:comentar",
    "preguntas:realizar",
    "preguntas:leer_ajenas",
    "preguntas:responder",
    "mensajes:enviar",
    "contenido:ver_publico",
    "contenido:guardar_favoritos",
    "contenido:reportar",
    "newsletter:suscribirse",
    "newsletter:recibir_comunicaciones",
  ],

  editor_cursos: [
    "cursos:gestionar",
    "cursos:ver_estadisticas",
    "blog:comentar",
    "preguntas:realizar",
    "mensajes:enviar",
    "contenido:ver_publico",
    "contenido:guardar_favoritos",
    "contenido:reportar",
    "newsletter:suscribirse",
    "newsletter:recibir_comunicaciones",
  ],

  usuario: [
    "blog:comentar",
    "preguntas:realizar",
    "mensajes:enviar",
    "contenido:ver_publico",
    "contenido:guardar_favoritos",
    "contenido:reportar",
    "newsletter:suscribirse",
    "newsletter:recibir_comunicaciones",
  ],
};

// ─── Etiquetas UI ─────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  moderador: "Moderador",
  editor_blog: "Editor Blog",
  editor_podcast: "Editor Podcast",
  editor_cursos: "Editor Cursos",
  usuario: "Usuario",
};

// Array ordenado para selects y tablas (admin siempre al frente)
export const ALL_ROLES: Role[] = [
  "admin",
  "moderador",
  "editor_blog",
  "editor_podcast",
  "editor_cursos",
  "usuario",
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Verifica si un rol tiene un permiso específico. */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Extrae el rol desde los custom claims del token de Firebase. */
export function getRoleFromClaims(
  claims: Record<string, unknown>
): Role {
  const claimed = claims["role"];
  if (typeof claimed === "string" && (ALL_ROLES as string[]).includes(claimed)) {
    return claimed as Role;
  }
  // El claim 'admin: true' sin 'role' equivale a admin (backwards-compat)
  if (claims["admin"] === true) return "admin";
  return "usuario";
}
