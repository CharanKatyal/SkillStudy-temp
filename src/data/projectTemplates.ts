import { ProjectTemplate } from '../types';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'hello-world',
    name: 'Hello World Starter',
    description: 'Clean starter with minimal HTML, CSS, and interactive JavaScript.',
    category: 'Starters',
    icon: 'Sparkles',
    difficulty: 'Beginner',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello SkillForge</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="badge">SkillForge Offline IDE</div>
    <h1>Hello, Future Developer! 🚀</h1>
    <p>This is your offline playground. Edit HTML, CSS, and JS, then click <strong>Run</strong>.</p>
    <button id="magicBtn">Click for Inspiration</button>
    <div id="output" class="output-box"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

body {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.badge {
  display: inline-block;
  background: #10b981;
  color: #064e3b;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
}

h1 {
  font-size: 26px;
  margin-bottom: 12px;
  color: #38bdf8;
}

p {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 24px;
}

button {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
}

button:hover {
  background: #7dd3fc;
  transform: translateY(-2px);
}

.output-box {
  margin-top: 20px;
  min-height: 24px;
  font-weight: 500;
  color: #10b981;
}`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Learning without thought is labor lost; thought without learning is perilous."
];

const btn = document.getElementById('magicBtn');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  output.textContent = '✨ ' + randomQuote;
  console.log('User requested inspiration:', randomQuote);
});`
      }
    }
  },
  {
    id: 'calculator',
    name: 'Interactive Calculator',
    description: 'A responsive digital calculator with arithmetic functions and history.',
    category: 'Apps',
    icon: 'Calculator',
    difficulty: 'Beginner',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Calculator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="calculator">
    <div class="display">
      <div id="history" class="prev-op"></div>
      <div id="current" class="curr-op">0</div>
    </div>
    <div class="buttons">
      <button class="action" onclick="clearAll()">AC</button>
      <button class="action" onclick="deleteLast()">DEL</button>
      <button class="op" onclick="appendOp('%')">%</button>
      <button class="op" onclick="appendOp('/')">÷</button>
      
      <button onclick="appendNum('7')">7</button>
      <button onclick="appendNum('8')">8</button>
      <button onclick="appendNum('9')">9</button>
      <button class="op" onclick="appendOp('*')">×</button>
      
      <button onclick="appendNum('4')">4</button>
      <button onclick="appendNum('5')">5</button>
      <button onclick="appendNum('6')">6</button>
      <button class="op" onclick="appendOp('-')">−</button>
      
      <button onclick="appendNum('1')">1</button>
      <button onclick="appendNum('2')">2</button>
      <button onclick="appendNum('3')">3</button>
      <button class="op" onclick="appendOp('+')">+</button>
      
      <button class="zero" onclick="appendNum('0')">0</button>
      <button onclick="appendNum('.')">.</button>
      <button class="equal" onclick="compute()">=</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: system-ui, sans-serif;
}
.calculator {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  width: 320px;
}
.display {
  background: #090d16;
  border-radius: 12px;
  padding: 16px;
  text-align: right;
  margin-bottom: 20px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.prev-op { color: #64748b; font-size: 14px; min-height: 18px; }
.curr-op { color: #f8fafc; font-size: 32px; font-weight: bold; overflow-x: auto; }
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
button {
  background: #334155;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  font-size: 18px;
  cursor: pointer;
  transition: 0.1s;
}
button:hover { background: #475569; }
button.op { background: #0284c7; font-weight: bold; }
button.op:hover { background: #0369a1; }
button.action { background: #e11d48; }
button.equal { background: #16a34a; font-weight: bold; }
.zero { grid-column: span 2; }`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `let currentExpr = '0';
const currEl = document.getElementById('current');
const histEl = document.getElementById('history');

function updateDisplay() {
  currEl.textContent = currentExpr;
}

function appendNum(num) {
  if (currentExpr === '0' && num !== '.') {
    currentExpr = num;
  } else {
    currentExpr += num;
  }
  updateDisplay();
}

function appendOp(op) {
  const last = currentExpr.slice(-1);
  if (['+', '-', '*', '/', '%'].includes(last)) {
    currentExpr = currentExpr.slice(0, -1) + op;
  } else {
    currentExpr += op;
  }
  updateDisplay();
}

function clearAll() {
  currentExpr = '0';
  histEl.textContent = '';
  updateDisplay();
}

function deleteLast() {
  if (currentExpr.length <= 1) {
    currentExpr = '0';
  } else {
    currentExpr = currentExpr.slice(0, -1);
  }
  updateDisplay();
}

function compute() {
  try {
    histEl.textContent = currentExpr + ' =';
    // Safe arithmetic evaluation using Function
    const result = new Function('return ' + currentExpr)();
    currentExpr = String(Math.round(result * 100000) / 100000);
    updateDisplay();
  } catch (err) {
    currentExpr = 'Error';
    updateDisplay();
    setTimeout(clearAll, 1500);
  }
}`
      }
    }
  },
  {
    id: 'todo-app',
    name: 'Interactive To-Do List',
    description: 'Local storage powered task manager with filters and status toggle.',
    category: 'Apps',
    icon: 'CheckSquare',
    difficulty: 'Intermediate',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Focus To-Do</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app-card">
    <header>
      <h2>Task Focus</h2>
      <span id="taskCount" class="badge">0 tasks</span>
    </header>
    
    <div class="input-row">
      <input type="text" id="taskInput" placeholder="Add a new goal..." />
      <button id="addBtn">Add</button>
    </div>

    <div class="filters">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="active">Active</button>
      <button class="filter-btn" data-filter="completed">Done</button>
    </div>

    <ul id="taskList" class="task-list"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #0b1329;
  color: #e2e8f0;
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}
.app-card {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 440px;
  border: 1px solid #334155;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.badge { background: #3b82f6; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; }
.input-row { display: flex; gap: 8px; margin-bottom: 16px; }
input {
  flex: 1;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  outline: none;
}
button {
  background: #10b981;
  color: #022c22;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  cursor: pointer;
}
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filter-btn {
  background: #0f172a;
  color: #94a3b8;
  padding: 6px 12px;
  font-size: 13px;
}
.filter-btn.active { background: #2563eb; color: white; }
.task-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  padding: 12px;
  border-radius: 8px;
}
.task-item.done span { text-decoration: line-through; color: #64748b; }
.delete-btn { background: #ef4444; color: white; padding: 4px 8px; font-size: 12px; }`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `let tasks = [
  { id: 1, text: 'Complete HTML Lesson', done: true },
  { id: 2, text: 'Build a calculator project', done: false }
];
let currentFilter = 'all';

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskCount = document.getElementById('taskCount');
const filterBtns = document.querySelectorAll('.filter-btn');

function render() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'completed') return t.done;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.innerHTML = \`
      <div style="display:flex; align-items:center; gap: 10px;">
        <input type="checkbox" \${task.done ? 'checked' : ''} onchange="toggleTask(\${task.id})" />
        <span>\${task.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(\${task.id})">✕</button>
    \`;
    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.length + ' tasks';
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = '';
  render();
}

window.toggleTask = function(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  render();
};

window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
};

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();`
      }
    }
  },
  {
    id: 'digital-clock',
    name: 'Digital Neon Clock',
    description: 'Real-time clock with customized date formats and glowing neon theme.',
    category: 'Widgets',
    icon: 'Clock',
    difficulty: 'Beginner',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Neon Digital Clock</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="clock-card">
    <div id="date" class="date-text">Monday, Jan 1, 2026</div>
    <div id="clock" class="clock-display">00:00:00</div>
    <div class="tz-badge">Local Time (Offline)</div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #030712;
  color: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
}
.clock-card {
  background: #111827;
  border: 2px solid #22c55e;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
}
.date-text {
  color: #9ca3af;
  font-size: 16px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.clock-display {
  font-size: 56px;
  font-weight: bold;
  color: #4ade80;
  text-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
  margin-bottom: 16px;
}
.tz-badge {
  display: inline-block;
  background: #1f2937;
  color: #22c55e;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
}`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  document.getElementById('clock').textContent = \`\${hours}:\${minutes}:\${seconds}\`;
  
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString(undefined, options);
}

setInterval(updateClock, 1000);
updateClock();`
      }
    }
  },
  {
    id: 'quiz-app',
    name: 'Interactive Quiz App',
    description: 'Multi-question trivia quiz with live scoring and results screen.',
    category: 'Apps',
    icon: 'HelpCircle',
    difficulty: 'Intermediate',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quiz Master</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="quiz-container" id="quizBox">
    <div class="quiz-header">
      <h2 id="qCount">Question 1/3</h2>
      <span id="scoreText">Score: 0</span>
    </div>
    <p id="question" class="question-text"></p>
    <div id="options" class="options-grid"></div>
    <button id="nextBtn" class="next-btn" style="display:none;">Next Question</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #0f172a;
  color: white;
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
.quiz-container {
  background: #1e293b;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  border: 1px solid #334155;
}
.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #94a3b8;
  font-size: 14px;
}
.question-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #f1f5f9;
}
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.opt-btn {
  background: #334155;
  border: 1px solid #475569;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;
}
.opt-btn:hover:not([disabled]) { background: #475569; }
.opt-btn.correct { background: #16a34a !important; border-color: #22c55e; }
.opt-btn.wrong { background: #dc2626 !important; border-color: #ef4444; }
.next-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #2563eb;
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `const questions = [
  {
    q: "Which HTML tag is used to link an external JavaScript file?",
    options: ["<script>", "<link>", "<javascript>", "<js>"],
    answer: 0
  },
  {
    q: "Which CSS property changes the text color?",
    options: ["font-color", "text-color", "color", "background-color"],
    answer: 2
  },
  {
    q: "What does DOM stand for in Web Development?",
    options: [
      "Document Object Model",
      "Data Origin Module",
      "Digital Order Mechanism",
      "Direct Output Method"
    ],
    answer: 0
  }
];

let currentIndex = 0;
let score = 0;

const qEl = document.getElementById('question');
const optsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const qCountEl = document.getElementById('qCount');
const scoreTextEl = document.getElementById('scoreText');

function loadQuestion() {
  const current = questions[currentIndex];
  qCountEl.textContent = \`Question \${currentIndex + 1}/\${questions.length}\`;
  qEl.textContent = current.q;
  optsEl.innerHTML = '';
  nextBtn.style.display = 'none';

  current.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    optsEl.appendChild(btn);
  });
}

function selectOption(index, button) {
  const current = questions[currentIndex];
  const buttons = optsEl.querySelectorAll('.opt-btn');
  buttons.forEach(b => b.disabled = true);

  if (index === current.answer) {
    button.classList.add('correct');
    score++;
    scoreTextEl.textContent = \`Score: \${score}\`;
  } else {
    button.classList.add('wrong');
    buttons[current.answer].classList.add('correct');
  }

  nextBtn.style.display = 'block';
}

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    document.getElementById('quizBox').innerHTML = \`
      <h2 style="color:#22c55e;">Quiz Completed! 🎉</h2>
      <p style="margin: 20px 0; font-size: 18px;">Your final score is <strong>\${score}/\${questions.length}</strong></p>
      <button class="next-btn" onclick="location.reload()">Try Again</button>
    \`;
  }
};

loadQuestion();`
      }
    }
  },
  {
    id: 'landing-page',
    name: 'Product Landing Page',
    description: 'Modern responsive marketing landing page with hero, features, and call-to-action.',
    category: 'Websites',
    icon: 'Layout',
    difficulty: 'Intermediate',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apex Studio — Build Faster</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav>
    <div class="logo">⚡ ApexStudio</div>
    <div class="links">
      <a href="#features">Features</a>
      <a href="#about">About</a>
      <a href="#cta" class="nav-btn">Get Started</a>
    </div>
  </nav>

  <header class="hero">
    <h1>Crafting Future-Ready Digital Products</h1>
    <p>Empowering students and creators to build high-performance web applications entirely offline.</p>
    <div class="hero-actions">
      <button class="btn primary">Start Free Trial</button>
      <button class="btn secondary">View Examples</button>
    </div>
  </header>

  <section id="features" class="features">
    <div class="card">
      <div class="icon">🚀</div>
      <h3>Lightning Fast</h3>
      <p>Zero server latency. Everything executes locally in your browser sandbox.</p>
    </div>
    <div class="card">
      <div class="icon">🔒</div>
      <h3>100% Private</h3>
      <p>Your source code and learning data never leave your personal computer.</p>
    </div>
    <div class="card">
      <div class="icon">📦</div>
      <h3>Offline PWA</h3>
      <p>Install on any Chromebook, Mac, Linux, or PC and keep coding anywhere.</p>
    </div>
  </section>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `* { margin:0; padding:0; box-sizing:border-box; font-family:system-ui, sans-serif; }
body { background: #0b0f19; color: #f8fafc; line-height: 1.6; }
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid #1e293b;
}
.logo { font-size: 20px; font-weight: bold; color: #38bdf8; }
.links a { color: #94a3b8; text-decoration: none; margin-left: 24px; font-weight: 500; }
.links a:hover { color: white; }
.nav-btn { background: #0284c7; color: white !important; padding: 8px 16px; border-radius: 6px; }
.hero {
  text-align: center;
  padding: 80px 20px 60px;
  max-width: 800px;
  margin: 0 auto;
}
.hero h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  background: linear-gradient(to right, #38bdf8, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero p { font-size: 18px; color: #94a3b8; margin-bottom: 32px; }
.hero-actions { display: flex; gap: 16px; justify-content: center; }
.btn { padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; border: none; }
.btn.primary { background: #38bdf8; color: #0b0f19; }
.btn.secondary { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; }
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}
.card {
  background: #131d31;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}
.icon { font-size: 36px; margin-bottom: 16px; }
.card h3 { font-size: 20px; margin-bottom: 10px; color: #e2e8f0; }
.card p { color: #64748b; font-size: 14px; }`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Thank you for trying out this offline demo landing page!');
  });
});`
      }
    }
  },
  {
    id: 'simple-game',
    name: 'Catch the Star Game',
    description: 'An interactive canvas arcade game with player movement, collision detection, and score counter.',
    category: 'Games',
    icon: 'Gamepad2',
    difficulty: 'Intermediate',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Star Collector Game</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-wrapper">
    <div class="hud">
      <span>Score: <strong id="score">0</strong></span>
      <span>Use Arrow Keys or A/D to Move</span>
    </div>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <div class="controls">
      <button id="startBtn">Restart Game</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #020617;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: system-ui, sans-serif;
}
.game-wrapper {
  text-align: center;
}
.hud {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #38bdf8;
  font-size: 16px;
}
canvas {
  background: #0f172a;
  border: 2px solid #38bdf8;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
}
.controls { margin-top: 14px; }
button {
  background: #10b981;
  color: #022c22;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
}`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

let score = 0;
let player = { x: 180, y: 360, width: 40, height: 16, speed: 6 };
let stars = [];
let keys = {};

function spawnStar() {
  stars.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    radius: 8,
    speed: 2 + Math.random() * 2
  });
}

window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function update() {
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    player.x = Math.max(0, player.x - player.speed);
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
  }

  stars.forEach((star, index) => {
    star.y += star.speed;

    // Collision check with player
    if (
      star.y + star.radius >= player.y &&
      star.x >= player.x &&
      star.x <= player.x + player.width
    ) {
      stars.splice(index, 1);
      score += 10;
      scoreEl.textContent = score;
    } else if (star.y > canvas.height) {
      stars.splice(index, 1);
    }
  });

  if (Math.random() < 0.03) spawnStar();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player paddle
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw Stars
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.closePath();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

startBtn.onclick = () => {
  score = 0;
  scoreEl.textContent = '0';
  stars = [];
};

loop();`
      }
    }
  },
  {
    id: 'personal-website',
    name: 'Personal Developer Bio',
    description: 'Clean personal website with profile card, skills list, and project highlights.',
    category: 'Websites',
    icon: 'User',
    difficulty: 'Beginner',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Alex Rivers — Student Developer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <div class="avatar">👨‍💻</div>
    <h1>Alex Rivers</h1>
    <p class="subtitle">Student & Aspiring Software Engineer</p>
    <div class="bio">
      Passionate about web development, algorithms, and offline-first software. Currently learning full-stack development with SkillForge!
    </div>
    
    <h3>Core Skills</h3>
    <div class="tags">
      <span>HTML5</span>
      <span>CSS3</span>
      <span>JavaScript</span>
      <span>Python</span>
      <span>Git</span>
    </div>

    <button id="contactBtn">Send a Message</button>
  </main>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `body {
  background: #0f172a;
  color: #f1f5f9;
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 20px;
}
.card {
  background: #1e293b;
  border-radius: 20px;
  padding: 36px;
  max-width: 420px;
  text-align: center;
  border: 1px solid #334155;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
.avatar { font-size: 48px; margin-bottom: 12px; }
h1 { margin: 0 0 4px; font-size: 24px; color: #f8fafc; }
.subtitle { color: #38bdf8; font-size: 14px; font-weight: 500; margin-bottom: 16px; }
.bio { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
h3 { font-size: 16px; margin-bottom: 12px; color: #cbd5e1; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 24px; }
.tags span {
  background: #334155;
  color: #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
button {
  background: #22c55e;
  color: #052e16;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `document.getElementById('contactBtn').addEventListener('click', () => {
  alert('Thanks for visiting my portfolio card! Let’s build something amazing.');
});`
      }
    }
  },
  {
    id: 'portfolio-website',
    name: 'Complete Portfolio Website',
    description: 'Multi-section portfolio with hero, projects gallery, skills bar, and contact form.',
    category: 'Websites',
    icon: 'FolderGit2',
    difficulty: 'Intermediate',
    files: {
      'index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Showcase Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <div class="container nav-wrapper">
      <h2>Jordan Lee</h2>
      <nav>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <section id="about" class="container hero">
    <h1>Creative Coder &amp; Builder</h1>
    <p>I design and code modern web apps using HTML, CSS, and JavaScript. Explore my recent projects below!</p>
  </section>

  <section id="projects" class="container">
    <h2 class="section-title">Featured Works</h2>
    <div class="grid">
      <div class="project-card">
        <h3>🕹️ Mini Arcade</h3>
        <p>A retro 2D browser canvas game with sound effects and leaderboards.</p>
      </div>
      <div class="project-card">
        <h3>🧮 Math Quizzer</h3>
        <p>Interactive study helper for algebra and geometry practice.</p>
      </div>
      <div class="project-card">
        <h3>⏱️ Task Pomodoro</h3>
        <p>Productivity timer with custom interval audio and streak tracking.</p>
      </div>
    </div>
  </section>
  <script src="script.js"></script>
</body>
</html>`
      },
      'style.css': {
        name: 'style.css',
        language: 'css',
        content: `* { box-sizing: border-box; margin:0; padding:0; font-family: system-ui, sans-serif; }
body { background: #090e17; color: #f1f5f9; }
.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
header { background: #111827; border-bottom: 1px solid #1f2937; padding: 20px 0; }
.nav-wrapper { display: flex; justify-content: space-between; align-items: center; }
nav a { color: #9ca3af; text-decoration: none; margin-left: 20px; font-weight: 500; }
nav a:hover { color: #38bdf8; }
.hero { padding: 60px 20px 40px; text-align: center; }
.hero h1 { font-size: 40px; margin-bottom: 12px; color: #38bdf8; }
.hero p { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; }
.section-title { margin: 40px 0 20px; font-size: 24px; border-left: 4px solid #10b981; padding-left: 12px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 60px; }
.project-card {
  background: #162032;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 24px;
  transition: transform 0.2s;
}
.project-card:hover { transform: translateY(-4px); }
.project-card h3 { margin-bottom: 8px; color: #e2e8f0; }
.project-card p { color: #94a3b8; font-size: 14px; }`
      },
      'script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `console.log('Portfolio initialized successfully in SkillForge offline sandbox.');`
      }
    }
  }
];
