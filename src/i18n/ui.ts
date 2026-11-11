export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];

/** A value that exists in every supported language. */
export type Localized<T = string> = Record<Locale, T>;

export const ui = {
  en: {
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.contact': 'Contact',
    'nav.language': 'Language',
    'experience.title': 'Experience',
    'experience.intro':
      'From ocean research to production software. Pick a stop on the timeline to see what I built, how it works and what came out of it.',
    'experience.timeline': 'Career timeline',
    'experience.ongoing': 'Ongoing',
    'experience.projects': 'Projects',
    'experience.overview': 'Overview',
    'experience.how': 'How it works',
    'experience.planned': 'Planned direction, in progress',
    'experience.results': 'Results',
    'experience.link.live': 'Open live site',
    'experience.link.repo': 'Source code',
    'experience.link.paper': 'Read the paper',
    'experience.tech': 'Built with',
    'experience.subprojectOf': 'Part of',
    'education.title': 'Education',
    'contact.title': 'Let’s talk',
    'contact.body':
      'The best way to reach me is a message on LinkedIn. My code and side projects are on GitHub.',
    'contact.linkedin': 'Message me on LinkedIn',
    'contact.github': 'See my code on GitHub',
    'footer.built': 'Static site built with Astro and React Flow.',
  },
  pt: {
    'nav.experience': 'Experiência',
    'nav.education': 'Formação',
    'nav.contact': 'Contato',
    'nav.language': 'Idioma',
    'experience.title': 'Experiência',
    'experience.intro':
      'Da pesquisa oceânica ao software em produção. Escolha uma parada na linha do tempo para ver o que construí, como funciona e o que resultou disso.',
    'experience.timeline': 'Linha do tempo da carreira',
    'experience.ongoing': 'Em andamento',
    'experience.projects': 'Projetos',
    'experience.overview': 'Visão geral',
    'experience.how': 'Como funciona',
    'experience.planned': 'Direção planejada, em andamento',
    'experience.results': 'Resultados',
    'experience.link.live': 'Abrir site',
    'experience.link.repo': 'Código-fonte',
    'experience.link.paper': 'Ler o artigo',
    'experience.tech': 'Tecnologias',
    'experience.subprojectOf': 'Parte de',
    'education.title': 'Formação',
    'contact.title': 'Vamos conversar',
    'contact.body':
      'A melhor forma de falar comigo é uma mensagem no LinkedIn. Meu código e projetos pessoais estão no GitHub.',
    'contact.linkedin': 'Falar comigo no LinkedIn',
    'contact.github': 'Ver meu código no GitHub',
    'footer.built': 'Site estático feito com Astro e React Flow.',
  },
} satisfies Record<Locale, Record<string, string>>;

export type UIKey = keyof (typeof ui)['en'];
export type UIStrings = Record<UIKey, string>;

export function t(lang: Locale) {
  return (key: UIKey) => ui[lang][key];
}
