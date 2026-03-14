import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { EPISODES } from '@/app/lib/data/podcast';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return EPISODES.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = EPISODES.find((e) => e.slug === slug);
  if (!episode) return {};
  return {
    title: `${episode.title} | Podcast Intertalent`,
    description: episode.description,
    openGraph: {
      title: episode.title,
      description: episode.description,
      images: ['/images/og-podcast.jpg'],
    },
  };
}

export default async function PodcastEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = EPISODES.find((e) => e.slug === slug);

  if (!episode) notFound();

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#23354F] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest bg-[#EEC073] text-[#23354F]">
              Podcast
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 max-w-3xl leading-tight">
            {episode.title}
          </h1>
          <p className="text-base text-gray-300 max-w-2xl mb-6 leading-relaxed">{episode.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Episodio {episode.episodeNumber}
            </span>
            <span>·</span>
            <span>{episode.duration}</span>
            <span>·</span>
            <span>{episode.date}</span>
          </div>
        </div>
      </section>

      {/* Player Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Cover Image */}
            <div className="flex-shrink-0 w-full md:w-64">
              <div className="relative w-full md:w-64 h-64 bg-[#F3F4F6] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={episode.image}
                  alt={`Portada del episodio ${episode.episodeNumber}: ${episode.title}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-2">
                Episodio {episode.episodeNumber}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-[#23354F] mb-4">{episode.title}</h2>

              {/* Embedded Player Placeholder */}
              <div className="w-full h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center border border-gray-200 mb-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-[#EEC073] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#23354F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="h-2 bg-gray-300 rounded w-48 mb-1" />
                    <div className="h-2 bg-gray-200 rounded w-32" />
                  </div>
                  <span className="ml-auto text-sm text-gray-500">{episode.duration}</span>
                </div>
              </div>

              {/* Platform Links */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Escuchar en:
                </p>
                <div className="flex flex-wrap gap-3">
                  {episode.platforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-300 text-[#23354F] hover:border-[#23354F] hover:bg-[#23354F] hover:text-white font-medium text-sm px-4 py-2 rounded transition-colors"
                    >
                      {platform.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Quote */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-6 text-center">
            Momento clave del episodio
          </p>
          <blockquote className="border-l-4 border-[#EEC073] pl-6 py-2">
            <p className="text-lg md:text-xl font-light text-[#23354F] italic leading-relaxed mb-4">
              {episode.keyQuote}
            </p>
            <footer className="text-sm text-gray-500">
              <strong className="text-[#23354F]">{episode.keyQuoteAuthor}</strong>
              {episode.keyQuoteRole && <span> · {episode.keyQuoteRole}</span>}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Related Resources */}
      {episode.relatedResources.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#23354F] mb-8">
              Profundiza con herramientas prácticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {episode.relatedResources.map((resource) => (
                <div
                  key={resource.slug}
                  className="border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow flex gap-4 items-start"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 bg-[#F3F4F6] rounded overflow-hidden">
                    <Image
                      src={resource.image}
                      alt={`Recurso: ${resource.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#EEC073]">
                      {resource.type}
                    </span>
                    <h3 className="text-sm font-bold text-[#23354F] mt-1 mb-2">{resource.title}</h3>
                    <Link
                      href={`/recursos/${resource.slug}`}
                      className="text-xs font-semibold text-[#23354F] hover:text-[#EEC073] transition-colors"
                    >
                      Obtener recurso →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About the Podcast */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-4">
            Sobre el podcast
          </p>
          <h2 className="text-2xl font-bold text-[#23354F] mb-4">El Pulso Global</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Conversaciones profundas sobre el futuro del trabajo, el talento global y el liderazgo humano.
            Cada episodio reúne a expertos, líderes y pensadores que están redefiniendo cómo las
            organizaciones atraen, desarrollan y retienen a las mejores personas del mundo — sin importar
            dónde estén.
          </p>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="bg-[#23354F] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Quieres recibir nuevos episodios?
          </h2>
          <p className="text-sm text-gray-300 mb-8">
            Suscríbete y recibe cada episodio directamente en tu bandeja de entrada junto con recursos exclusivos.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center" aria-label="Formulario de suscripción al podcast">
            <label htmlFor="podcast-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="podcast-email"
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 border border-gray-500 bg-white/10 text-white placeholder-gray-400 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEC073]"
            />
            <button
              type="submit"
              className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-2 rounded transition-colors"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
