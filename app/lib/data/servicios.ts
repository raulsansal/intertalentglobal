export interface CaseStudy {
  client: string;
  metric1: string;
  metric2: string;
  description: string;
}

export interface Servicio {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  color: string; // tailwind color class for icon bg
  results: string[];
  image: string;
  caseStudies: CaseStudy[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const SERVICIOS: Servicio[] = [
  {
    slug: 'consultoria-rh-global',
    title: 'Consultoría en RH Global',
    shortDescription:
      'Optimiza tu gestión de talento internacional con estrategias que unifican culturas, cumplen regulaciones y maximizan el rendimiento global.',
    fullDescription:
      'Diseñamos estrategias integrales de Recursos Humanos para organizaciones que operan en múltiples países y culturas. Nuestro enfoque combina rigor analítico con sensibilidad humana, asegurando que cada política y proceso respete tanto las regulaciones locales como la esencia de tu cultura organizacional.',
    icon: '🌐',
    color: 'bg-blue-100',
    results: [
      'Reducción de costos operativos en un 30%',
      'Alineación cultural en equipos multiregionales',
      'Cumplimiento legal en 15+ jurisdicciones',
    ],
    image: '/images/servicio-consultoria.jpg',
    caseStudies: [
      {
        client: 'TechGlobal Inc.',
        metric1: '↓35% rotación',
        metric2: '↑28% productividad',
        description:
          'Diseñamos un programa de desarrollo de líderes con enfoque intercultural, adaptado a 5 regiones, con métricas de impacto en tiempo real.',
      },
      {
        client: 'InnovateCorp',
        metric1: '↓22% costos',
        metric2: '↑90% precisión en predicción',
        description:
          'Implementamos un dashboard de análisis de talento que permitió decisiones proactivas en reclutamiento, retención y desarrollo.',
      },
    ],
    testimonial: {
      quote:
        'Gabriela no solo nos dio una estrategia — nos devolvió el alma como organización global. Hoy operamos con propósito, no solo con KPIs.',
      author: 'María González',
      role: 'Directora de Talento',
      company: 'TechGlobal Inc.',
    },
  },
  {
    slug: 'talleres-dei',
    title: 'Talleres de DEI',
    shortDescription:
      'Transforma tu cultura organizacional con programas de diversidad que generan innovación, compromiso y resultados medibles.',
    fullDescription:
      'Los Talleres de Diversidad, Equidad e Inclusión de Intertalent van más allá de la sensibilización. Diseñamos experiencias de aprendizaje que generan cambios de comportamiento reales, con métricas claras de progreso y un acompañamiento continuo para garantizar que la inclusión sea parte del ADN organizacional.',
    icon: '🤝',
    color: 'bg-purple-100',
    results: [
      'Mayor innovación (+40% en equipos diversos)',
      'Mejor clima laboral y retención',
      'Métricas claras de progreso en inclusión',
    ],
    image: '/images/servicio-dei.jpg',
    caseStudies: [
      {
        client: 'GlobalTech',
        metric1: '↑45% líderes mujeres',
        metric2: '↑32% innovación',
        description:
          'Implementamos un programa integral de DEI que transformó la cultura de liderazgo y aceleró el desarrollo de talento diverso.',
      },
    ],
    testimonial: {
      quote:
        'Gracias a los talleres de DEI, hoy el 45% de nuestros líderes son mujeres y nuestra innovación ha crecido exponencialmente.',
      author: 'Carlos Rodríguez',
      role: 'CPO',
      company: 'InnovateCorp',
    },
  },
  {
    slug: 'programas-liderazgo-global',
    title: 'Programas de Liderazgo Global',
    shortDescription:
      'Desarrolla líderes capaces de inspirar equipos multiculturales y navegar la complejidad de los negocios globales.',
    fullDescription:
      'Nuestros programas de liderazgo combinan la más avanzada investigación en neurociencia del liderazgo con la riqueza de la experiencia práctica en entornos multiculturales. Formamos líderes que no solo gestionan — inspiran, conectan y transforman organizaciones desde adentro.',
    icon: '⭐',
    color: 'bg-yellow-100',
    results: [
      'Líderes con competencias interculturales',
      'Sucesión efectiva y pipeline de talento',
      'Engagement del 85% en equipos liderados',
    ],
    image: '/images/servicio-liderazgo.jpg',
    caseStudies: [
      {
        client: 'StartUpGlobal',
        metric1: '↓35% rotación',
        metric2: '↑141% engagement',
        description:
          'Desarrollamos un programa de liderazgo distribuido que permitió a los equipos autogestionar su crecimiento con guías, no con reglas rígidas.',
      },
    ],
    testimonial: {
      quote:
        'Su enfoque humanizado transformó nuestra cultura organizacional. Los resultados hablan por sí solos: 40% menos rotación y equipos más comprometidos.',
      author: 'Carlos Mendoza',
      role: 'CEO',
      company: 'InnovateCorp',
    },
  },
  {
    slug: 'people-analytics',
    title: 'Implementación de People Analytics',
    shortDescription:
      'Convierte datos en decisiones estratégicas con sistemas de análisis que predicen tendencias y optimizan el rendimiento.',
    fullDescription:
      'La era del instinto en RH ha terminado. Con People Analytics, transformamos datos dispersos en inteligencia organizacional accionable. Implementamos dashboards, modelos predictivos y sistemas de alerta temprana que permiten a los líderes de RH anticiparse a los desafíos antes de que se conviertan en crisis.',
    icon: '📊',
    color: 'bg-green-100',
    results: [
      'Decisiones basadas en datos reales',
      'Predicción de rotación con 90% de precisión',
      'ROI medible en 6 meses',
    ],
    image: '/images/servicio-analytics.jpg',
    caseStudies: [
      {
        client: 'TechGlobal Inc.',
        metric1: '↓22% costos HR',
        metric2: '↑90% precisión predictiva',
        description:
          'Implementamos un dashboard completo de People Analytics que redujo el tiempo de toma de decisiones de RH de semanas a horas.',
      },
    ],
    testimonial: {
      quote:
        'La implementación de people analytics nos permitió reducir la rotación en un 35% y tomar decisiones basadas en datos reales.',
      author: 'David Kim',
      role: 'CEO',
      company: 'StartUp Global',
    },
  },
];
