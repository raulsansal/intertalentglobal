import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#23354F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
        {/* Text content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            INTERTALENT GLOBAL
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6 leading-snug">
            Talento sin fronteras.<br />
            Liderazgo en evolución.
          </p>
          <p className="text-sm md:text-base text-gray-300 mb-10 max-w-md leading-relaxed">
            Transformando organizaciones a través de estrategias innovadoras de recursos humanos que trascienden fronteras y culturas.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/servicios"
              className="border border-white text-white hover:bg-white hover:text-[#23354F] font-medium text-sm px-6 py-3 rounded transition-colors"
            >
              Explora Soluciones
            </Link>
            <Link
              href="/recursos"
              className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-6 py-3 rounded transition-colors"
            >
              Ver Recursos
            </Link>
          </div>
        </div>

        {/* Profile image */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#EEC073] relative">
            <Image
              src="/images/gabriela-hero.jpg"
              alt="Gabriela García Cortés"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="text-center">
            <p className="font-semibold text-base">Gabriela García Cortés</p>
            <p className="text-xs text-gray-300">RH Global Expert</p>
          </div>
        </div>
      </div>
    </section>
  );
}
