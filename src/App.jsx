import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  CalendarDays,
  ChevronRight,
  Code2,
  Database,
  GraduationCap,
  Gamepad2,
  Linkedin,
  Languages,
  Mail,
  Menu,
  X,
} from 'lucide-react'
import PlasmaWave from './PlasmaWave'
import CertificateQuickLook from './CertificateQuickLook'
import CertificateFileTree from './CertificateFileTree'
import ContentFileTree from './ContentFileTree'
import ClosingSequence from './ClosingSequence'
import LineSidebar from './LineSidebar'
import PerspectiveMarquee from './PerspectiveMarquee'
import PaperPreview from './PaperPreview'
import ProjectPreview from './ProjectPreview'
import TextType from './TextType'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const showAboutSection = true
const showPortfolioSections = false

const certificateAssets = [
  {
    id: 'machine-learning',
    group: 'coding',
    image: '/certificates/machine-learning.jpg',
    href: '/certificates/machine-learning.pdf',
    featured: true,
  },
  {
    id: 'python-everybody',
    group: 'coding',
    image: '/certificates/python-everybody.jpg',
    href: '/certificates/python-everybody.pdf',
  },
  {
    id: 'negotiation',
    group: 'econ',
    image: '/certificates/negotiation.jpg',
    href: '/certificates/negotiation.pdf',
  },
  {
    id: 'removing-barriers',
    group: 'econ',
    image: '/certificates/removing-barriers.jpg',
    href: '/certificates/removing-barriers.pdf',
  },
  { id: 'ieo-regional', group: 'econ', image: '/certificates/ieo-regional-gold.jpg', href: '/certificates/ieo-regional-gold.jpg' },
  { id: 'nus-belt-road', group: 'econ', image: '/certificates/nus-belt-road.jpg', href: '/certificates/nus-belt-road.jpg' },
  { id: 'arml-top100', group: 'math', image: '/certificates/arml-top100.jpg', href: '/certificates/arml-top100.jpg' },
  { id: 'euclid-top25', group: 'math', image: '/certificates/euclid-top25.jpg', href: '/certificates/euclid-top25.jpg' },
  { id: 'hypatia-top25', group: 'math', image: '/certificates/hypatia-top25.jpg', href: '/certificates/hypatia-top25.jpg' },
  { id: 'amc-silver', group: 'math', image: '/certificates/amc-silver.jpg', href: '/certificates/amc-silver.jpg' },
]

const phoneContactsByLanguage = {
  zh: [
    { label: '中国 · +86 177 6258 3565', href: 'tel:+8617762583565' },
    { label: '英国 · +44 07526037298', href: 'tel:+447526037298' },
  ],
  zhHant: [
    { label: '中國 · +86 177 6258 3565', href: 'tel:+8617762583565' },
    { label: '英國 · +44 07526037298', href: 'tel:+447526037298' },
  ],
  en: [
    { label: 'China · +86 177 6258 3565', href: 'tel:+8617762583565' },
    { label: 'United Kingdom · +44 07526037298', href: 'tel:+447526037298' },
  ],
  fr: [
    { label: 'Chine · +86 177 6258 3565', href: 'tel:+8617762583565' },
    { label: 'Royaume-Uni · +44 07526037298', href: 'tel:+447526037298' },
  ],
}

const contentTreeCopyByLanguage = {
  zh: {
    aria: ['项目文件', '资料文件'],
    projectFolder: '论文',
    projectMeta: ['iOS 产品', '2 篇 · 研究论文'],
    projectAction: [
      '查看 Pawlog 项目',
      '行动偏差 — UCL 本科毕业论文',
      '疫情开放政策对医药行业指数的影响 — 已发表论文',
    ],
    profileMeta: ['职业主页', '直接联系', '2 个号码'],
    fileMeta: ['打开', '邮件', '拨打'],
  },
  zhHant: {
    aria: ['專案檔案', '資料檔案'],
    projectFolder: '論文',
    projectMeta: ['iOS 產品', '2 篇 · 研究論文'],
    projectAction: [
      '查看 Pawlog 專案',
      '行動偏差 — UCL 本科畢業論文',
      '疫情開放政策對醫藥行業指數的影響 — 已發表論文',
    ],
    profileMeta: ['職業主頁', '直接聯絡', '2 個號碼'],
    fileMeta: ['打開', '電郵', '撥打'],
  },
  en: {
    aria: ['Project files', 'Profile files'],
    projectFolder: 'Papers',
    projectMeta: ['iOS product', '2 papers · Research'],
    projectAction: [
      'Open Pawlog project',
      'Action Bias — UCL BSc Dissertation',
      'The Impact of the Epidemic Opening Policy on the Pharmaceutical Industry Index — Published Paper',
    ],
    profileMeta: ['Professional profile', 'Direct contact', '2 numbers'],
    fileMeta: ['Open', 'Email', 'Call'],
  },
  fr: {
    aria: ['Fichiers de projets', 'Fichiers de profil'],
    projectFolder: 'Publications',
    projectMeta: ['Produit iOS', '2 articles · Recherche'],
    projectAction: [
      'Voir le projet Pawlog',
      'Biais d’action — Mémoire de licence UCL',
      'L’impact de la politique d’ouverture épidémique sur l’indice pharmaceutique — Article publié',
    ],
    profileMeta: ['Profil professionnel', 'Contact direct', '2 numéros'],
    fileMeta: ['Ouvrir', 'E-mail', 'Appeler'],
  },
}

const paperPreviewCopyByLanguage = {
  zh: {
    dissertation: {
      id: 'action-bias-dissertation',
      eyebrow: '毕业论文 · UCL · 2025',
      title: '行动偏差',
      subtitle: '股票市场决策中，行动与预期效用之间的张力。',
      ariaLabel: '行动偏差毕业论文二级页面',
      closeLabel: '关闭行动偏差论文页面',
      documentTitle: '行动偏差 UCL 本科毕业论文原篇',
      meta: ['行为经济学', '实证研究', '49 页'],
      summary: '这篇 UCL 本科毕业论文提出“行动偏差程度”指标，并将行为理论与股票交易数据结合，用于识别投资者是否在缺乏足够效用依据时更倾向于采取行动。',
      details: [
        { label: '研究问题', value: '如何在金融决策中度量行动偏差，并区分理性交易与行动本身带来的偏好？' },
        { label: '方法', value: '行为经济学理论、计量分析与股票市场交易数据。' },
        { label: '成果', value: '最终评分 71.9，获一等成绩，并入选 UCL Economics 历史论文 Hall of Fame 展示。' },
      ],
      pdf: '/papers/QuanZhong_ActionBias_BScDissertation_UCL_2025.pdf',
    },
    published: {
      id: 'epidemic-policy-paper',
      eyebrow: '已发表论文 · 2023',
      title: '疫情开放政策对医药行业指数的影响',
      subtitle: '从时间序列中观察政策变化前后的短期与长期市场反应。',
      ariaLabel: '疫情开放政策论文二级页面',
      closeLabel: '关闭已发表论文页面',
      meta: ['计量经济学', 'ARIMA', '已发表'],
      summary: '研究使用 2016 至 2023 年上证医药行业指数数据，通过数据变换、平稳性检验与 ARIMA 预测，分析疫情开放政策对行业指数的短期冲击和长期变化。',
      details: [
        { label: '研究范围', value: '中国医药行业指数与疫情开放政策。' },
        { label: '数据', value: '2016–2023 年上证医药行业指数时间序列。' },
        { label: '发表信息', value: 'Advances in Economics, Management and Political Sciences, Vol. 54, pp. 296–305。' },
      ],
      publicationLabel: '网站研究摘要',
      venue: 'Advances in Economics, Management and Political Sciences',
      websiteTitle: '疫情开放政策论文发表网站预览',
      websiteUrl: 'https://aemps.ewapub.com/article/view/7257',
      highlights: [
        { title: '问题', body: '开放政策如何改变医药行业指数的走势与预期？' },
        { title: '方法', body: '平稳性检验、数据变换与 ARIMA 时间序列预测。' },
        { title: '输出', body: '比较政策变化带来的短期波动与长期市场影响。' },
      ],
    },
  },
  zhHant: {
    dissertation: {
      id: 'action-bias-dissertation',
      eyebrow: '畢業論文 · UCL · 2025',
      title: '行動偏差',
      subtitle: '股票市場決策中，行動與預期效用之間的張力。',
      ariaLabel: '行動偏差畢業論文二級頁面',
      closeLabel: '關閉行動偏差論文頁面',
      documentTitle: '行動偏差 UCL 本科畢業論文原篇',
      meta: ['行為經濟學', '實證研究', '49 頁'],
      summary: '這篇 UCL 本科畢業論文提出「行動偏差程度」指標，並將行為理論與股票交易資料結合，用於識別投資者是否在缺乏足夠效用依據時更傾向採取行動。',
      details: [
        { label: '研究問題', value: '如何在金融決策中度量行動偏差，並區分理性交易與行動本身帶來的偏好？' },
        { label: '方法', value: '行為經濟學理論、計量分析與股票市場交易資料。' },
        { label: '成果', value: '最終評分 71.9，獲一等成績，並入選 UCL Economics 歷史論文 Hall of Fame 展示。' },
      ],
      pdf: '/papers/QuanZhong_ActionBias_BScDissertation_UCL_2025.pdf',
    },
    published: {
      id: 'epidemic-policy-paper',
      eyebrow: '已發表論文 · 2023',
      title: '疫情開放政策對醫藥行業指數的影響',
      subtitle: '從時間序列觀察政策變化前後的短期與長期市場反應。',
      ariaLabel: '疫情開放政策論文二級頁面',
      closeLabel: '關閉已發表論文頁面',
      meta: ['計量經濟學', 'ARIMA', '已發表'],
      summary: '研究使用 2016 至 2023 年上證醫藥行業指數資料，透過資料變換、平穩性檢驗與 ARIMA 預測，分析疫情開放政策對行業指數的短期衝擊和長期變化。',
      details: [
        { label: '研究範圍', value: '中國醫藥行業指數與疫情開放政策。' },
        { label: '資料', value: '2016–2023 年上證醫藥行業指數時間序列。' },
        { label: '發表資訊', value: 'Advances in Economics, Management and Political Sciences, Vol. 54, pp. 296–305。' },
      ],
      publicationLabel: '網站研究摘要',
      venue: 'Advances in Economics, Management and Political Sciences',
      websiteTitle: '疫情開放政策論文發表網站預覽',
      websiteUrl: 'https://aemps.ewapub.com/article/view/7257',
      highlights: [
        { title: '問題', body: '開放政策如何改變醫藥行業指數的走勢與預期？' },
        { title: '方法', body: '平穩性檢驗、資料變換與 ARIMA 時間序列預測。' },
        { title: '輸出', body: '比較政策變化帶來的短期波動與長期市場影響。' },
      ],
    },
  },
  en: {
    dissertation: {
      id: 'action-bias-dissertation',
      eyebrow: 'BSc Dissertation · UCL · 2025',
      title: 'Action Bias',
      subtitle: 'The tension between action and expected utility in stock-market decisions.',
      ariaLabel: 'Action Bias dissertation detail page',
      closeLabel: 'Close Action Bias dissertation page',
      documentTitle: 'Original UCL BSc dissertation on Action Bias',
      meta: ['Behavioural economics', 'Empirical research', '49 pages'],
      summary: 'This UCL dissertation develops a degree measure for action bias and combines behavioural theory with trading data to identify whether investors prefer taking action without sufficient utility-based justification.',
      details: [
        { label: 'Question', value: 'How can action bias be measured in financial decisions while separating rational trading from a preference for action itself?' },
        { label: 'Method', value: 'Behavioural economic theory, econometric analysis, and stock-market trading data.' },
        { label: 'Outcome', value: 'Awarded 71.9 (First Class) and selected for the UCL Economics historical dissertation Hall of Fame showcase.' },
      ],
      pdf: '/papers/QuanZhong_ActionBias_BScDissertation_UCL_2025.pdf',
    },
    published: {
      id: 'epidemic-policy-paper',
      eyebrow: 'Published Paper · 2023',
      title: 'The Impact of the Epidemic Opening Policy on the Pharmaceutical Industry Index',
      subtitle: 'Reading short- and long-run market responses around a policy change.',
      ariaLabel: 'Published pharmaceutical index paper detail page',
      closeLabel: 'Close published paper page',
      meta: ['Econometrics', 'ARIMA', 'Published'],
      summary: 'Using SSE pharmaceutical-industry index data from 2016 to 2023, this study applies transformations, stationarity tests, and ARIMA forecasting to examine the short- and long-term effects of the epidemic opening policy.',
      details: [
        { label: 'Scope', value: 'China’s pharmaceutical industry index and the epidemic opening policy.' },
        { label: 'Data', value: 'SSE pharmaceutical-industry index time series, 2016–2023.' },
        { label: 'Publication', value: 'Advances in Economics, Management and Political Sciences, Vol. 54, pp. 296–305.' },
      ],
      publicationLabel: 'Research summary on this website',
      venue: 'Advances in Economics, Management and Political Sciences',
      websiteTitle: 'Published paper website preview',
      websiteUrl: 'https://aemps.ewapub.com/article/view/7257',
      highlights: [
        { title: 'Question', body: 'How did the opening policy alter the trajectory and expectations of the pharmaceutical index?' },
        { title: 'Method', body: 'Stationarity testing, data transformation, and ARIMA time-series forecasting.' },
        { title: 'Output', body: 'A comparison of short-run volatility and longer-run market effects.' },
      ],
    },
  },
  fr: {
    dissertation: {
      id: 'action-bias-dissertation',
      eyebrow: 'Mémoire de licence · UCL · 2025',
      title: 'Biais d’action',
      subtitle: 'La tension entre action et utilité espérée dans les décisions boursières.',
      ariaLabel: 'Page détaillée du mémoire sur le biais d’action',
      closeLabel: 'Fermer la page du mémoire sur le biais d’action',
      documentTitle: 'Mémoire original de licence UCL sur le biais d’action',
      meta: ['Économie comportementale', 'Recherche empirique', '49 pages'],
      summary: 'Ce mémoire de l’UCL développe une mesure du degré de biais d’action et combine théorie comportementale et données de transaction afin d’identifier une préférence pour l’action sans justification suffisante par l’utilité.',
      details: [
        { label: 'Question', value: 'Comment mesurer le biais d’action dans les décisions financières en distinguant transaction rationnelle et préférence pour l’action ?' },
        { label: 'Méthode', value: 'Théorie comportementale, analyse économétrique et données boursières.' },
        { label: 'Résultat', value: 'Note finale de 71,9 (First Class) et sélection pour la galerie historique Hall of Fame des mémoires d’économie de l’UCL.' },
      ],
      pdf: '/papers/QuanZhong_ActionBias_BScDissertation_UCL_2025.pdf',
    },
    published: {
      id: 'epidemic-policy-paper',
      eyebrow: 'Article publié · 2023',
      title: 'Impact de la politique d’ouverture épidémique sur l’indice pharmaceutique',
      subtitle: 'Observer les réactions de marché à court et à long terme autour d’un changement de politique.',
      ariaLabel: 'Page détaillée de l’article sur l’indice pharmaceutique',
      closeLabel: 'Fermer la page de l’article publié',
      meta: ['Économétrie', 'ARIMA', 'Publié'],
      summary: 'À partir de l’indice pharmaceutique de Shanghai de 2016 à 2023, cette étude mobilise transformations, tests de stationnarité et prévisions ARIMA pour étudier les effets à court et à long terme de la politique d’ouverture.',
      details: [
        { label: 'Périmètre', value: 'Indice pharmaceutique chinois et politique d’ouverture épidémique.' },
        { label: 'Données', value: 'Série temporelle de l’indice pharmaceutique de Shanghai, 2016–2023.' },
        { label: 'Publication', value: 'Advances in Economics, Management and Political Sciences, vol. 54, p. 296–305.' },
      ],
      publicationLabel: 'Résumé de recherche sur ce site',
      venue: 'Advances in Economics, Management and Political Sciences',
      websiteTitle: 'Aperçu du site de publication de l’article',
      websiteUrl: 'https://aemps.ewapub.com/article/view/7257',
      highlights: [
        { title: 'Question', body: 'Comment la politique d’ouverture a-t-elle modifié la trajectoire et les attentes de l’indice ?' },
        { title: 'Méthode', body: 'Tests de stationnarité, transformation des données et prévisions ARIMA.' },
        { title: 'Résultat', body: 'Comparaison de la volatilité à court terme et des effets de marché à plus long terme.' },
      ],
    },
  },
}

const education = [
  {
    period: 'SEP 2025 — SEP 2026',
    degree: 'MSc Economics',
    school: 'University College London',
    status: 'Expected',
    description:
      'Advanced economics training with a growing focus on empirical methods, technology markets, and data-led decision making.',
    link: 'https://www.ucl.ac.uk/prospective-students/graduate/taught-degrees/economics-msc',
  },
  {
    period: 'SEP 2022 — JUN 2025',
    degree: 'BSc Economics',
    school: 'University College London',
    status: 'First Class Honours',
    description:
      'Built a rigorous foundation in microeconomics, macroeconomics, econometrics, and applied quantitative analysis.',
    link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/economics-bsc-econ/',
  },
]

const internships = [
  {
    period: 'JUN 2025 — SEP 2025',
    role: 'Portfolio Development',
    company: 'CHXWealth / AI Real Estate',
    location: 'The Shard, London',
    metric: '30%',
    metricLabel: 'landlord conversion lift',
    description:
      'Built multi-step GPT and Claude workflows that transformed listing data into market analysis, rental-yield breakdowns, and landlord pitch decks.',
    tags: ['AI workflows', 'Real estate', 'Market analysis'],
    link: 'https://chxwealth.com/',
  },
  {
    period: 'JUN 2024 — SEP 2024',
    role: 'Consulting Analyst & Financial Systems Engineer',
    company: 'Baosight Software',
    location: 'Wuhan, China',
    metric: '7',
    metricLabel: 'operational modules mapped',
    description:
      'Mapped the company resource-management workflow across ordering, contracts, approvals, transport, inventory, shipping, and settlement, contributing to cloud platform integration and automated financial reporting.',
    tags: ['Financial systems', 'Cloud platforms', 'Reporting'],
    link: 'https://www.baosight.com/',
  },
  {
    period: 'JUN 2023 — SEP 2023',
    role: 'Data Analytics Intern',
    company: 'Baosight Software',
    location: 'Wuhan, China',
    metric: '100K+',
    metricLabel: 'records processed',
    description:
      'Queried operational records in SQL and designed a divide-and-conquer aggregation workflow in Python to compute KPIs and produce visual reports for the company cloud system.',
    tags: ['Python', 'SQL', 'Pandas / NumPy'],
    link: 'https://www.baosight.com/',
  },
]

const projects = [
  {
    number: '01',
    eyebrow: 'PRODUCT / iOS / GAME',
    title: 'Pawlog',
    subtitle: 'An AI-assisted pet game that turns real life into play.',
    description:
      'A SwiftUI app mapping diary language and HealthKit signals into six evolving pet attributes, with a 2048-style adventure mode and a Supabase backend.',
    tags: ['SwiftUI', 'HealthKit', 'NLP', 'Supabase'],
    link: 'https://testflight.apple.com/join/s4tDfhHc',
    linkLabel: 'View TestFlight',
    visual: 'pawlog',
  },
  {
    number: '02',
    eyebrow: 'BEHAVIOURAL ECONOMICS / DISSERTATION',
    title: 'Action Bias',
    subtitle: 'Measuring the tension between action and expected utility.',
    description:
      'A first-class UCL dissertation developing a novel “degree” measure for action bias in stock-market decisions, combining behavioural theory with empirical trading analysis.',
    tags: ['Python', 'Stata', 'LaTeX', 'Behavioural Economics'],
    link: '/papers/QuanZhong_ActionBias_BScDissertation_UCL_2025.pdf',
    linkLabel: 'Read Dissertation',
    visual: 'dissertation',
  },
  {
    number: '03',
    eyebrow: 'ECONOMETRICS / RESEARCH',
    title: 'Stata → Python',
    subtitle: 'Rebuilding economics teaching material in open code.',
    description:
      'Reimplemented UCL Applied Economics tutorials and empirical projects in Python, matching OLS, robust standard errors, and hypothesis tests across toolchains.',
    tags: ['Python', 'Statsmodels', 'Econometrics'],
    link: 'https://www.ucl.ac.uk/social-historical-sciences/economics',
    linkLabel: 'UCL Economics',
    visual: 'research',
  },
]

const academicProjects = [
  {
    period: 'JUL — AUG 2023',
    title: 'Introduction to Causal Inference in Econometrics',
    advisor: 'Supervised by Professor Edward Vytlacil / Yale University',
    description:
      'Studied SLR, omitted-variable bias, multiple regression, difference-in-differences, and instrumental variables. Led a team analysis of the composition of the U.S. labour force.',
    tags: ['R', 'Stata', 'LaTeX', 'Causal Inference'],
  },
  {
    period: 'JUL — AUG 2021',
    title: 'An Inquiry into Heuristics & Biases',
    advisor: 'Supervised by Professor Edoardo Gallo / University of Cambridge',
    description:
      'Researched action bias, anchoring, loss aversion, the endowment effect, and framing, then designed a behavioural strategy for improving vaccine distribution.',
    tags: ['Behavioural Economics', 'Markdown', 'LaTeX'],
  },
]

const strengths = [
  {
    icon: BrainCircuit,
    index: '01',
    title: 'Structured AI Thinking',
    body: 'I turn broad questions into reliable systems: fixed inputs, chained prompts, evidence checks, and usable outputs.',
  },
  {
    icon: Database,
    index: '02',
    title: 'Data at Real Scale',
    body: 'I have queried and processed 100,000+ operational records with SQL, pandas, NumPy, and pragmatic aggregation logic.',
  },
  {
    icon: Gamepad2,
    index: '03',
    title: 'Product Instinct',
    body: 'I enjoy shaping the full loop: concept, architecture, interaction, balancing, backend, testing, and iteration.',
  },
  {
    icon: BarChart3,
    index: '04',
    title: 'Economic Lens',
    body: 'First-class economics training helps me connect technical execution to incentives, markets, measurement, and decisions.',
  },
]

const skillGroups = [
  {
    label: 'Technology',
    skills: [
      'Python',
      'SQL',
      'R',
      'Stata',
      'Swift',
      'SwiftUI',
      'Data Analytics',
      'Software Development',
      'LaTeX',
      'Markdown',
    ],
  },
  {
    label: 'Economics & Research',
    skills: [
      'Econometrics',
      'Statistics',
      'Machine Learning',
      'Time Series Analysis',
      'Quantitative Analysis',
      'Economic Research',
      'Behavioural Economics',
      'Advanced Microeconomics',
      'Microeconomics',
      'Macroeconomics',
      'Financial Economics',
      'Accounting',
      'Linear Algebra',
      'Research',
    ],
  },
  {
    label: 'Human',
    skills: ['Leadership', 'Communication'],
  },
]

const publications = [
  {
    year: '2023',
    title: 'The Impact of the Epidemic Opening Policy on the Pharmaceutical Industry Index',
    venue: 'Advances in Economics, Management and Political Sciences · Vol. 54 · pp. 296–305',
    description:
      'Applied ARIMA forecasting to SSE pharmaceutical-industry data from 2016–2023, using transformations and stationarity tests to estimate short- and long-term policy effects.',
    link: 'https://www.ewadirect.com/proceedings/aemps/article/view/7257',
  },
  {
    year: '2021',
    title: 'The Use of Behaviour Economics in Promoting Vaccines Distribution',
    venue: 'International Conference on World Trade and Economic Development · WTED-122',
    description:
      'Used anchoring, loss aversion, endowment effects, and framing to design a multi-stage strategy for increasing vaccination willingness.',
  },
]

const honors = [
  ['2024', 'Coursera Certificate in Machine Learning', 'University of Michigan / Coursera'],
  ['2024', 'Ranking 95th / 70,000 — Youth Creativity International Challenge', 'Belt and Road Initiatives 2028'],
  ['2021', 'Distinction — Euclid Mathematics Contest', 'University of Waterloo'],
  ['2021', 'Distinction — Hypatia Mathematics Contest', 'University of Waterloo'],
  ['2021', 'Coursera Certificate in Negotiation', 'Yale University / Coursera'],
  ['2021', 'Certificate in Removing Barriers to Change', 'Wharton / Coursera'],
  ['2021', 'First Prize, Senior Level — International Economics Olympiad', 'International Economics Olympiad'],
  ['2021', 'Regional Individual Top 100 — ARML', 'American Regions Mathematics League'],
  ['2020', 'Distinction, D-Intermediate — Australian Mathematics Competition', 'Australian Mathematics Trust'],
]

const languages = [
  { language: 'Chinese (Mandarin)', level: 'Native' },
  { language: 'English', level: 'Full professional proficiency' },
]

const timelinePositions = [
  { x: '4%', y: '81.1%' },
  { x: '24.3%', y: '50.5%' },
  { x: '44.5%', y: '38.3%' },
  { x: '60.3%', y: '68.9%' },
  { x: '83.4%', y: '25.2%' },
  { x: '96%', y: '15%' },
]

const languageOptions = [
  { code: 'zh', label: '简体中文', shortLabel: '简中', htmlLang: 'zh-CN' },
  { code: 'zhHant', label: '繁體中文', shortLabel: '繁中', htmlLang: 'zh-Hant' },
  { code: 'en', label: 'English', shortLabel: 'EN', htmlLang: 'en' },
  { code: 'fr', label: 'Français', shortLabel: 'FR', htmlLang: 'fr' },
]

const copyByLanguage = {
  zh: {
    nav: [
      { label: '首页', href: '#top' },
      { label: '关于', href: '#about' },
      { label: '方向', href: '#direction' },
      { label: '索引', href: '#links' },
      { label: '结束', href: '#ending' },
    ],
    languageAria: '选择语言',
    menuOpen: '打开菜单',
    menuClose: '关闭菜单',
    wordmarkAria: 'Quan Zhong，返回首页',
    heroKicker: [
      ['M', 'indful,'],
      ['I', 'ndustrious,'],
      ['N', 'ovel &'],
      ['D', 'edicated.'],
    ],
    heroMotto: '永远在热爱的领域里深耕。',
    heroMottoAria: '永远在热爱的领域里深耕',
    heroIndex: '作品集 / 2026',
    emailAria: 'Email Quan Zhong',
    about: {
      number: '01',
      label: '关于',
      aria: '个人信息',
      meta: [
        ['年龄', '22', 'meta-value-green'],
        ['性别', '男', ''],
        ['性取向', '异性恋', ''],
        ['MBTI', 'ENTJ', 'meta-value-purple'],
        ['星座', '双子座', ''],
      ],
    },
    direction: {
      number: '02',
      label: '方向',
      marquee: ['软件', 'AI', '研究', '运营'],
      timelineAria: 'AI 与编程时间线',
      milestonesAria: '时间线节点',
      timeline: [
        {
          year: '2022',
          title: 'Python 基础',
          body: '通过《Python编程：从入门到实践》和密歇根大学 Programming for Everybody 学习与练习。',
        },
        {
          year: '2023',
          title: 'Pandas + SQL + 爬虫',
          body: '在宝信软件实践 pandas 与 SQL，并自学爬虫流程，用于数据收集和处理。',
        },
        {
          year: '2024',
          title: 'STATA + R',
          body: '将 Stata 与 R 用于计量经济学和经济研究流程。',
        },
        {
          year: '2025',
          title: 'AI 房产工作流',
          body: '在 CHX 训练并使用 AI 工作流，完成数据分析与房产交互。',
        },
        {
          year: '2026',
          title: '爪记 iOS 软件 + PC 游戏',
          body: '独立开发爪记 iOS 软件并上架 TestFlight 测试。目前正在使用 Claude + Godot 制作 PC 游戏。',
        },
        {
          year: 'Next',
          title: '',
          body: '',
        },
      ],
    },
    links: {
      number: '03',
      label: '索引',
      aria: '个人内容链接索引',
      title: '三个入口，把我做过的和能证明我的内容放在一起。',
      note: '这一页不是另一份简历，而是通往作品、资料和证书的索引。',
      pawlogPreview: {
        kicker: '项目 01',
        title: 'Pawlog / 爪记',
        subtitle: '宠物成长记录与游戏化养成 iOS App',
        cta: '打开 TestFlight',
        closeLabel: '关闭 Pawlog 项目预览',
        ariaLabel: 'Pawlog 项目预览',
        imageAlt: 'Pawlog 的日记、宠物详情、2048 模式与日历功能总览',
      },
      cards: [
        {
          eyebrow: 'BUILDS',
          wheelTitle: '作品',
          title: '精选作品',
          body: '把已经能被点开、试用或继续追踪的作品集中在这里。',
          links: [
            { label: '爪记 - 与 AI 合力开发的 iOS 软件', href: 'https://testflight.apple.com/join/s4tDfhHc', preview: 'pawlog' },
            { label: '行动偏差论文', preview: 'paper-dissertation' },
            { label: '已发表论文', preview: 'paper-published' },
          ],
        },
        {
          eyebrow: 'IDENTITY',
          wheelTitle: '资料',
          title: '资料与联系',
          body: '更完整的公开履历、联系方式和可以快速了解我的入口。',
          links: [
            { label: '领英', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: '邮箱', href: 'mailto:17762583565@163.com' },
            { label: '电话', kind: 'phone' },
          ],
        },
        {
          eyebrow: 'PROOF',
          wheelTitle: '证书',
          title: '证书',
          body: '把课程、竞赛、论文和可验证的学习成果收束成一组。',
          links: [
            { label: 'Coursera / Machine Learning', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Coursera / Negotiation', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: '青年创意挑战赛', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Published Work', href: 'https://www.ewadirect.com/proceedings/aemps/article/view/7257' },
            { label: 'Mathematics Awards', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          ],
        },
      ],
      certificatesAria: '课程证书与竞赛荣誉展示',
      certificateOpen: '查看原件',
      certificateFoldersAria: '按领域筛选证书',
      certificateQuickLook: '快速检视',
      certificateQuickLookAria: '证书快速检视',
      certificateQuickLookClose: '关闭快速检视',
      certificateGroups: [
        { id: 'econ', label: '经济', countLabel: '4 项 · 经济与行为' },
        { id: 'math', label: '数学', countLabel: '4 项 · 数学' },
        { id: 'coding', label: '编程', countLabel: '2 项 · 编程与 AI' },
      ],
      certificateItems: [
        { type: '课程', year: '2024', title: '监督式机器学习：回归与分类', issuer: 'DeepLearning.AI × Stanford Online' },
        { type: '课程', year: '2022', title: '面向所有人的 Python', issuer: '密歇根大学' },
        { type: '课程', year: '2021', title: '谈判概论', issuer: '耶鲁大学' },
        { type: '课程', year: '2021', title: '消除改变的障碍', issuer: '宾夕法尼亚大学 Wharton' },
        { type: '经济学竞赛', year: '2021', title: 'IEO 区域赛个人一等奖', issuer: '国际经济学奥林匹克' },
        { type: '创意竞赛', year: '2021', title: '“一带一路”青年创意国际挑战赛二等奖', issuer: '新加坡国立大学相关赛事' },
        { type: '数学竞赛', year: '2021', title: 'ARML 区域个人前 100', issuer: 'American Regions Mathematics League' },
        { type: '数学竞赛', year: '2021', title: 'Euclid 数学竞赛优秀奖 · 前 25%', issuer: '滑铁卢大学' },
        { type: '数学竞赛', year: '2021', title: 'Hypatia 数学竞赛优秀奖 · 前 25%', issuer: '滑铁卢大学' },
        { type: '数学竞赛', year: '2021', title: 'AMC 澳大利亚数学竞赛银奖', issuer: 'Australian Mathematics Competition' },
      ],
    },
    sequence: {
      aria: 'Python 代码与手写结尾过渡',
      filename: 'closing.py',
      terminalLabel: '交互式 Python 终端',
      typingStatus: '正在输入',
      completeStatus: '运行完成',
      outputLabel: '输出',
    },
    ending: {
      number: '04',
      label: '结束',
      aria: '手写结束封面',
      videoLabel: '手写白字录屏',
      fallback: '你的浏览器暂不支持视频播放。',
      footer: {
        aria: '网站结尾与联系方式',
        tagline: '保持好奇，持续创造。',
        note: '正在寻找实习/工作机会。将匠人精神带到每时、每刻、每处。',
        explore: '浏览',
        direct: '联系',
        links: [
          { label: '首页', href: '#top' },
          { label: '关于', href: '#about' },
          { label: '方向', href: '#direction' },
          { label: '索引', href: '#links' },
        ],
        contacts: [
          { label: '领英', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          { label: '邮箱', href: 'mailto:17762583565@163.com' },
          { label: '中国电话', href: 'tel:+8617762583565' },
          { label: '英国电话', href: 'tel:+447526037298' },
        ],
        copyright: '© 2026 Quan Zhong. 保留所有权利。',
      },
    },
  },
  zhHant: {
    nav: [
      { label: '首頁', href: '#top' },
      { label: '關於', href: '#about' },
      { label: '方向', href: '#direction' },
      { label: '索引', href: '#links' },
      { label: '結尾', href: '#ending' },
    ],
    languageAria: '選擇語言',
    menuOpen: '打開選單',
    menuClose: '關閉選單',
    wordmarkAria: 'Quan Zhong，返回首頁',
    heroKicker: [
      ['M', 'indful,'],
      ['I', 'ndustrious,'],
      ['N', 'ovel &'],
      ['D', 'edicated.'],
    ],
    heroMotto: '永遠在熱愛的領域裡深耕。',
    heroMottoAria: '永遠在熱愛的領域裡深耕',
    heroIndex: '作品集 / 2026',
    emailAria: 'Email Quan Zhong',
    about: {
      number: '01',
      label: '關於',
      aria: '個人資訊',
      meta: [
        ['年齡', '22', 'meta-value-green'],
        ['性別', '男', ''],
        ['性取向', '異性戀', ''],
        ['MBTI', 'ENTJ', 'meta-value-purple'],
        ['星座', '雙子座', ''],
      ],
    },
    direction: {
      number: '02',
      label: '方向',
      marquee: ['軟體', 'AI', '研究', '設計'],
      timelineAria: 'AI 與程式設計時間線',
      milestonesAria: '時間線節點',
      timeline: [
        {
          year: '2022',
          title: 'Python 基礎',
          body: '透過《Python編程：從入門到實踐》和密歇根大學 Programming for Everybody 學習與練習。',
        },
        {
          year: '2023',
          title: 'Pandas + SQL + 爬蟲',
          body: '在寶信軟體實踐 pandas 與 SQL，並自學爬蟲流程，用於資料收集和處理。',
        },
        {
          year: '2024',
          title: 'STATA + R',
          body: '將 Stata 與 R 用於計量經濟學和經濟研究流程。',
        },
        {
          year: '2025',
          title: 'AI 房產工作流',
          body: '在 CHX 訓練並使用 AI 工作流，完成資料分析與房產互動。',
        },
        {
          year: '2026',
          title: '爪記 iOS 軟體 + PC 遊戲',
          body: '獨立開發爪記 iOS 軟體並上架 TestFlight 測試。目前正在使用 Claude + Godot 製作 PC 遊戲。',
        },
        {
          year: 'Next',
          title: '',
          body: '',
        },
      ],
    },
    links: {
      number: '03',
      label: '索引',
      aria: '個人內容連結索引',
      title: '三個入口，把我做過的和能證明我的內容放在一起。',
      note: '這一頁不是另一份履歷，而是通往作品、資料和證書的索引。',
      pawlogPreview: {
        kicker: '專案 01',
        title: 'Pawlog / 爪記',
        subtitle: '寵物成長記錄與遊戲化養成 iOS App',
        cta: '打開 TestFlight',
        closeLabel: '關閉 Pawlog 專案預覽',
        ariaLabel: 'Pawlog 專案預覽',
        imageAlt: 'Pawlog 的日記、寵物詳情、2048 模式與日曆功能總覽',
      },
      cards: [
        {
          eyebrow: 'BUILDS',
          wheelTitle: '作品',
          title: '精選作品',
          body: '把已經能被點開、試用或繼續追蹤的作品集中在這裡。',
          links: [
            { label: '爪記 - 與 AI 合力開發的 iOS 軟體', href: 'https://testflight.apple.com/join/s4tDfhHc', preview: 'pawlog' },
            { label: '行動偏差論文', preview: 'paper-dissertation' },
            { label: '已發表論文', preview: 'paper-published' },
          ],
        },
        {
          eyebrow: 'IDENTITY',
          wheelTitle: '資料',
          title: '資料與聯絡',
          body: '更完整的公開履歷、聯絡方式和可以快速了解我的入口。',
          links: [
            { label: '領英', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: '電郵', href: 'mailto:17762583565@163.com' },
            { label: '電話', kind: 'phone' },
          ],
        },
        {
          eyebrow: 'PROOF',
          wheelTitle: '證書',
          title: '證書',
          body: '把課程、競賽、論文和可驗證的學習成果收束成一組。',
          links: [
            { label: 'Coursera / Machine Learning', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Coursera / Negotiation', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: '青年創意挑戰賽', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Published Work', href: 'https://www.ewadirect.com/proceedings/aemps/article/view/7257' },
            { label: 'Mathematics Awards', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          ],
        },
      ],
      certificatesAria: '課程證書與競賽榮譽展示',
      certificateOpen: '查看原件',
      certificateFoldersAria: '依領域篩選證書',
      certificateQuickLook: '快速檢視',
      certificateQuickLookAria: '證書快速檢視',
      certificateQuickLookClose: '關閉快速檢視',
      certificateGroups: [
        { id: 'econ', label: '經濟', countLabel: '4 項 · 經濟與行為' },
        { id: 'math', label: '數學', countLabel: '4 項 · 數學' },
        { id: 'coding', label: '程式', countLabel: '2 項 · 程式與 AI' },
      ],
      certificateItems: [
        { type: '課程', year: '2024', title: '監督式機器學習：迴歸與分類', issuer: 'DeepLearning.AI × Stanford Online' },
        { type: '課程', year: '2022', title: '面向所有人的 Python', issuer: '密歇根大學' },
        { type: '課程', year: '2021', title: '談判概論', issuer: '耶魯大學' },
        { type: '課程', year: '2021', title: '消除改變的障礙', issuer: '賓夕法尼亞大學 Wharton' },
        { type: '經濟學競賽', year: '2021', title: 'IEO 區域賽個人一等獎', issuer: '國際經濟學奧林匹克' },
        { type: '創意競賽', year: '2021', title: '「一帶一路」青年創意國際挑戰賽二等獎', issuer: '新加坡國立大學相關賽事' },
        { type: '數學競賽', year: '2021', title: 'ARML 區域個人前 100', issuer: 'American Regions Mathematics League' },
        { type: '數學競賽', year: '2021', title: 'Euclid 數學競賽優秀獎 · 前 25%', issuer: '滑鐵盧大學' },
        { type: '數學競賽', year: '2021', title: 'Hypatia 數學競賽優秀獎 · 前 25%', issuer: '滑鐵盧大學' },
        { type: '數學競賽', year: '2021', title: 'AMC 澳洲數學競賽銀獎', issuer: 'Australian Mathematics Competition' },
      ],
    },
    sequence: {
      aria: 'Python 程式碼與手寫結尾過渡',
      filename: 'closing.py',
      terminalLabel: '互動式 Python 終端',
      typingStatus: '正在輸入',
      completeStatus: '執行完成',
      outputLabel: '輸出',
    },
    ending: {
      number: '04',
      label: '結尾',
      aria: '手寫結尾封面',
      videoLabel: '手寫白字錄屏',
      fallback: '你的瀏覽器暫不支援影片播放。',
      footer: {
        aria: '網站結尾與聯絡方式',
        tagline: '保持好奇，持續創造。',
        note: '正在尋找實習／工作機會。將匠人精神帶到每時、每刻、每處。',
        explore: '瀏覽',
        direct: '聯絡',
        links: [
          { label: '首頁', href: '#top' },
          { label: '關於', href: '#about' },
          { label: '方向', href: '#direction' },
          { label: '索引', href: '#links' },
        ],
        contacts: [
          { label: '領英', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          { label: '電郵', href: 'mailto:17762583565@163.com' },
          { label: '中國電話', href: 'tel:+8617762583565' },
          { label: '英國電話', href: 'tel:+447526037298' },
        ],
        copyright: '© 2026 Quan Zhong. 保留所有權利。',
      },
    },
  },
  en: {
    nav: [
      { label: 'Home', href: '#top' },
      { label: 'About', href: '#about' },
      { label: 'Direction', href: '#direction' },
      { label: 'Index', href: '#links' },
      { label: 'Ending', href: '#ending' },
    ],
    languageAria: 'Choose language',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    wordmarkAria: 'Quan Zhong, home',
    heroKicker: [
      ['M', 'indful,'],
      ['I', 'ndustrious,'],
      ['N', 'ovel &'],
      ['D', 'edicated.'],
    ],
    heroMotto: 'Always delve deeply into the field I love.',
    heroMottoAria: 'Always delve deeply into the field I love',
    heroIndex: 'PORTFOLIO / 2026',
    emailAria: 'Email Quan Zhong',
    about: {
      number: '01',
      label: 'About',
      aria: 'Personal profile details',
      meta: [
        ['Age', '22', 'meta-value-green'],
        ['Gender', 'Male', ''],
        ['Sexual Orientation', 'Straight', ''],
        ['MBTI', 'ENTJ', 'meta-value-purple'],
        ['Zodiac Sign', 'Gemini', ''],
      ],
    },
    direction: {
      number: '02',
      label: 'Direction',
      marquee: ['Software', 'AI', 'Research', 'Design'],
      timelineAria: 'AI and programming timeline',
      milestonesAria: 'Timeline milestones',
      timeline: [
        {
          year: '2022',
          title: 'Python Foundations',
          body: "Practiced with Eric Matthes's Python Crash Course and the University of Michigan's Programming for Everybody.",
        },
        {
          year: '2023',
          title: 'Pandas + SQL + Scraping',
          body: 'Practiced pandas and SQL at Baosight Software, plus self-studied scraping workflows.',
        },
        {
          year: '2024',
          title: 'STATA + R',
          body: 'Used Stata and R for econometrics and economics research workflows.',
        },
        {
          year: '2025',
          title: 'AI Real Estate Workflows',
          body: 'At CHX, trained and used AI workflows for data analysis and property interaction.',
        },
        {
          year: '2026',
          title: 'Pawlog iOS App + PC Game',
          body: 'Self-developed the Pawlog iOS app and released it for TestFlight testing. Currently building a PC game with Claude + Godot.',
        },
        {
          year: 'Next',
          title: '',
          body: '',
        },
      ],
    },
    links: {
      number: '03',
      label: 'Index',
      aria: 'Personal content link index',
      title: 'Three doors into what I have built and what proves the work.',
      note: 'Not another CV page. More like a clean index for projects, profiles, and certificates.',
      pawlogPreview: {
        kicker: 'PROJECT 01',
        title: 'Pawlog / 爪记',
        subtitle: 'A gamified iOS app for recording and growing with your pets.',
        cta: 'Open TestFlight',
        closeLabel: 'Close Pawlog project preview',
        ariaLabel: 'Pawlog project preview',
        imageAlt: 'Overview of Pawlog journal, pet profile, 2048 mode, and calendar features',
      },
      cards: [
        {
          eyebrow: 'BUILDS',
          wheelTitle: 'Projects',
          title: 'Selected Projects',
          body: 'A focused shelf for work that can be opened, tested, or followed as it develops.',
          links: [
            { label: 'Pawlog - an iOS app co-developed with AI', href: 'https://testflight.apple.com/join/s4tDfhHc', preview: 'pawlog' },
            { label: 'Action Bias Dissertation', preview: 'paper-dissertation' },
            { label: 'Published Paper', preview: 'paper-published' },
          ],
        },
        {
          eyebrow: 'IDENTITY',
          wheelTitle: 'Profile',
          title: 'Profile Links',
          body: 'The fastest routes to my public profile, professional context, and direct contact.',
          links: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Email', href: 'mailto:17762583565@163.com' },
            { label: 'Phone', kind: 'phone' },
          ],
        },
        {
          eyebrow: 'PROOF',
          wheelTitle: 'Certificates',
          title: 'Certificates',
          body: 'Courses, competitions, published work, and verifiable learning signals in one place.',
          links: [
            { label: 'Coursera / Machine Learning', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Coursera / Negotiation', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Youth Creativity Challenge', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Published Work', href: 'https://www.ewadirect.com/proceedings/aemps/article/view/7257' },
            { label: 'Mathematics Awards', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          ],
        },
      ],
      certificatesAria: 'Course certificates and competition awards',
      certificateOpen: 'Open proof',
      certificateFoldersAria: 'Filter certificates by field',
      certificateQuickLook: 'Quick Look',
      certificateQuickLookAria: 'Certificate Quick Look',
      certificateQuickLookClose: 'Close Quick Look',
      certificateGroups: [
        { id: 'econ', label: 'Economics', countLabel: '4 items · Economics & behaviour' },
        { id: 'math', label: 'Mathematics', countLabel: '4 items · Mathematics' },
        { id: 'coding', label: 'Coding', countLabel: '2 items · Code & AI' },
      ],
      certificateItems: [
        { type: 'Course', year: '2024', title: 'Supervised Machine Learning', issuer: 'DeepLearning.AI × Stanford Online' },
        { type: 'Course', year: '2022', title: 'Programming for Everybody', issuer: 'University of Michigan' },
        { type: 'Course', year: '2021', title: 'Introduction to Negotiation', issuer: 'Yale University' },
        { type: 'Course', year: '2021', title: 'Removing Barriers to Change', issuer: 'University of Pennsylvania · Wharton' },
        { type: 'Economics', year: '2021', title: 'IEO Regional · First Prize', issuer: 'International Economics Olympiad' },
        { type: 'Creativity', year: '2021', title: 'Belt and Road Youth Challenge · Second Prize', issuer: 'NUS-associated international challenge' },
        { type: 'Mathematics', year: '2021', title: 'ARML Regional Individual Top 100', issuer: 'American Regions Mathematics League' },
        { type: 'Mathematics', year: '2021', title: 'Euclid Contest · Distinction · Top 25%', issuer: 'University of Waterloo' },
        { type: 'Mathematics', year: '2021', title: 'Hypatia Contest · Distinction · Top 25%', issuer: 'University of Waterloo' },
        { type: 'Mathematics', year: '2021', title: 'Australian Mathematics Competition · Silver', issuer: 'Australian Mathematics Competition' },
      ],
    },
    sequence: {
      aria: 'Python code transitioning into the handwritten ending',
      filename: 'closing.py',
      terminalLabel: 'Interactive Python terminal',
      typingStatus: 'Typing',
      completeStatus: 'Execution complete',
      outputLabel: 'Output',
    },
    ending: {
      number: '04',
      label: 'Ending',
      aria: 'Handwritten ending cover',
      videoLabel: 'White handwriting screen recording',
      fallback: 'Your browser does not support video playback.',
      footer: {
        aria: 'Site ending and contact details',
        tagline: 'Stay curious. Keep creating.',
        note: "Seeking internship and career opportunities. Bringing a craftsperson's mindset to every moment and every place.",
        explore: 'Explore',
        direct: 'Direct',
        links: [
          { label: 'Home', href: '#top' },
          { label: 'About', href: '#about' },
          { label: 'Direction', href: '#direction' },
          { label: 'Index', href: '#links' },
        ],
        contacts: [
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          { label: 'Email', href: 'mailto:17762583565@163.com' },
          { label: 'China phone', href: 'tel:+8617762583565' },
          { label: 'UK phone', href: 'tel:+447526037298' },
        ],
        copyright: '© 2026 Quan Zhong. All rights reserved.',
      },
    },
  },
  fr: {
    nav: [
      { label: 'Accueil', href: '#top' },
      { label: 'À propos', href: '#about' },
      { label: 'Direction', href: '#direction' },
      { label: 'Index', href: '#links' },
      { label: 'Fin', href: '#ending' },
    ],
    languageAria: 'Choisir la langue',
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    wordmarkAria: 'Quan Zhong, accueil',
    heroKicker: [
      ['M', 'indful,'],
      ['I', 'ndustrious,'],
      ['N', 'ovel &'],
      ['D', 'edicated.'],
    ],
    heroMotto: "Toujours approfondir le domaine que j'aime.",
    heroMottoAria: "Toujours approfondir le domaine que j'aime",
    heroIndex: 'PORTFOLIO / 2026',
    emailAria: 'Envoyer un email à Quan Zhong',
    about: {
      number: '01',
      label: 'About',
      aria: 'Informations personnelles',
      meta: [
        ['Âge', '22', 'meta-value-green'],
        ['Genre', 'Homme', ''],
        ['Orientation sexuelle', 'Hétérosexuel', ''],
        ['MBTI', 'ENTJ', 'meta-value-purple'],
        ['Signe astrologique', 'Gémeaux', ''],
      ],
    },
    direction: {
      number: '02',
      label: 'Direction',
      marquee: ['Logiciel', 'IA', 'Recherche', 'Design'],
      timelineAria: 'Parcours IA et programmation',
      milestonesAria: 'Étapes du parcours',
      timeline: [
        {
          year: '2022',
          title: 'Bases Python',
          body: "Apprentissage avec Python Crash Course d’Eric Matthes et le cours Programming for Everybody de l’Université du Michigan.",
        },
        {
          year: '2023',
          title: 'Pandas + SQL + Scraping',
          body: 'Pratique de pandas et SQL chez Baosight Software, avec autoformation aux workflows de scraping.',
        },
        {
          year: '2024',
          title: 'STATA + R',
          body: "Usage de Stata et R pour l'économétrie et les workflows de recherche économique.",
        },
        {
          year: '2025',
          title: 'Workflows IA immobiliers',
          body: "Chez CHX, entraînement et usage de workflows IA pour l'analyse de données et l'interaction immobilière.",
        },
        {
          year: '2026',
          title: 'App iOS Pawlog + Jeu PC',
          body: "Développement indépendant de l’app iOS Pawlog, publiée en test sur TestFlight. Création en cours d’un jeu PC avec Claude + Godot.",
        },
        {
          year: 'Next',
          title: '',
          body: '',
        },
      ],
    },
    links: {
      number: '03',
      label: 'Index',
      aria: 'Index des liens personnels',
      title: "Trois portes vers ce que j'ai construit et ce qui le prouve.",
      note: 'Pas une autre page de CV, mais un index clair pour les projets, profils et certificats.',
      pawlogPreview: {
        kicker: 'PROJET 01',
        title: 'Pawlog / 爪记',
        subtitle: 'Une application iOS ludique pour suivre la croissance de ses animaux.',
        cta: 'Ouvrir TestFlight',
        closeLabel: 'Fermer l’aperçu du projet Pawlog',
        ariaLabel: 'Aperçu du projet Pawlog',
        imageAlt: 'Vue d’ensemble du journal, du profil animal, du mode 2048 et du calendrier de Pawlog',
      },
      cards: [
        {
          eyebrow: 'BUILDS',
          wheelTitle: 'Projets',
          title: 'Selected Projects',
          body: 'Un espace concentré pour les travaux que l’on peut ouvrir, tester ou suivre dans leur évolution.',
          links: [
            { label: 'Pawlog - une application iOS co-développée avec l’IA', href: 'https://testflight.apple.com/join/s4tDfhHc', preview: 'pawlog' },
            { label: 'Mémoire sur le biais d’action', preview: 'paper-dissertation' },
            { label: 'Article publié', preview: 'paper-published' },
          ],
        },
        {
          eyebrow: 'IDENTITY',
          wheelTitle: 'Profil',
          title: 'Profile Links',
          body: 'Les chemins les plus rapides vers mon profil public, mon contexte professionnel et le contact direct.',
          links: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Email', href: 'mailto:17762583565@163.com' },
            { label: 'Téléphone', kind: 'phone' },
          ],
        },
        {
          eyebrow: 'PROOF',
          wheelTitle: 'Certificats',
          title: 'Certificates',
          body: 'Cours, concours, publication et preuves vérifiables de progression réunis en un seul endroit.',
          links: [
            { label: 'Coursera / Machine Learning', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Coursera / Negotiation', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Youth Creativity Challenge', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
            { label: 'Publication', href: 'https://www.ewadirect.com/proceedings/aemps/article/view/7257' },
            { label: 'Prix de mathématiques', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          ],
        },
      ],
      certificatesAria: 'Certificats de cours et distinctions de concours',
      certificateOpen: 'Voir la preuve',
      certificateFoldersAria: 'Filtrer les certificats par domaine',
      certificateQuickLook: 'Aperçu rapide',
      certificateQuickLookAria: 'Aperçu rapide du certificat',
      certificateQuickLookClose: 'Fermer l’aperçu',
      certificateGroups: [
        { id: 'econ', label: 'Économie', countLabel: '4 éléments · Économie et comportement' },
        { id: 'math', label: 'Mathématiques', countLabel: '4 éléments · Mathématiques' },
        { id: 'coding', label: 'Programmation', countLabel: '2 éléments · Code et IA' },
      ],
      certificateItems: [
        { type: 'Cours', year: '2024', title: 'Apprentissage supervisé', issuer: 'DeepLearning.AI × Stanford Online' },
        { type: 'Cours', year: '2022', title: 'Programming for Everybody', issuer: 'Université du Michigan' },
        { type: 'Cours', year: '2021', title: 'Introduction à la négociation', issuer: 'Université Yale' },
        { type: 'Cours', year: '2021', title: 'Removing Barriers to Change', issuer: 'Université de Pennsylvanie · Wharton' },
        { type: 'Économie', year: '2021', title: 'IEO régional · Premier prix', issuer: "Olympiade internationale d'économie" },
        { type: 'Créativité', year: '2021', title: 'Défi jeunesse Belt and Road · Deuxième prix', issuer: 'Concours international associé à la NUS' },
        { type: 'Mathématiques', year: '2021', title: 'ARML régional · Top 100 individuel', issuer: 'American Regions Mathematics League' },
        { type: 'Mathématiques', year: '2021', title: 'Concours Euclid · Distinction · Top 25 %', issuer: 'Université de Waterloo' },
        { type: 'Mathématiques', year: '2021', title: 'Concours Hypatia · Distinction · Top 25 %', issuer: 'Université de Waterloo' },
        { type: 'Mathématiques', year: '2021', title: 'Concours australien de mathématiques · Argent', issuer: 'Australian Mathematics Competition' },
      ],
    },
    sequence: {
      aria: 'Transition du code Python vers la fin manuscrite',
      filename: 'closing.py',
      terminalLabel: 'Terminal Python interactif',
      typingStatus: 'Saisie en cours',
      completeStatus: 'Exécution terminée',
      outputLabel: 'Sortie',
    },
    ending: {
      number: '04',
      label: 'Ending',
      aria: 'Couverture finale manuscrite',
      videoLabel: 'Enregistrement manuscrit en blanc',
      fallback: 'Votre navigateur ne prend pas en charge la lecture vidéo.',
      footer: {
        aria: 'Fin du site et coordonnées',
        tagline: 'Rester curieux. Continuer à créer.',
        note: 'À la recherche d’un stage ou d’un emploi. Apporter un esprit d’artisan à chaque instant et en tout lieu.',
        explore: 'Explorer',
        direct: 'Contact',
        links: [
          { label: 'Accueil', href: '#top' },
          { label: 'À propos', href: '#about' },
          { label: 'Direction', href: '#direction' },
          { label: 'Index', href: '#links' },
        ],
        contacts: [
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/quan-zhong-ss92' },
          { label: 'E-mail', href: 'mailto:17762583565@163.com' },
          { label: 'Téléphone Chine', href: 'tel:+8617762583565' },
          { label: 'Téléphone R.-U.', href: 'tel:+447526037298' },
        ],
        copyright: '© 2026 Quan Zhong. Tous droits réservés.',
      },
    },
  },
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [activeLinkIndex, setActiveLinkIndex] = useState(0)
  const [expandedContentGroups, setExpandedContentGroups] = useState({
    0: new Set(),
    1: new Set(),
  })
  const [quickLookCertificate, setQuickLookCertificate] = useState(null)
  const [projectPreview, setProjectPreview] = useState(null)
  const [paperPreview, setPaperPreview] = useState(null)
  const [headerFloating, setHeaderFloating] = useState(false)
  const directionSectionRef = useRef(null)
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'zh'
    const storedLanguage = window.localStorage.getItem('portfolio-language')
    return copyByLanguage[storedLanguage] ? storedLanguage : 'zh'
  })
  const copy = copyByLanguage[language]
  const currentLanguage = languageOptions.find((item) => item.code === language) || languageOptions[0]
  const directionTimeline = copy.direction.timeline.map((item, index) => ({
    ...item,
    ...timelinePositions[index],
  }))
  const linkCards = copy.links.cards
  const activeLinkCard = linkCards[Math.min(activeLinkIndex, Math.max(linkCards.length - 1, 0))]
  const certificateCards = copy.links.certificateItems.map((item, index) => ({
    ...certificateAssets[index],
    ...item,
  }))
  const certificateGroups = copy.links.certificateGroups.map((group) => ({
    ...group,
    cards: certificateCards.filter((card) => card.group === group.id),
  }))
  const contentTreeCopy = contentTreeCopyByLanguage[language]
  const paperPreviewCopy = paperPreviewCopyByLanguage[language]
  const contentGroups = activeLinkIndex === 0
    ? [
      {
        id: 'project-pawlog',
        label: activeLinkCard.links[0].label,
        countLabel: contentTreeCopy.projectMeta[0],
        items: [
          {
            id: 'project-file-pawlog',
            ...activeLinkCard.links[0],
            label: contentTreeCopy.projectAction[0],
            meta: contentTreeCopy.fileMeta[0],
          },
        ],
      },
      {
        id: 'project-papers',
        label: contentTreeCopy.projectFolder,
        countLabel: contentTreeCopy.projectMeta[1],
        items: activeLinkCard.links.slice(1).map((link, index) => ({
          id: `project-paper-${index}`,
          ...link,
          label: contentTreeCopy.projectAction[index + 1],
          meta: contentTreeCopy.fileMeta[0],
        })),
      },
    ]
    : activeLinkIndex === 1
      ? [
          {
            id: 'profile-linkedin',
            label: activeLinkCard.links[0].label,
            countLabel: contentTreeCopy.profileMeta[0],
            items: [
              {
                id: 'profile-linkedin-file',
                label: 'linkedin.com/in/quan-zhong-ss92',
                meta: contentTreeCopy.fileMeta[0],
                href: activeLinkCard.links[0].href,
              },
            ],
          },
          {
            id: 'profile-email',
            label: activeLinkCard.links[1].label,
            countLabel: contentTreeCopy.profileMeta[1],
            items: [
              {
                id: 'profile-email-file',
                label: '17762583565@163.com',
                meta: contentTreeCopy.fileMeta[1],
                href: activeLinkCard.links[1].href,
              },
            ],
          },
          {
            id: 'profile-phone',
            label: activeLinkCard.links[2].label,
            countLabel: contentTreeCopy.profileMeta[2],
            items: phoneContactsByLanguage[language].map((phone, index) => ({
              id: `profile-phone-${index}`,
              label: phone.label,
              meta: contentTreeCopy.fileMeta[2],
              href: phone.href,
            })),
          },
        ]
      : []
  useGSAP(
    () => {
      const map = directionSectionRef.current?.querySelector('.direction-map')
      const path = map?.querySelector('.timeline-path')
      const shadow = map?.querySelector('.timeline-shadow')
      const points = map ? gsap.utils.toArray('.timeline-point', map) : []
      const copies = map ? gsap.utils.toArray('.timeline-copy', map) : []

      if (!map || !path || !shadow || points.length === 0) return undefined

      const pathLength = path.getTotalLength()
      const drawDuration = 4.9
      const media = gsap.matchMedia()

      media.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 900px)',
        },
        (context) => {
          if (context.conditions.reduced) {
            gsap.set([path, shadow], {
              strokeDasharray: pathLength,
              strokeDashoffset: 0,
            })
            gsap.set(shadow, { opacity: 1 })
            gsap.set(points, { autoAlpha: 1, y: 0 })
            gsap.set(copies, { autoAlpha: 1, y: 0 })
            return
          }

          if (context.conditions.mobile) {
            gsap.set([path, shadow], {
              strokeDasharray: pathLength,
              strokeDashoffset: 0,
              opacity: 0,
            })
            gsap.set(points, { autoAlpha: 0, y: 12 })
            gsap.set(copies, { autoAlpha: 0, y: 10 })

            const mobileTimeline = gsap.timeline({
              defaults: { overwrite: 'auto' },
              scrollTrigger: {
                trigger: map,
                start: 'top 86%',
                once: true,
              },
            })

            points.forEach((point, index) => {
              const revealAt = index * 0.16

              mobileTimeline.to(
                point,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.42,
                  ease: 'power2.out',
                },
                revealAt,
              )

              if (copies[index]) {
                mobileTimeline.to(
                  copies[index],
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power3.out',
                  },
                  revealAt + 0.03,
                )
              }
            })

            return
          }

          gsap.set([path, shadow], {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          })
          gsap.set(shadow, { opacity: 0 })
          gsap.set(points, { autoAlpha: 0, y: 12 })
          gsap.set(copies, { autoAlpha: 0, y: 10 })

          const timeline = gsap.timeline({
            defaults: { overwrite: 'auto' },
            scrollTrigger: {
              trigger: map,
              start: 'top 78%',
              once: true,
            },
          })

          timeline
            .to(shadow, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.08)
            .to(
              [shadow, path],
              {
                strokeDashoffset: 0,
                duration: drawDuration,
                ease: 'power1.inOut',
              },
              0,
            )

          points.forEach((point, index) => {
            const x = Number.parseFloat(point.style.getPropertyValue('--point-x')) / 100
            const revealAt = Math.max(0.12, Math.min(drawDuration - 0.2, x * drawDuration))

            timeline.to(
              point,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
              },
              revealAt,
            )

            if (copies[index]) {
              timeline.to(
                copies[index],
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.72,
                  ease: 'power3.out',
                },
                revealAt + 0.06,
              )
            }
          })
        },
      )

      ScrollTrigger.refresh()
      return () => media.revert()
    },
    { scope: directionSectionRef, dependencies: [language], revertOnUpdate: true },
  )

  const selectLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    setLanguageMenuOpen(false)
    setMenuOpen(false)
  }

  useEffect(() => {
    const sections = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.12 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateHeader = () => {
      const hero = document.querySelector('.hero')
      setHeaderFloating(window.scrollY >= (hero?.offsetHeight ?? window.innerHeight) - 80)
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader)

    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = currentLanguage.htmlLang
    window.localStorage.setItem('portfolio-language', language)
  }, [currentLanguage.htmlLang, language])

  useEffect(() => {
    if (activeLinkIndex >= linkCards.length) setActiveLinkIndex(Math.max(linkCards.length - 1, 0))
  }, [activeLinkIndex, linkCards.length])

  useEffect(() => {
    const closeLanguageMenu = (event) => {
      if (event.key === 'Escape') setLanguageMenuOpen(false)
    }

    window.addEventListener('keydown', closeLanguageMenu)
    return () => window.removeEventListener('keydown', closeLanguageMenu)
  }, [])

  return (
    <main>
      <header className={`site-header${headerFloating ? ' is-floating' : ''}`}>
        <a className="wordmark" href="#top" aria-label={copy.wordmarkAria}>
          QZ<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {copy.nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="language-picker">
          <button
            className="header-contact language-toggle"
            type="button"
            aria-label={copy.languageAria}
            aria-expanded={languageMenuOpen}
            onClick={() => setLanguageMenuOpen((current) => !current)}
          >
            {currentLanguage.shortLabel} <Languages size={16} />
          </button>
          {languageMenuOpen && (
            <div className="language-menu" role="menu" aria-label={copy.languageAria}>
              {languageOptions.map((item) => (
                <button
                  className={item.code === language ? 'is-active' : ''}
                  type="button"
                  role="menuitem"
                  key={item.code}
                  onClick={() => selectLanguage(item.code)}
                >
                  <span>{item.label}</span>
                  <small>{item.shortLabel}</small>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {copy.nav.map((item) => (
              <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="mobile-language-group" aria-label={copy.languageAria}>
              {languageOptions.map((item) => (
                <button
                  className={`mobile-language-toggle${item.code === language ? ' is-active' : ''}`}
                  type="button"
                  key={item.code}
                  onClick={() => selectLanguage(item.code)}
                >
                  {item.label} <span>{item.shortLabel}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section className="hero" id="top">
        <PlasmaWave
          className="hero-plasma"
          colors={['#A855F7', '#C8FF45']}
          speed1={0.038}
          speed2={0.045}
          focalLength={0.86}
          bend1={0.9}
          bend2={0.58}
          dir2={-1}
          rotationDeg={-4}
          xOffset={-90}
          yOffset={20}
        />
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="hero-content">
          <p className="hero-kicker">
            {copy.heroKicker.map(([letter, rest]) => (
              <span key={`${letter}-${rest}`}>
                <span className="kicker-letter">{letter}</span>
                {rest}{' '}
              </span>
            ))}
          </p>
          <TextType
            key={language}
            as="h1"
            className="motto-title"
            text={copy.heroMotto}
            typingSpeed={50}
            initialDelay={350}
            loop={false}
            showCursor
            cursorCharacter="|"
            cursorClassName="motto-cursor"
            aria-label={copy.heroMottoAria}
          />
          <div className="hero-bottom">
            <a className="round-link" href="mailto:17762583565@163.com" aria-label={copy.emailAria}>
              <ArrowUpRight />
            </a>
          </div>
        </div>
        <div className="hero-index">{copy.heroIndex}</div>
      </section>

      {showAboutSection && (
      <section className="about section-shell" id="about">
        <p className="section-label about-heading" data-reveal>
          <span>{copy.about.number}</span>
          {copy.about.label}
        </p>
        <div className="personal-meta" aria-label={copy.about.aria} data-reveal>
          {copy.about.meta.map(([label, value, className]) => (
            <div key={label}>
              <span>{label}</span>
              <strong
                className={className}
                style={{ '--meta-scale': Math.min(1, 7.8 / value.length) }}
              >
                {value}
              </strong>
            </div>
          ))}
        </div>
      </section>
      )}

      <section className="direction section-shell" id="direction" ref={directionSectionRef}>
        <p className="section-label direction-heading" data-reveal>
          <span>{copy.direction.number}</span>
          {copy.direction.label}
        </p>
        <div className="direction-intro" data-reveal>
          <div>
            <PerspectiveMarquee
              className="direction-marquee"
              items={copy.direction.marquee}
              duration={12}
            />
          </div>
        </div>

        <div className="direction-map">
          <svg
            className="timeline-curve"
            viewBox="0 0 1200 360"
            preserveAspectRatio="none"
            role="img"
            aria-label={copy.direction.timelineAria}
          >
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="58%" stopColor="#C8FF45" />
                <stop offset="100%" stopColor="#F2FFD8" />
              </linearGradient>
              <filter id="timelineGlow" x="-30%" y="-80%" width="160%" height="260%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              className="timeline-shadow"
              d="M48 292 C282 315 300 26 534 138 C715 224 738 334 895 172 C1012 52 1072 76 1152 54"
            />
            <path
              className="timeline-path"
              d="M48 292 C282 315 300 26 534 138 C715 224 738 334 895 172 C1012 52 1072 76 1152 54"
            />
          </svg>

          <div className="timeline-points" aria-label={copy.direction.milestonesAria}>
            {directionTimeline.map((item, index) => (
              <article
                className={`timeline-point timeline-point-${index + 1}${item.title ? '' : ' timeline-point-empty'}`}
                key={`${item.year}-${item.title || 'empty'}`}
                style={{ '--point-x': item.x, '--point-y': item.y }}
              >
                <div className="timeline-copy">
                  {item.year && <span>{item.year}</span>}
                  {item.title && <h3>{item.title}</h3>}
                  {item.body && <p>{item.body}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="link-index section-shell" id="links" aria-label={copy.links.aria}>
        <div className="link-index-heading" data-reveal>
          <p className="section-label">
            <span>{copy.links.number}</span>
            {copy.links.label}
          </p>
        </div>
        <div className="link-console">
          <div className="link-sidebar-panel">
            <LineSidebar
              key={`${language}-${linkCards.length}`}
              items={linkCards.map((item) => item.wheelTitle || item.title)}
              accentColor="#a855f7"
              textColor="rgba(255, 255, 255, 0.42)"
              showIndex
              showMarker={false}
              maxShift={8}
              scaleTick={false}
              itemGap={0}
              fontSize={1.25}
              smoothing={260}
              defaultActive={activeLinkIndex}
              className="link-sidebar"
              onItemClick={(index) => setActiveLinkIndex(index)}
            />
          </div>

          {activeLinkCard && activeLinkIndex === 2 ? (
            <article className="link-display" key={`${language}-certificates`}>
              <CertificateFileTree
                groups={certificateGroups}
                ariaLabel={copy.links.certificatesAria}
                onItemSelect={(card, sourceElement) => {
                  const sourceRect = sourceElement.getBoundingClientRect()
                  setQuickLookCertificate({
                    ...card,
                    quickLookLabel: `${card.title} · ${copy.links.certificateQuickLook}`,
                    sourceElement,
                    sourceRect: {
                      top: sourceRect.top,
                      left: sourceRect.left,
                      width: sourceRect.width,
                      height: sourceRect.height,
                    },
                  })
                }}
              />
            </article>
          ) : activeLinkCard ? (
            <article className="link-display" key={`${language}-${activeLinkCard.title}`}>
              <ContentFileTree
                groups={contentGroups}
                ariaLabel={contentTreeCopy.aria[activeLinkIndex]}
                expandedIds={expandedContentGroups[activeLinkIndex] || new Set()}
                onExpandedChange={(nextExpandedIds) => {
                  setExpandedContentGroups((current) => ({
                    ...current,
                    [activeLinkIndex]: nextExpandedIds,
                  }))
                }}
                onPreview={(item, sourceElement) => {
                  if (item.preview === 'paper-dissertation' || item.preview === 'paper-published') {
                    const paperKey = item.preview === 'paper-dissertation' ? 'dissertation' : 'published'
                    setPaperPreview(paperPreviewCopy[paperKey])
                    return
                  }

                  const sourceRect = sourceElement.getBoundingClientRect()
                  setProjectPreview({
                    id: 'pawlog',
                    ...copy.links.pawlogPreview,
                    href: item.href,
                    image: '/projects/pawlog-overview.png',
                    sourceRect: {
                      top: sourceRect.top,
                      left: sourceRect.left,
                      width: sourceRect.width,
                      height: sourceRect.height,
                    },
                  })
                }}
              />
            </article>
          ) : null}
        </div>
      </section>

      {quickLookCertificate ? (
        <CertificateQuickLook
          item={quickLookCertificate}
          ariaLabel={copy.links.certificateQuickLookAria}
          closeLabel={copy.links.certificateQuickLookClose}
          onClose={() => setQuickLookCertificate(null)}
        />
      ) : null}

      {projectPreview ? (
        <ProjectPreview project={projectPreview} onClose={() => setProjectPreview(null)} />
      ) : null}

      {paperPreview ? (
        <PaperPreview
          paper={paperPreview}
          onClose={() => {
            setPaperPreview(null)
            setActiveLinkIndex(0)
            setExpandedContentGroups((current) => ({
              ...current,
              0: new Set([...current[0], 'project-papers']),
            }))
          }}
        />
      ) : null}

      <ClosingSequence
        key={language}
        copy={copy.sequence}
        endingCopy={copy.ending}
      />

      {showPortfolioSections && (
        <>
      <section className="resume-chapter education-chapter" id="education">
        <div className="chapter-shell">
          <ChapterHeading
            number="02"
            eyebrow="Education"
            title="Economic foundations, built at UCL."
            note="London / 2022 — 2026"
          />
          <div className="education-list">
            {education.map((item, index) => (
              <article className="education-row" key={item.degree} data-reveal>
                <div className="entry-index">0{index + 1}</div>
                <div className="entry-period">
                  <CalendarDays size={16} />
                  {item.period}
                </div>
                <div className="education-main">
                  <p>{item.school}</p>
                  <h3>{item.degree}</h3>
                  <span>{item.description}</span>
                </div>
                <div className="education-status">{item.status}</div>
                <a href={item.link} target="_blank" rel="noreferrer" aria-label={`View ${item.degree}`}>
                  <ArrowUpRight />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="resume-chapter experience-chapter" id="experience">
        <div className="chapter-shell">
          <ChapterHeading
            number="03"
            eyebrow="Internship Experience"
            title="Turning analysis into operational value."
            note="AI / DATA / SOFTWARE"
          />
          <div className="experience-list">
            {internships.map((item, index) => (
              <article
                className={`experience-card${index === 2 ? ' experience-card-wide' : ''}`}
                key={`${item.company}-${item.period}`}
                data-reveal
              >
                <div className="experience-card-top">
                  <span>0{index + 1}</span>
                  <p>{item.period}</p>
                </div>
                <div className="experience-title">
                  <Building2 />
                  <div>
                    <p>{item.company}</p>
                    <h3>{item.role}</h3>
                  </div>
                </div>
                <p className="experience-description">{item.description}</p>
                <div className="experience-result">
                  <strong>{item.metric}</strong>
                  <span>{item.metricLabel}</span>
                </div>
                <div className="experience-footer">
                  <div className="tag-list">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.location} <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="resume-chapter research-chapter" id="research">
        <div className="chapter-shell">
          <ChapterHeading
            number="04"
            eyebrow="Research Experience"
            title="Making econometrics readable, reproducible, and open."
            note="UCL ECONOMICS / 2025"
          />
          <article className="research-feature" data-reveal>
            <div className="research-role">
              <div className="research-icon">
                <GraduationCap />
              </div>
              <p>Department of Economics / University College London</p>
              <h3>Research Assistant</h3>
              <span>August 2025 — October 2025</span>
            </div>
            <div className="research-story">
              <p className="research-lead">
                Converted the full ECON0004 Applied Economics teaching sequence from
                <span> Stata to Python.</span>
              </p>
              <p>
                Reimplemented OLS regressions, robust standard errors, and hypothesis
                tests across tutorials, practicals, and the empirical project using
                pandas, statsmodels, and matplotlib.
              </p>
              <div className="research-principle">
                <span>Core principle</span>
                <strong>Teaching code must be readable, not just short.</strong>
              </div>
            </div>
            <div className="research-stack">
              <span>Python</span>
              <span>Statsmodels</span>
              <span>Pandas</span>
              <span>Matplotlib</span>
            </div>
          </article>
        </div>
      </section>

      <section className="projects resume-chapter" id="projects">
        <div className="chapter-shell">
          <div className="projects-heading" data-reveal>
            <div className="chapter-number">05</div>
            <div>
              <p className="chapter-eyebrow">Selected Projects</p>
              <h2>Projects built around evidence, systems, and curiosity.</h2>
            </div>
            <p className="chapter-note">PRODUCT / AI / ECONOMETRICS</p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.number} data-reveal>
                <ProjectVisual type={project.visual} />
                <div className="project-info">
                  <div className="project-meta">
                    <span>{project.number}</span>
                    <p>{project.eyebrow}</p>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                  <p className="project-description">{project.description}</p>
                  <div className="project-footer">
                    <div className="tag-list">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noreferrer">
                      {project.linkLabel} <ArrowUpRight size={17} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="academic-projects">
            <div className="subsection-heading" data-reveal>
              <span>04 — 05</span>
              <h3>Additional academic projects</h3>
            </div>
            <div className="academic-project-grid">
              {academicProjects.map((project, index) => (
                <article className="academic-project-card" key={project.title} data-reveal>
                  <div className="academic-project-top">
                    <span>0{index + 4}</span>
                    <p>{project.period}</p>
                  </div>
                  <p className="academic-advisor">{project.advisor}</p>
                  <h3>{project.title}</h3>
                  <p className="academic-description">{project.description}</p>
                  <div className="tag-list">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="publications resume-chapter" id="publications">
        <div className="chapter-shell">
          <ChapterHeading
            number="06"
            eyebrow="Publications"
            title="Research built from real questions."
            note="BEHAVIOURAL ECONOMICS / TIME SERIES"
          />
          <div className="publication-list">
            {publications.map((publication, index) => (
              <article className="publication-card" key={publication.title} data-reveal>
                <div className="publication-index">0{index + 1}</div>
                <div className="publication-icon">
                  <BookOpen />
                </div>
                <div className="publication-content">
                  <p>{publication.venue}</p>
                  <h3>{publication.title}</h3>
                  <span>{publication.description}</span>
                </div>
                <div className="publication-year">{publication.year}</div>
                {publication.link ? (
                  <a href={publication.link} target="_blank" rel="noreferrer" aria-label="Read publication">
                    <ArrowUpRight />
                  </a>
                ) : (
                  <div className="publication-link-placeholder" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="credentials resume-chapter" id="credentials">
        <div className="chapter-shell">
          <ChapterHeading
            number="07"
            eyebrow="Honors & Languages"
            title="Recognition across economics, mathematics, and learning."
            note="9 HONORS / 2 LANGUAGES"
          />
          <div className="credentials-grid">
            <div className="honors-list">
              {honors.map(([year, title, issuer], index) => (
                <article className="honor-row" key={title} data-reveal>
                  <span className="honor-index">{String(index + 1).padStart(2, '0')}</span>
                  <Award />
                  <div>
                    <h3>{title}</h3>
                    <p>{issuer}</p>
                  </div>
                  <time>{year}</time>
                </article>
              ))}
            </div>
            <aside className="languages-panel" data-reveal>
              <Languages />
              <p className="chapter-eyebrow">Languages</p>
              {languages.map((item) => (
                <div className="language-item" key={item.language}>
                  <h3>{item.language}</h3>
                  <span>{item.level}</span>
                </div>
              ))}
              <a href="https://www.linkedin.com/in/quan-zhong-ss92" target="_blank" rel="noreferrer">
                Full profile on LinkedIn <ArrowUpRight size={16} />
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="strengths resume-chapter" id="strengths">
        <div className="chapter-shell">
          <div className="strengths-layout">
            <div className="strengths-intro" data-reveal>
              <div className="chapter-number">08</div>
              <p className="chapter-eyebrow">Skills & Capabilities</p>
              <h2>Analytical depth, with the urge to ship.</h2>
              <p>
                I am most useful where an ambiguous problem needs structure, data, and a
                working product at the other end.
              </p>
            </div>
            <div className="strength-grid">
              {strengths.map(({ icon: Icon, index, title, body }) => (
                <article className="strength-card" key={title} data-reveal>
                  <div className="strength-top">
                    <Icon />
                    <span>{index}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <ChevronRight className="strength-arrow" />
                </article>
              ))}
            </div>
          </div>

          <div className="skills-matrix" data-reveal>
            {skillGroups.map((group, index) => (
              <div className="skill-group" key={group.label}>
                <div className="skill-group-label">
                  <span>0{index + 1}</span>
                  <h3>{group.label}</h3>
                </div>
                <div className="skill-cloud">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-glow" />
        <div className="contact-inner" data-reveal>
          <p className="contact-kicker">Currently in London / Open to the right challenge</p>
          <h2>
            Let&apos;s build something
            <br />
            <span>worth caring about.</span>
          </h2>
          <a className="email-cta" href="mailto:17762583565@163.com">
            Start a conversation <ArrowUpRight />
          </a>
        </div>
        <footer>
          <a className="wordmark" href="#top">
            QZ<span>.</span>
          </a>
          <p>© 2026 Quan Zhong. Built with React.</p>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/quan-zhong-ss92"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a href="mailto:17762583565@163.com" aria-label="Email">
              <Mail />
            </a>
          </div>
        </footer>
      </section>
        </>
      )}
    </main>
  )
}

function ChapterHeading({ number, eyebrow, title, note }) {
  return (
    <div className="chapter-heading" data-reveal>
      <div className="chapter-number">{number}</div>
      <div>
        <p className="chapter-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <p className="chapter-note">{note}</p>
    </div>
  )
}

function ProjectVisual({ type }) {
  if (type === 'pawlog') {
    return (
      <div className="project-visual pawlog-visual">
        <img src="/assets/gaming-setup.jpg" alt="Atmospheric gaming setup" />
        <div className="visual-tint" />
        <div className="phone-frame">
          <div className="phone-speaker" />
          <div className="pet-face">
            <span className="pet-ear left" />
            <span className="pet-ear right" />
            <span className="pet-eye left" />
            <span className="pet-eye right" />
            <span className="pet-mouth" />
          </div>
          <p>TODAY&apos;S MOOD</p>
          <strong>CURIOUS</strong>
          <div className="pet-bars">
            <span />
            <span />
            <span />
          </div>
        </div>
        <span className="visual-note">TESTFLIGHT / BETA</span>
      </div>
    )
  }

  if (type === 'dissertation') {
    return (
      <div className="project-visual property-visual">
        <div className="property-grid" />
        <div className="dashboard-window">
          <div className="window-top">
            <span />
            <span />
            <span />
            <p>TRADING BEHAVIOUR / UCL / 2025</p>
          </div>
          <div className="dashboard-content">
            <div className="score-panel">
              <p>ACTION BIAS DEGREE</p>
              <strong>0.74</strong>
              <span>FIRST CLASS</span>
            </div>
            <div className="chart-panel">
              <div className="chart-bars">
                {[34, 56, 43, 78, 66, 92, 74, 100].map((height, index) => (
                  <i key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="chart-labels">
                <span>Observed action</span>
                <span>74%</span>
              </div>
            </div>
            <div className="metric-row">
              <span>METHOD</span>
              <strong>Econometrics</strong>
              <span>GRADE</span>
              <strong>70+</strong>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-visual research-visual">
      <div className="research-grid" />
      <div className="code-window code-one">
        <div className="code-title">
          <Code2 size={15} /> model.py
        </div>
        <pre>
          <code>
            <span className="code-blue">model</span> = sm.OLS(y, X).fit(
            <br />
            &nbsp;&nbsp;cov_type=<span className="code-green">&apos;HC1&apos;</span>
            <br />)
            <br />
            <span className="code-muted"># robust standard errors</span>
          </code>
        </pre>
      </div>
      <div className="code-window result-window">
        <div className="code-title">OLS / RESULTS</div>
        <div className="result-line">
          <span>R²</span>
          <strong>0.847</strong>
        </div>
        <div className="result-line">
          <span>F-stat</span>
          <strong>32.14</strong>
        </div>
        <div className="result-line">
          <span>p-value</span>
          <strong>0.001</strong>
        </div>
      </div>
      <div className="stata-label">STATA</div>
      <ArrowUpRight className="migration-arrow" />
      <div className="python-label">PYTHON</div>
    </div>
  )
}

export default App
