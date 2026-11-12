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
  | 'upload' | 'gateway' | 'match' | 'report' | 'portal'
  | 'library' | 'screen' | 'ask' | 'explore'
  | 'pipeline' | 'tfidf' | 'tune' | 'confusion' | 'infer'
  | 'vote' | 'filters' | 'curated'
  | 'form' | 'cosine' | 'rank'
  | 'stats';

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
  /**
   * Programme overview: shows only the head, the flow and links to its projects.
   * Used where details stay inside the individual projects.
   */
  overview?: boolean;
  /** Overview only: colour of each project card, by project id. */
  projectTones?: Record<string, Tone>;
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
    overview: true,
    projectTones: { 'petrobras-classifier': 'green', 'petrobras-pipeline': 'violet', 'petrobras-app': 'amber' },
    flow: [
      {
        art: 'library',
        tone: 'cyan',
        label: s('Scientific literature', 'Literatura científica'),
        caption: s('Large volumes of research on environmental impact.', 'Grandes volumes de pesquisa sobre impacto ambiental.'),
      },
      {
        art: 'screen',
        tone: 'green',
        label: s('Filter', 'Filtrar'),
        caption: s(
          'Classifiers, AI models and domain filters cut the volume down to a manageable set.',
          'Classificadores, modelos de IA e filtros do domínio reduzem o volume a um conjunto gerenciável.',
        ),
      },
      {
        art: 'ask',
        tone: 'violet',
        label: s('Ask', 'Perguntar'),
        caption: s('Questions in plain language, answered with references.', 'Perguntas em linguagem natural, respondidas com referências.'),
      },
      {
        art: 'explore',
        tone: 'amber',
        label: s('Explore', 'Explorar'),
        caption: s('Knowledge graphs and interactive charts.', 'Grafos de conhecimento e gráficos interativos.'),
      },
    ],
  },
  'petrobras-classifier': {
    problemLabel: s('The task', 'A tarefa'),
    problem: s(
      'Binary text classification: given a scientific article, decide whether it relates to environmental impact assessment or not.',
      'Classificação binária de texto: dado um artigo científico, decidir se ele tem relação com avaliação de impacto ambiental ou não.',
    ),
    built: list(
      [
        'Data pipelines that collect the articles and sanitise them into a clean, consistent dataset',
        'Text features with TF-IDF',
        'Train/test split, then hyperparameter search with cross-validation',
        'An ensemble of XGBoost, Decision Trees and Naive Bayes, trained and used for inference',
        'Evaluation with a confusion matrix and other metrics, to check how well the model fits',
        'Training and experiments in an Azure environment',
      ],
      [
        'Pipelines de dados que coletam os artigos e os saneiam em uma base limpa e consistente',
        'Features de texto com TF-IDF',
        'Divisão treino/teste e busca de hiperparâmetros com validação cruzada',
        'Um ensemble de XGBoost, Decision Trees e Naive Bayes, treinado e usado para inferência',
        'Avaliação com matriz de confusão e outras métricas, para verificar se o modelo se ajusta bem',
        'Treino e experimentos em um ambiente Azure',
      ],
    ),
    details: list(
      [
        'Metrics: accuracy, precision, recall and F1-score, read alongside the confusion matrix',
        'Cross-validation inside the search, so the test set stays untouched until the end',
        'Comparative experiments with embeddings and Transformers',
      ],
      [
        'Métricas: acurácia, precisão, recall e F1-score, lidas junto com a matriz de confusão',
        'Validação cruzada dentro da busca, para que o conjunto de teste fique intocado até o fim',
        'Experimentos comparativos com embeddings e Transformers',
      ],
    ),
    stack: [
      layer('Data pipeline', 'Pipeline de dados', ['Python', 'pandas', 'Text cleaning'], 'cyan'),
      layer('Features', 'Features', ['TF-IDF', 'Embeddings', 'Transformers'], 'violet'),
      layer('Modelling', 'Modelagem', ['scikit-learn', 'XGBoost', 'Decision Trees', 'Naive Bayes', 'RandomizedSearchCV'], 'amber'),
      layer('Evaluation', 'Avaliação', ['Confusion matrix', 'Accuracy', 'Precision', 'Recall', 'F1-score'], 'coral'),
      layer('Azure', 'Azure', ['Azure Machine Learning', 'Azure Blob Storage', 'Azure ML Notebooks'], 'green'),
    ],
    flow: [
      {
        art: 'pipeline',
        tone: 'cyan',
        label: s('Data pipeline', 'Pipeline de dados'),
        note: 'Python, Azure Blob Storage',
        caption: s('Articles are collected from their sources and stored.', 'Os artigos são coletados das fontes e armazenados.'),
      },
      {
        art: 'structure',
        tone: 'green',
        label: s('Sanitise', 'Saneamento'),
        note: 'pandas',
        caption: s('Duplicates, gaps and noise are cleaned into one consistent dataset.', 'Duplicatas, lacunas e ruído são limpos em uma base consistente.'),
      },
      {
        art: 'tfidf',
        tone: 'violet',
        label: s('TF-IDF features', 'Features TF-IDF'),
        note: 'scikit-learn',
        caption: s('Each article becomes a vector of weighted terms.', 'Cada artigo vira um vetor de termos ponderados.'),
      },
      {
        art: 'tune',
        tone: 'amber',
        label: s('Split, tune, train', 'Dividir, ajustar, treinar'),
        note: 'RandomizedSearchCV, Azure ML',
        caption: s(
          'A train/test split, then a hyperparameter search with cross-validation picks the best model.',
          'Divisão treino/teste e busca de hiperparâmetros com validação cruzada escolhem o melhor modelo.',
        ),
      },
      {
        art: 'confusion',
        tone: 'coral',
        label: s('Evaluate', 'Avaliar'),
        note: 'Confusion matrix, F1-score',
        caption: s('The confusion matrix and metrics show how well the model fits.', 'A matriz de confusão e as métricas mostram se o modelo se ajusta bem.'),
      },
      {
        art: 'infer',
        tone: 'cyan',
        label: s('Inference', 'Inferência'),
        note: 'XGBoost, Decision Trees, Naive Bayes',
        caption: s('New articles get a label: related or not related.', 'Novos artigos recebem um rótulo: relacionado ou não.'),
      },
    ],
  },
  'petrobras-pipeline': {
    problemLabel: s('The task', 'A tarefa'),
    problem: s(
      'A literature search returns far more articles than anyone can read. The pipeline has to reduce that volume to a manageable set and serve it to the app.',
      'Uma busca bibliográfica retorna muito mais artigos do que alguém consegue ler. O pipeline precisa reduzir esse volume a um conjunto gerenciável e servi-lo à aplicação.',
    ),
    built: list(
      [
        'Collection from different scientific repositories through their APIs',
        'Machine learning models that classify whether each article fits the context',
        'AI models from different providers that each give an opinion on the article, combined as an ensemble',
        'Metadata filters',
        'Domain filters defined together with the specialists',
        'The curated set exposed for the RAG app to consume',
      ],
      [
        'Coleta em diferentes repositórios científicos por meio de suas APIs',
        'Modelos de machine learning que classificam se cada artigo se encaixa no contexto',
        'Modelos de IA de diferentes provedores que dão sua opinião sobre o artigo, combinadas em um ensemble',
        'Filtros de metadados',
        'Filtros de domínio definidos junto com os especialistas',
        'O conjunto curado exposto para a aplicação RAG consumir',
      ],
    ),
    stack: [
      layer('Pipeline', 'Pipeline', ['Python', 'Repository APIs'], 'cyan'),
      layer('Machine learning', 'Machine learning', ['scikit-learn', 'PyTorch'], 'green'),
      layer('AI models', 'Modelos de IA', ['LangChain', 'Multiple providers'], 'violet'),
    ],
    flow: [
      {
        art: 'pipeline',
        tone: 'cyan',
        label: s('Repositories', 'Repositórios'),
        note: 'Python, repository APIs',
        caption: s('Articles are collected from different scientific repositories.', 'Artigos são coletados de diferentes repositórios científicos.'),
      },
      {
        art: 'screen',
        tone: 'green',
        label: s('Relevance classifier', 'Classificador de relevância'),
        note: 'scikit-learn, PyTorch',
        caption: s('Machine learning keeps the articles that fit the context.', 'Machine learning mantém os artigos que se encaixam no contexto.'),
      },
      {
        art: 'vote',
        tone: 'violet',
        label: s('Ensemble of AI opinions', 'Ensemble de opiniões de IA'),
        note: 'LangChain',
        caption: s('Models from different providers each give an opinion, and the opinions are combined.', 'Modelos de diferentes provedores dão sua opinião, e as opiniões são combinadas.'),
      },
      {
        art: 'filters',
        tone: 'amber',
        label: s('Metadata and domain filters', 'Filtros de metadados e domínio'),
        caption: s('Metadata rules and the specialists’ own filters narrow it further.', 'Regras de metadados e os filtros dos especialistas refinam ainda mais.'),
      },
      {
        art: 'curated',
        tone: 'coral',
        label: s('Curated set', 'Conjunto curado'),
        caption: s('A manageable set of articles, ready for the RAG app.', 'Um conjunto gerenciável de artigos, pronto para a aplicação RAG.'),
      },
    ],
  },
  'petrobras-app': {
    outcomes: [
      s(
        'Researchers ask questions in plain language instead of reading dozens of papers by hand.',
        'Pesquisadores fazem perguntas em linguagem natural em vez de ler dezenas de artigos manualmente.',
      ),
      s('Every answer cites the papers it came from.', 'Toda resposta cita os artigos de onde veio.'),
    ],
    problem: s(
      'Even after curation, answering a question about a set of papers meant reading them one by one, and seeing the bigger picture across them was hard.',
      'Mesmo depois da curadoria, responder uma pergunta sobre um conjunto de artigos exigia lê-los um a um, e enxergar o panorama entre eles era difícil.',
    ),
    built: list(
      [
        'One Next.js and TypeScript app on top of the curated set from the data pipeline',
        'A RAG flow with embeddings in PostgreSQL/pgvector and language models through the Vercel AI SDK',
        'Knowledge graphs and interactive charts to explore the literature',
        'Background processing pipelines with Inngest',
      ],
      [
        'Uma aplicação em Next.js e TypeScript sobre o conjunto curado pelo pipeline de dados',
        'Fluxo de RAG com embeddings em PostgreSQL/pgvector e modelos de linguagem via Vercel AI SDK',
        'Grafos de conhecimento e gráficos interativos para explorar a literatura',
        'Pipelines de processamento em segundo plano com Inngest',
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
      layer('App', 'Aplicação', ['Next.js', 'TypeScript'], 'cyan'),
      layer('Retrieval', 'Recuperação', ['PostgreSQL', 'pgvector', 'Embeddings'], 'violet'),
      layer('Language models', 'Modelos de linguagem', ['Vercel AI SDK'], 'green'),
      layer('Background jobs', 'Processamento em segundo plano', ['Inngest'], 'amber'),
    ],
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
      {
        art: 'library',
        tone: 'cyan',
        label: s('Curated articles', 'Artigos curados'),
        note: 'from the data pipeline',
        caption: s('The app reads the manageable set the pipeline produced.', 'A aplicação lê o conjunto gerenciável produzido pelo pipeline.'),
      },
      {
        art: 'tfidf',
        tone: 'violet',
        label: s('Embeddings', 'Embeddings'),
        note: 'PostgreSQL, pgvector',
        caption: s('Each passage is stored as a vector for semantic search.', 'Cada trecho é armazenado como vetor para busca semântica.'),
      },
      {
        art: 'ask',
        tone: 'green',
        label: s('Ask', 'Perguntar'),
        note: 'Vercel AI SDK',
        caption: s('Questions in plain language, answered with references.', 'Perguntas em linguagem natural, respondidas com referências.'),
      },
      {
        art: 'explore',
        tone: 'amber',
        label: s('Explore', 'Explorar'),
        note: 'Next.js, Inngest',
        caption: s('Knowledge graphs and interactive charts across the literature.', 'Grafos de conhecimento e gráficos interativos sobre a literatura.'),
      },
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
      layer('Text mining', 'Mineração de texto', ['Python', 'scikit-learn', 'TF-IDF'], 'violet'),
      layer('Recommendation', 'Recomendação', ['Cosine similarity', 'Content-based ranking'], 'green'),
      layer('API', 'API', ['FastAPI'], 'cyan'),
      layer('Web app', 'Aplicação web', ['Next.js'], 'amber'),
    ],
    flow: [
      {
        art: 'form',
        tone: 'cyan',
        label: s('Thesis details', 'Dados do trabalho'),
        note: 'Next.js',
        caption: s('The title, abstract and keywords go in.', 'Entram o título, o resumo e as palavras-chave.'),
      },
      {
        art: 'library',
        tone: 'coral',
        label: s('Researchers’ work', 'Produção dos pesquisadores'),
        caption: s('Each candidate evaluator is described by their own work.', 'Cada avaliador candidato é descrito pela própria produção.'),
      },
      {
        art: 'tfidf',
        tone: 'violet',
        label: s('TF-IDF vectors', 'Vetores TF-IDF'),
        note: 'scikit-learn',
        caption: s('Both sides become vectors of weighted terms.', 'Os dois lados viram vetores de termos ponderados.'),
      },
      {
        art: 'cosine',
        tone: 'green',
        label: s('Cosine similarity', 'Similaridade do cosseno'),
        note: 'Python',
        caption: s('The smaller the angle between two vectors, the closer the subjects.', 'Quanto menor o ângulo entre dois vetores, mais próximos os temas.'),
      },
      {
        art: 'rank',
        tone: 'amber',
        label: s('Ranked evaluators', 'Avaliadores ranqueados'),
        note: 'FastAPI, Next.js',
        caption: s('A ranked list of evaluators, with references.', 'Uma lista ranqueada de avaliadores, com referências.'),
      },
    ],
  },
  'research-portal': {
    results: [{ value: '200+', label: s('documents managed in the admin panel', 'documentos gerenciados no painel administrativo') }],
    outcomes: [
      s('Information that was scattered now lives in one structured, maintained catalog.', 'Informações antes dispersas agora ficam em um catálogo estruturado e mantido.'),
      s('Statistics, graphs and illustrated results update as new data comes in.', 'Estatísticas, grafos e resultados ilustrados se atualizam conforme novos dados entram.'),
      s('Each sector has its own view of the data.', 'Cada setor tem sua própria visão dos dados.'),
    ],
    problem: s(
      'An educational institution’s research records and documents were scattered and hard to explore publicly.',
      'Os registros e documentos de pesquisa de uma instituição de ensino estavam dispersos e eram difíceis de explorar publicamente.',
    ),
    built: list(
      [
        'An admin panel where staff add, review and edit records and documents',
        'A data catalog that organises everything by sector',
        'Role-based access control for who can see and change what',
        'Data pipelines that sanitise inserted content before it is exposed publicly',
        'A dynamic statistics page, graph data and illustrated results that follow the data',
        'Public pages with interactive maps, charts, filters and data downloads',
      ],
      [
        'Painel administrativo onde a equipe insere, revisa e edita registros e documentos',
        'Catálogo de dados que organiza tudo por setor',
        'Controle de acesso por papéis para definir quem vê e altera o quê',
        'Pipelines de dados que saneiam o conteúdo inserido antes de expô-lo publicamente',
        'Página de estatísticas dinâmica, dados em grafo e resultados ilustrados que acompanham os dados',
        'Páginas públicas com mapas, gráficos, filtros e download de dados',
      ],
    ),
    details: list(
      [
        'Audit trail on data entry',
        'CI/CD with GitHub Actions',
        'AI-assisted development workflow',
      ],
      [
        'Auditoria no cadastro de dados',
        'CI/CD com GitHub Actions',
        'Fluxo de desenvolvimento assistido por IA',
      ],
    ),
    stack: [
      layer('App', 'Aplicação', ['Next.js', 'TypeScript'], 'cyan'),
      layer('Data', 'Dados', ['Prisma', 'PostgreSQL', 'Neon'], 'violet'),
      layer('Delivery', 'Entrega', ['GitHub Actions', 'CI/CD', 'Vercel'], 'green'),
      layer('Workflow', 'Fluxo de trabalho', ['AI-assisted development'], 'amber'),
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
      {
        art: 'upload',
        tone: 'cyan',
        label: s('Admin panel', 'Painel administrativo'),
        note: 'Next.js',
        caption: s('Staff add records and documents, 200+ so far.', 'A equipe insere registros e documentos, mais de 200 até agora.'),
      },
      {
        art: 'gateway',
        tone: 'violet',
        label: s('Role-based access', 'Acesso por papéis'),
        caption: s('Each role sees and changes only what it should.', 'Cada papel vê e altera apenas o que deve.'),
      },
      {
        art: 'structure',
        tone: 'green',
        label: s('Pipelines and sanitising', 'Pipelines e saneamento'),
        note: 'Prisma',
        caption: s('Inserted content is cleaned before anything goes public.', 'O conteúdo inserido é limpo antes de qualquer publicação.'),
      },
      {
        art: 'pipeline',
        tone: 'amber',
        label: s('Data catalog', 'Catálogo de dados'),
        note: 'PostgreSQL, Neon',
        caption: s('One structured catalog, organised by sector.', 'Um catálogo estruturado, organizado por setor.'),
      },
      {
        art: 'stats',
        tone: 'coral',
        label: s('Dynamic statistics', 'Estatísticas dinâmicas'),
        note: 'Next.js, Vercel',
        caption: s('Statistics, graphs and illustrated results update with the data.', 'Estatísticas, grafos e resultados ilustrados se atualizam com os dados.'),
      },
    ],
    links: [{ kind: 'live', url: 'https://projeto-oceano-five.vercel.app/' }],
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
