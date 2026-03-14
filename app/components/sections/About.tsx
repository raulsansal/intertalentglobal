import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "50K+", label: "Profesionales impactados" },
  { value: "25", label: "Países" },
];

export default function About() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Photo */}
        <div className="flex-shrink-0 w-64 h-80 md:w-72 md:h-96 relative rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/gabriela-about.jpg"
            alt="Gabriela García Cortés"
            fill
            className="object-cover object-top"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#23354F] mb-1">
            Gabriela García Cortés
          </h2>
          <p className="text-[#EEC073] font-semibold text-sm mb-4">
            Experta Global en Recursos Humanos
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-lg">
            Con más de 15 años de experiencia transformando organizaciones a nivel global, he liderado iniciativas de RH que han impactado a más de 50,000 profesionales en 25 países.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-[#23354F]">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/sobre-mi"
            className="inline-block bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors"
          >
            Conoce Mi Historia
          </Link>
        </div>
      </div>
    </section>
  );
}
