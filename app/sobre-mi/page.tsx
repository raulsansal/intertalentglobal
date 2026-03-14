import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { getAvatarUrl } from '@/app/lib/avatar';

export const metadata: Metadata = {
  title: 'Sobre Mí | Intertalent Global',
  description:
    'Conoce a Gabriela García Cortés — experta global en RH, PhD por Harvard, autora y speaker TEDx. Talento sin fronteras, liderazgo en evolución.',
  openGraph: {
    title: 'Sobre Mí | Intertalent Global',
    description:
      'Conoce a Gabriela García Cortés — experta global en RH, PhD por Harvard, autora y speaker TEDx.',
    images: ['/images/og-sobre-mi.jpg'],
  },
};

const credentials = [
  {
    icon: '🎓',
    title: 'PhD en Gestión Organizacional',
    subtitle: 'Universidad de Harvard',
  },
  {
    icon: '📊',
    title: 'Certificada en People Analytics',
    subtitle: 'MIT — Programa Avanzado',
  },
  {
    icon: '📖',
    title: 'Autora de "El Futuro del Trabajo Sin Fronteras"',
    subtitle: 'Editorial Global RH, 2023',
  },
  {
    icon: '🎤',
    title: 'Speaker TEDx',
    subtitle: '"Cuando la ética lidera la innovación"',
  },
];

const values = [
  'Ética antes que eficiencia',
  'Diversidad como motor de innovación',
  'Sostenibilidad humana, no solo financiera',
  'Liderazgo con propósito, no con poder',
];

const testimonials = [
  {
    name: 'María González',
    role: 'Directora de Talento',
    company: 'TechGlobal Inc.',
    quote:
      'Gabriela no solo nos dio una estrategia — nos devolvió el alma como organización global. Hoy operamos con propósito, no solo con KPIs.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'CEO',
    company: 'InnovataCorp',
    quote:
      'Su enfoque humanizado transformó nuestra cultura organizacional. Los resultados hablan por sí solos: 40% menos rotación y equipos más comprometidos.',
  },
  {
    name: 'Ana Rodríguez',
    role: 'VP People & Culture',
    company: 'GlobalTech',
    quote:
      'Gabriela entiende que detrás de cada métrica hay personas reales. Su metodología es rigurosa pero profundamente empática.',
  },
];

export default function SobreMiPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            Gabriela García Cortés
          </p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 leading-tight max-w-3xl mx-auto">
            Mi viaje: de lo local a lo global, sin perder lo humano
          </h1>
          <p className="text-base md:text-lg font-light text-gray-300 max-w-2xl mx-auto">
            No soy solo una consultora — soy una puente entre lo estratégico y lo profundamente humano en el trabajo.
          </p>
        </div>
      </section>

      {/* Why I Do What I Do */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-[#F3F4F6] border-4 border-[#EEC073] shadow-lg">
                <Image
                  src="/images/gabriela-about_me.jpg"
                  alt="Foto de Gabriela García Cortés, experta global en recursos humanos"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-6">
                Por qué hago lo que hago
              </h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                Comencé en una oficina pequeña, con recursos limitados pero una convicción
                inquebrantable: las personas son el alma de toda organización. Hoy, guío
                transformaciones en más de 30 países — pero sigo empezando cada proyecto
                preguntando: <em>"¿Qué necesitan las personas aquí?"</em>
              </p>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8">
                Mi enfoque combina rigor académico con empatía práctica. No diseño políticas
                — diseño experiencias humanas que escalan globalmente sin perder su esencia local.
              </p>
              <ul className="space-y-3" aria-label="Valores profesionales">
                {values.map((value) => (
                  <li key={value} className="flex items-center gap-3 text-sm text-gray-700">
                    <span
                      className="w-5 h-5 rounded-full bg-[#EEC073] flex items-center justify-center flex-shrink-0"
                      aria-hidden="true"
                    >
                      <svg className="w-3 h-3 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-10 text-center">
            Experiencia y Formación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div
                key={cred.title}
                className="bg-white rounded-lg p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <span
                  className="text-2xl flex-shrink-0 w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  {cred.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#23354F]">{cred.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cred.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-10 text-center">
            Lo que dicen mis clientes
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
                {/* Stars */}
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
            ¿Listo para transformar tu organización desde lo humano?
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Agenda una consulta gratuita de 30 minutos y exploremos juntos tu próximo paso.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-8 py-3 rounded transition-colors"
          >
            Agendar mi consulta →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
