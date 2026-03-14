'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Recurso, type RecursoType } from '@/app/lib/data/recursos';

interface RecursosFilterProps {
  recursos: Recurso[];
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

const ALL_TYPES: RecursoType[] = ['plantilla', 'checklist', 'guia', 'dashboard'];

export default function RecursosFilter({ recursos }: RecursosFilterProps) {
  const [activeFilter, setActiveFilter] = useState<RecursoType | null>(null);

  const filtered = activeFilter ? recursos.filter((r) => r.type === activeFilter) : recursos;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mr-2">
            Explora por tipo:
          </p>
          <button
            onClick={() => setActiveFilter(null)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
              activeFilter === null
                ? 'bg-[#23354F] text-white border-[#23354F]'
                : 'border-gray-300 text-gray-600 hover:border-[#23354F]'
            }`}
            aria-pressed={activeFilter === null}
          >
            Todos
          </button>
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                activeFilter === type
                  ? 'bg-[#23354F] text-white border-[#23354F]'
                  : 'border-gray-300 text-gray-600 hover:border-[#23354F]'
              }`}
              aria-pressed={activeFilter === type}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((recurso) => (
            <article
              key={recurso.slug}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative w-full h-48 bg-[#F3F4F6]">
                <Image
                  src={recurso.image}
                  alt={`Vista previa del recurso: ${recurso.title}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${TYPE_BADGE_COLORS[recurso.type]}`}
                  >
                    {TYPE_LABELS[recurso.type]}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#23354F] mb-2 leading-snug">{recurso.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{recurso.description}</p>
                <div className="mt-4">
                  <Link
                    href={`/recursos/${recurso.slug}`}
                    className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-5 py-2 rounded transition-colors"
                  >
                    Descargar {TYPE_LABELS[recurso.type].toLowerCase()}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
