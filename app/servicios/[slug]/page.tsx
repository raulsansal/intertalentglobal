'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { use } from 'react';
import Navbar from '@/app/components/layout/Navbar';
import { getAvatarUrl } from '@/app/lib/avatar';
import Footer from '@/app/components/layout/Footer';
import { SERVICIOS } from '@/app/lib/data/servicios';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EMPLOYEE_RANGES = ['1–50', '51–200', '201–1,000', '1,000+'] as const;

export default function ServicioDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const servicio = SERVICIOS.find((s) => s.slug === slug);

  if (!servicio) notFound();

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <span
              className={`text-4xl w-20 h-20 rounded-2xl ${servicio.color} flex items-center justify-center flex-shrink-0`}
              aria-hidden="true"
            >
              {servicio.icon}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-3">
                Servicio
              </p>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 leading-tight">
                {servicio.title}
              </h1>
              <p className="text-base text-gray-300 max-w-2xl leading-relaxed">
                {servicio.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#23354F] mb-6">Descripción completa</h2>
              <p className="text-base text-gray-700 leading-relaxed mb-8">{servicio.fullDescription}</p>

              {/* Results */}
              <div className="bg-[#F3F4F6] rounded-lg p-6">
                <h3 className="text-sm font-bold text-[#23354F] uppercase tracking-wide mb-4">
                  Resultados que lograrás
                </h3>
                <ul className="space-y-3" aria-label={`Resultados del servicio ${servicio.title}`}>
                  {servicio.results.map((result) => (
                    <li key={result} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 text-[#EEC073] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Service Image */}
            <div className="flex-shrink-0 w-full md:w-80">
              <div className="relative w-full h-64 md:h-80 bg-[#F3F4F6] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={servicio.image}
                  alt={`Imagen ilustrativa del servicio: ${servicio.title}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {servicio.caseStudies.length > 0 && (
        <section className="bg-[#F3F4F6] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-10 text-center">
              Casos de Éxito
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicio.caseStudies.map((c) => (
                <div
                  key={c.client}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-8 mb-4">
                    <div>
                      <p className="text-xl font-bold text-[#23354F]">{c.metric1}</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#23354F]">{c.metric2}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-3">
                    Cliente:{' '}
                    <span className="text-[#23354F] font-bold">{c.client}</span>
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-6">
            Testimonio
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-[#F3F4F6] rounded-lg p-6 text-left">
            <Image
              src={getAvatarUrl(servicio.testimonial.author, 56)}
              alt={`Foto de perfil de ${servicio.testimonial.author}`}
              width={56}
              height={56}
              className="rounded-full flex-shrink-0"
            />
            <blockquote>
              <p className="text-lg md:text-xl font-light text-[#23354F] italic leading-relaxed mb-4">
                "{servicio.testimonial.quote}"
              </p>
              <footer className="text-sm text-gray-500">
                <strong className="text-[#23354F]">{servicio.testimonial.author}</strong>
                {' '}· {servicio.testimonial.role}, {servicio.testimonial.company}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Proposal Form */}
      <ProposalForm serviceTitle={servicio.title} />

      <Footer />
    </main>
  );
}

function ProposalForm({ serviceTitle }: { serviceTitle: string }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    employees: '',
    country: '',
    challenge: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to email service (Resend or similar)
    setSubmitted(true);
  }

  return (
    <section className="bg-[#F3F4F6] py-16" id="propuesta">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-3">
            Solicita tu propuesta
          </h2>
          <p className="text-sm text-gray-500">
            Cuéntanos tu desafío y recibirás una propuesta personalizada para{' '}
            <strong>{serviceTitle}</strong> en menos de 24 horas.
          </p>
        </div>

        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="bg-white rounded-lg p-8 text-center shadow-sm"
          >
            <div
              className="w-14 h-14 rounded-full bg-[#EEC073] flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <svg className="w-7 h-7 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#23354F] mb-2">¡Solicitud enviada!</h3>
            <p className="text-sm text-gray-500">
              Te responderemos en menos de 24 horas con una propuesta personalizada.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 shadow-sm space-y-5"
            aria-label="Formulario de solicitud de propuesta"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-[#23354F] mb-1">
                  Nombre completo <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#23354F] mb-1">
                  Correo profesional <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@empresa.com"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="company" className="block text-xs font-semibold text-[#23354F] mb-1">
                  Empresa <span aria-hidden="true">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Nombre de tu empresa"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
                />
              </div>
              <div>
                <label htmlFor="employees" className="block text-xs font-semibold text-[#23354F] mb-1">
                  Número de empleados
                </label>
                <select
                  id="employees"
                  name="employees"
                  value={form.employees}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
                >
                  <option value="">Selecciona un rango</option>
                  {EMPLOYEE_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-xs font-semibold text-[#23354F] mb-1">
                País
              </label>
              <input
                id="country"
                name="country"
                type="text"
                autoComplete="country-name"
                value={form.country}
                onChange={handleChange}
                placeholder="País o región de tu organización"
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
              />
            </div>

            <div>
              <label htmlFor="challenge" className="block text-xs font-semibold text-[#23354F] mb-1">
                Descripción del desafío <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="challenge"
                name="challenge"
                required
                rows={4}
                value={form.challenge}
                onChange={handleChange}
                placeholder="Cuéntanos sobre tu mayor desafío en RH global..."
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073] resize-none"
              />
            </div>

            <p className="text-xs text-gray-400">
              Te responderemos en menos de 24 horas con una propuesta personalizada.
            </p>

            <button
              type="submit"
              className="w-full bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm py-3 rounded transition-colors"
            >
              Enviar solicitud
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link href="/servicios" className="text-xs text-gray-400 hover:text-[#23354F] transition-colors">
            ← Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
