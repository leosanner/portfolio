/**
 * Evidence for each experience: results, the problem, what was built, technical
 * details, stack, media and "how it works" flows. Keyed by the CareerNode id in ./career.ts.
 *
 * RULES
 * - `results` holds REAL figures only, supplied by Leo. Never estimate or invent.
 * - `outcomes` are real, qualitative results taken from Leo's resume or his own words.
 * - `built` / `details` restate facts from the resume; no invented rationale.
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

export interface StackLayer {
  layer: Localized;
  items: string[];
}

export interface CaseStudy {
  /** Numeric results. Real figures only. */
  results?: Result[];
  /** Qualitative results, stated plainly. */
  outcomes?: Localized[];
  /** The situation before the work, one or two sentences. */
  problem?: Localized;
  /** What was built, one item per contribution. Falls back to the node's highlights. */
  built?: Localized<string[]>;
  /** Technical specifics worth calling out. */
  details?: Localized<string[]>;
  /** Technologies grouped by layer. Falls back to the node's flat tech list. */
  stack?: StackLayer[];
  media?: Media[];
  flow?: FlowStep[];
  /** Marks a flow that describes planned work, not delivered work. */
  flowPlanned?: boolean;
  links?: CaseLink[];
}

const s = (en: string, pt: string = en): Localized => ({ en, pt });
const list = (en: string[], pt: string[]): Localized<string[]> => ({ en, pt });
const layer = (en: string, pt: string, items: string[]): StackLayer => ({ layer: s(en, pt), items });

export const caseStudies: Record<string, CaseStudy> = {
  'water-quality': {
    problem: s(
      'Water quality in the Port of Santos needed a low-cost way to be measured and classified.',
      'A qualidade da água no Porto de Santos precisava de uma forma de baixo custo para ser medida e classificada.',
    ),
    stack: [
      layer('Hardware', 'Hardware', ['Arduino', 'C++']),
      layer('Data and ML', 'Dados e ML', ['Python', 'pandas', 'scikit-learn']),
      layer('Interface', 'Interface', ['Streamlit', 'Matplotlib']),
    ],
    flow: [
      { label: s('Sensor probe', 'Sonda de sensores'), note: 'Arduino, C++' },
      { label: s('pH and water readings', 'pH e leituras da água') },
      { label: s('Quality classification', 'Classificação da qualidade'), note: 'scikit-learn' },
      { label: s('Results dashboard', 'Painel de resultados'), note: 'Streamlit' },
    ],
  },
  'ocean-forecasting': {
    stack: [
      layer('Data', 'Dados', ['Python', 'Jupyter']),
      layer('Models', 'Modelos', ['PyTorch', 'TensorFlow', 'scikit-learn']),
    ],
    flow: [
      { label: s('Scientific and NASA data', 'Dados científicos e da NASA') },
      { label: s('Integration and preprocessing', 'Integração e pré-processamento'), note: 'pandas' },
      { label: s('Model experiments', 'Experimentos com modelos'), note: 'PyTorch, TensorFlow' },
      { label: s('Extreme event forecasts', 'Previsão de eventos extremos') },
    ],
  },
  petrobras: {
    outcomes: [s('Selected research products secured internal investment.', 'Produtos selecionados da pesquisa receberam investimento interno.')],
    problem: s(
      'Environmental impact assessment depends on large volumes of scientific literature that take a long time to screen, read and explore.',
      'A avaliação de impacto ambiental depende de grandes volumes de literatura científica, que levam muito tempo para triar, ler e explorar.',
    ),
    built: list(
      [
        'A classifier that screens articles by relevance',
        'A RAG app that answers questions over selected papers, with references',
        'A visual explorer with knowledge graphs and interactive charts',
      ],
      [
        'Um classificador que faz a triagem de artigos por relevância',
        'Uma aplicação RAG que responde perguntas sobre artigos selecionados, com referências',
        'Um explorador visual com grafos de conhecimento e gráficos interativos',
      ],
    ),
  },
  'petrobras-classifier': {
    problem: s(
      'Literature reviews for environmental impact assessment return a large volume of results that had to be screened for relevance.',
      'Revisões bibliográficas para avaliação de impacto ambiental retornam um grande volume de resultados que precisavam ser triados por relevância.',
    ),
    built: list(
      [
        'A machine learning tool that labels scientific articles as relevant or not for environmental impact assessment',
        'A TF-IDF pipeline feeding an ensemble of XGBoost, Decision Trees and Naive Bayes',
        'A visual interface on Streamlit Cloud, integrated with Azure Blob Storage',
      ],
      [
        'Ferramenta de machine learning que classifica artigos científicos como relevantes ou não para avaliação de impacto ambiental',
        'Pipeline TF-IDF alimentando um ensemble de XGBoost, Decision Trees e Naive Bayes',
        'Interface visual no Streamlit Cloud, integrada ao Azure Blob Storage',
      ],
    ),
    details: list(
      [
        'Comparative experiments with embeddings and Transformers',
        'Evaluated with cross-validation, accuracy, F1-score and confusion matrices',
      ],
      [
        'Experimentos comparativos com embeddings e Transformers',
        'Avaliado com validação cruzada, acurácia, F1-score e matriz de confusão',
      ],
    ),
    stack: [
      layer('Machine learning', 'Machine learning', ['scikit-learn', 'XGBoost', 'TF-IDF']),
      layer('Experiments', 'Experimentos', ['Embeddings', 'Transformers']),
      layer('Interface and storage', 'Interface e armazenamento', ['Streamlit', 'Streamlit Cloud', 'Azure Blob Storage']),
    ],
    flow: [
      { label: s('Scientific articles', 'Artigos científicos') },
      { label: s('TF-IDF features', 'Features TF-IDF') },
      { label: s('Ensemble model', 'Modelo ensemble'), note: 'XGBoost, Decision Trees, Naive Bayes' },
      { label: s('Relevance label', 'Rótulo de relevância') },
      { label: s('Review interface', 'Interface de revisão'), note: 'Streamlit' },
    ],
  },
  'petrobras-rag': {
    outcomes: [
      s(
        'Researchers ask questions in plain language instead of reading dozens of papers by hand.',
        'Pesquisadores fazem perguntas em linguagem natural em vez de ler dezenas de artigos manualmente.',
      ),
      s('Every answer cites the papers it came from.', 'Toda resposta cita os artigos de onde veio.'),
    ],
    problem: s(
      'Answering a question about a set of retrieved papers meant reading dozens of documents by hand.',
      'Responder uma pergunta sobre um conjunto de artigos recuperados exigia ler dezenas de documentos manualmente.',
    ),
    built: list(
      [
        'A Next.js and TypeScript app for natural-language questions over papers that were already retrieved and filtered',
        'A RAG flow with embeddings in PostgreSQL/pgvector and language models through the Vercel AI SDK',
      ],
      [
        'Aplicação em Next.js e TypeScript para perguntas em linguagem natural sobre artigos já recuperados e filtrados',
        'Fluxo de RAG com embeddings em PostgreSQL/pgvector e modelos de linguagem via Vercel AI SDK',
      ],
    ),
    details: list(
      [
        'Users choose which group of articles a question runs against',
        'Token use and estimated cost tracked for every answer',
        'Audit trail and context control',
        'A safe reply when there is not enough evidence to answer',
      ],
      [
        'O usuário escolhe o grupo de artigos usado em cada pergunta',
        'Uso de tokens e custo estimado registrados em cada resposta',
        'Auditoria e controle de contexto',
        'Resposta segura quando não há evidência suficiente',
      ],
    ),
    stack: [
      layer('App', 'Aplicação', ['Next.js', 'TypeScript']),
      layer('Retrieval', 'Recuperação', ['PostgreSQL', 'pgvector', 'Embeddings']),
      layer('Language models', 'Modelos de linguagem', ['Vercel AI SDK']),
    ],
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
    stack: [
      layer('App', 'Aplicação', ['Next.js', 'TypeScript']),
      layer('Data', 'Dados', ['PostgreSQL', 'Inngest']),
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
    outcomes: [
      s('A reporting process that used to be manual now runs automatically.', 'Um processo de relatórios antes manual agora roda de forma automática.'),
      s('Less manual rework and more consistent documents.', 'Menos retrabalho manual e documentos mais padronizados.'),
      s('Room for a higher volume of work.', 'Espaço para um volume maior de atendimentos.'),
    ],
    problem: s(
      'The clinic produced its reports by hand from PDFs, text files, forms and spreadsheets, and its day-to-day information was spread across tools.',
      'A clínica produzia relatórios manualmente a partir de PDFs, arquivos de texto, formulários e planilhas, e suas informações do dia a dia estavam espalhadas em várias ferramentas.',
    ),
    built: list(
      [
        'A management system that brings admin routines, the client interface and internal information into one app',
        'A Go REST API on PostgreSQL/Neon in production, with authentication through Clerk',
        'Python and Streamlit flows that extract, filter and standardise data from PDFs, TXT files, Google Forms and Google Sheets',
        'Automatic final reports in DOCX, generated from templates',
      ],
      [
        'Sistema de gestão que reúne rotinas administrativas, interface para clientes e informações internas em uma só aplicação',
        'API REST em Go sobre PostgreSQL/Neon em produção, com autenticação via Clerk',
        'Fluxos em Python e Streamlit que extraem, filtram e padronizam dados de PDFs, arquivos TXT, Google Forms e Google Sheets',
        'Relatórios finais automáticos em DOCX, gerados a partir de templates',
      ],
    ),
    details: list(
      [
        'React and Vite frontend on Cloudflare Pages',
        'Backend on a VPS behind Caddy for reverse proxy and HTTPS',
        'Internal service that emails system status and health',
      ],
      [
        'Frontend em React e Vite no Cloudflare Pages',
        'Backend em VPS atrás do Caddy, com proxy reverso e HTTPS',
        'Serviço interno que envia e-mails de status e saúde do sistema',
      ],
    ),
    stack: [
      layer('Frontend', 'Frontend', ['React', 'Vite', 'TypeScript']),
      layer('Backend', 'Backend', ['Go', 'Python', 'FastAPI', 'Clerk']),
      layer('Data and documents', 'Dados e documentos', ['PostgreSQL', 'Neon', 'AWS S3', 'DocxTemplate', 'Streamlit']),
      layer('Infrastructure', 'Infraestrutura', ['Cloudflare Pages', 'VPS', 'Caddy', 'GitHub Actions']),
    ],
    flow: [
      { label: s('Clinic web app', 'App web da clínica'), note: 'React, Cloudflare Pages' },
      { label: s('HTTPS proxy', 'Proxy HTTPS'), note: 'Caddy' },
      { label: s('REST API', 'API REST'), note: 'Go' },
      { label: s('Report service', 'Serviço de relatórios'), note: 'Python' },
      { label: s('DOCX reports and files', 'Relatórios DOCX e arquivos'), note: 'PostgreSQL, S3' },
    ],
  },
  thesis: {
    outcomes: [s('Delivered in January 2026.', 'Entregue em janeiro de 2026.')],
    problem: s(
      'Finding suitable evaluators for a thesis means matching its subject against many researchers by hand.',
      'Encontrar avaliadores adequados para um trabalho exige comparar o tema com muitos pesquisadores manualmente.',
    ),
    built: list(
      [
        'A text-mining engine that compares a thesis’s title, abstract and keywords with researchers’ work',
        'A web app that returns a ranked list of evaluators, with references',
      ],
      [
        'Motor de mineração de texto que compara título, resumo e palavras-chave do trabalho com a produção dos pesquisadores',
        'Aplicação web que devolve uma lista ranqueada de avaliadores, com referências',
      ],
    ),
    details: list(
      ['TF-IDF vectors compared with cosine similarity', 'Content-based recommendation, no user history needed'],
      ['Vetores TF-IDF comparados por similaridade do cosseno', 'Recomendação baseada em conteúdo, sem depender de histórico de usuários'],
    ),
    stack: [
      layer('Text mining', 'Mineração de texto', ['Python', 'scikit-learn', 'TF-IDF', 'Cosine similarity']),
      layer('App', 'Aplicação', ['FastAPI', 'Next.js']),
    ],
    flow: [
      { label: s('Title, abstract, keywords', 'Título, resumo, palavras-chave') },
      { label: s('TF-IDF vectors', 'Vetores TF-IDF') },
      { label: s('Cosine similarity', 'Similaridade do cosseno') },
      { label: s('Ranked evaluators', 'Avaliadores ranqueados'), note: 'FastAPI, Next.js' },
    ],
  },
  'research-portal': {
    outcomes: [
      s('Information that was scattered now lives in one structured, maintained base.', 'Informações antes dispersas agora ficam em uma base estruturada e mantida.'),
      s('Running in production on Vercel.', 'Em produção na Vercel.'),
    ],
    problem: s(
      'An educational institution’s research records and documents were scattered and hard to explore publicly.',
      'Os registros e documentos de pesquisa de uma instituição de ensino estavam dispersos e eram difíceis de explorar publicamente.',
    ),
    built: list(
      [
        'Public pages with interactive maps, charts, filters and data downloads',
        'An admin area to add, review and edit records and documents',
        'User management and document organisation',
      ],
      [
        'Páginas públicas com mapas, gráficos, filtros e download de dados',
        'Área administrativa para inserir, revisar e editar registros e documentos',
        'Gestão de usuários e organização documental',
      ],
    ),
    details: list(['Audit trail on data entry'], ['Auditoria no cadastro de dados']),
    stack: [
      layer('App', 'Aplicação', ['Next.js', 'TypeScript']),
      layer('Data', 'Dados', ['PostgreSQL', 'Neon']),
      layer('Hosting', 'Hospedagem', ['Vercel']),
    ],
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
    problem: s(
      'Client telemetry has to reach the ingestion pipeline on AWS, and only from authenticated clients.',
      'A telemetria dos clientes precisa chegar ao pipeline de ingestão na AWS, e apenas de clientes autenticados.',
    ),
    built: list(
      [
        'A Go collector that receives OpenTelemetry data (OTLP) over gRPC',
        'Client access checks with Amazon Cognito',
        'Continuous streaming to Kinesis Data Firehose for ingestion',
      ],
      [
        'Coletor em Go que recebe dados OpenTelemetry (OTLP) via gRPC',
        'Validação de acesso dos clientes com Amazon Cognito',
        'Envio contínuo ao Kinesis Data Firehose para ingestão',
      ],
    ),
    details: list(
      ['Concurrent processing with goroutines and channels', 'Graceful shutdown'],
      ['Processamento concorrente com goroutines e channels', 'Graceful shutdown'],
    ),
    stack: [
      layer('Service', 'Serviço', ['Go', 'gRPC']),
      layer('Telemetry', 'Telemetria', ['OpenTelemetry', 'OTLP']),
      layer('AWS', 'AWS', ['Kinesis Data Firehose', 'Amazon Cognito']),
    ],
    flow: [
      { label: s('Client telemetry', 'Telemetria dos clientes'), note: 'OTLP over gRPC' },
      { label: s('Access check', 'Validação de acesso'), note: 'Amazon Cognito' },
      { label: s('Go collector', 'Coletor em Go'), note: 'goroutines, channels' },
      { label: s('Streaming', 'Envio contínuo'), note: 'Kinesis Data Firehose' },
      { label: s('Ingestion on AWS', 'Ingestão na AWS') },
    ],
  },
  masters: {
    problem: s(
      'Data for environmental impact assessment is spread across many sources and regulators, which makes it hard to use in decisions.',
      'Os dados para avaliação de impacto ambiental estão espalhados entre várias fontes e órgãos reguladores, o que dificulta usá-los nas decisões.',
    ),
    built: list(
      ['A decision-support platform combining RAG, machine learning, deep learning and a web application'],
      ['Plataforma de suporte à decisão que combina RAG, machine learning, deep learning e uma aplicação web'],
    ),
    flowPlanned: true,
    flow: [
      { label: s('Regulators and sources', 'Órgãos reguladores e fontes'), note: 'e.g. IBAMA' },
      { label: s('Data integration', 'Integração de dados') },
      { label: s('NLP, RAG, GraphRAG') },
      { label: s('Decision support', 'Suporte à decisão') },
    ],
  },
};
