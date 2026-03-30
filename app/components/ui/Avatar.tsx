interface AvatarProps {
  displayName: string | null;
  email: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md";
}

/**
 * Genera las iniciales a partir del nombre completo o del email.
 * "Enrique Rouaix" → "ER" | "enrique@mail.com" → "E"
 */
function getInitials(displayName: string | null, email: string | null): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "?";
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
};

export default function Avatar({
  displayName,
  email,
  avatarUrl,
  size = "md",
}: AvatarProps) {
  const initials = getInitials(displayName, email);
  const sizeClass = sizes[size];

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`Foto de perfil de ${displayName ?? email}`}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-[#EEC073]`}
      />
    );
  }

  return (
    <span
      aria-label={`Perfil de ${displayName ?? email}`}
      className={`${sizeClass} rounded-full bg-[#23354F] text-[#EEC073] font-semibold flex items-center justify-center ring-2 ring-[#EEC073] select-none`}
    >
      {initials}
    </span>
  );
}
