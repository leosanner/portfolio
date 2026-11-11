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
    'experience.title': 'The route so far',
    'experience.intro':
      'From ocean research to production software. Select a stop to see what I built there.',
    'experience.empty': 'Select a stop on the route to see the details.',
    'experience.close': 'Close details',
    'experience.ongoing': 'Ongoing',
    'experience.projects': 'projects',
    'experience.showProjects': 'Show the 3 projects',
    'experience.highlights': 'What I worked on',
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
    'experience.title': 'A rota até aqui',
    'experience.intro':
      'Da pesquisa oceânica ao software em produção. Selecione uma parada para ver o que construí ali.',
    'experience.empty': 'Selecione uma parada na rota para ver os detalhes.',
    'experience.close': 'Fechar detalhes',
    'experience.ongoing': 'Em andamento',
    'experience.projects': 'projetos',
    'experience.showProjects': 'Ver os 3 projetos',
    'experience.highlights': 'No que trabalhei',
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
