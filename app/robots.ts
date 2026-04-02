import type { MetadataRoute } from "next";

// Bloqueo global de indexación durante la fase de desarrollo.
// Cuando el sitio esté listo para producción, cambiar Disallow a Allow
// y actualizar el host con el dominio definitivo.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
