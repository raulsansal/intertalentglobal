import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contacto | Intertalent Global',
  description:
    'Conecta con Gabriela García Cortés para una consulta estratégica, colaboración o simplemente para hacer una pregunta sobre RH global.',
  openGraph: {
    title: 'Contacto | Intertalent Global',
    description:
      'Ya sea que busques una consulta estratégica, una colaboración o simplemente tienes una pregunta — estoy aquí para escucharte.',
    images: ['/images/og-contacto.jpg'],
  },
};

export default function ContactoPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            Hablemos
          </p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Conectemos para transformar juntos
          </h1>
          <p className="text-base md:text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Ya sea que busques una consulta estratégica, una colaboración o simplemente tienes
            una pregunta — estoy aquí para escucharte.
          </p>
        </div>
      </section>

      {/* Form + Consultation Card */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[#23354F] mb-6">Envíame un mensaje</h2>
              <ContactForm />
            </div>

            {/* Consultation Card */}
            <div className="bg-[#23354F] text-white rounded-lg p-8 flex flex-col gap-6">
              <div
                className="w-14 h-14 rounded-full bg-[#EEC073]/20 border-2 border-[#EEC073] flex items-center justify-center"
                aria-hidden="true"
              >
                <svg className="w-7 h-7 text-[#EEC073]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">Agenda tu consulta estratégica</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  60 minutos para diagnosticar tu mayor desafío en RH global — sin compromiso.
                </p>
              </div>
              <ul className="space-y-3" aria-label="Beneficios de la consulta estratégica">
                {[
                  'Sesión 100% personalizada',
                  'Enfoque en resultados accionables',
                  'Acceso a recursos exclusivos post-sesión',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-gray-200">
                    <svg
                      className="w-4 h-4 text-[#EEC073] flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors text-center"
              >
                Reservar mi espacio →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#23354F] mb-10">O escríbeme directamente</h2>
          <div className="flex flex-col md:flex-row items-start justify-center gap-12">
            {/* Contact Info */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full bg-[#EEC073]/20 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-4 h-4 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a
                  href="mailto:gabrielac@talentosinfronteras.com"
                  className="text-sm text-gray-700 hover:text-[#23354F] transition-colors"
                >
                  gabrielac@talentosinfronteras.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full bg-[#EEC073]/20 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-4 h-4 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a
                  href="tel:+525512345678"
                  className="text-sm text-gray-700 hover:text-[#23354F] transition-colors"
                >
                  +52 (55) 1234-5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-full bg-[#EEC073]/20 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  <svg className="w-4 h-4 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="text-sm text-gray-700">CDMX · México · Disponible en horario global</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-left md:text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
                Sígueme en redes
              </p>
              <div className="flex gap-4 justify-start md:justify-center">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Gabriela García Cortés"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#23354F] hover:border-[#23354F] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter de Gabriela García Cortés"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#23354F] hover:border-[#23354F] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Gabriela García Cortés"
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#23354F] hover:border-[#23354F] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pregúntale a la Experta CTA */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-[#23354F] rounded-lg p-8 text-center">
            <div
              className="w-12 h-12 rounded-full bg-[#EEC073]/20 border-2 border-[#EEC073] flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg className="w-6 h-6 text-[#EEC073]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">¿Prefieres una respuesta rápida?</h2>
            <p className="text-sm text-gray-300 mb-6">
              Usa la sección "Pregúntale a la Experta" y podrías ver tu pregunta respondida en el
              blog o newsletter.
            </p>
            <Link
              href="/#preguntale"
              className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors"
            >
              Ir a "Pregúntale a la Experta" →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
