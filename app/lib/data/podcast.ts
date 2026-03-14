export interface PodcastEpisode {
  slug: string;
  title: string;
  description: string;
  episodeNumber: number;
  duration: string; // "25 min"
  date: string;
  image: string;
  keyQuote: string;
  keyQuoteAuthor: string;
  keyQuoteRole: string;
  embedUrl: string; // external player URL
  platforms: { name: string; url: string; icon: string }[];
  relatedResources: { title: string; type: string; slug: string; image: string }[];
}

export const EPISODES: PodcastEpisode[] = [
  {
    slug: 'ia-etica-rh-guia-practica-implementacion',
    title: 'IA Ética en RH: Guía práctica para implementación',
    description:
      'Conversación con expertos sobre cómo implementar inteligencia artificial manteniendo principios éticos en la gestión del talento.',
    episodeNumber: 7,
    duration: '25 min',
    date: '10 Mar 2024',
    image: '/images/podcast-ia-etica.jpg',
    keyQuote:
      '"La IA en RH no debe reemplazar el juicio humano — debe amplificarlo. Si tu algoritmo no puede explicar por qué rechazó a un candidato, no estás innovando: estás automatizando el sesgo."',
    keyQuoteAuthor: 'Dra. Elena Martínez',
    keyQuoteRole: 'MIT',
    embedUrl: 'https://open.spotify.com/embed/episode/placeholder',
    platforms: [
      { name: 'Spotify', url: '#', icon: 'spotify' },
      { name: 'Apple Podcasts', url: '#', icon: 'apple' },
      { name: 'Google Podcasts', url: '#', icon: 'google' },
    ],
    relatedResources: [
      {
        title: 'Guía de Implementación de IA Ética en RH',
        type: 'Guía',
        slug: 'guia-ia-etica-seleccion',
        image: '/images/recurso-ia-etica.jpg',
      },
      {
        title: 'Auditoría de IA Ética para tu organización',
        type: 'Consultoría',
        slug: 'consultoria-rh-global',
        image: '/images/recurso-auditoria.jpg',
      },
    ],
  },
  {
    slug: 'futuro-trabajo-sin-fronteras',
    title: 'El Futuro del Trabajo Sin Fronteras',
    description:
      'Exploramos cómo las organizaciones globales están redefiniendo el trabajo remoto con un enfoque humano.',
    episodeNumber: 6,
    duration: '32 min',
    date: '25 Feb 2024',
    image: '/images/podcast-trabajo.jpg',
    keyQuote:
      '"La verdadera globalización del talento no se mide en husos horarios, sino en la capacidad de crear pertenencia sin proximidad."',
    keyQuoteAuthor: 'Gabriela García Cortés',
    keyQuoteRole: 'Intertalent Global',
    embedUrl: 'https://open.spotify.com/embed/episode/placeholder2',
    platforms: [
      { name: 'Spotify', url: '#', icon: 'spotify' },
      { name: 'Apple Podcasts', url: '#', icon: 'apple' },
      { name: 'Google Podcasts', url: '#', icon: 'google' },
    ],
    relatedResources: [
      {
        title: 'Framework de Bienestar Organizacional 2024',
        type: 'Plantilla',
        slug: 'framework-bienestar-organizacional',
        image: '/images/recurso-bienestar.jpg',
      },
    ],
  },
];
