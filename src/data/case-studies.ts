/**
 * Evidence for each experience: results, media and "how it works" flows.
 * Keyed by the CareerNode id in ./career.ts.
 *
 * RULES
 * - `results` holds REAL figures only, supplied by Leo. Never estimate or invent.
 * - `media` files live in /public/work/. Screenshots, GIFs or short MP4/WebM clips.
 * - `flow` steps come from facts in the resume; they render as an animated diagram.
 */
import type { Localized } from '../i18n/ui';

export interface Result {
  /** The figure itself, e.g. "92%", "40+", "3×". */
  value: string;
  label: Localized;
}

export interface Media {
  type: 'image' | 'video';
  src: string;
  alt: Localized;
  /** Poster frame for videos. */
  poster?: string;
}

export interface FlowStep {
  label: Localized;
  /** Small technical note under the label, e.g. the tool used. */
  note?: string;
}

export interface CaseLink {
  kind: 'live' | 'repo' | 'paper';
  url: string;
}

export interface CaseStudy {
  results?: Result[];
  media?: Media[];
  flow?: FlowStep[];
  /** Marks a flow that describes planned work, not delivered work. */
  flowPlanned?: boolean;
  links?: CaseLink[];
}

const s = (en: string, pt: string = en): Localized => ({ en, pt });

export const caseStudies: Record<string, CaseStudy> = {
  'water-quality': {
    flow: [
      { label: s('Sensor probe', 'Sonda de sensores'), note: 'Arduino, C++' },
      { label: s('pH and water readings', 'pH e leituras da água') },
      { label: s('Quality classification', 'Classificação da qualidade'), note: 'scikit-learn' },
      { label: s('Results dashboard', 'Painel de resultados'), note: 'Streamlit' },
    ],
  },
  'ocean-forecasting': {
    flow: [
      { label: s('Scientific and NASA data', 'Dados científicos e da NASA') },
      { label: s('Integration and preprocessing', 'Integração e pré-processamento'), note: 'pandas' },
      { label: s('Model experiments', 'Experimentos com modelos'), note: 'PyTorch, TensorFlow' },
      { label: s('Extreme event forecasts', 'Previsão de eventos extremos') },
    ],
  },
  'petrobras-classifier': {
    flow: [
      { label: s('Scientific articles', 'Artigos científicos') },
      { label: s('TF-IDF features', 'Features TF-IDF') },
      { label: s('Ensemble model', 'Modelo ensemble'), note: 'XGBoost, Decision Trees, Naive Bayes' },
      { label: s('Relevance label', 'Rótulo de relevância') },
      { label: s('Review interface', 'Interface de revisão'), note: 'Streamlit' },
    ],
  },
  'petrobras-rag': {
    flow: [
      { label: s('Selected papers', 'Artigos selecionados') },
      { label: s('Embeddings', 'Embeddings') },
      { label: s('Vector search', 'Busca vetorial'), note: 'pgvector' },
      { label: s('Language model', 'Modelo de linguagem'), note: 'Vercel AI SDK' },
      { label: s('Answer with references', 'Resposta com referências') },
    ],
  },
  'petrobras-visualization': {
    media: [
      {
        type: 'image',
        src: '/work/petrobras-visualization.jpg',
        alt: s(
          'Explorador AIA home page: digital technologies associated with environmental impact assessment.',
          'Página inicial do Explorador AIA: tecnologias digitais associadas à avaliação de impacto ambiental.',
        ),
      },
    ],
    flow: [
      { label: s('Literature and datasets', 'Literatura e bases de dados') },
      { label: s('Background pipelines', 'Pipelines em segundo plano'), note: 'Inngest' },
      { label: s('Structured storage', 'Armazenamento estruturado'), note: 'PostgreSQL' },
      { label: s('Graphs and charts', 'Grafos e gráficos'), note: 'Next.js' },
    ],
    links: [{ kind: 'live', url: 'https://resultados-aia.vercel.app/' }],
  },
  healthcare: {
    flow: [
      { label: s('Clinic web app', 'App web da clínica'), note: 'React, Cloudflare Pages' },
      { label: s('HTTPS proxy', 'Proxy HTTPS'), note: 'Caddy' },
      { label: s('REST API', 'API REST'), note: 'Go' },
      { label: s('Report service', 'Serviço de relatórios'), note: 'Python' },
      { label: s('DOCX reports and files', 'Relatórios DOCX e arquivos'), note: 'PostgreSQL, S3' },
    ],
  },
  thesis: {
    flow: [
      { label: s('Title, abstract, keywords', 'Título, resumo, palavras-chave') },
      { label: s('TF-IDF vectors', 'Vetores TF-IDF') },
      { label: s('Cosine similarity', 'Similaridade do cosseno') },
      { label: s('Ranked evaluators', 'Avaliadores ranqueados'), note: 'FastAPI, Next.js' },
    ],
  },
  'research-portal': {
    media: [
      {
        type: 'image',
        src: '/work/research-portal.jpg',
        alt: s(
          'Somos Oceano home page: an observation system for monitoring ocean health.',
          'Página inicial do Somos Oceano: sistema de observação para monitoramento da saúde do oceano.',
        ),
      },
    ],
    flow: [
      { label: s('Research data entry', 'Cadastro de dados de pesquisa') },
      { label: s('Admin and audit', 'Administração e auditoria') },
      { label: s('Database', 'Banco de dados'), note: 'PostgreSQL, Neon' },
      { label: s('Maps, charts, downloads', 'Mapas, gráficos, downloads'), note: 'Next.js, Vercel' },
    ],
    links: [{ kind: 'live', url: 'https://projeto-oceano-five.vercel.app/' }],
  },
  'trust-gtw': {
    flow: [
      { label: s('Client telemetry', 'Telemetria dos clientes'), note: 'OTLP over gRPC' },
      { label: s('Access check', 'Validação de acesso'), note: 'Amazon Cognito' },
      { label: s('Go collector', 'Coletor em Go'), note: 'goroutines, channels' },
      { label: s('Streaming', 'Envio contínuo'), note: 'Kinesis Data Firehose' },
      { label: s('Ingestion on AWS', 'Ingestão na AWS') },
    ],
  },
  masters: {
    flowPlanned: true,
    flow: [
      { label: s('Regulators and sources', 'Órgãos reguladores e fontes'), note: 'e.g. IBAMA' },
      { label: s('Data integration', 'Integração de dados') },
      { label: s('NLP, RAG, GraphRAG') },
      { label: s('Decision support', 'Suporte à decisão') },
    ],
  },
};
