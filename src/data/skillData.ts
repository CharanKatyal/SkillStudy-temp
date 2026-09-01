import { Skill } from '../types';

export const SKILL_SUBJECTS: Skill[] = [
  {
    id: 'web-dev-basics',
    name: 'Modern Web Development',
    category: 'Frontend',
    difficulty: 'Beginner',
    prerequisites: ['Basic Computer Literacy'],
    description: 'Learn the core trinity of the web: HTML for structure, CSS for styling, and JavaScript for dynamic interactivity.',
    icon: 'Code2',
    color: 'sky',
    learningPathIds: ['lp-web-starter'],
    projectIdeas: [
      'Interactive Digital Calculator',
      'Personal Student Portfolio Card',
      'Pomodoro Focus Timer App'
    ],
    lessons: [
      {
        id: 'les-web-101',
        title: 'HTML Semantic Elements & Page Structure',
        description: 'Learn how to build accessible, semantic web layouts using modern HTML tags.',
        category: 'skill',
        subjectOrSkillId: 'web-dev-basics',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Understand DOM hierarchy and nesting tags',
          'Use semantic tags like header, main, nav, and section',
          'Embed text, hyperlinks, and interactive buttons'
        ],
        content: `### The Skeleton of the Web: HTML5
HTML (**HyperText Markup Language**) provides the structure and content of every webpage on the internet.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Web Page</title>
</head>
<body>
  <header>
    <h1>Welcome to My Code Studio</h1>
  </header>
  <main>
    <p>Coding opens doors to infinite creative possibilities.</p>
    <button id="cta-btn">Click Me</button>
  </main>
</body>
</html>
\`\`\`

---

### Why Semantic HTML Matters:
1. **Accessibility (a11y):** Screen readers use semantic tags to navigate the page for visually impaired users.
2. **SEO & Search Engines:** Helps search engine bots index content accurately.
3. **Clean Maintainability:** Makes reading and updating code intuitive for developer teams.`,
        codeExamples: [
          {
            lang: 'html',
            title: 'Sample Semantic Card',
            code: `<article class="card">
  <h2>Study Goal</h2>
  <p>Finish 3 coding lessons today.</p>
  <span class="badge">In Progress</span>
</article>`
          }
        ]
      },
      {
        id: 'les-web-102',
        title: 'CSS Flexbox & Responsive Layouts',
        description: 'Master 1-dimensional flexible box layout alignment, spacing, and centering.',
        category: 'skill',
        subjectOrSkillId: 'web-dev-basics',
        durationMinutes: 20,
        order: 2,
        objectives: [
          'Turn elements into flex containers with display: flex',
          'Control cross-axis and main-axis alignment using justify-content and align-items',
          'Easily center any UI element both horizontally and vertically'
        ],
        content: `### Mastering CSS Flexbox
Flexbox makes it easy to distribute space and align content dynamically inside a container.

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* Main axis alignment */
  align-items: center;            /* Cross axis alignment */
  gap: 16px;
}
\`\`\`

---

### The Magic 3 Lines to Center Anything:
\`\`\`css
.perfect-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\``
      }
    ],
    challenges: [
      {
        id: 'chal-web-101',
        title: 'Build a Glowing Student Profile Card',
        skillId: 'web-dev-basics',
        difficulty: 'Beginner',
        description: 'Create a responsive profile card containing a name header, an avatar placeholder, and an action button.',
        instructions: [
          'Add a centered container with a dark background',
          'Add a circular avatar image and a <h1> heading with your name',
          'Style the button with a hover transition and rounded corners'
        ],
        hints: [
          'Use display: flex and flex-direction: column to stack items vertically.',
          'Add border-radius: 9999px to create a circular avatar.'
        ],
        starterFiles: {
          'index.html': {
            name: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
  <title>Profile Card</title>
</head>
<body>
  <div class="profile-card">
    <div class="avatar">👨‍💻</div>
    <h2>Alex Rivera</h2>
    <p class="role">Student Developer</p>
    <button id="connect-btn">Connect</button>
  </div>
</body>
</html>`
          },
          'style.css': {
            name: 'style.css',
            language: 'css',
            content: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
  font-family: sans-serif;
  color: white;
}

.profile-card {
  background: #1e293b;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #334155;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  width: 280px;
}

.avatar {
  font-size: 48px;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 6px 0;
}

.role {
  color: #38bdf8;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 20px;
}

button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}`
          }
        }
      }
    ]
  },
  {
    id: 'python-programming',
    name: 'Python Programming Essentials',
    category: 'Languages',
    difficulty: 'Beginner',
    prerequisites: ['Basic Logic'],
    description: 'Learn Python syntax, dynamic data structures (lists, dictionaries), functions, and algorithmic problem solving.',
    icon: 'Terminal',
    color: 'amber',
    learningPathIds: ['lp-python-journey'],
    projectIdeas: [
      'Interactive Command-Line Quiz Game',
      'Student Grade Tracker & GPA Calculator',
      'Text-based Adventure Quest'
    ],
    lessons: [
      {
        id: 'les-py-101',
        title: 'Variables, Data Types & Formatted Strings',
        description: 'Discover how Python handles numbers, strings, booleans, and modern f-strings.',
        category: 'skill',
        subjectOrSkillId: 'python-programming',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Declare variables with dynamic typing in Python',
          'Work with strings, integers, floats, and booleans',
          'Use f-strings for clean string interpolation'
        ],
        content: `### Clean & Expressive Python Syntax
Python is designed for readability and simplicity.

\`\`\`python
# Declaring variables
student_name = "Maya"
grade_level = 10
study_hours = 3.5
is_enrolled = True

# Formatted string (f-string)
message = f"Student {student_name} (Grade {grade_level}) studied for {study_hours} hours."
print(message)
\`\`\`

---

### Core Data Types in Python:
- \`str\` : Text and characters (e.g. \`"Hello"\`)
- \`int\` : Whole integers (e.g. \`42\`, \`-7\`)
- \`float\` : Decimal numbers (e.g. \`3.14159\`)
- \`bool\` : Logical values (\`True\` or \`False\`)
- \`list\` : Ordered collections (e.g. \`[1, 2, 3]\`)`,
        codeExamples: [
          {
            lang: 'python',
            title: 'Dynamic Data Structures',
            code: `# Python Lists & Dicts
subjects = ["Math", "Physics", "Computer Science"]
grades = {"Math": 95, "Physics": 88, "Computer Science": 98}

print(f"Top Subject: {subjects[2]} with Grade: {grades['Computer Science']}%")`
          }
        ]
      }
    ],
    challenges: [
      {
        id: 'chal-py-101',
        title: 'Write a Study Streak Calculator',
        skillId: 'python-programming',
        difficulty: 'Beginner',
        description: 'Write a function that calculates total study points based on consecutive daily streak days.',
        instructions: [
          'Create a function calculate_streak_bonus(days)',
          'Award 10 base points per day',
          'Add a 50 point bonus if streak is 7 days or more'
        ],
        hints: ['Use an if statement: if days >= 7:'],
        starterFiles: {
          'main.py': {
            name: 'main.py',
            language: 'python',
            content: `def calculate_streak_bonus(days):
    base_points = days * 10
    # Add bonus calculation here
    if days >= 7:
        return base_points + 50
    return base_points

# Test with 7 days
print("Points for 7 days:", calculate_streak_bonus(7)) # Expected: 120
print("Points for 3 days:", calculate_streak_bonus(3)) # Expected: 30`
          }
        }
      }
    ]
  },
  {
    id: 'git-tools',
    name: 'Git & Version Control',
    category: 'Tools',
    difficulty: 'Intermediate',
    prerequisites: ['Basic CLI knowledge'],
    description: 'Learn distributed version control, tracking changes, branch management, and collaborating on repositories.',
    icon: 'GitBranch',
    color: 'purple',
    learningPathIds: ['lp-web-starter'],
    projectIdeas: [
      'Publishing a Project to GitHub Pages',
      'Open Source Contribution Flow'
    ],
    lessons: [
      {
        id: 'les-git-101',
        title: 'Snapshots, Commits, and Repositories',
        description: 'Understand how Git tracks project history like a time machine for your code.',
        category: 'skill',
        subjectOrSkillId: 'git-tools',
        durationMinutes: 15,
        order: 1,
        objectives: [
          'Initialize a local git repository with git init',
          'Stage files using git add and create commits with git commit',
          'Inspect project history using git log'
        ],
        content: `### The Three States of Git
Git projects have three primary local zones:
1. **Working Directory:** The actual files you are currently editing.
2. **Staging Area (Index):** A staging zone that formats the next commit snapshot.
3. **Repository (HEAD):** The permanent history of verified commits.

\`\`\`bash
# Initialize repo
git init

# Stage all changes
git add .

# Create snapshot
git commit -m "feat: setup initial student timetable"
\`\`\``
      }
    ],
    challenges: []
  }
];
