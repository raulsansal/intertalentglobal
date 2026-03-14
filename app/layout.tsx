import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intertalent Global | Gabriela García Cortés",
  description: "Talento sin fronteras. Liderazgo en evolución. Experta Global en Recursos Humanos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
