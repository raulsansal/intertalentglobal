import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { RECURSOS } from '@/app/lib/data/recursos';
import RecursosFilter from './RecursosFilter';

export const metadata: Metadata = {
  title: 'Recursos | Intertalent Global',
  description:
    'Descarga plantillas, checklists, guías y dashboards de RH global. Herramientas prácticas basadas en casos reales, diseñadas para implementar desde hoy.',
  openGraph: {
    title: 'Recursos Gratuitos de RH Global | Intertalent Global',
    description:
      'Herramientas para transformar tu RH global. Descarga recursos prácticos, basados en casos reales.',
    images: ['/images/og-recursos.jpg'],
  },
};

export default function RecursosPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            Recursos Gratuitos
          </p>
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Herramientas para transformar tu RH global
          </h1>
          <p className="text-base md:text-lg font-light text-gray-300 max-w-2xl mx-auto">
            Descarga recursos prácticos, basados en casos reales, diseñados para implementar
            desde hoy — sin teoría vacía.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <RecursosFilter recursos={RECURSOS} />

      {/* Newsletter CTA */}
      <section className="bg-[#23354F] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-3xl mb-4 block" aria-hidden="true">🎁</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Quieres recibir recursos exclusivos cada mes?
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Suscríbete a la newsletter y obtén plantillas, checklists y análisis que no comparto en público.
          </p>
          <Link
            href="/blog#newsletter"
            className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-8 py-3 rounded transition-colors"
          >
            Suscribirme y recibir recursos →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
