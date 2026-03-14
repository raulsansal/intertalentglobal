'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Por favor ingresa un correo válido.');
      return;
    }
    setError('');
    // TODO: connect to email service (Resend or similar)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" aria-live="polite" className="text-center py-8">
        <div
          className="w-14 h-14 rounded-full bg-[#EEC073] flex items-center justify-center mx-auto mb-4"
          aria-hidden="true"
        >
          <svg className="w-7 h-7 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#23354F] mb-2">¡Mensaje enviado!</h3>
        <p className="text-sm text-gray-500">Te responderé en menos de 48 horas.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-label="Formulario de contacto"
      noValidate
    >
      <div>
        <label htmlFor="contact-name" className="block text-xs font-semibold text-[#23354F] mb-1">
          Nombre completo <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
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
        <label htmlFor="contact-email" className="block text-xs font-semibold text-[#23354F] mb-1">
          Correo profesional <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
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

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-[#23354F] mb-1">
          Mensaje <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Cuéntame sobre tu desafío en RH global..."
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073] resize-none"
        />
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full border border-[#23354F] text-[#23354F] hover:bg-[#23354F] hover:text-white font-semibold text-sm py-3 rounded transition-colors"
      >
        Enviar mensaje
      </button>
    </form>
  );
}
