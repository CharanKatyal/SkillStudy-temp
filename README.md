# Skudium — Student Learning & Code Studio

**Skudium** is a modern, beginner-friendly offline-first educational web platform for students. It combines structured academic curricula, practical technology skills, interactive in-browser coding, practice quizzes, milestone project management, student showcase portfolios, and gamified achievement badges — **all running directly on your device**.

---

## 🌟 Core Highlights

1. **Light & Dark Theme Engine**
   - High-contrast visual themes with smooth instantaneous transitions between Dark and Light modes.

2. **Unified Student Learning Cycle**
   $$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Code} \longrightarrow \text{Build} \longrightarrow \text{Ship Projects} \longrightarrow \text{Showcase Portfolio}$$

3. **10 Core Navigation Modules**
   - **Dashboard**: Welcome banner, active daily streak, today's study tasks, quick resume, progress meters, and statistics.
   - **Academics**: Structured subjects across Mathematics (Algebra & Geometry), Science (Physics & Chemistry), and English Language Arts (Thesis Writing & Rhetoric) with lessons, copyable code, and auto-saving personal study notes.
   - **Skills**: Practical modern skills (HTML5, CSS3, JavaScript, Python, Git & Version Control, UI/UX Design, Digital Skills) with interactive coding challenges that launch right into the IDE.
   - **Learn & Roadmaps**: Sequential learning paths with unlocked milestone steps, learning objectives, rich lesson text, and 1-click **"Open in IDE"** code injection.
   - **Practice Hub**: MCQs, True/False, Short Answer, and Code Quizzes with instant explanations, score tracking, accuracy metrics, and attempt history.
   - **Multi-Language Offline IDE Studio**:
     - Sandboxed browser runtime with secure iframe isolation and console logger bridge.
     - Multi-file tabbed CodeMirror 6 editor with syntax highlighting for HTML, CSS, JavaScript, and Python.
     - In-browser runtime runners for Python, C++, Java, and JavaScript.
     - 10+ starter project templates (Calculator, Todo, Digital Clock, Quiz App, 2D Canvas Game, Landing Page, Portfolio, etc.).
     - 1-click Project ZIP export and in-browser ZIP import (`JSZip`).
   - **Project Management**: Create projects, track milestone tasks with interactive checkboxes, log notes, and link to IDE projects.
   - **Study Planner**: Calendar planner (Day & Week views), task scheduling, priority filters, and study timers.
   - **Student Showcase Portfolio**: Custom bio, competency levels, showcase projects, and badges with **Print / PDF export stylesheet** for generating student resumes/transcripts.
   - **Achievements**: 15+ unlockable badges with celebration confetti, streak milestones, and progress meters.
   - **Settings & Data Management**: Student profile, Dark/Light/System theme, Code editor settings, full JSON Backup / Restore, and data reset.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 with TypeScript
* **Build Tool**: Vite 6 (Static compilation with rollup manual chunking)
* **Styling**: Tailwind CSS & PostCSS with dynamic dark/light mode & print media styles
* **Editor**: CodeMirror 6 (`@uiw/react-codemirror` with HTML, CSS, JavaScript, and Python language parsers)
* **Local Storage**: Native IndexedDB engine with localStorage fallback
* **PWA & Offline Service Worker**: `vite-plugin-pwa` with Workbox CacheFirst strategy
* **Icons**: `lucide-react` (Self-contained vector SVG icons)
* **File Compression**: `jszip` (Client-side ZIP packaging for IDE project downloads/imports)
* **Celebration Effects**: `canvas-confetti` (Canvas particle animations)

---

## 📁 Project Structure

```text
Skudium/
├── public/
│   ├── favicon.svg             # Custom vector application badge
│   ├── pwa-192x192.svg         # PWA icon 192x192
│   └── pwa-512x512.svg         # PWA icon 512x512
├── src/
│   ├── components/
│   │   ├── academics/          # Academic Subject & Chapter views
│   │   ├── achievements/       # Badges & Streak tracker
│   │   ├── ai/                 # AI Assistant (Coming Soon drawer & settings modal)
│   │   ├── common/             # Modals, Badges, Cards, ProgressBars, Toasts
│   │   ├── dashboard/          # Home dashboard view & statistics
│   │   ├── ide/                # FileExplorer, CodeEditor, LivePreview, ConsoleOutput, Templates
│   │   ├── layout/             # AppLayout, Sidebar, Header
│   │   ├── learn/              # Learning roadmaps & rich LessonViewer
│   │   ├── planner/            # Study timetable, calendar & task modal
│   │   ├── portfolio/          # Student portfolio showcase & customizer
│   │   ├── practice/           # Practice quiz runner & question bank
│   │   ├── projects/           # Project management & task milestones
│   │   ├── settings/           # Profile, Theme, Editor preferences & JSON Backup
│   │   └── skills/             # Practical skill cards & coding challenges
│   ├── context/
│   │   ├── AIContext.tsx       # AI status & offline adaptive insights
│   │   ├── AppContext.tsx      # Navigation routing & toast state
│   │   ├── AuthContext.tsx     # Student profile state
│   │   ├── DataContext.tsx     # Reactive IndexedDB data provider & theme switcher
│   │   └── IDEContext.tsx      # Multi-file sandbox, postMessage console & autosave
│   ├── data/
│   │   ├── academicData.ts     # Mathematics, Science, English curricula
│   │   ├── defaultAchievements.ts # Achievement badge definitions
│   │   ├── learningPaths.ts    # Sequential roadmaps
│   │   ├── practiceData.ts     # Question bank (MCQ, True/False, Short Answer, Code)
│   │   ├── projectTemplates.ts # 10 complete starter templates
│   │   └── skillData.ts        # HTML, CSS, JS, Python, Git, UI/UX, Digital Skills
│   ├── services/
│   │   ├── achievementEngine.ts# Automated achievement evaluator
│   │   ├── adaptiveLearningService.ts # Mastery diagnostics
│   │   ├── aiTutorService.ts   # Educational guidance engine
│   │   ├── backupService.ts    # Full JSON export/import & Project ZIP handler
│   │   ├── codeRunnerService.ts# Multi-language browser sandbox runner
│   │   ├── db.ts               # Typed IndexedDB client (Skudium_DB)
│   │   ├── smartTimetableService.ts # Heuristic timetable generator
│   │   └── storageService.ts   # Central Data Access Layer
│   ├── styles/
│   │   └── index.css           # Tailwind directives & @media print styles
│   ├── types/                  # TypeScript domain models
│   ├── App.tsx                 # Route coordinator & providers
│   └── main.tsx                # Bootstrap & Service worker registration
├── index.html                  # HTML entry point with PWA metadata
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite & PWA build configuration
```

---

## 🚀 Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173`.

### 3. Build Production Static Bundle
```bash
npm run build
```

---

## 💾 IndexedDB Storage Architecture

Skudium uses `Skudium_DB` with dedicated object stores:

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
