import { Skill } from '../types';

export const SKILL_SUBJECTS: Skill[] = [
  {
    id: 'html',
    name: 'HTML5',
    category: 'Frontend',
    difficulty: 'Beginner',
    prerequisites: ['Basic Computer Literacy'],
    description: 'The standard markup language for creating structured web pages and documents.',
    icon: 'FileCode2',
    color: '#ea580c',
    learningPathIds: ['web-dev-beginner'],
    projectIdeas: ['Personal Bio Page', 'Recipe Card', 'Event Invitation'],
    lessons: [
      {
        id: 'html-les-1',
        title: 'HTML Document Structure & Semantic Elements',
        description: 'Learn DOCTYPE, head, body, headings, paragraphs, and semantic tags.',
        category: 'skill',
        subjectOrSkillId: 'html',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Structure a valid HTML5 document',
          'Use header, main, section, and footer elements for accessibility',
          'Format text with tags like em, strong, and p'
        ],
        content: `### HTML5 Structure and Semantic Tags

HTML (HyperText Markup Language) defines the structure and meaning of web content.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Semantic Web Page</title>
</head>
<body>
  <header>
    <h1>Welcome to My Website</h1>
  </header>
  <main>
    <article>
      <h2>First Article</h2>
      <p>Semantic tags improve accessibility and search engine readability.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 StillSkudy</p>
  </footer>
</body>
</html>
\`\`\`

#### Why Semantic HTML Matters:
* **Screen Readers**: Visually impaired users navigate headers and landmark regions easily.
* **SEO**: Search engines can index the structure of your content accurately.
* **Maintainability**: Clearer code for team collaboration.`,
        codeExamples: [
          {
            lang: 'html',
            title: 'Semantic Document Skeleton',
            code: `<!DOCTYPE html>
<html>
<body>
  <header><h1>My Header</h1></header>
  <nav><a href="#home">Home</a></nav>
  <main><p>Content goes here</p></main>
</body>
</html>`
          }
        ],
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTML Basics Practice</title>
</head>
<body>
  <h1>My First Semantic Page</h1>
  <p>Edit this content and see it update live in the sandbox!</p>
</body>
</html>`
        },
        challengeId: 'ch-html-1'
      },
      {
        id: 'html-les-2',
        title: 'Lists, Tables, and Media (Images & Audio)',
        description: 'Display ordered/unordered lists, tabular data, and media elements.',
        category: 'skill',
        subjectOrSkillId: 'html',
        durationMinutes: 20,
        order: 2,
        objectives: [
          'Create bulleted (ul) and numbered (ol) lists',
          'Build structured data tables with thead, tbody, and tr/td',
          'Embed local and vector image assets'
        ],
        content: `### Organizing Content with Lists & Tables

#### Lists:
* **Unordered** (\`<ul>\`): Best for navigation menus and bulleted items.
* **Ordered** (\`<ol>\`): Best for numbered step-by-step procedures.

\`\`\`html
<ol>
  <li>Plan your project</li>
  <li>Write semantic HTML</li>
  <li>Add responsive CSS</li>
</ol>
\`\`\`

#### Tables:
Use \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, and \`<td>\` for tabular matrices.`,
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html>
<body>
  <h2>My Favorite Skills</h2>
  <ul>
    <li>HTML5</li>
    <li>CSS3</li>
    <li>JavaScript</li>
  </ul>
</body>
</html>`
        }
      }
    ],
    challenges: [
      {
        id: 'ch-html-1',
        title: 'Build a Semantic Student Profile Card',
        skillId: 'html',
        lessonId: 'html-les-1',
        difficulty: 'Beginner',
        description: 'Create an HTML document containing a header with your name, a main section with a bio paragraph, and an unordered list of 3 hobbies.',
        instructions: [
          'Include an <h1> element with your name or title',
          'Include a <main> tag with a <p> tag describing your interests',
          'Include a <ul> tag with at least 3 <li> items listing your favorite topics',
          'Ensure the document has a valid <footer> tag'
        ],
        hints: [
          'Remember to wrap your list items inside <ul>...</ul>',
          'Use semantic landmarks like <header>, <main>, and <footer>'
        ],
        starterFiles: {
          'index.html': {
            name: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Profile Card</title>
</head>
<body>
  <!-- Add your header, main with bio, and 3 list items here -->
  <header>
    <h1>Alex Rivera</h1>
  </header>
  <main>
    <p>I am learning to build offline web applications!</p>
    <ul>
      <li>Coding</li>
      <li>Mathematics</li>
      <li>Robotics</li>
    </ul>
  </main>
  <footer>
    <p>Powered by StillSkudy Offline</p>
  </footer>
</body>
</html>`
          }
        }
      }
    ]
  },
  {
    id: 'css',
    name: 'CSS3 & Styling',
    category: 'Frontend',
    difficulty: 'Beginner',
    prerequisites: ['HTML5 Basics'],
    description: 'Cascade styling, Flexbox layout, CSS Grid, animations, and responsive design.',
    icon: 'Palette',
    color: '#0284c7',
    learningPathIds: ['web-dev-beginner'],
    projectIdeas: ['Responsive Landing Page', 'Color Palette Generator', 'Pricing Table'],
    lessons: [
      {
        id: 'css-les-1',
        title: 'The CSS Box Model, Margins, and Padding',
        description: 'Master content, padding, border, and margin box calculation.',
        category: 'skill',
        subjectOrSkillId: 'css',
        durationMinutes: 20,
        order: 1,
        objectives: [
          'Differentiate between content, padding, border, and margin',
          'Use box-sizing: border-box for predictable layouts',
          'Apply border-radius, shadows, and color variables'
        ],
        content: `### The CSS Box Model

Every element in a web page is rendered as a rectangular box comprising four concentric layers:

1. **Content**: The text, image, or child element.
2. **Padding**: Transparent space immediately around the content inside the border.
3. **Border**: The frame bounding the padding and content.
4. **Margin**: Transparent space outside the border separating neighboring elements.

\`\`\`css
* {
  box-sizing: border-box; /* Includes padding & border in total width */
}

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #3b82f6;
  margin: 15px auto;
  border-radius: 12px;
  background-color: #1e293b;
  color: #f8fafc;
}
\`\`\``,
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="box">
    <h2>Box Model Demo</h2>
    <p>Inspect how padding and border style this container.</p>
  </div>
</body>
</html>`,
          'style.css': `body {
  background: #0f172a;
  color: white;
  font-family: sans-serif;
  padding: 20px;
}
.box {
  background: #1e293b;
  border: 2px solid #38bdf8;
  padding: 24px;
  border-radius: 12px;
  max-width: 350px;
  margin: 0 auto;
}`
        },
        challengeId: 'ch-css-1'
      },
      {
        id: 'css-les-2',
        title: 'Modern Layouts with Flexbox & Grid',
        description: 'Align items, build flexible rows, columns, and 2D responsive grids.',
        category: 'skill',
        subjectOrSkillId: 'css',
        durationMinutes: 25,
        order: 2,
        objectives: [
          'Use display: flex with justify-content and align-items',
          'Create responsive column grids with grid-template-columns: repeat(auto-fit, minmax(...))',
          'Build mobile-first media queries'
        ],
        content: `### Flexbox vs. CSS Grid

* **Flexbox (1D Layouts)**: Best for linear arrangements (navbars, button groups, vertical lists).
* **CSS Grid (2D Layouts)**: Best for rows and columns simultaneously (galleries, dashboards, full-page layouts).

\`\`\`css
/* Flexbox Navbar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Responsive Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
\`\`\``,
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="grid">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
</body>
</html>`,
          'style.css': `body { background: #0f172a; color: white; padding: 20px; font-family: sans-serif; }
.grid { display: flex; gap: 12px; }
.card { background: #1e293b; padding: 20px; border-radius: 8px; flex: 1; text-align: center; }`
        }
      }
    ],
    challenges: [
      {
        id: 'ch-css-1',
        title: 'Style a Glowing Neon Card Component',
        skillId: 'css',
        lessonId: 'css-les-1',
        difficulty: 'Beginner',
        description: 'Style a centered container with dark background, rounded corners, padding, and a glowing cyan box shadow.',
        instructions: [
          'Set the container background to #1e293b and text color to white',
          'Add a padding of 24px and border-radius of 16px',
          'Add a box-shadow with cyan or emerald glow effect',
          'Center the card horizontally using margin: 0 auto or flexbox'
        ],
        hints: [
          'Use box-shadow: 0 0 20px rgba(56, 189, 248, 0.4); for the glow'
        ],
        starterFiles: {
          'index.html': {
            name: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="neon-card">
    <h2>Neon Power</h2>
    <p>Add glowing styles to this card!</p>
  </div>
</body>
</html>`
          },
          'style.css': {
            name: 'style.css',
            language: 'css',
            content: `body {
  background: #090d16;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}
.neon-card {
  /* Complete your styling here */
  background: #1e293b;
  color: #38bdf8;
  padding: 30px;
  border-radius: 16px;
  border: 2px solid #38bdf8;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.5);
  text-align: center;
}`
          }
        }
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript Programming',
    category: 'Languages',
    difficulty: 'Intermediate',
    prerequisites: ['HTML5 Basics', 'CSS3 Basics'],
    description: 'Core logic, data structures, DOM manipulation, asynchronous programming, and events.',
    icon: 'Code2',
    color: '#eab308',
    learningPathIds: ['web-dev-beginner'],
    projectIdeas: ['Interactive Quiz App', 'Digital Stopwatch', 'Weather Simulator (Offline)'],
    lessons: [
      {
        id: 'js-les-1',
        title: 'Variables, Data Types, and Operators',
        description: 'Understand let, const, strings, numbers, booleans, and conditional logic.',
        category: 'skill',
        subjectOrSkillId: 'javascript',
        durationMinutes: 20,
        order: 1,
        objectives: [
          'Declare variables with const and let (avoid var)',
          'Operate on primitives (strings, numbers, booleans)',
          'Control program flow using if/else statements'
        ],
        content: `### JavaScript Variables and Data Types

JavaScript is the programming language of the web, enabling interactive logic in the browser.

\`\`\`javascript
// Variable declaration
const studentName = "Elena";
let score = 95;
let isPassing = score >= 70;

// Conditional logic
if (isPassing) {
  console.log(\`Great job \${studentName}, you passed!\`);
} else {
  console.log(\`Keep practicing, \${studentName}!\`);
}
\`\`\`

#### Rules for Clean Code:
* Always prefer \`const\` by default.
* Use \`let\` only when you expect the variable value to be reassigned.
* Use strict equality \`===\` rather than loose equality \`==\`.`,
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h2>JavaScript Variables Demo</h2>
  <button id="calcBtn">Calculate Grade</button>
  <p id="result"></p>
  <script src="script.js"></script>
</body>
</html>`,
          'style.css': `body { background: #0f172a; color: white; padding: 20px; font-family: sans-serif; }
button { background: #eab308; color: black; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; }
#result { margin-top: 15px; font-size: 18px; color: #4ade80; }`,
          'script.js': `const btn = document.getElementById('calcBtn');
const res = document.getElementById('result');

btn.addEventListener('click', () => {
  const name = "Jordan";
  const marks = 92;
  res.textContent = \`Student: \${name} | Score: \${marks}% (Grade: A)\`;
  console.log('Calculated result for:', name);
});`
        },
        challengeId: 'ch-js-1'
      },
      {
        id: 'js-les-2',
        title: 'DOM Manipulation & Event Listeners',
        description: 'Query HTML elements, modify classes, update text, and listen to user clicks.',
        category: 'skill',
        subjectOrSkillId: 'javascript',
        durationMinutes: 25,
        order: 2,
        objectives: [
          'Select elements with document.querySelector and getElementById',
          'Attach click, input, and submit event listeners',
          'Dynamically create and append DOM nodes'
        ],
        content: `### DOM (Document Object Model)

The DOM is an object-oriented representation of the web page that can be modified with a scripting language like JavaScript.

\`\`\`javascript
const title = document.querySelector('#main-title');
const button = document.querySelector('#action-btn');

button.addEventListener('click', () => {
  title.textContent = 'Updated with JavaScript!';
  title.classList.toggle('highlight');
});
\`\`\``,
        starterCode: {
          'index.html': `<!DOCTYPE html>
<html>
<body>
  <h1 id="headline">Original Text</h1>
  <button id="changeBtn">Change Text</button>
  <script src="script.js"></script>
</body>
</html>`,
          'script.js': `document.getElementById('changeBtn').addEventListener('click', () => {
  document.getElementById('headline').textContent = 'Changed dynamically!';
});`
        }
      }
    ],
    challenges: [
      {
        id: 'ch-js-1',
        title: 'Name & Age Display Program',
        skillId: 'javascript',
        lessonId: 'js-les-1',
        difficulty: 'Beginner',
        description: 'Write a JavaScript program that stores a student name and age in variables, calculates their birth year, and outputs the sentence to the screen.',
        instructions: [
          'Create a variable studentName = "Your Name"',
          'Create a variable age = 16',
          'Calculate birthYear = 2026 - age',
          'Display the message inside the #output div'
        ],
        hints: [
          'Use document.getElementById("output").textContent = ...',
          'Use template literals \`Hello \${studentName}!\`'
        ],
        starterFiles: {
          'index.html': {
            name: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0f172a; color: white; font-family: sans-serif; padding: 30px; text-align: center; }
    #output { margin-top: 20px; font-size: 20px; color: #38bdf8; font-weight: bold; }
    button { background: #38bdf8; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>Student Age Calculator</h2>
  <button id="runBtn">Display Student Info</button>
  <div id="output">Click the button to see details</div>
  <script src="script.js"></script>
</body>
</html>`
          },
          'script.js': {
            name: 'script.js',
            language: 'javascript',
            content: `document.getElementById('runBtn').addEventListener('click', () => {
  const studentName = "Maya Lin";
  const age = 15;
  const currentYear = 2026;
  const birthYear = currentYear - age;

  const message = \`Student: \${studentName}, Age: \${age} (Born approximately \${birthYear})\`;
  document.getElementById('output').textContent = message;
  console.log(message);
});`
          }
        }
      }
    ]
  },
  {
    id: 'python',
    name: 'Python Fundamentals',
    category: 'Languages',
    difficulty: 'Beginner',
    prerequisites: ['Algorithmic Thinking Basics'],
    description: 'Readable syntax, data structures (lists, dicts), functions, loops, and OOP concepts. (Theoretical & Code Analysis in Phase 1; Runtime Engine Planned for Future Phase).',
    icon: 'Binary',
    color: '#38bdf8',
    learningPathIds: ['python-core'],
    projectIdeas: ['Text Adventure Game', 'Student Grade Analyzer', 'Password Strength Checker'],
    lessons: [
      {
        id: 'py-les-1',
        title: 'Python Syntax, Indentation, and Data Structures',
        description: 'Explore lists, dictionaries, tuples, and clean whitespace indentation.',
        category: 'skill',
        subjectOrSkillId: 'python',
        durationMinutes: 20,
        order: 1,
        objectives: [
          'Understand Python significant whitespace & indentation',
          'Create and manipulate lists and dictionaries',
          'Write custom functions with parameters and return values'
        ],
        content: `### Python Foundations & Clean Syntax

> [!NOTE]
> In Phase 1 of StillSkudy, Python lessons provide syntax-highlighted code analysis and logic exercises. Full in-browser WebAssembly runtime execution is scheduled for Phase 4.

\`\`\`python
# Student record system in Python
def calculate_gpa(grades: list[float]) -> float:
    if not grades:
        return 0.0
    return sum(grades) / len(grades)

student = {
    "name": "David",
    "grades": [90.5, 88.0, 94.0, 98.5],
    "skills": ["HTML", "Python", "Math"]
}

gpa = calculate_gpa(student["grades"])
print(f"Student: {student['name']} | Average: {gpa:.2f}")
\`\`\`

#### Key Python Features:
* **Dynamic Typing**: No explicit type declarations required (though type hints are recommended).
* **Readable Indentation**: 4 spaces define function and loop blocks.
* **Rich Standard Library**: Built-in math, string, and collection tools.`,
        codeExamples: [
          {
            lang: 'python',
            title: 'List Comprehensions & Dictionaries',
            code: `numbers = [1, 2, 3, 4, 5, 6]
squares = [n ** 2 for n in numbers if n % 2 == 0]
print(squares)  # [4, 16, 36]`
          }
        ]
      }
    ],
    challenges: []
  },
  {
    id: 'git',
    name: 'Git & Version Control',
    category: 'Tools',
    difficulty: 'Intermediate',
    prerequisites: ['Terminal & File System Basics'],
    description: 'Repositories, commits, branching, merging, pull requests, and collaborative workflows.',
    icon: 'GitBranch',
    color: '#f97316',
    learningPathIds: ['web-dev-beginner'],
    projectIdeas: ['Open Source Contribution Guide', 'Personal Git Cheat Sheet'],
    lessons: [
      {
        id: 'git-les-1',
        title: 'Git Core Concepts: Working Directory, Staging & Commits',
        description: 'Understand snapshot-based versioning and the three states of Git.',
        category: 'skill',
        subjectOrSkillId: 'git',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Differentiate between Untracked, Staged, and Committed states',
          'Write concise and meaningful commit messages following conventional commits',
          'Understand HEAD and branching mechanisms'
        ],
        content: `### How Git Works: Snapshots, Not Diffs

Git treats data like a series of **snapshots** of a miniature filesystem.

\`\`\`bash
# 1. Initialize a new repo
git init

# 2. Stage changes to the index
git add index.html style.css

# 3. Create a permanent commit snapshot
git commit -m "feat: add responsive navigation bar"
\`\`\`

#### The 3 Trees:
1. **Working Directory**: Your actual files on disk.
2. **Staging Area (Index)**: Files prepared to go into the next commit.
3. **Repository (.git directory)**: Permanent history database.`
      }
    ],
    challenges: []
  },
  {
    id: 'uiux',
    name: 'UI/UX & Visual Design',
    category: 'Design',
    difficulty: 'Beginner',
    prerequisites: ['None'],
    description: 'Visual hierarchy, typography, contrast ratios, wireframing, and user-centric design principles.',
    icon: 'LayoutGrid',
    color: '#8b5cf6',
    learningPathIds: ['web-dev-beginner'],
    projectIdeas: ['Design System Style Guide', 'Accessible Color Contrast Checker'],
    lessons: [
      {
        id: 'uiux-les-1',
        title: 'Visual Hierarchy & Color Accessibility',
        description: 'Learn contrast ratios (WCAG 2.1), font scaling, and whitespace balance.',
        category: 'skill',
        subjectOrSkillId: 'uiux',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Apply 60-30-10 color harmony rule',
          'Ensure minimum 4.5:1 text contrast for body copy',
          'Use consistent 4px / 8px spacing grids'
        ],
        content: `### Visual Hierarchy & Layout Principles

Good UI design guides the user's eye naturally through the content without cognitive overload.

#### Core Rules:
* **Scale & Weight**: Important headers should be larger and bolder.
* **Whitespace (Negative Space)**: Gives content breathing room and signals grouped elements.
* **Accessibility First**: Never convey critical information through color alone; always pair colors with icons or descriptive labels.`
      }
    ],
    challenges: []
  },
  {
    id: 'digital-skills',
    name: 'Digital Skills & Productivity',
    category: 'Foundations',
    difficulty: 'Beginner',
    prerequisites: ['None'],
    description: 'Data security, search literacy, offline-first computing, and ethical technology practices.',
    icon: 'Laptop',
    color: '#06b6d4',
    learningPathIds: ['digital-literacy'],
    projectIdeas: ['Personal Data Privacy Plan', 'Digital File Organization System'],
    lessons: [
      {
        id: 'dig-les-1',
        title: 'Offline-First Computing & Data Sovereignty',
        description: 'Understand how local storage, browser sandboxes, and offline apps protect your data.',
        category: 'skill',
        subjectOrSkillId: 'digital-skills',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Understand how local databases like IndexedDB work on your machine',
          'Recognize privacy benefits of zero-cloud local computing',
          'Safely create JSON data backups'
        ],
        content: `### Offline-First Architecture

An **offline-first application** treats the local device as the primary source of truth rather than relying on remote servers.

#### Why Offline-First Empowers Students:
* **Equity**: Works reliably on laptops without broadband internet or on school buses.
* **Privacy**: Your notes, code, and test scores belong to you and stay on your hardware.
* **Speed**: Instant load times and zero network roundtrip latency.`
      }
    ],
    challenges: []
  }
];
