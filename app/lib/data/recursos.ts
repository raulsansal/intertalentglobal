export type RecursoType = 'plantilla' | 'checklist' | 'guia' | 'dashboard';

export interface Recurso {
  slug: string;
  title: string;
  description: string;
  type: RecursoType;
  image: string;
  previewImage: string;
  downloadCount: string;
  updatedDate: string;
  highlights: string[];
  faq: { question: string; answer: string }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const RECURSOS: Recurso[] = [
  {
    slug: 'framework-bienestar-organizacional',
    title: 'Framework de Upskilling Ético',
    description:
      'Guía paso a paso para desarrollar habilidades futuras sin dejar a nadie atrás. Incluye matriz de priorización y métricas de impacto.',
    type: 'plantilla',
    image: '/images/recurso-upskilling.jpg',
    previewImage: '/images/recurso-upskilling-preview.jpg',
    downloadCount: '+2,500',
    updatedDate: '1 Mar 2024',
    highlights: [
      'Enfoque global: adaptado a 5 regiones con métricas culturalmente relevantes',
      'Acción inmediata: cada indicador incluye 3 estrategias prácticas para implementar en 48 horas',
      'Medición sostenible: tablero automático que muestra tendencias mensuales y alertas tempranas',
    ],
    faq: [
      { question: '¿Es compatible con Google Sheets?', answer: 'Sí, incluye versión para Excel y Google Sheets.' },
      {
        question: '¿Necesito conocimientos técnicos?',
        answer: 'No, está diseñada para profesionales de RH sin experiencia en datos.',
      },
      {
        question: '¿Puedo usarlo en mi consultoría?',
        answer: 'Sí, con atribución a "Talento Sin Fronteras".',
      },
    ],
    testimonial: {
      quote:
        'Gracias a este framework, redujimos el burnout en un 38% en solo 4 meses — y los líderes ahora hablan de bienestar como prioridad estratégica, no como beneficio.',
      author: 'Ana Martínez',
      role: 'CHRO',
      company: 'FutureLeaders',
    },
  },
  {
    slug: 'checklist-bienestar-laboral-global',
    title: 'Checklist de Bienestar Laboral Global',
    description:
      '12 acciones verificables para implementar programas de bienestar en equipos remotos y presenciales, adaptadas a 5 regiones.',
    type: 'checklist',
    image: '/images/recurso-checklist.jpg',
    previewImage: '/images/recurso-checklist-preview.jpg',
    downloadCount: '+1,800',
    updatedDate: '15 Feb 2024',
    highlights: [
      'Adaptado para equipos remotos e híbridos',
      '12 acciones verificables con criterios de éxito',
      'Versión en español, inglés y portugués',
    ],
    faq: [
      {
        question: '¿Está disponible en inglés?',
        answer: 'Sí, incluye versiones en español, inglés y portugués.',
      },
      {
        question: '¿Es gratuito?',
        answer: 'Completamente gratuito para uso profesional con registro.',
      },
    ],
    testimonial: {
      quote:
        'En 2 semanas de implementar el checklist, nuestra encuesta de bienestar mejoró 15 puntos. Simple pero transformador.',
      author: 'Roberto Lima',
      role: 'Head of People',
      company: 'LatamTech',
    },
  },
  {
    slug: 'guia-ia-etica-seleccion',
    title: 'Guía de IA Ética en Selección',
    description:
      'Cómo auditar tus algoritmos de reclutamiento para garantizar equidad, transparencia y cumplimiento legal.',
    type: 'guia',
    image: '/images/recurso-ia-etica.jpg',
    previewImage: '/images/recurso-ia-preview.jpg',
    downloadCount: '+950',
    updatedDate: '20 Feb 2024',
    highlights: [
      'Auditoría de 12 puntos para algoritmos de selección',
      'Marco legal actualizado: GDPR, AI Act europeo y regulaciones LATAM',
      'Casos reales de sesgos algorítmicos y cómo evitarlos',
    ],
    faq: [
      {
        question: '¿Es aplicable a cualquier ATS?',
        answer: 'Sí, los principios son independientes de la plataforma.',
      },
      { question: '¿Incluye ejemplos reales?', answer: 'Sí, incluye 5 casos de estudio anonimizados.' },
    ],
    testimonial: {
      quote:
        'Esta guía nos ayudó a identificar 3 sesgos críticos en nuestro proceso de selección que no habíamos detectado.',
      author: 'Patricia Flores',
      role: 'TA Manager',
      company: 'GlobalHire',
    },
  },
  {
    slug: 'dashboard-people-analytics',
    title: 'Dashboard de People Analytics',
    description:
      'Plantilla lista para usar con KPIs clave: rotación, engagement, diversidad, ROI de capacitación.',
    type: 'dashboard',
    image: '/images/recurso-dashboard.jpg',
    previewImage: '/images/recurso-dashboard-preview.jpg',
    downloadCount: '+1,200',
    updatedDate: '10 Mar 2024',
    highlights: [
      'KPIs predefinidos: rotación, engagement, diversidad, ROI',
      'Visualizaciones automáticas con gráficos interactivos',
      'Fácil importación de datos desde cualquier HRIS',
    ],
    faq: [
      {
        question: '¿Requiere Excel avanzado?',
        answer: 'Nivel intermedio es suficiente. Incluye tutorial en video.',
      },
      {
        question: '¿Se actualiza automáticamente?',
        answer: 'Sí, una vez conectado a tu fuente de datos.',
      },
    ],
    testimonial: {
      quote:
        'Por primera vez podemos mostrar el impacto de RH en números que el CEO entiende. Game changer total.',
      author: 'Mónica Vega',
      role: 'HR Director',
      company: 'MultiLatam',
    },
  },
];
