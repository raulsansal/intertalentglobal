"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Avatar from "@/app/components/ui/Avatar";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Sobre Mí", href: "/sobre-mi" },
  { label: "Servicios", href: "/servicios" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // Flag para distinguir "nunca registrado" de "registrado pero sin sesión"
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    setHasAccount(localStorage.getItem("hasAccount") === "true");

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleLogout() {
    await signOut(auth);
    await fetch("/api/auth/logout", { method: "POST" });
    setProfileOpen(false);
    window.location.href = "/";
  }

  // Botón derecho del navbar según estado de autenticación
  function AuthButton() {
    if (authLoading) return <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />;

    if (user) {
      return (
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Abrir menú de perfil"
            aria-expanded={profileOpen}
            className="focus:outline-none focus:ring-2 focus:ring-[#EEC073] rounded-full"
          >
            <Avatar
              displayName={user.displayName}
              email={user.email}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-100 py-1 z-50">
              <Link
                href="/perfil"
                className="block px-4 py-2 text-sm text-[#23354F] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F3F4F6] transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      );
    }

    if (hasAccount) {
      return (
        <Link
          href="/login"
          className="text-sm font-semibold text-[#23354F] border border-[#23354F] px-5 py-2 rounded hover:bg-[#23354F] hover:text-white transition-colors"
        >
          Iniciar sesión
        </Link>
      );
    }

    return (
      <Link
        href="/registro"
        className="text-sm font-semibold text-[#23354F] border border-[#23354F] px-5 py-2 rounded hover:bg-[#23354F] hover:text-white transition-colors"
      >
        Registrarme
      </Link>
    );
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#23354F]">
          Logo
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[#1F2937] hover:text-[#23354F] transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contacto"
            className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-5 py-2 rounded transition-colors"
          >
            Agendar Consulta
          </Link>
          <AuthButton />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#23354F]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[#1F2937] hover:text-[#23354F]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/contacto"
              className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-5 py-2 rounded text-center"
              onClick={() => setMenuOpen(false)}
            >
              Agendar Consulta
            </Link>
            {user ? (
              <>
                <Link
                  href="/perfil"
                  className="text-sm font-semibold text-[#23354F] border border-[#23354F] px-5 py-2 rounded text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-sm text-red-600 border border-red-200 px-5 py-2 rounded text-center"
                >
                  Cerrar sesión
                </button>
              </>
            ) : hasAccount ? (
              <Link
                href="/login"
                className="text-sm font-semibold text-[#23354F] border border-[#23354F] px-5 py-2 rounded text-center"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            ) : (
              <Link
                href="/registro"
                className="text-sm font-semibold text-[#23354F] border border-[#23354F] px-5 py-2 rounded text-center"
                onClick={() => setMenuOpen(false)}
              >
                Registrarme
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
