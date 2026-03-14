import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { SERVICIOS } from '@/app/lib/data/servicios';
import { getAvatarUrl } from '@/app/lib/avatar';

export const metadata: Metadata = {
  title: 'Servicios | Intertalent Global',
  description:
    'Consultoría en RH Global, Talleres de DEI, Programas de Liderazgo Global e Implementación de People Analytics para organizaciones que operan sin fronteras.',
  openGraph: {
    title: 'Servicios | Intertalent Global',
    description:
      'Estrategias personalizadas para organizaciones que no quieren solo gestionar personas — sino liberar su potencial sin fronteras.',
    images: ['/images/og-servicios.jpg'],
  },
};

const testimonials = [
  {
    name: 'Carlos Rodríguez',
    role: 'CPO',
    company: 'InnovateCorp',
    quote:
      'Gracias a los talleres de DEI, hoy el 45% de nuestros líderes son mujeres y nuestra innovación ha crecido exponencialmente.',
  },
  {
    name: 'María González',
    role: 'Directora de Talento',
    company: 'GlobalTech',
    quote:
      'Los programas de liderazgo transformaron completamente nuestra capacidad de gestionar equipos internacionales con resultados medibles.',
  },
  {
    name: 'David Kim',
    role: 'CEO',
    company: 'StartUpGlobal',
    quote:
      'La implementación de people analytics nos permitió reducir la rotación en un 35% y tomar decisiones basadas en datos reales.',
  },
];

export default function ServiciosPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            Nuestros Servicios
          </p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Soluciones que transforman el talento global
          </h1>
          <p className="text-base md:text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Estrategias personalizadas para organizaciones que no quieren solo gestionar personas
            — sino liberar su potencial sin fronteras.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICIOS.map((servicio) => (
              <article
                key={servicio.slug}
                className="border border-gray-100 rounded-lg p-8 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    className={`text-2xl w-12 h-12 rounded-lg ${servicio.color} flex items-center justify-center flex-shrink-0`}
                    aria-hidden="true"
                  >
                    {servicio.icon}
                  </span>
                  <h2 className="text-xl font-bold text-[#23354F] leading-snug">{servicio.title}</h2>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{servicio.shortDescription}</p>

                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#23354F] mb-3">
                    Resultados que lograrás:
                  </p>
                  <ul className="space-y-2" aria-label={`Resultados del servicio ${servicio.title}`}>
                    {servicio.results.map((result) => (
                      <li key={result} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-[#EEC073] flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/servicios/${servicio.slug}`}
                    className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-2 rounded transition-colors"
                  >
                    Solicitar propuesta →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-10 text-center">
            Casos de Éxito
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICIOS.flatMap((s) => s.caseStudies.map((c) => ({ ...c, serviceTitle: s.title, serviceSlug: s.slug }))).slice(0, 4).map((c) => (
              <div
                key={`${c.serviceSlug}-${c.client}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#EEC073]">
                    {c.serviceTitle}
                  </span>
                </div>
                <div className="flex gap-6 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#23354F]">{c.metric1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#23354F]">{c.metric2}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="font-semibold text-gray-700">Cliente:</span> {c.client}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                <Link
                  href={`/servicios/${c.serviceSlug}`}
                  className="inline-block mt-4 text-xs font-semibold text-[#23354F] border border-[#23354F] hover:bg-[#23354F] hover:text-white px-4 py-2 rounded transition-colors"
                >
                  Ver caso completo
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-10 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#F3F4F6] rounded-lg p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={getAvatarUrl(t.name)}
                    alt={`Foto de perfil de ${t.name}`}
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#23354F]">{t.name}</p>
                    <p className="text-xs text-gray-500">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1" aria-label="Calificación 5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#EEC073]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote>
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{t.quote}"</p>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#23354F] py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Cuál es tu mayor desafío en RH global hoy?
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Agenda una consulta gratuita y diseñemos juntos tu hoja de ruta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-8 py-3 rounded transition-colors"
            >
              Agendar mi consulta →
            </Link>
            <Link
              href="/servicios"
              className="inline-block border border-white text-white hover:bg-white hover:text-[#23354F] font-medium text-sm px-8 py-3 rounded transition-colors"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
