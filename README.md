# StillSkudy — Offline-First Web Learning Platform

**StillSkudy** is a comprehensive, offline-first educational web application built for students. It brings together academic curricula, practical technology skills, hands-on coding, interactive practice, milestone-driven project management, student portfolios, and learning achievement badges — **all without requiring any server, account, cloud database, AI, or internet connection**.

---

## 🌟 Key Features

1. **100% Offline-First Architecture & Privacy**
   - Operates entirely in the browser using IndexedDB for structured local data persistence.
   - PWA (Progressive Web App) service worker precaching ensures the entire application runs without Wi-Fi, mobile data, or external CDN dependencies.
   - Zero external trackers, zero telemetry, zero passwords.

2. **Unified Student Journey**
   $$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Code} \longrightarrow \text{Build} \longrightarrow \text{Complete Projects} \longrightarrow \text{Portfolio} \longrightarrow \text{Track Progress}$$

3. **11 Core Navigation Modules**
   - **Dashboard**: Welcome hub, today's scheduled tasks, continue-learning shortcuts, academic & skill progress bars, active projects, recent IDE files, and learning statistics.
   - **Academics**: Structured subjects (Mathematics, Science, English) broken down into Chapters, Topics, Lessons, and Practice.
   - **Skills**: Practical modern skills (HTML5, CSS3, JavaScript, Python, Git & GitHub, UI/UX Design, Digital Skills) with prerequisites, difficulty indicators, challenges, and project ideas.
   - **Learn (Roadmaps & Lesson Reader)**: Step-by-step learning roadmaps with unlocked milestones, learning objectives, rich lesson text, code examples with 1-click copy, personal student notes with autosave, and **"Open in IDE"** 1-click starter code injection.
   - **Practice Hub**: MCQs, True/False, Short answers, and interactive code quizzes with instant explanations, scoring, accuracy tracking, and attempts history.
   - **Integrated Offline IDE**:
     - Sandboxed browser runtime with secure iframe isolation.
     - Multi-file tabbed editor with syntax highlighting (HTML, CSS, JS, Python) using CodeMirror.
     - File explorer (Create, Rename, Delete, Multiple files).
     - Interactive Console / Output capturing `console.log`, `console.warn`, `console.error`, and runtime errors via postMessage bridge.
     - 9+ Starter Project Templates (Hello World, Calculator, To-Do App, Digital Clock, Quiz App, Landing Page, Canvas Game, Personal Bio, Portfolio Website).
     - ZIP / JSON import and export.
   - **Project Management**: Create projects, track milestone tasks with interactive checkboxes, log notes, and link to IDE projects.
   - **Study Planner**: Manual calendar schedule (Day & Week views), task duration, priority tags, and category filters.
   - **Student Portfolio**: Custom bio, competency levels, showcase projects, and badges with **Print / PDF export stylesheet** for generating student transcripts.
   - **Achievements**: Unlockable local badge system with celebration animations, progress meters, and daily streak tracking.
   - **Settings & Data Management**: Custom profile, theme (Dark / Light / System), code editor customizations, full JSON backup export & restore, and data reset.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite 6 (Static compilation with rollup manual chunking)
* **Styling**: Tailwind CSS & PostCSS with dark mode & print media styles
* **Editor**: CodeMirror 6 (`@uiw/react-codemirror` with HTML, CSS, JavaScript, and Python language parsers)
* **Local Storage**: Native IndexedDB engine with localStorage fallback
* **PWA & Offline Service Worker**: `vite-plugin-pwa` with Workbox CacheFirst strategy
* **Icons**: `lucide-react` (Self-contained vector SVG icons)
* **File Compression**: `jszip` (Client-side ZIP packaging for IDE project downloads/imports)
* **Celebration Effects**: `canvas-confetti` (Offline canvas particle animations)

---

## 📁 Clean Folder Structure

```text
StillSkudy/
├── public/
│   ├── favicon.svg             # Vector application badge
│   ├── pwa-192x192.svg         # PWA icon 192x192
│   └── pwa-512x512.svg         # PWA icon 512x512
├── src/
│   ├── components/
│   │   ├── academics/          # Academic Subject & Chapter views
│   │   ├── achievements/       # Badges & Streak tracker
│   │   ├── common/             # Modals, Badges, Cards, ProgressBars, Toasts
│   │   ├── dashboard/          # Home dashboard view & statistics
│   │   ├── ide/                # FileExplorer, CodeEditor, LivePreview, ConsoleOutput, Templates
│   │   ├── layout/             # AppLayout, Sidebar, Header, OfflineBanner
│   │   ├── learn/              # Learning roadmaps & rich LessonViewer
│   │   ├── planner/            # Study timetable, calendar & task modal
│   │   ├── portfolio/          # Student portfolio showcase & customizer
│   │   ├── practice/           # Practice quiz runner & question bank
│   │   ├── projects/           # Project management & task milestones
│   │   ├── settings/           # Profile, Theme, Editor preferences & JSON Backup
│   │   └── skills/             # Practical skill cards & detail modals
│   ├── context/
│   │   ├── AppContext.tsx      # Navigation routing & toast state
│   │   ├── DataContext.tsx     # Reactive IndexedDB data provider & achievement triggers
│   │   └── IDEContext.tsx      # Multi-file sandbox, postMessage console & autosave
│   ├── data/
│   │   ├── academicData.ts     # Mathematics, Science, English curricula
│   │   ├── defaultAchievements.ts # Achievement badge definitions
│   │   ├── learningPaths.ts    # Sequential roadmaps
│   │   ├── practiceData.ts     # Question bank (MCQ, True/False, Short Answer, Code)
│   │   ├── projectTemplates.ts # 9 complete HTML/CSS/JS starter templates
│   │   └── skillData.ts        # HTML, CSS, JS, Python, Git, UI/UX, Digital Skills
│   ├── services/
│   │   ├── achievementEngine.ts # Automated offline achievement evaluator
│   │   ├── backupService.ts    # Full JSON export/import & Project ZIP handler
│   │   ├── db.ts               # Typed IndexedDB client with object stores
│   │   └── storageService.ts   # Central Data Access Layer (Ready for Phase 2 API)
│   ├── styles/
│   │   └── index.css           # Tailwind directives, scrollbars & @media print styles
│   ├── types/
│   │   ├── index.ts            # Domain entity definitions
│   │   └── storage.ts          # Backup schema definitions
│   ├── App.tsx                 # Route coordinator & providers
│   └── main.tsx                # Bootstrap & Service worker registration
├── index.html                  # HTML entry point with PWA metadata
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite & PWA build configuration
```

---

## 🚀 Installation & Commands

### 1. Prerequisites
* Node.js v18+ (tested on Node v20 & v24)
* npm v9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server
Run the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Production Build
Compile the application into optimized, static production files:
```bash
npm run build
```
The compiled static output will be in the `dist/` folder.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📱 PWA & Offline Usage Instructions

1. **First Load**: Open StillSkudy in any modern web browser (Chrome, Edge, Firefox, Safari, Brave, or Chromium on Chromebook).
2. **Installation**: Click the **Install** icon in the browser address bar or select **"Add to Home Screen"** on mobile/tablet devices.
3. **Offline Verification**: Disconnect from Wi-Fi or turn on Airplane Mode. Reload the page — the application will continue to work seamlessly without internet connectivity.
4. **Data Isolation**: All projects, code files, quiz scores, and settings remain stored on the local device.

---

## 🗄️ IndexedDB Data Architecture

StillSkudy uses a dedicated database named `StillSkudy_DB` with separate object stores for each domain:

| Object Store | Key Path | Purpose |
| :--- | :--- | :--- |
| `profile` | `id` | Student name, bio, grade level, avatar |
| `settings` | `id` | Theme, editor font size, tab size, accessibility |
| `progress` | `id` | Completed lessons, challenges, notes, daily streak, stats |
| `ide_projects` | `id` | Multi-file IDE workspaces (`index.html`, `style.css`, etc.) |
| `managed_projects` | `id` | Milestones, task checklists, portfolio visibility |
| `planner_tasks` | `id` | Study schedule items, priority, duration, date |
| `portfolio` | `id` | Customized student portfolio data & skills |
| `achievements` | `id` | Badge unlock states, progress, timestamps |
| `practice_attempts`| `id` | Practice session scores, accuracy, answer logs |

---

## 💻 IDE & Live Preview Architecture

1. **Security & Sandbox Isolation**:
   - The live preview renders inside an iframe with `sandbox="allow-scripts"`.
   - The iframe is isolated from the host page origin, preventing student code from accessing the parent window's IndexedDB, local storage, or application state.
2. **Console Bridge**:
   - A lightweight offline logger bridge intercepts `console.log`, `console.warn`, `console.error`, and `window.onerror` inside the iframe and forwards structured log packets via `postMessage` to the parent IDE console.
3. **Autosave & Persistence**:
   - Changes to any file trigger a debounced autosave (1.5s) to IndexedDB, ensuring work is never lost on page reload.

---

## 💾 Project & Data Backup System

* **Full Data Backup (`StillSkudy_Backup_YYYY-MM-DD.json`)**:
  - Export: Generates a single validated JSON file containing all profile information, progress, notes, projects, planner tasks, portfolio, achievements, and practice attempts.
  - Import / Restore: Restores all tables into IndexedDB with format validation.
* **Project ZIP Export & Import**:
  - Export ZIP: Packages all project files (`index.html`, `style.css`, `script.js`, etc.) into a standard `.zip` archive with a `stillskudy-manifest.json` file.
  - Import ZIP: Unpacks any standard ZIP archive in-browser using `JSZip` and creates a new project in the student's IDE.

---

## 🔄 Phase 2 Backend Evolution (Zero Rewrite Architecture)

StillSkudy has been architected from the ground up to support a future cloud backend (PostgreSQL, parent accounts, sync) without rewriting Phase 1:

1. **Repository Pattern (`StorageService`)**:
   - All UI components interact exclusively with `storageService` and `DataContext`.
   - In Phase 2, `StorageService` can be updated to implement a **Local-First Sync Adapter** (e.g. ElectricSQL, CRDTs, or REST API sync with a PostgreSQL database).
2. **Static Content Decoupling**:
   - `academicData.ts`, `skillData.ts`, `learningPaths.ts`, and `practiceData.ts` follow normalized JSON schemas.
   - In Phase 2, these static files can simply be replaced with API endpoints (`/api/v1/curriculum/subjects`, `/api/v1/skills`) returning the exact same data contracts.
3. **Stateless UI Views**:
   - UI views consume reactive state from React Contexts without coupling to storage implementation details.
