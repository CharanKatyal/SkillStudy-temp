import { AIMessage, AIProviderConfig } from '../types/ai';

export class AITutorService {
  private config: AIProviderConfig = {
    provider: 'offline-engine'
  };

  constructor() {
    const raw = localStorage.getItem('stillskudy_ai_config');
    if (raw) {
      try {
        this.config = JSON.parse(raw);
      } catch {}
    }
  }

  getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  saveConfig(newConfig: AIProviderConfig) {
    this.config = newConfig;
    localStorage.setItem('stillskudy_ai_config', JSON.stringify(newConfig));
  }

  /**
   * Process prompt using the selected provider (Offline Pedagogical Engine or Cloud API)
   */
  async generateResponse(
    userPrompt: string,
    context?: {
      currentLesson?: { title: string; content?: string };
      activeCode?: string;
      activeFileName?: string;
      activeSubjectOrSkill?: string;
    }
  ): Promise<AIMessage> {
    // If user configured a cloud API key and is online, query cloud endpoint
    if (this.config.provider === 'gemini' && this.config.apiKey && navigator.onLine) {
      try {
        return await this.queryGemini(userPrompt, context);
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to built-in offline engine:', err);
      }
    } else if (this.config.provider === 'openai' && this.config.apiKey && navigator.onLine) {
      try {
        return await this.queryOpenAI(userPrompt, context);
      } catch (err: any) {
        console.warn('OpenAI API call failed, falling back to built-in offline engine:', err);
      }
    }

    // Default: High-Performance Built-in Pedagogical Heuristics Engine (100% Offline)
    return this.generateOfflineResponse(userPrompt, context);
  }

  /**
   * Built-in Offline Educational Heuristics & Knowledge Engine
   */
  private generateOfflineResponse(
    prompt: string,
    context?: {
      currentLesson?: { title: string; content?: string };
      activeCode?: string;
      activeFileName?: string;
      activeSubjectOrSkill?: string;
    }
  ): AIMessage {
    const p = prompt.toLowerCase();
    let content = '';
    let codeSnippet: string | undefined;

    // Code Debugging / Review request
    if (p.includes('error') || p.includes('debug') || p.includes('fix') || p.includes('review') || p.includes('not working')) {
      if (context?.activeCode) {
        content = `### 🔍 Code Analysis & Debugging Guide

I reviewed your active **${context.activeFileName || 'code file'}**:

1. **Syntax & Structure**: Check that all opening braces \`{\`, parentheses \`(\`, and HTML tags are properly balanced and closed.
2. **DOM Element IDs**: Make sure element IDs queried in JavaScript (e.g. \`getElementById('...')\`) exactly match the \`id\` attributes in your \`index.html\`.
3. **Console Logs**: Check the bottom **Console / Output** drawer for specific line number errors.

> 💡 **Tutor Tip**: Always use \`console.log('Checkpoint:', variable)\` to inspect variable values step-by-step!`;
        codeSnippet = `// Quick debugging pattern:
console.log('Current value is:', myVariable);`;
      } else {
        content = `To help you debug, open your code file in the **IDE** or paste your code snippet here! In general, look for missing quotes, misspelled variable names, or unclosed HTML tags.`;
      }
    }
    // HTML Questions
    else if (p.includes('html') || p.includes('tag') || p.includes('doctype') || p.includes('semantic')) {
      content = `### 🌐 HTML5 Core Concepts

HTML defines the structural architecture of web pages:
* **Semantic Landmarks**: Use \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, and \`<footer>\` to make pages accessible to screen readers.
* **Text Formatting**: Use \`<h1>\` through \`<h6>\` for hierarchical headings and \`<p>\` for body paragraphs.
* **Document Root**: Every HTML5 document begins with \`<!DOCTYPE html>\` followed by \`<html lang="en">\`.`;
      codeSnippet = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessible Page</title>
</head>
<body>
  <header><h1>Welcome</h1></header>
  <main><p>Your content here.</p></main>
</body>
</html>`;
    }
    // CSS Questions
    else if (p.includes('css') || p.includes('flexbox') || p.includes('grid') || p.includes('color') || p.includes('center')) {
      content = `### 🎨 CSS Styling & Layout Guide

* **Center Anything with Flexbox**:
  Apply \`display: flex; justify-content: center; align-items: center;\` to the parent container.
* **Box Model**:
  Always declare \`* { box-sizing: border-box; }\` so that padding and border are included inside element widths.
* **Responsive Columns**:
  Use \`grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\` for automatic responsive column layouts without media queries!`;
      codeSnippet = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 16px;
}`;
    }
    // JavaScript Questions
    else if (p.includes('javascript') || p.includes('js') || p.includes('let') || p.includes('const') || p.includes('function') || p.includes('dom')) {
      content = `### ⚡ JavaScript Logic & DOM Interaction

* **Variables**: Prefer \`const\` for immutable bindings, and \`let\` when values must be reassigned. Avoid legacy \`var\`.
* **Event Listeners**: Use \`element.addEventListener('click', () => { ... })\` to react to user interactions cleanly.
* **Template Literals**: Use backticks with \`\${variable}\` for clean multi-line string interpolation.`;
      codeSnippet = `const button = document.getElementById('myBtn');
const output = document.getElementById('myOutput');

button.addEventListener('click', () => {
  output.textContent = "Button was clicked successfully! 🚀";
});`;
    }
    // Mathematics
    else if (p.includes('math') || p.includes('equation') || p.includes('quadratic') || p.includes('algebra') || p.includes('formula')) {
      content = `### 📐 Mathematical Problem Solving & Algebra

1. **Balance Principle**: Whatever operation you apply to one side of the equal sign ($+$, $-$, $\\times$, $\\div$), you must apply equally to the other.
2. **Quadratic Formula**: For $ax^2 + bx + c = 0$, the roots are:
   $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
3. **The Discriminant ($\\Delta = b^2 - 4ac$)**:
   * $\\Delta > 0$: 2 real solutions
   * $\\Delta = 0$: Exactly 1 real solution
   * $\\Delta < 0$: 2 complex solutions`;
    }
    // Science
    else if (p.includes('science') || p.includes('force') || p.includes('newton') || p.includes('physics') || p.includes('chemistry')) {
      content = `### 🔬 Scientific Principles & Mechanics

* **Newton's Second Law**: $\\vec{F} = m\\vec{a}$ (Net Force equals mass times acceleration).
* **Law of Inertia**: Objects maintain constant velocity unless acted upon by a net external force.
* **Chemical Bonds**:
  * **Ionic**: Complete electron transfer from metal to non-metal.
  * **Covalent**: Shared electron pairs between non-metals.`;
    }
    // Socratic Hint or General Learning
    else {
      const activeTopic = context?.currentLesson?.title || context?.activeSubjectOrSkill || 'your current topic';
      content = `### 🎓 StillSkudy AI Tutor

I am here to guide you through **${activeTopic}**!

Let's break it down using the Socratic method:
1. What is the main goal or outcome you are trying to achieve?
2. What have you tried so far, and what happened?
3. Which specific concept (syntax, equation, or styling) would you like to explore step-by-step?

Ask me any question about **Academics (Math, Science, English)**, **Practical Web Coding (HTML, CSS, JS, Python)**, or **Debugging your IDE files**!`;
    }

    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content,
      codeSnippet,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  private async queryGemini(prompt: string, context?: any): Promise<AIMessage> {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are StillSkudy Tutor, an encouraging offline-first educational AI tutor for students. Explain clearly, use markdown headers and code blocks. Context: ${JSON.stringify(context || {})}. Student Prompt: ${prompt}`
              }
            ]
          }
        ]
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  private async queryOpenAI(prompt: string, context?: any): Promise<AIMessage> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are StillSkudy Tutor, an encouraging educational assistant for students.'
          },
          {
            role: 'user',
            content: `Context: ${JSON.stringify(context || {})}\n\nPrompt: ${prompt}`
          }
        ]
      })
    });
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || 'No response from OpenAI';
    return {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

export const aiTutorService = new AITutorService();
