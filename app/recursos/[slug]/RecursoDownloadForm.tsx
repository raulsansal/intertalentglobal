'use client';

import { useState } from 'react';

interface RecursoDownloadFormProps {
  recursoTitle: string;
  typeLabel: string;
}

export default function RecursoDownloadForm({ recursoTitle, typeLabel }: RecursoDownloadFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Por favor ingresa un correo profesional válido.');
      return;
    }
    setError('');
    // TODO: connect to email service and trigger resource delivery
    setSubmitted(true);
  }

  return (
    <section className="bg-[#23354F] py-16" id="descargar">
      <div className="max-w-xl mx-auto px-6 text-center">
        <span className="text-3xl mb-4 block" aria-hidden="true">🎁</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Obtén tu copia gratuita hoy
        </h2>
        <p className="text-sm text-gray-300 mb-8">
          Incluye: {typeLabel.toLowerCase()} editable, guía de implementación y checklist de seguimiento.
        </p>

        {submitted ? (
          <div role="status" aria-live="polite" className="bg-white/10 rounded-lg p-6">
            <p className="text-white font-semibold mb-1">¡Listo! Revisa tu bandeja de entrada.</p>
            <p className="text-sm text-gray-300">
              Enviamos <strong>{recursoTitle}</strong> a {email}.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            aria-label={`Formulario para obtener el recurso ${recursoTitle}`}
            noValidate
          >
            <div className="flex-1">
              <label htmlFor="resource-email" className="sr-only">
                Tu correo profesional
              </label>
              <input
                id="resource-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo profesional"
                required
                autoComplete="email"
                aria-describedby={error ? 'resource-email-error' : undefined}
                className="w-full border border-gray-500 bg-white/10 text-white placeholder-gray-400 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
              />
              {error && (
                <p id="resource-email-error" role="alert" className="text-xs text-red-300 mt-1 text-left">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-2 rounded transition-colors whitespace-nowrap"
            >
              Enviar recurso
            </button>
          </form>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Respetamos tu privacidad. Sin spam, solo valor.
        </p>
      </div>
    </section>
  );
}
