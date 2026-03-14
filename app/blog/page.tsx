import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Newsletter from '@/app/components/sections/Newsletter';
import { POSTS, DIMENSIONS, type ContentType } from '@/app/lib/data/blog';

export const metadata: Metadata = {
  title: 'Blog | Intertalent Global',
  description:
    'Cinco dimensiones para liderar el talento del futuro — con ética, datos y humanidad.',
  openGraph: {
    title: 'El Pulso Global de RH | Intertalent Global',
    description:
      'Cinco dimensiones para liderar el talento del futuro — con ética, datos y humanidad.',
    images: ['/images/og-blog.jpg'],
  },
};

const TYPE_BADGE: Record<ContentType, { label: string; classes: string }> = {
  articulo: { label: 'Artículo', classes: 'bg-blue-100 text-blue-700' },
  podcast: { label: 'Podcast', classes: 'bg-yellow-100 text-yellow-700' },
  recurso: { label: 'Recurso', classes: 'bg-green-100 text-green-700' },
  legal: { label: 'Legal', classes: 'bg-red-100 text-red-700' },
  video: { label: 'Video', classes: 'bg-purple-100 text-purple-700' },
};

function TypeBadge({ type }: { type: ContentType }) {
  const badge = TYPE_BADGE[type];
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${badge.classes}`}>
      {badge.label}
    </span>
  );
}

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const recent = POSTS.filter((p) => !p.featured);

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            El Pulso Global de RH
          </p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            El Pulso Global de RH
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-300 max-w-2xl mx-auto">
            Cinco dimensiones para liderar el talento del futuro — con ética, datos y humanidad.
          </p>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="search"
              placeholder="Busca 'IA ética', 'bienestar global', 'GDPR en LATAM'..."
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
              aria-label="Buscar artículos"
            />
            <select
              className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
              aria-label="Filtrar por dimensión"
              defaultValue=""
            >
              <option value="">Todas las dimensiones</option>
              {DIMENSIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
              aria-label="Filtrar por formato"
              defaultValue=""
            >
              <option value="">Todos los formatos</option>
              <option value="articulo">Artículo</option>
              <option value="podcast">Podcast</option>
              <option value="recurso">Recurso</option>
              <option value="legal">Legal</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>
      </section>

      {/* Las 5 Dimensiones */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-[#23354F] mb-8">Las 5 Dimensiones</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {DIMENSIONS.map((dim) => (
              <div key={dim.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full border-4 ${dim.color} bg-[#F3F4F6] flex items-center justify-center text-2xl`}
                  aria-hidden="true"
                >
                  {dim.icon}
                </div>
                <p className="text-xs font-medium text-[#23354F] max-w-[90px] text-center leading-tight">
                  {dim.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos Destacados */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-8">Artículos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                <div className="relative w-full h-48 bg-[#F3F4F6]">
                  <Image
                    src={post.image}
                    alt={`Imagen ilustrativa para el artículo: ${post.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <TypeBadge type={post.type} />
                  </div>
                  <h3 className="text-base font-bold text-[#23354F] mb-2 leading-snug">{post.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{post.readTime} min lectura</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="w-8 h-8 rounded-full bg-[#EEC073] hover:bg-[#d4a455] flex items-center justify-center transition-colors"
                      aria-label={`Leer artículo: ${post.title}`}
                    >
                      <svg className="w-4 h-4 text-[#23354F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos Análisis */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#23354F]">Últimos Análisis</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-[#23354F] hover:text-[#EEC073] transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recent.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-4 p-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-[#F3F4F6] rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={`Imagen ilustrativa para: ${post.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="mb-1">
                      <TypeBadge type={post.type} />
                    </div>
                    <h3 className="text-sm font-bold text-[#23354F] leading-snug mt-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <span>{post.readTime} min</span>
                    <span>·</span>
                    <span>{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="ml-auto text-[#23354F] hover:text-[#EEC073] font-medium transition-colors"
                    >
                      Leer →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      <Footer />
    </main>
  );
}
