import type { Localized } from '../i18n/ui';

export const profile = {
  name: 'Leonardo Sanner',
  headline: {
    en: 'Software engineer',
    pt: 'Engenheiro de software',
  } satisfies Localized,
  location: {
    en: 'São Paulo, Brazil',
    pt: 'São Paulo, Brasil',
  } satisfies Localized,
  bio: {
    en: 'I came to software through scientific research: ocean data, environmental impact studies and machine learning. Today I build backend services, data pipelines and AI tools, from the first model to production.',
    pt: 'Cheguei ao software pela pesquisa científica: dados oceânicos, estudos de impacto ambiental e machine learning. Hoje construo serviços de backend, pipelines de dados e ferramentas de IA, do primeiro modelo até a produção.',
  } satisfies Localized,
  links: {
    github: 'https://github.com/leosanner',
    linkedin: 'https://www.linkedin.com/in/leonardo-sanner-86b27a305/',
  },
};

export interface Education {
  id: string;
  degree: Localized;
  institution: string;
  period: Localized;
  note?: Localized;
}

export const education: Education[] = [
  {
    id: 'masters',
    degree: { en: "Master's degree", pt: 'Mestrado' },
    institution: 'UNIFESP / USP',
    period: { en: 'Since Aug 2026', pt: 'Desde ago. 2026' },
    note: {
      en: 'Petrobras-funded research on decision support for environmental impact assessment.',
      pt: 'Pesquisa financiada pela Petrobras sobre suporte à decisão para avaliação de impacto ambiental.',
    },
  },
  {
    id: 'it',
    degree: { en: "Bachelor's in Information Technology", pt: 'Bacharelado em Tecnologia da Informação' },
    institution: 'UNIVESP',
    period: { en: 'In progress', pt: 'Em andamento' },
  },
  {
    id: 'bct',
    degree: { en: "Bachelor's in Science and Technology", pt: 'Bacharelado em Ciência e Tecnologia' },
    institution: 'UNIFESP, Santos',
    period: { en: '2023 – 2025', pt: '2023 – 2025' },
    note: {
      en: 'Petroleum Engineering track. GPA 9.1 / 10. Thesis: a text-mining system that recommends academic evaluators.',
      pt: 'Trilha de Engenharia de Petróleo. Coeficiente de rendimento 9,1. TCC: sistema de mineração de texto que recomenda avaliadores acadêmicos.',
    },
  },
];
