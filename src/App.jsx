import { useEffect, useState } from 'react'
import {
  ArrowDown,
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
  MapPin,
  Menu,
  Sparkles,
  X,
} from 'lucide-react'
import PlasmaWave from './PlasmaWave'

const navItems = [
  { label: 'Profile', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Credentials', href: '#credentials' },
]

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
    link: 'https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/economics-bsc-econ/',
    linkLabel: 'UCL Economics',
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerFloating, setHeaderFloating] = useState(false)

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

  return (
    <main>
      <header className={`site-header${headerFloating ? ' is-floating' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Quan Zhong, home">
          QZ<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="mailto:17762583565@163.com">
          Let&apos;s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
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
            <span className="status-dot" /> Economics student / Builder / London
          </p>
          <h1>
            I study markets.
            <br />
            I build <span>systems.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              Exploring the space where economic thinking meets software, AI, data, and
              interactive experiences.
            </p>
            <a className="round-link" href="#about" aria-label="Scroll to about section">
              <ArrowDown />
            </a>
          </div>
        </div>
        <div className="hero-index">PORTFOLIO / 2026</div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-label" data-reveal>
          <span>01</span> About
        </div>
        <div className="about-grid">
          <div className="portrait-wrap" data-reveal>
            <div className="portrait-card">
              <div className="portrait-noise" />
              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />
              <div className="portrait-initials">QZ</div>
              <div className="portrait-tag">
                <Sparkles size={14} /> Open to opportunities
              </div>
            </div>
            <p className="image-caption">ECONOMICS × SOFTWARE × PLAY</p>
          </div>

          <div className="about-copy" data-reveal>
            <p className="overline">A quantitative mind with a product bias.</p>
            <h2>
              I&apos;m Quan, an economics student who would rather <em>build the thing</em>{' '}
              than only talk about it.
            </h2>
            <p className="about-body">
              At UCL, I move between econometrics, data systems, AI workflows, and product
              experiments. I care about useful technology: software that clarifies a
              decision, automates real work, or makes an everyday habit more engaging.
            </p>
            <div className="contact-lines">
              <a href="mailto:17762583565@163.com">
                <Mail size={18} /> 17762583565@163.com
              </a>
              <a href="https://www.linkedin.com/in/quan-zhong-ss92" target="_blank" rel="noreferrer">
                <Linkedin size={18} /> linkedin.com/in/quan-zhong-ss92
              </a>
              <span>
                <MapPin size={18} /> London, United Kingdom
              </span>
            </div>
          </div>
        </div>

      </section>

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
