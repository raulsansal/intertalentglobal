import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    slug: "ia-etica-recursos-humanos",
    category: "VISIÓN ESTRATÉGICA",
    title: "IA Ética en Recursos Humanos: El Futuro es Ahora",
    excerpt:
      "Descubre cómo implementar inteligencia artificial de manera ética en tus procesos de RH.",
    image: "/images/blog-ia-etica.jpg",
  },
  {
    slug: "upskilling-global",
    category: "DESARROLLO HUMANO",
    title: "Upskilling Global: Preparando Talento para el Mañana",
    excerpt:
      "Estrategias probadas para desarrollar habilidades del futuro en equipos multiculturales.",
    image: "/images/blog-upskilling.jpg",
  },
  {
    slug: "cultura-organizacional-agil",
    category: "DESARROLLO ORGANIZACIONAL",
    title: "Cultura Organizacional Ágil: Adaptándose al Cambio",
    excerpt:
      "Cómo construir organizaciones resilientes que prosperen en la incertidumbre.",
    image: "/images/blog-cultura.jpg",
  },
];

export default function BlogCards() {
  return (
    <section className="bg-[#F3F4F6] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full bg-gray-200">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-[#EEC073] uppercase tracking-wide mb-2">
                  {article.category}
                </span>
                <h3 className="text-base font-bold text-[#23354F] mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{article.excerpt}</p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="text-sm font-medium text-[#23354F] hover:text-[#EEC073] transition-colors"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
