**[中文](README.md) · [English](README.en.md)**

# 个人主页 · Quan Zhong

一个用 React + Vite 手写的个人主页。不是简历模板，而是一个按「关于 → 研究方向 → 经历 → 教育 → 能力 → 证书 → 作品 → 发表 → 联系」顺序展开的长页面，四语切换，动效自己做。

在线：https://personal-website-nine-beta-26.vercel.app

---

## 页面结构

| 锚点 | 板块 | 内容 |
| --- | --- | --- |
| `#top` | 首屏 | 姓名、身份、等离子波动背景、打字机式自我介绍 |
| `#about` | 关于 | 定位说明与三段式自述 |
| `#research` | 研究方向 | 行为经济学、有限前瞻、市场微观结构 |
| `#direction` | 方向 | 2022 → 未来的技术时间线（Python、pandas/SQL、Stata/R、AI 工作流、Pawlog 与 PC 游戏） |
| `#experience` | 经历 | 实习与工作，按时间倒序 |
| `#education` | 教育 | UCL 经济系本科与硕士 |
| `#strengths` | 能力 | 编程、计量、语言、工具 |
| `#credentials` | 证书 | 10 张证书，按经济 / 数学 / 编程分组，支持文件夹式浏览与快速预览 |
| `#projects` | 作品 | Pawlog（iOS）、游戏与其它自建项目 |
| `#publications` | 论文 | 本科毕业论文与已发表论文，站内可直接翻页预览 PDF |
| `#links` | 索引 | 三扇门：作品、资料、证明 |
| `#contact` | 联系 | 邮箱、电话（中英双号）、LinkedIn |

## 四语

页面内置四套完整文案，顶栏一键切换，选择记在本地：

| 代码 | 语言 |
| --- | --- |
| `zh` | 简体中文 |
| `zhHant` | 繁體中文 |
| `en` | English |
| `fr` | Français |

不是机器翻译的占位文本，四套都是手写的正式表述，连电话区号、证书分类标签、预览弹窗的无障碍标签都各自本地化。

## 技术栈

- **框架**：React 18 + Vite 6
- **样式**：Tailwind CSS 3 + shadcn 风格组件 + 大量手写 CSS
- **动效**：GSAP 3（含 ScrollTrigger）驱动滚动编排与入场，`@gsap/react` 的 `useGSAP` 管理生命周期
- **图形**：Three.js + `@react-three/fiber` + `ogl`，首屏等离子波动由 GLSL shader 实时绘制
- **图标**：lucide-react
- **字体**：`@fontsource-variable/geist` 自托管，不依赖外部 CDN
- **零后端**：纯静态产物，所有内容写在源码里

## 目录结构

```
personal-website/
├── index.html
├── package.json
├── vite 配置（postcss / tailwind / jsconfig / components.json）
├── public/
│   ├── assets/            首屏与结尾的手写体视频、设备照
│   ├── certificates/      10 张证书（jpg + 可选的 pdf）
│   ├── papers/            两篇论文 PDF
│   └── projects/          Pawlog 总览图、RAG 流程图（svg + png）
└── src/
    ├── main.jsx           挂载
    ├── App.jsx            全站主体：四语文案表、板块编排、路由式滚动
    ├── styles.css         设计令牌与全部样式（约 74 KB）
    ├── PlasmaWave.jsx     首屏 shader 波动
    ├── Silk.jsx           丝绸质感背景
    ├── TextType.jsx       打字机文本
    ├── PerspectiveMarquee.jsx  透视跑马灯
    ├── MagicBento.jsx     便当格布局
    ├── CertificateFileTree.jsx / CertificateQuickLook.jsx  证书文件夹与快速预览
    ├── PaperPreview.jsx   站内 PDF 翻页预览
    ├── ProjectPreview.jsx 项目预览弹窗
    ├── ClosingSequence.jsx 结尾序列
    ├── LineSidebar.jsx    侧边进度线
    ├── ContentFileTree.jsx 内容树
    ├── components/ui/     shadcn 基元
    └── lib/utils.js       类名合并工具
```

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
```

构建与预览：

```bash
npm run build
npm run preview
```

## 部署

推到 `main` 触发 Vercel 自动构建，产物是纯静态文件，没有环境变量、没有服务端依赖。要换托管方，把 `dist/` 丢给任意静态站点服务即可。

## 改内容

所有文案集中在 `src/App.jsx` 顶部的四套语言对象里，按 `zh` / `zhHant` / `en` / `fr` 分组。改标题、改时间线、换证书、加项目，都在这一个文件里；`public/` 下换成自己的图片与 PDF 就行。

板块显隐由文件开头的两个开关控制：

```js
const showAboutSection = true
const showPortfolioSections = false
```

## 说明

站的视觉与代码为自己实现；shadcn 提供组件基元，GSAP、Three.js、ogl 为开源库。证书与论文为本人材料，PDF 直接放在 `public/` 下公开可读。
