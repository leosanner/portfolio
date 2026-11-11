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
  /**
   * Before/after comparison, drawn to scale. `from`/`to` are the raw numbers behind
   * `before`/`value` (e.g. minutes). 'bar' draws two bars, 'people' draws person icons.
   */
  before?: string;
  compare?: { from: number; to: number; kind: 'bar' | 'people' };
  /** Short badge derived from the real numbers, e.g. "6× faster". */
  gain?: Localized;
  label: Localized;
}

export interface Media {
  type: 'image' | 'video';
  src: string;
  alt: Localized;
  /** Poster frame for videos. */
  poster?: string;
}

/** Colour family for a stack layer or flow stage. Defined as --tone-* in global.css. */
export type Tone = 'cyan' | 'green' | 'violet' | 'amber' | 'coral';

/** Drawings available to illustrated flows (see src/components/IllustratedFlow.tsx). */
export type FlowArt =
  | 'probe' | 'readings' | 'classify' | 'webapp'
  | 'satellite' | 'structure' | 'split' | 'train' | 'forecast'
  | 'upload' | 'gateway' | 'match' | 'report' | 'portal';

export interface FlowStep {
  label: Localized;
  /** Small technical note under the label, e.g. the tool used. */
  note?: string;
  /** Illustrated flows only: a drawing, a colour, a one-line explanation. */
  art?: FlowArt;
  tone?: Tone;
  caption?: Localized;
  /** Marks the steps Leo was personally responsible for. */
  mine?: boolean;
}

export interface CaseLink {
  kind: 'live' | 'repo' | 'paper';
  url: string;
}

export interface StackLayer {
  layer: Localized;
  items: string[];
  /** Colour of the layer card. Cycles through the palette when omitted. */
  tone?: Tone;
}

export interface Reference {
  title: string;
  authors: string;
  publisher: string;
  year: number;
  url?: string;
  tone?: Tone;
}

export interface ArchNode {
  label: Localized;
  note?: string;
}

/** One box of the architecture diagram: a place where services run. */
export interface ArchZone {
  label: Localized;
  tone: Tone;
  /** Shows a lock: the zone is not reachable from the internet. */
  private?: boolean;
  nodes: ArchNode[];
}

export interface Architecture {
  /** Zones in request order, left to right. */
  zones: ArchZone[];
  /** Managed services the system relies on, shown under the zones. */
  services?: ArchNode[];
}

export interface CaseStudy {
  architecture?: Architecture;
  /** Override the "The problem" / "What I built" headings, e.g. for a study rather than a build. */
  problemLabel?: Localized;
  builtLabel?: Localized;
  /** Books and papers the work was grounded in. */
  references?: Reference[];
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
const layer = (en: string, pt: string, items: string[], tone?: Tone): StackLayer => ({ layer: s(en, pt), items, tone });

export const caseStudies: Record<string, CaseStudy> = {
  'water-quality': {
    problem: s(
      'Water quality in the Port of Santos needed a low-cost way to be measured and classified.',
      'A qualidade da água no Porto de Santos precisava de uma forma de baixo custo para ser medida e classificada.',
    ),
    built: list(
      [
        'Collected the sensor readings in the Port of Santos and prepared them as a training dataset',
        'Trained machine learning models that classify the water into quality groups',
        'Built the web application that presents the classification results',
      ],
      [
        'Coletei as leituras dos sensores no Porto de Santos e as preparei como base de treino',
        'Treinei modelos de machine learning que classificam a água em grupos de qualidade',
        'Construí a aplicação web que apresenta os resultados da classificação',
      ],
    ),
    stack: [
      layer('Sensors and hardware', 'Sensores e hardware', ['Arduino', 'C++', 'pH sensor', 'Serial data logging'], 'cyan'),
      layer('Data collection', 'Coleta de dados', ['Python', 'pandas', 'NumPy', 'Jupyter', 'CSV'], 'green'),
      layer('Machine learning', 'Machine learning', ['scikit-learn', 'Classification', 'Model evaluation'], 'violet'),
      layer('Web application', 'Aplicação web', ['Streamlit', 'Matplotlib'], 'amber'),
    ],
    flow: [
      {
        art: 'probe',
        tone: 'cyan',
        label: s('Sensors in the water', 'Sensores na água'),
        note: 'Arduino, C++',
        caption: s(
          'Sensor probes developed by the team take pH and water readings in the Port of Santos.',
          'Sondas de sensores desenvolvidas pela equipe fazem leituras de pH e da água no Porto de Santos.',
        ),
      },
      {
        art: 'readings',
        tone: 'green',
        mine: true,
        label: s('Data collection', 'Coleta de dados'),
        note: 'Python, pandas',
        caption: s(
          'The readings are collected, cleaned and organised into a dataset.',
          'As leituras são coletadas, limpas e organizadas em uma base de dados.',
        ),
      },
      {
        art: 'classify',
        tone: 'violet',
        mine: true,
        label: s('Model training', 'Treino dos modelos'),
        note: 'scikit-learn',
        caption: s(
          'Machine learning models learn to sort each sample into a water quality group.',
          'Modelos de machine learning aprendem a separar cada amostra em um grupo de qualidade da água.',
        ),
      },
      {
        art: 'webapp',
        tone: 'amber',
        mine: true,
        label: s('Web application', 'Aplicação web'),
        note: 'Streamlit',
        caption: s(
          'A web app shows the classification results in a way anyone can read.',
          'Uma aplicação web mostra os resultados da classificação de forma que qualquer pessoa entenda.',
        ),
      },
    ],
  },
  'ocean-forecasting': {
    outcomes: [
      s(
        'A solid grounding in how machine learning models work, from the mathematics up.',
        'Uma base sólida de como os modelos de machine learning funcionam, a partir da matemática.',
      ),
      s(
        'Hands-on practice with the full life cycle: raw data to trained, tested model.',
        'Prática com o ciclo de vida completo: dos dados brutos ao modelo treinado e testado.',
      ),
    ],
    problemLabel: s('The goal', 'O objetivo'),
    builtLabel: s('What I studied and did', 'O que estudei e fiz'),
    problem: s(
      'Understand the mathematics and statistics behind machine learning, and apply them to forecasting extreme ocean events.',
      'Entender a matemática e a estatística por trás do machine learning e aplicá-las à previsão de eventos oceânicos extremos.',
    ),
    built: list(
      [
        'Studied the mathematics behind machine learning: linear algebra, calculus, probability and optimisation',
        'Studied how different statistical learning models work and how they are trained and evaluated',
        'Applied the full life cycle to extreme ocean events: raw NASA and scientific data, processing, train/test split, training and testing',
      ],
      [
        'Estudei a matemática por trás do machine learning: álgebra linear, cálculo, probabilidade e otimização',
        'Estudei como diferentes modelos de aprendizado estatístico funcionam e como são treinados e avaliados',
        'Apliquei o ciclo de vida completo a eventos oceânicos extremos: dados brutos da NASA e científicos, processamento, divisão treino/teste, treino e teste',
      ],
    ),
    references: [
      {
        title: 'Mathematics for Machine Learning',
        authors: 'M. P. Deisenroth, A. A. Faisal, C. S. Ong',
        publisher: 'Cambridge University Press',
        year: 2020,
        url: 'https://mml-book.github.io/',
        tone: 'cyan',
      },
      {
        title: 'An Introduction to Statistical Learning',
        authors: 'G. James, D. Witten, T. Hastie, R. Tibshirani',
        publisher: 'Springer',
        year: 2021,
        url: 'https://www.statlearning.com/',
        tone: 'violet',
      },
    ],
    stack: [
      layer('Mathematical foundations', 'Fundamentos matemáticos', ['Linear algebra', 'Calculus', 'Probability', 'Optimisation'], 'cyan'),
      layer('Statistical learning', 'Aprendizado estatístico', ['Regression', 'Classification', 'Train/test split', 'Model evaluation'], 'violet'),
      layer('Data', 'Dados', ['NASA data', 'Python', 'Jupyter', 'pandas'], 'green'),
      layer('Models', 'Modelos', ['scikit-learn', 'PyTorch', 'TensorFlow'], 'amber'),
      layer('Cloud (Azure)', 'Nuvem (Azure)', ['Azure Blob Storage', 'Azure Machine Learning', 'Azure ML Notebooks', 'Azure ML Endpoints'], 'coral'),
    ],
    flow: [
      {
        art: 'satellite',
        tone: 'cyan',
        label: s('Raw data', 'Dados brutos'),
        note: 'NASA, scientific datasets',
        caption: s('Ocean observations collected from NASA and scientific sources.', 'Observações do oceano coletadas da NASA e de fontes científicas.'),
      },
      {
        art: 'structure',
        tone: 'green',
        label: s('Processing', 'Processamento'),
        note: 'Python, pandas',
        caption: s('Raw files are cleaned and turned into structured, consistent tables.', 'Arquivos brutos são limpos e transformados em tabelas estruturadas e consistentes.'),
      },
      {
        art: 'split',
        tone: 'violet',
        label: s('Train / test split', 'Divisão treino / teste'),
        caption: s('The data is split so models are tested on samples they never saw.', 'Os dados são divididos para que os modelos sejam testados em amostras que nunca viram.'),
      },
      {
        art: 'train',
        tone: 'amber',
        label: s('Training', 'Treino'),
        note: 'scikit-learn, PyTorch, TensorFlow',
        caption: s('Models learn by minimising their error, step by step.', 'Os modelos aprendem minimizando o erro, passo a passo.'),
      },
      {
        art: 'forecast',
        tone: 'coral',
        label: s('Extreme event forecast', 'Previsão de eventos extremos'),
        caption: s('The tested model flags values that cross an extreme threshold.', 'O modelo testado sinaliza valores que ultrapassam um limiar extremo.'),
      },
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
    results: [
      {
        before: '3h',
        value: '30 min',
        label: s('Time to produce a report', 'Tempo para produzir um relatório'),
        compare: { from: 180, to: 30, kind: 'bar' },
        gain: s('6× faster', '6× mais rápido'),
      },
      {
        before: '5',
        value: '1',
        label: s('Professionals per task', 'Profissionais por tarefa'),
        compare: { from: 5, to: 1, kind: 'people' },
        gain: s('5× fewer', '5× menos'),
      },
      { value: '300+', label: s('users', 'usuários') },
    ],
    outcomes: [s('The whole process in one place.', 'Todo o processo em um só lugar.')],
    problem: s(
      'Staff took raw output files from specialised assessment equipment and turned them by hand into personalised client reports and treatment plans. It was slow, manual work.',
      'A equipe pegava arquivos brutos de equipamentos especializados de avaliação e os transformava à mão em relatórios e planos de tratamento personalizados. Era um trabalho lento e manual.',
    ),
    built: list(
      [
        'Automated report generation: upload the device exports, get a branded Word report',
        'Self-service reference catalogs that the clinic edits itself, with normalisation and health checks',
        'Per-clinic pricing catalogs and reusable treatment-plan presets',
        'Room rental scheduling, with protection enforced by the database',
        'A client portal with invitation-based onboarding and email notifications',
        'Report template management: staff upload and pick the templates used',
        'Role-based access for admins, operators and clients',
      ],
      [
        'Geração automática de relatórios: envie os arquivos do equipamento e receba um relatório Word personalizado',
        'Catálogos de referência editados pela própria clínica, com normalização e verificações de saúde',
        'Catálogos de preços por clínica e modelos reutilizáveis de plano de tratamento',
        'Agenda de aluguel de salas, com proteções garantidas pelo banco de dados',
        'Portal do cliente com cadastro por convite e notificações por e-mail',
        'Gestão de templates de relatório: a equipe envia e escolhe os templates usados',
        'Acesso por papéis para administradores, operadores e clientes',
      ],
    ),
    details: list(
      [
        'API-first: typed frontend clients generated from the OpenAPI spec, which the Go gateway generates from code',
        'Hexagonal (ports and adapters) Go gateway split into vertical modules, with role guards that deny by default',
        'The processing engine runs on a private network only and is never exposed to the internet',
        'Data quality as a feature: normalisation layers, idempotent migrations and staging checks before every release',
        'CI enforces linting, strict types (mypy strict, tsc -b), migrations on a real Postgres and OpenAPI drift checks',
        'AI-assisted development, with agent workflows coordinated across parallel tasks',
        'Three services in one monorepo, about 220 test suites, 17 architecture decision records and 20+ PRDs',
      ],
      [
        'API-first: clientes tipados no frontend gerados a partir da especificação OpenAPI, que o gateway em Go gera a partir do código',
        'Gateway em Go hexagonal (ports and adapters), dividido em módulos verticais, com guardas de papel que negam por padrão',
        'O motor de processamento roda apenas em rede privada e nunca fica exposto à internet',
        'Qualidade de dados como funcionalidade: camadas de normalização, migrações idempotentes e verificação em staging antes de cada release',
        'O CI exige lint, tipagem estrita (mypy strict, tsc -b), migrações em um Postgres real e checagem de divergência do OpenAPI',
        'Desenvolvimento assistido por IA, com fluxos de agentes coordenados em tarefas paralelas',
        'Três serviços em um monorepo, cerca de 220 suítes de teste, 17 registros de decisão de arquitetura e mais de 20 PRDs',
      ],
    ),
    stack: [
      layer('Frontend', 'Frontend', ['React 19', 'TypeScript', 'Vite', 'TanStack Router', 'TanStack Query', 'Tailwind CSS v4', 'openapi-typescript', 'dnd-kit'], 'cyan'),
      layer('API gateway', 'API gateway', ['Go', 'chi', 'swaggest', 'Swagger UI', 'Clerk'], 'violet'),
      layer('Processing engine', 'Motor de processamento', ['Python', 'FastAPI', 'pdfplumber', 'RapidFuzz', 'DOCX templates', 'Google Sheets'], 'green'),
      layer('Data', 'Dados', ['PostgreSQL', 'SQLAlchemy 2', 'Alembic', 'Cloudflare R2'], 'amber'),
      layer('Infrastructure', 'Infraestrutura', ['Docker', 'Caddy', 'VPS', 'Cloudflare Pages', 'GitHub Actions', 'Resend'], 'coral'),
    ],
    architecture: {
      zones: [
        {
          label: s('Cloudflare Pages', 'Cloudflare Pages'),
          tone: 'cyan',
          nodes: [{ label: s('Web app (SPA)', 'Aplicação web (SPA)'), note: 'React, TanStack' }],
        },
        {
          label: s('VPS, public', 'VPS, pública'),
          tone: 'violet',
          nodes: [
            { label: s('Reverse proxy, automatic TLS', 'Proxy reverso, TLS automático'), note: 'Caddy' },
            { label: s('API gateway', 'API gateway'), note: 'Go, chi' },
          ],
        },
        {
          label: s('VPS, private network', 'VPS, rede privada'),
          tone: 'green',
          private: true,
          nodes: [{ label: s('Processing engine', 'Motor de processamento'), note: 'FastAPI, pdfplumber, RapidFuzz' }],
        },
        {
          label: s('Data', 'Dados'),
          tone: 'amber',
          nodes: [
            { label: s('Database', 'Banco de dados'), note: 'PostgreSQL' },
            { label: s('Report templates', 'Templates de relatório'), note: 'Cloudflare R2' },
            { label: s('Spreadsheets', 'Planilhas'), note: 'Google Sheets' },
          ],
        },
      ],
      services: [
        { label: s('Auth and roles', 'Autenticação e papéis'), note: 'Clerk' },
        { label: s('Email', 'E-mail'), note: 'Resend' },
        { label: s('CI/CD, Docker images', 'CI/CD, imagens Docker'), note: 'GitHub Actions' },
      ],
    },
    flow: [
      {
        art: 'upload',
        tone: 'cyan',
        label: s('Upload device exports', 'Envio dos arquivos'),
        note: 'React, dnd-kit',
        caption: s('Operators drop in the raw files exported by the assessment equipment.', 'Operadores enviam os arquivos brutos exportados pelo equipamento de avaliação.'),
      },
      {
        art: 'gateway',
        tone: 'violet',
        label: s('Secure gateway', 'Gateway seguro'),
        note: 'Go, chi, Clerk',
        caption: s('The Go gateway authenticates each request and checks its role, denying by default.', 'O gateway em Go autentica cada requisição e verifica o papel, negando por padrão.'),
      },
      {
        art: 'match',
        tone: 'green',
        label: s('Parse and match', 'Leitura e correspondência'),
        note: 'FastAPI, pdfplumber, RapidFuzz',
        caption: s('The private engine reads the exports and matches them against the clinic’s reference catalog.', 'O motor privado lê os arquivos e os compara com o catálogo de referência da clínica.'),
      },
      {
        art: 'report',
        tone: 'amber',
        label: s('Branded report', 'Relatório personalizado'),
        note: 'DOCX templates, R2',
        caption: s('A Word report is generated from the clinic’s own template.', 'Um relatório Word é gerado a partir do template da própria clínica.'),
      },
      {
        art: 'portal',
        tone: 'coral',
        label: s('Client portal', 'Portal do cliente'),
        note: 'Resend',
        caption: s('Clients join the portal by invitation and get email notifications.', 'Clientes entram no portal por convite e recebem notificações por e-mail.'),
      },
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
