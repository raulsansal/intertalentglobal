export type ContentType = 'articulo' | 'podcast' | 'recurso' | 'legal' | 'video';

export type Dimension =
  | 'vision-estrategica'
  | 'desarrollo-humano'
  | 'desarrollo-organizacional'
  | 'legalidad-etica'
  | 'herramientas-tecnologia';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  type: ContentType;
  dimension: Dimension;
  readTime: number; // minutes
  date: string; // "15 Mar 2024"
  image: string;
  featured: boolean;
  content: string; // HTML string
  author: string;
}

export const DIMENSIONS = [
  { id: 'vision-estrategica', label: 'Visión Estratégica', icon: '🌐', color: 'border-blue-400' },
  { id: 'desarrollo-humano', label: 'Desarrollo Humano', icon: '💚', color: 'border-green-400' },
  { id: 'desarrollo-organizacional', label: 'Desarrollo Organizacional', icon: '📊', color: 'border-purple-400' },
  { id: 'legalidad-etica', label: 'Legalidad y Ética', icon: '⚖️', color: 'border-red-400' },
  { id: 'herramientas-tecnologia', label: 'Herramientas y Tecnología', icon: '💡', color: 'border-teal-400' },
] as const;

export const POSTS: Post[] = [
  {
    slug: 'futuro-trabajo-hibrido-estrategias-2024',
    title: 'El Futuro del Trabajo Híbrido: Estrategias para 2024',
    excerpt:
      'Análisis profundo de las tendencias globales en trabajo remoto y presencial, con frameworks prácticos para líderes de RH.',
    type: 'articulo',
    dimension: 'vision-estrategica',
    readTime: 8,
    date: '15 Mar 2024',
    image: '/images/blog-hibrido.jpg',
    featured: true,
    author: 'Gabriela García Cortés',
    content: `
      <blockquote>"El trabajo híbrido ya no es una opción — es la nueva normalidad. Pero la mayoría de las organizaciones están gestionando un modelo híbrido fragmentado, no intencionado."</blockquote>
      <p>En 2024, el 78% de las empresas globales operan con algún modelo híbrido. Sin embargo, solo el 23% ha diseñado una <strong>estrategia coherente</strong> que equilibre productividad, equidad, bienestar y cultura. El resto improvisa — y paga el precio en desconfianza, desconcierto y burnout silencioso.</p>
      <h2>1. El mito de la "igualdad de condiciones"</h2>
      <p>Muchas empresas asumen que, si todos tienen laptop y Zoom, están en igualdad. Error. Un estudio de Gartner (2023) reveló que los empleados que trabajan <strong>más de 3 días presenciales</strong> tienen un 42% más de visibilidad ante líderes, lo que impacta directamente en promociones y proyectos clave.</p>
      <blockquote>"La equidad híbrida no se logra con tecnología — se diseña con intención"</blockquote>
      <h2>2. Tres pilares de un modelo híbrido con alma</h2>
      <p>Basado en mi trabajo con 12 organizaciones globales, estos son los cimientos no negociables:</p>
      <ul>
        <li><strong>Propósito compartido, no solo política</strong>: No digas "trabajamos 2 días en oficina". Di "Nos reunimos los martes y jueves para co-crear, conectar y celebrar."</li>
        <li><strong>Métricas de experiencia, no solo productividad</strong>: Sentimiento de pertenencia (encuestas mensuales), equidad de participación, bienestar sostenible.</li>
        <li><strong>Flexibilidad cultural, no solo geográfica</strong>: Un equipo en México, con alguien en Polonia, otro en Singapur.</li>
      </ul>
      <h2>3. Caso real: cómo TechGlobal redujo la rotación en un 35%</h2>
      <p>TechGlobal, con 2,000 empleados en 15 países, enfrentaba una rotación del 29% en su talento remoto. Su solución:</p>
      <ol>
        <li>Diagnóstico con people analytics</li>
        <li>Rediseño de rituales híbridos</li>
        <li>Liderazgo distribuido</li>
      </ol>
      <h2>Conclusión: El híbrido no es un lugar — es una promesa</h2>
      <p>El futuro del trabajo híbrido no se trata de cuántos días estás en la oficina. Se trata de <strong>cómo construyes organizaciones donde cada persona, sin importar dónde esté, pueda contribuir con todo su potencial</strong>.</p>
    `,
  },
  {
    slug: 'ia-etica-rh-guia-practica-implementacion',
    title: 'IA Ética en RH: Guía Práctica para Implementación',
    excerpt:
      'Conversación con expertos sobre cómo implementar inteligencia artificial manteniendo principios éticos en la gestión del talento.',
    type: 'podcast',
    dimension: 'legalidad-etica',
    readTime: 25,
    date: '12 Mar 2024',
    image: '/images/blog-ia-etica.jpg',
    featured: true,
    author: 'Gabriela García Cortés',
    content: '',
  },
  {
    slug: 'framework-bienestar-organizacional-2024',
    title: 'Framework de Bienestar Organizacional 2024',
    excerpt:
      'Recurso descargable con métricas, indicadores y estrategias para medir y mejorar el bienestar en equipos globales.',
    type: 'recurso',
    dimension: 'desarrollo-humano',
    readTime: 5,
    date: '10 Mar 2024',
    image: '/images/blog-bienestar.jpg',
    featured: true,
    author: 'Gabriela García Cortés',
    content: '',
  },
  {
    slug: 'gdpr-latam-nuevas-regulaciones-privacidad',
    title: 'GDPR en LATAM: Nuevas Regulaciones de Privacidad',
    excerpt: 'Análisis del impacto de las regulaciones europeas en las prácticas de RH latinoamericanas.',
    type: 'legal',
    dimension: 'legalidad-etica',
    readTime: 6,
    date: '8 Mar 2024',
    image: '/images/blog-gdpr.jpg',
    featured: false,
    author: 'Gabriela García Cortés',
    content: `<p>El GDPR europeo está teniendo un impacto significativo en las organizaciones latinoamericanas que manejan datos de ciudadanos europeos o que aspiran a operar en mercados globales.</p>`,
  },
  {
    slug: 'upskilling-global-casos-exito-multinacionales',
    title: 'Upskilling Global: Casos de Éxito en Multinacionales',
    excerpt: 'Webinar con líderes de Google, Microsoft y Unilever sobre programas de desarrollo de talento.',
    type: 'video',
    dimension: 'desarrollo-humano',
    readTime: 35,
    date: '5 Mar 2024',
    image: '/images/blog-upskilling.jpg',
    featured: false,
    author: 'Gabriela García Cortés',
    content: '',
  },
  {
    slug: 'cultura-organizacional-era-post-pandemia',
    title: 'Cultura Organizacional en la Era Post-Pandemia',
    excerpt: 'Framework para evaluar y transformar la cultura empresarial en entornos híbridos.',
    type: 'articulo',
    dimension: 'desarrollo-organizacional',
    readTime: 12,
    date: '2 Mar 2024',
    image: '/images/blog-cultura.jpg',
    featured: false,
    author: 'Gabriela García Cortés',
    content: `<p>La pandemia transformó permanentemente la forma en que entendemos la cultura organizacional. Las organizaciones que prosperan hoy son aquellas que han aprendido a cultivar cultura intencionalmente en entornos distribuidos.</p>`,
  },
  {
    slug: 'guia-herramientas-hr-tech-2024',
    title: 'Guía de Herramientas HR Tech 2024',
    excerpt: 'Guía comparativa completa de plataformas de gestión de talento, con criterios de selección.',
    type: 'recurso',
    dimension: 'herramientas-tecnologia',
    readTime: 15,
    date: '28 Feb 2024',
    image: '/images/blog-hrtech.jpg',
    featured: false,
    author: 'Gabriela García Cortés',
    content: '',
  },
];
