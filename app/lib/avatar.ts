/**
 * Genera una URL de avatar desde UI Avatars (ui-avatars.com).
 * Produce una imagen PNG con las iniciales del nombre sobre el color dorado del sitio.
 *
 * @param name  Nombre completo de la persona (ej. "María González")
 * @param size  Tamaño en píxeles del lado del cuadrado (default: 128)
 */
export function getAvatarUrl(name: string, size = 128): string {
  const encoded = encodeURIComponent(name.trim());
  return (
    `https://ui-avatars.com/api/` +
    `?name=${encoded}` +
    `&background=EEC073` +
    `&color=23354F` +
    `&size=${size}` +
    `&font-size=0.4` +
    `&bold=true` +
    `&rounded=true`
  );
}
