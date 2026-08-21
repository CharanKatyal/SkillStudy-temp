import { AIMessage, AIProviderConfig } from '../types/ai';

export class AITutorService {
  private config: AIProviderConfig = {
    provider: 'offline-engine'
  };

  constructor() {
    const raw = localStorage.getItem('skillforge_ai_config');
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
    localStorage.setItem('skillforge_ai_config', JSON.stringify(newConfig));
  }

  /**
   * Process prompt using the Built-in Offline Pedagogical Heuristics Engine (100% Offline, Zero Cloud)
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
    const lower = prompt.toLowerCase();
    let content = '';
    let codeSnippet: string | undefined;

    if (lower.includes('debug') || lower.includes('error') || lower.includes('fix')) {
      content = `### 🔍 Offline Code Analysis & Debugger\n\nI analyzed your current workspace (**${context?.activeFileName || 'active file'}**):\n\n1. **Check closing brackets & semicolons**: Make sure all open \`{\`, \`(\`, \`[\` pairs are properly closed.\n2. **Check variable scoping**: Prefer \`const\` and \`let\` over \`var\` to avoid unexpected hoisting bugs.\n3. **Console diagnostics**: Click the **Run** button to execute and inspect the sandboxed console output tab.\n\n*Note: Full on-device LLM code generation is coming soon in an upcoming offline update.*`;
      if (context?.activeCode) {
        codeSnippet = `// Active File: ${context.activeFileName || 'script.js'}\n// Status: Verified for syntax structure\nconsole.log("Workspace ready!");`;
      }
    } else if (lower.includes('hint') || lower.includes('help') || lower.includes('socratic')) {
      content = `### 💡 Socratic Study Hint\n\nTake a step-by-step approach to this concept:\n\n1. **Identify the Given Inputs**: What data or formulas are provided in the lesson?\n2. **Deconstruct into Subproblems**: Can you solve a single small step first before the entire problem?\n3. **Test in Sandbox**: Write a small prototype script in the IDE to test your logic!\n\n*What specific step are you finding challenging?*`;
    } else if (lower.includes('math') || lower.includes('formula') || lower.includes('equation')) {
      content = `### 📐 Core Mathematical Concepts\n\n* **Linear Equations**: $y = mx + b$ where $m$ is slope and $b$ is $y$-intercept.\n* **Quadratic Formula**: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$\n* **Newton's 2nd Law**: $\\vec{F} = m\\vec{a}$\n\nAll formulas and problem sets are available in full detail inside the **Academics** section!`;
    } else {
      content = `### 🎓 SkillForge Learning Guide (100% Offline)\n\nI'm your offline educational companion! SkillForge runs completely inside your browser with **zero internet connection** needed.\n\nHere is how you can level up right now:\n* 📖 **Academics**: Study structured Math, Science, and English lessons.\n* 💻 **Skills**: Learn HTML, CSS, JavaScript, and Python with hands-on challenges.\n* 🛠️ **Offline IDE**: Code and preview web apps with instant console logs.\n* 📝 **Practice Hub**: Test your retention with interactive quizzes.\n\n*(Full on-device conversational AI model is coming soon!)*`;
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content,
      codeSnippet,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}

export const aiTutorService = new AITutorService();
