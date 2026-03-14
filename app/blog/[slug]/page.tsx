import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { POSTS, type ContentType } from '@/app/lib/data/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog Intertalent`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: ['/images/og-blog.jpg'],
    },
  };
}

const TYPE_BADGE: Record<ContentType, { label: string; classes: string }> = {
  articulo: { label: 'Artículo', classes: 'bg-blue-100 text-blue-700' },
  podcast: { label: 'Podcast', classes: 'bg-yellow-100 text-yellow-700' },
  recurso: { label: 'Recurso', classes: 'bg-green-100 text-green-700' },
  legal: { label: 'Legal', classes: 'bg-red-100 text-red-700' },
  video: { label: 'Video', classes: 'bg-purple-100 text-purple-700' },
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug && p.dimension === post.dimension).slice(0, 3);
  const fallbackRelated = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const relatedPosts = related.length > 0 ? related : fallbackRelated;

  const badge = TYPE_BADGE[post.type];

  return (
    <main>
      <Navbar />

      {/* Article Hero */}
      <section className="bg-[#23354F] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-4">
            <span className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EEC073] flex items-center justify-center text-xs font-bold text-[#23354F]">
                G
              </div>
              <span>{post.author}</span>
            </div>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} min de lectura</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-6">
          {post.content ? (
            <div
              className="
                prose prose-sm md:prose-base max-w-none
                prose-headings:text-[#23354F] prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-strong:text-[#23354F]
                prose-blockquote:border-l-4 prose-blockquote:border-[#EEC073] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:my-1
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-500 italic">Contenido no disponible para este tipo de entrada.</p>
          )}

          {/* Mid-article CTA */}
          <div className="my-12 bg-[#FEF3C7] border border-[#EEC073] rounded-lg p-6">
            <h3 className="text-base font-bold text-[#23354F] mb-2">
              ¿Quieres implementar esto en tu organización?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Descarga recursos prácticos o agenda una consulta personalizada con Gabriela.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/recursos"
                className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-5 py-2 rounded transition-colors"
              >
                Descargar recursos gratuitos
              </Link>
              <Link
                href="/recursos"
                className="border border-[#23354F] text-[#23354F] hover:bg-[#23354F] hover:text-white font-medium text-sm px-5 py-2 rounded transition-colors"
              >
                Ver todos los recursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="bg-[#F3F4F6] py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#F3F4F6] overflow-hidden flex-shrink-0 relative border-2 border-[#EEC073]">
              <Image
                src="/images/og-sobre-mi.jpg"
                alt="Foto de perfil de Gabriela García Cortés, autora del artículo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#EEC073] mb-1">
                Sobre la autora
              </p>
              <h3 className="text-base font-bold text-[#23354F] mb-1">{post.author}</h3>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                Experta global en Recursos Humanos con más de 15 años transformando organizaciones en 20+ países.
                PhD en Gestión Organizacional (Harvard). Fundadora de Intertalent Global.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Perfil de LinkedIn de Gabriela García Cortés"
                  className="text-gray-400 hover:text-[#23354F] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Perfil de Twitter de Gabriela García Cortés"
                  className="text-gray-400 hover:text-[#23354F] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#23354F] mb-8">Sigue explorando</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relBadge = TYPE_BADGE[related.type];
                return (
                  <article
                    key={related.slug}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                  >
                    <div className="relative w-full h-40 bg-[#F3F4F6]">
                      <Image
                        src={related.image}
                        alt={`Imagen ilustrativa para: ${related.title}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide self-start mb-2 ${relBadge.classes}`}
                      >
                        {relBadge.label}
                      </span>
                      <h3 className="text-sm font-bold text-[#23354F] leading-snug flex-1">{related.title}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">{related.readTime} min</span>
                        <Link
                          href={`/blog/${related.slug}`}
                          className="text-xs font-medium text-[#23354F] hover:text-[#EEC073] transition-colors"
                        >
                          Leer →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
