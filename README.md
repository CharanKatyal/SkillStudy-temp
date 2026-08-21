# SkillForge — 100% Offline Student Mastery & Code Platform

**SkillForge** is a complete, beginner-friendly, offline-first educational web platform for students. It combines structured academic curricula, practical modern skills, interactive in-browser coding, quiz assessments, milestone project management, student showcase portfolios, and gamified achievement badges — **all without requiring any server, cloud database, account, external AI API, or internet connection**.

---

## 🌟 Core Highlights

1. **100% Offline-First Architecture & Data Sovereignty**
   - Runs completely inside the browser using structured **IndexedDB** (`SkillForge_DB`).
   - Service Worker precaching guarantees full functionality on airplane mode, buses, or areas with zero internet connectivity.
   - **Zero Cloud / Zero Online Dependencies**: No tracking, no external logins, no commercial telemetry.
   - **AI Co-Pilot (Coming Soon)**: Dedicated offline on-device AI assistant interface with clear *Coming Soon* status.

2. **Unified Student Learning Cycle**
   $$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Code} \longrightarrow \text{Build} \longrightarrow \text{Ship Projects} \longrightarrow \text{Showcase Portfolio}$$

3. **14 Complete Feature Modules**
   - **Dashboard**: Welcome banner, active daily streak, today's study tasks, quick resume, progress meters, and statistics.
   - **Academics**: Deep curricula across Mathematics (Algebra & Geometry), Science (Physics & Chemistry), and English Language Arts (Thesis Writing & Rhetoric) with lessons, copyable code, and auto-saving personal study notes.
   - **Skills**: Practical modern skills (HTML5, CSS3, JavaScript, Python, Git & Version Control, UI/UX Design, Digital Skills) with interactive coding challenges that launch right into the IDE.
   - **Learn & Roadmaps**: Sequential learning paths with unlocked milestone steps, learning objectives, rich lesson text, and 1-click **"Open in IDE"** code injection.
   - **Practice Hub**: MCQs, True/False, Short Answer, and Code Quizzes with instant explanations, score tracking, accuracy metrics, and attempt history.
   - **Multi-Language Offline IDE**:
     - Sandboxed browser runtime with secure iframe isolation and console logger bridge.
     - Multi-file tabbed CodeMirror 6 editor with syntax highlighting for HTML, CSS, JavaScript, and Python.
     - In-browser simulated runtime runners for Python, C++, Java, and JavaScript.
     - 10+ starter project templates (Calculator, Todo, Digital Clock, Quiz App, 2D Canvas Game, Landing Page, Portfolio, etc.).
     - 1-click Project ZIP export and in-browser ZIP import (`JSZip`).
   - **Project Management**: Create projects, track milestone tasks with interactive checkboxes, log notes, and link to IDE projects.
   - **Open Source (FOSS) Hub**: Open source simulator with curated repositories, Good First Issues, and an interactive Pull Request simulator.
   - **Mentorship Hub**: Browse verified mentors, view guidance, and book simulated 1-on-1 office hours / code reviews.
   - **School LMS Classroom**: Join class sections with room codes (`CS-101`, `MATH-202`), view teacher announcements, and submit IDE projects.
   - **Real-World Client Briefs & Student Wallet**: Community project briefs with stipend tracking & local grant wallet transaction ledger.
   - **Study Planner**: Calendar planner (Day & Week views), task scheduling, priority filters, and study timers.
   - **Student Showcase Portfolio**: Custom bio, competency levels, showcase projects, and badges with **Print / PDF export stylesheet** for generating student resumes/transcripts.
   - **Achievements**: 15+ unlockable badges with celebration confetti, streak milestones, and progress meters.
   - **Settings & Data Management**: Student profile, Dark/Light/System theme, Code editor settings, full JSON Backup / Restore, and data reset.

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
* **Testing**: Vitest & React Testing Library (17 automated unit and component tests)

---

## 📁 Project Structure

```text
SkillForge/
├── public/
│   ├── favicon.svg             # Vector application badge
│   ├── pwa-192x192.svg         # PWA icon 192x192
│   └── pwa-512x512.svg         # PWA icon 512x512
├── src/
│   ├── components/
│   │   ├── academics/          # Academic Subject & Chapter views
│   │   ├── achievements/       # Badges & Streak tracker
│   │   ├── ai/                 # AI Co-Pilot (Coming Soon drawer & settings modal)
│   │   ├── common/             # Modals, Badges, Cards, ProgressBars, Toasts
│   │   ├── dashboard/          # Home dashboard view & statistics
│   │   ├── foss/               # Open Source contribution & PR simulator
│   │   ├── ide/                # FileExplorer, CodeEditor, LivePreview, ConsoleOutput, Templates
│   │   ├── layout/             # AppLayout, Sidebar, Header, OfflineBanner
│   │   ├── learn/              # Learning roadmaps & rich LessonViewer
│   │   ├── mentors/            # Mentorship & Office Hours booking portal
│   │   ├── planner/            # Study timetable, calendar & task modal
│   │   ├── portfolio/          # Student portfolio showcase & customizer
│   │   ├── practice/           # Practice quiz runner & question bank
│   │   ├── projects/           # Project management & task milestones
│   │   ├── realworld/          # Real-world client briefs & student grant wallet
│   │   ├── schools/            # Classroom LMS portal & project submissions
│   │   ├── settings/           # Profile, Theme, Editor preferences & JSON Backup
│   │   ├── skills/             # Practical skill cards & coding challenges
│   │   └── sync/               # Local profile & guardian switcher
│   ├── context/
│   │   ├── AIContext.tsx       # AI status & offline adaptive insights
│   │   ├── AppContext.tsx      # Navigation routing & toast state
│   │   ├── AuthContext.tsx     # Local student & guardian profile management
│   │   ├── DataContext.tsx     # Reactive IndexedDB data provider & achievement triggers
│   │   └── IDEContext.tsx      # Multi-file sandbox, postMessage console & autosave
│   ├── data/
│   │   ├── academicData.ts     # Mathematics, Science, English curricula
│   │   ├── defaultAchievements.ts # Achievement badge definitions
│   │   ├── fossData.ts         # Open Source repositories & Good First Issues
│   │   ├── learningPaths.ts    # Sequential roadmaps
│   │   ├── mentorshipData.ts   # Verified mentor dataset
│   │   ├── opportunitiesData.ts# Client briefs & grant wallet dataset
│   │   ├── practiceData.ts     # Question bank (MCQ, True/False, Short Answer, Code)
│   │   ├── projectTemplates.ts # 10 complete starter templates
│   │   ├── schoolData.ts       # Classroom LMS courses & assignments
│   │   └── skillData.ts        # HTML, CSS, JS, Python, Git, UI/UX, Digital Skills
│   ├── services/
│   │   ├── achievementEngine.ts# Automated offline achievement evaluator
│   │   ├── adaptiveLearningService.ts # Local mastery diagnostics
│   │   ├── aiTutorService.ts   # Offline educational guidance engine
│   │   ├── backupService.ts    # Full JSON export/import & Project ZIP handler
│   │   ├── codeRunnerService.ts# Multi-language browser sandbox runner
│   │   ├── db.ts               # Typed IndexedDB client (SkillForge_DB)
│   │   ├── smartTimetableService.ts # Local heuristic timetable generator
│   │   └── storageService.ts   # Central Data Access Layer
│   ├── styles/
│   │   └── index.css           # Tailwind directives & @media print styles
│   ├── test/                   # 17 automated unit and component tests
│   │   ├── academicData.test.ts
│   │   ├── achievementEngine.test.ts
│   │   ├── backupService.test.ts
│   │   ├── codeRunnerService.test.ts
│   │   ├── setup.ts
│   │   └── uiComponents.test.tsx
│   ├── types/                  # TypeScript domain models
│   ├── App.tsx                 # Route coordinator & providers
│   └── main.tsx                # Bootstrap & Service worker registration
├── index.html                  # HTML entry point with PWA metadata
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind theme configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite & PWA build configuration
└── vitest.config.ts            # Vitest testing configuration
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

### 3. Run Automated Tests
```bash
npm run test
```

### 4. Build Production Static Bundle
```bash
npm run build
```

---

## 💾 IndexedDB Data Architecture

SkillForge uses `SkillForge_DB` (version 1) with dedicated stores:

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
