/**
 * Career route content. Rendered by src/components/CareerRoute.tsx.
 * Rules carried over from the interview brief: no invented metrics, keep copy short,
 * planned work (master's) is never presented as delivered.
 */
import type { Localized } from '../i18n/ui';
import type { Affiliation } from './orgs';

export type CareerKind = 'research' | 'consulting' | 'thesis' | 'job' | 'masters' | 'subproject';

export interface CareerNode {
  id: string;
  kind: CareerKind;
  title: Localized;
  category: Localized;
  period?: Localized;
  ongoing?: boolean;
  org?: string;
  /** Funders, universities and companies involved. Subprojects inherit their parent's. */
  affiliations?: Affiliation[];
  parentId?: string;
  childIds?: string[];
  summary: Localized;
  highlights: Localized<string[]>;
  techTitle?: Localized;
  tech: string[];
}

export const mainNodes: CareerNode[] = [
  {
    id: 'water-quality',
    kind: 'research',
    title: { en: 'Water quality monitoring', pt: 'Monitoramento da qualidade da água' },
    category: { en: 'Funded research (CNPq)', pt: 'Iniciação científica (CNPq)' },
    period: { en: '~3 months', pt: '~3 meses' },
    org: 'UNIFESP',
    affiliations: [{ org: 'cnpq', role: 'funding' }, { org: 'unifesp', role: 'university' }],
    summary: {
      en: 'Built a sensor-based water quality prototype for the Port of Santos and explored machine learning classification.',
      pt: 'Construí um protótipo com sensores para monitorar a qualidade da água no Porto de Santos e explorei classificação com machine learning.',
    },
    highlights: {
      en: ['Arduino sensor probe', 'Water quality classification', 'Local results dashboard'],
      pt: ['Sonda de sensores com Arduino', 'Classificação da qualidade da água', 'Painel local de resultados'],
    },
    tech: ['Arduino', 'C++', 'Python', 'scikit-learn', 'pandas', 'Matplotlib', 'Streamlit'],
  },
  {
    id: 'ocean-forecasting',
    kind: 'research',
    title: { en: 'Extreme ocean events forecasting', pt: 'Previsão de eventos oceânicos extremos' },
    category: { en: 'Research study', pt: 'Estudo de pesquisa' },
    period: { en: '~6 months', pt: '~6 meses' },
    org: 'UNIFESP',
    affiliations: [{ org: 'unifesp', role: 'university' }],
    summary: {
      en: 'Explored predictive models for extreme ocean events using scientific datasets and NASA data.',
      pt: 'Explorei modelos preditivos para eventos oceânicos extremos com bases científicas e dados da NASA.',
    },
    highlights: {
      en: ['Data integration and preprocessing', 'Model training and experiments', 'Statistical learning'],
      pt: ['Integração e pré-processamento de dados', 'Treino e experimentos com modelos', 'Aprendizado estatístico'],
    },
    tech: ['Python', 'Jupyter', 'PyTorch', 'TensorFlow', 'scikit-learn'],
  },
  {
    id: 'petrobras',
    kind: 'research',
    title: { en: 'Petrobras digital innovation', pt: 'Inovação digital Petrobras' },
    category: { en: 'Petrobras-funded research fellowship', pt: 'Bolsa de pesquisa financiada pela Petrobras' },
    period: { en: '~1 year', pt: '~1 ano' },
    org: 'UNIFESP / USP',
    childIds: ['petrobras-classifier', 'petrobras-rag', 'petrobras-visualization'],
    affiliations: [{ org: 'petrobras', role: 'funding' }, { org: 'unifesp', role: 'university' }, { org: 'usp', role: 'university' }],
    summary: {
      en: 'Built AI tools for analysing, searching and exploring scientific literature on environmental impact.',
      pt: 'Desenvolvi ferramentas de IA para analisar, consultar e explorar literatura científica sobre impacto ambiental.',
    },
    highlights: {
      en: ['Article classification', 'Retrieval-augmented generation', 'Interactive visualizations'],
      pt: ['Classificação de artigos', 'Geração aumentada por recuperação', 'Visualizações interativas'],
    },
    tech: [],
  },
  {
    id: 'healthcare',
    kind: 'consulting',
    title: { en: 'Healthcare management platform', pt: 'Plataforma de gestão para saúde' },
    category: { en: 'Software engineering consulting', pt: 'Consultoria em engenharia de software' },
    period: { en: '~1 year', pt: '~1 ano' },
    ongoing: true,
    summary: {
      en: 'One platform for the clinic–client lifecycle, from user management to automated documents and reports.',
      pt: 'Uma plataforma para todo o ciclo clínica–cliente, da gestão de usuários à geração automática de documentos e relatórios.',
    },
    highlights: {
      en: [
        'Go REST API with a Python report service',
        'Automated DOCX reports from PDFs, forms and spreadsheets',
        'React frontend on Cloudflare Pages',
        'VPS deploy with Caddy, HTTPS and CI/CD',
      ],
      pt: [
        'API REST em Go com serviço de relatórios em Python',
        'Relatórios DOCX automáticos a partir de PDFs, formulários e planilhas',
        'Frontend React no Cloudflare Pages',
        'Deploy em VPS com Caddy, HTTPS e CI/CD',
      ],
    },
    tech: ['Go', 'Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'AWS S3', 'GitHub Actions'],
  },
  {
    id: 'thesis',
    kind: 'thesis',
    title: { en: 'Academic evaluator recommendation', pt: 'Recomendação de avaliadores acadêmicos' },
    category: { en: 'Undergraduate thesis', pt: 'Trabalho de conclusão de curso' },
    period: { en: 'Delivered Jan 2026', pt: 'Entregue em jan. 2026' },
    org: 'UNIFESP',
    affiliations: [{ org: 'unifesp', role: 'university' }],
    summary: {
      en: 'A web app that uses text mining to recommend evaluators for a thesis from its title, abstract and keywords.',
      pt: 'Aplicação web que usa mineração de texto para recomendar avaliadores a partir do título, resumo e palavras-chave do trabalho.',
    },
    highlights: {
      en: ['Text mining and NLP', 'Content-based recommendations', 'Referenced results'],
      pt: ['Mineração de texto e NLP', 'Recomendação baseada em conteúdo', 'Resultados com referências'],
    },
    tech: ['Python', 'Next.js', 'FastAPI', 'TF-IDF', 'Cosine similarity', 'scikit-learn'],
  },
  {
    id: 'research-portal',
    kind: 'consulting',
    title: { en: 'Interactive research data portal', pt: 'Portal interativo de dados de pesquisa' },
    category: { en: 'Software engineering consulting', pt: 'Consultoria em engenharia de software' },
    period: { en: 'May – Nov 2026', pt: 'Mai. – nov. 2026' },
    summary: {
      en: 'A public portal for exploring research data, theses and dissertations through charts and maps.',
      pt: 'Portal público para explorar dados de pesquisa, teses e dissertações com gráficos e mapas.',
    },
    highlights: {
      en: ['Interactive charts and statistics', 'Geospatial exploration', 'Admin area with audit and data entry'],
      pt: ['Gráficos e estatísticas interativos', 'Exploração geoespacial', 'Área administrativa com auditoria e cadastro de dados'],
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Neon', 'Vercel'],
  },
  {
    id: 'trust-gtw',
    kind: 'job',
    title: { en: 'Software engineer', pt: 'Engenheiro de software' },
    category: { en: 'Industry', pt: 'Mercado' },
    period: { en: 'Since Jul 2026', pt: 'Desde jul. 2026' },
    ongoing: true,
    org: 'Trust GTW',
    affiliations: [{ org: 'trust-gtw', role: 'company' }],
    summary: {
      en: 'Building a Go telemetry collector that receives client data over OpenTelemetry, validates it and forwards it to ingestion on AWS.',
      pt: 'Desenvolvo um coletor de telemetria em Go que recebe dados de clientes via OpenTelemetry, valida e encaminha para ingestão na AWS.',
    },
    highlights: {
      en: [
        'OTLP over gRPC',
        'Streaming to Kinesis Data Firehose',
        'Client auth with Amazon Cognito',
        'Concurrency and graceful shutdown',
      ],
      pt: [
        'OTLP sobre gRPC',
        'Envio contínuo para o Kinesis Data Firehose',
        'Autenticação de clientes com Amazon Cognito',
        'Concorrência e graceful shutdown',
      ],
    },
    tech: ['Go', 'gRPC', 'OpenTelemetry', 'AWS Kinesis', 'Amazon Cognito'],
  },
  {
    id: 'masters',
    kind: 'masters',
    title: { en: 'Data-driven decision support', pt: 'Suporte à decisão orientado a dados' },
    category: { en: "Petrobras-funded master's research", pt: 'Mestrado financiado pela Petrobras' },
    period: { en: 'Since Aug 2026', pt: 'Desde ago. 2026' },
    ongoing: true,
    org: 'UNIFESP / USP',
    affiliations: [{ org: 'petrobras', role: 'funding' }, { org: 'unifesp', role: 'university' }, { org: 'usp', role: 'university' }],
    summary: {
      en: 'A platform that turns data from different sources and regulators into accessible knowledge for environmental impact assessment.',
      pt: 'Plataforma que transforma dados de diferentes fontes e órgãos reguladores em conhecimento acessível para avaliação de impacto ambiental.',
    },
    highlights: {
      en: ['Data integration', 'NLP and text mining', 'RAG and GraphRAG', 'Business analytics'],
      pt: ['Integração de dados', 'NLP e mineração de texto', 'RAG e GraphRAG', 'Business analytics'],
    },
    techTitle: { en: 'Planned direction', pt: 'Direção planejada' },
    tech: ['AWS', 'Java', 'Spring Boot', 'React', 'LocalStack'],
  },
];

export const subprojectNodes: CareerNode[] = [
  {
    id: 'petrobras-classifier',
    kind: 'subproject',
    parentId: 'petrobras',
    title: { en: 'Scientific article classifier', pt: 'Classificador de artigos científicos' },
    category: { en: 'Petrobras research project', pt: 'Projeto de pesquisa Petrobras' },
    period: { en: 'Oct 2025 – Jun 2026', pt: 'Out. 2025 – jun. 2026' },
    summary: {
      en: 'Classifies scientific articles by relevance to environmental impact assessment, to speed up large literature reviews.',
      pt: 'Classifica artigos científicos por relevância para avaliação de impacto ambiental, acelerando revisões bibliográficas grandes.',
    },
    highlights: {
      en: ['TF-IDF features', 'Ensemble classification', 'Cross-validation and F1-score', 'Streamlit interface'],
      pt: ['Features TF-IDF', 'Classificação com ensemble', 'Validação cruzada e F1-score', 'Interface em Streamlit'],
    },
    tech: ['Python', 'scikit-learn', 'XGBoost', 'Streamlit', 'Azure Blob Storage'],
  },
  {
    id: 'petrobras-rag',
    kind: 'subproject',
    parentId: 'petrobras',
    title: { en: 'Scientific literature RAG', pt: 'RAG de literatura científica' },
    category: { en: 'Petrobras research project', pt: 'Projeto de pesquisa Petrobras' },
    period: { en: 'Mar – Jul 2026', pt: 'Mar. – jul. 2026' },
    summary: {
      en: 'Answers natural-language questions over selected papers, with every answer grounded in cited sources.',
      pt: 'Responde perguntas em linguagem natural sobre artigos selecionados, sempre com base nas fontes citadas.',
    },
    highlights: {
      en: ['Vector search with pgvector', 'Referenced answers', 'Token and cost tracking per answer', 'Safe replies when evidence is missing'],
      pt: ['Busca vetorial com pgvector', 'Respostas com referências', 'Controle de tokens e custo por resposta', 'Respostas seguras sem evidência suficiente'],
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'pgvector', 'Vercel AI SDK'],
  },
  {
    id: 'petrobras-visualization',
    kind: 'subproject',
    parentId: 'petrobras',
    title: { en: 'Scientific data visualization', pt: 'Visualização de dados científicos' },
    category: { en: 'Petrobras research project', pt: 'Projeto de pesquisa Petrobras' },
    summary: {
      en: 'Makes scientific literature and related datasets explorable through knowledge graphs and interactive charts.',
      pt: 'Torna a literatura científica e seus dados exploráveis com grafos de conhecimento e gráficos interativos.',
    },
    highlights: {
      en: ['Knowledge graphs', 'Interactive charts', 'Background processing pipelines'],
      pt: ['Grafos de conhecimento', 'Gráficos interativos', 'Pipelines de processamento em segundo plano'],
    },
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Inngest'],
  },
];

export const careerById: Record<string, CareerNode> = Object.fromEntries(
  [...mainNodes, ...subprojectNodes].map((n) => [n.id, n]),
);

/** Affiliations for a node, falling back to its parent's. */
export function getAffiliations(node: CareerNode): Affiliation[] {
  return node.affiliations ?? (node.parentId ? careerById[node.parentId]?.affiliations : undefined) ?? [];
}

export function getChildren(node: CareerNode): CareerNode[] {
  return (node.childIds ?? []).map((id) => careerById[id]).filter(Boolean);
}

