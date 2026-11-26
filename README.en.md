**[中文](README.md) · [English](README.en.md)**

# Personal Website · Quan Zhong

A hand-built personal site in React + Vite. Not a résumé template: one long page that runs About → Research → Experience → Education → Strengths → Certificates → Projects → Publications → Contact, with four full languages and hand-made motion.

Live: https://personal-website-nine-beta-26.vercel.app

---

## Page structure

| Anchor | Section | Content |
| --- | --- | --- |
| `#top` | Hero | Name, role, plasma-wave shader background, typewriter intro |
| `#about` | About | Positioning statement and a three-part self-description |
| `#research` | Research | Behavioural economics, limited foresight, market microstructure |
| `#direction` | Direction | 2022 → future timeline (Python, pandas/SQL, Stata/R, AI workflows, Pawlog and a PC game) |
| `#experience` | Experience | Internships and work, newest first |
| `#education` | Education | UCL Department of Economics, BSc and MSc |
| `#strengths` | Strengths | Programming, econometrics, languages, tooling |
| `#credentials` | Certificates | Ten certificates grouped by Economics / Mathematics / Coding, browsable as folders with Quick Look |
| `#projects` | Projects | Pawlog (iOS), games, and other self-built work |
| `#publications` | Papers | Undergraduate dissertation and a published paper, both previewable in-page as PDFs |
| `#links` | Index | Three doors: builds, profile, proof |
| `#contact` | Contact | Email, phone (China and UK), LinkedIn |

## Four languages

Four complete copy sets ship with the page. The header switches between them and remembers the choice locally.

| Code | Language |
| --- | --- |
| `zh` | Simplified Chinese |
| `zhHant` | Traditional Chinese |
| `en` | English |
| `fr` | French |

These are not machine-translated placeholders. All four are written out properly, down to phone country codes, certificate group labels and the accessibility labels on the preview dialogs.

## Stack

- **Framework:** React 18 + Vite 6
- **Styling:** Tailwind CSS 3 + shadcn-style primitives + a large body of hand-written CSS
- **Motion:** GSAP 3 with ScrollTrigger for scroll choreography and entrances, `useGSAP` from `@gsap/react` for lifecycle
- **Graphics:** Three.js + `@react-three/fiber` + `ogl`; the hero plasma wave is a live GLSL shader
- **Icons:** lucide-react
- **Fonts:** `@fontsource-variable/geist`, self-hosted, no external CDN
- **No backend:** a purely static build; every piece of content lives in the source

## Structure

```
personal-website/
├── index.html
├── package.json
├── build config (postcss / tailwind / jsconfig / components.json)
├── public/
│   ├── assets/            hero and closing handwriting video, desk photo
│   ├── certificates/      10 certificates (jpg, some with pdf)
│   ├── papers/            two paper PDFs
│   └── projects/          Pawlog overview, RAG flow diagram (svg + png)
└── src/
    ├── main.jsx           mount
    ├── App.jsx            the whole site: four copy sets, section composition, scroll routing
    ├── styles.css         design tokens and all styling (~74 KB)
    ├── PlasmaWave.jsx     hero shader wave
    ├── Silk.jsx           silk-texture background
    ├── TextType.jsx       typewriter text
    ├── PerspectiveMarquee.jsx  perspective marquee
    ├── MagicBento.jsx     bento grid layout
    ├── CertificateFileTree.jsx / CertificateQuickLook.jsx  folder browsing and Quick Look
    ├── PaperPreview.jsx   in-page PDF paging preview
    ├── ProjectPreview.jsx project preview dialog
    ├── ClosingSequence.jsx closing sequence
    ├── LineSidebar.jsx    progress line sidebar
    ├── ContentFileTree.jsx content tree
    ├── components/ui/     shadcn primitives
    └── lib/utils.js       class-name merge helper
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Build and preview:

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` trigger a Vercel build. The output is plain static files with no environment variables and no server dependency. To move hosts, serve `dist/` from any static host.

## Changing content

All copy sits in the four language objects at the top of `src/App.jsx`, grouped as `zh` / `zhHant` / `en` / `fr`. Headings, timeline entries, certificates and projects all live in that one file; drop your own images and PDFs into `public/`.

Two flags near the top of the file control section visibility:

```js
const showAboutSection = true
const showPortfolioSections = false
```

## Notes

The visual design and code are my own. shadcn supplies component primitives; GSAP, Three.js and ogl are open-source libraries. Certificates and papers are my own material, and the PDFs sit in `public/` and are publicly readable.
