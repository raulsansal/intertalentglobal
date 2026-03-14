const resources = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "Framework de Upskilling",
    description: "Guía completa para diseñar programas de desarrollo de habilidades.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Framework Bienestar Organizacional",
    description: "Evalúa y mejora el bienestar de tus equipos.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Guía DEI Global",
    description: "Implementa diversidad e inclusión en organizaciones multinacionales.",
  },
];

export default function Recursos() {
  return (
    <section className="bg-[#23354F] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Recursos Gratuitos
          </h2>
          <p className="text-sm text-gray-300">
            Herramientas y plantillas para potenciar tu gestión de RH
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className="bg-[#1F2937] rounded-lg p-6 flex flex-col gap-4"
            >
              <div className="text-[#EEC073]">{resource.icon}</div>
              <h3 className="font-bold text-white text-base">{resource.title}</h3>
              <p className="text-sm text-gray-400 flex-1">{resource.description}</p>
              <button className="bg-[#EEC073] hover:bg-[#d4a455] text-[#23354F] font-semibold text-sm px-5 py-2 rounded transition-colors w-fit">
                Descargar Gratis
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
