import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { RECURSOS, type RecursoType } from '@/app/lib/data/recursos';
import RecursoDownloadForm from './RecursoDownloadForm';
import { getAvatarUrl } from '@/app/lib/avatar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const TYPE_LABELS: Record<RecursoType, string> = {
  plantilla: 'Plantilla',
  checklist: 'Checklist',
  guia: 'Guía',
  dashboard: 'Dashboard',
};

const TYPE_BADGE_COLORS: Record<RecursoType, string> = {
  plantilla: 'bg-blue-100 text-blue-700',
  checklist: 'bg-green-100 text-green-700',
  guia: 'bg-purple-100 text-purple-700',
  dashboard: 'bg-orange-100 text-orange-700',
};

const HIGHLIGHT_ICONS = ['🌐', '⚡', '📈'];

export async function generateStaticParams() {
  return RECURSOS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recurso = RECURSOS.find((r) => r.slug === slug);
  if (!recurso) return {};
  return {
    title: `${recurso.title} | Recursos Intertalent`,
    description: recurso.description,
    openGraph: {
      title: recurso.title,
      description: recurso.description,
      images: ['/images/og-recursos.jpg'],
    },
  };
}

export default async function RecursoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recurso = RECURSOS.find((r) => r.slug === slug);

  if (!recurso) notFound();

  const typeLabel = TYPE_LABELS[recurso.type];
  const typeBadge = TYPE_BADGE_COLORS[recurso.type];

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#23354F] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src={recurso.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-4">
            <span className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${typeBadge}`}>
              {typeLabel}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 max-w-3xl leading-tight">
            {recurso.title}
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mb-6 leading-relaxed">{recurso.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#EEC073]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {recurso.downloadCount} descargas
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#EEC073]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Actualizado: {recurso.updatedDate}
            </span>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative w-full h-64 md:h-96 bg-[#F3F4F6] rounded-lg overflow-hidden shadow-md mb-6">
            <Image
              src={recurso.previewImage}
              alt={`Vista previa del contenido: ${recurso.title} — ${typeLabel} descargable`}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center text-sm text-gray-500">
            Diseñado en Excel/Google Sheets — listo para usar, personalizable y con instrucciones paso a paso.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#23354F] mb-10 text-center">
            No es solo otra herramienta — es un sistema de acción
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recurso.highlights.map((highlight, index) => {
              const [label, ...rest] = highlight.split(':');
              const body = rest.join(':').trim();
              return (
                <div key={highlight} className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <span className="text-3xl mb-4 block" aria-hidden="true">
                    {HIGHLIGHT_ICONS[index] ?? '✅'}
                  </span>
                  <h3 className="text-sm font-bold text-[#23354F] mb-2">{label}</h3>
                  {body && <p className="text-xs text-gray-500 leading-relaxed">{body}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-[#F3F4F6] rounded-lg p-6">
            <Image
              src={getAvatarUrl(recurso.testimonial.author, 56)}
              alt={`Foto de perfil de ${recurso.testimonial.author}`}
              width={56}
              height={56}
              className="rounded-full flex-shrink-0"
            />
            <div>
              <blockquote>
                <p className="text-base md:text-lg font-light text-[#23354F] italic leading-relaxed mb-4">
                  "{recurso.testimonial.quote}"
                </p>
                <footer className="text-sm text-gray-500">
                  <strong className="text-[#23354F]">{recurso.testimonial.author}</strong>
                  {' '}· {recurso.testimonial.role}, {recurso.testimonial.company}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <RecursoDownloadForm recursoTitle={recurso.title} typeLabel={typeLabel} />

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#23354F] mb-8 text-center">Preguntas comunes</h2>
          <dl className="space-y-6">
            {recurso.faq.map((item) => (
              <div key={item.question} className="border-b border-gray-100 pb-6">
                <dt className="text-sm font-bold text-[#23354F] mb-2">{item.question}</dt>
                <dd className="text-sm text-gray-600 leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="bg-[#23354F] py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Prefieres una demo personalizada?
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Agendemos 15 minutos para mostrarte cómo adaptar este recurso a tu organización.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-8 py-3 rounded transition-colors"
          >
            Agendar una sesión de 15 minutos
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
