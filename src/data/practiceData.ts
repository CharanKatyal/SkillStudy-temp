import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // Mathematics
  {
    id: 'm-q1',
    subjectOrSkillId: 'mathematics',
    topicTitle: 'Linear Equations',
    type: 'mcq',
    question: 'Solve for x: 4x - 8 = 24',
    options: ['x = 4', 'x = 6', 'x = 8', 'x = 10'],
    correctAnswer: 2, // index 2 -> x = 8
    explanation: 'Add 8 to both sides: 4x = 32. Divide both sides by 4: x = 8.',
    hint: 'Add 8 to both sides first.'
  },
  {
    id: 'm-q2',
    subjectOrSkillId: 'mathematics',
    topicTitle: 'Linear Systems',
    type: 'true_false',
    question: 'A system of two parallel linear lines with different y-intercepts has infinitely many solutions.',
    options: ['True', 'False'],
    correctAnswer: 1, // False
    explanation: 'Parallel lines with different y-intercepts never intersect, so the system has NO solution (0 solutions).',
    hint: 'Do parallel lines ever cross?'
  },
  {
    id: 'm-q3',
    subjectOrSkillId: 'mathematics',
    topicTitle: 'Linear Equations',
    type: 'short_answer',
    question: 'If 2x + 5 = 19, what is the numerical value of x?',
    correctAnswer: '7',
    explanation: 'Subtract 5: 2x = 14. Divide by 2: x = 7.',
    hint: 'Isolate 2x first.'
  },
  {
    id: 'm-q4',
    subjectOrSkillId: 'mathematics',
    topicTitle: 'Quadratic Equations',
    type: 'mcq',
    question: 'What is the discriminant formula for ax² + bx + c = 0?',
    options: ['b² + 4ac', 'b² - 4ac', '4ac - b²', '-b ± √ac'],
    correctAnswer: 1,
    explanation: 'The discriminant is Δ = b² - 4ac. It determines the number and type of roots.',
    hint: 'Look for the term under the square root in the quadratic formula.'
  },
  {
    id: 'm-q6',
    subjectOrSkillId: 'mathematics',
    topicTitle: 'Trigonometry',
    type: 'mcq',
    question: 'In a right triangle, which ratio represents tangent (tan θ)?',
    options: ['Opposite / Hypotenuse', 'Adjacent / Hypotenuse', 'Opposite / Adjacent', 'Hypotenuse / Opposite'],
    correctAnswer: 2,
    explanation: 'By SOH-CAH-TOA, Tan(θ) = Opposite / Adjacent.',
    hint: 'Remember the mnemonic SOH CAH TOA.'
  },

  // Science
  {
    id: 's-q1',
    subjectOrSkillId: 'science',
    topicTitle: 'Physics: Forces',
    type: 'mcq',
    question: 'According to Newton’s Second Law of Motion, what is the relationship between force (F), mass (m), and acceleration (a)?',
    options: ['F = m / a', 'F = m × a', 'F = a / m', 'F = m + a'],
    correctAnswer: 1,
    explanation: 'Newton’s Second Law states that F = m * a.',
    hint: 'Force equals mass multiplied by acceleration.'
  },
  {
    id: 's-q2',
    subjectOrSkillId: 'science',
    topicTitle: 'Physics: Inertia',
    type: 'true_false',
    question: 'An object in space moving at constant velocity requires continuous force to stay in motion.',
    options: ['True', 'False'],
    correctAnswer: 1, // False
    explanation: 'By Newton\'s First Law (Inertia), an object in uniform motion will stay in motion indefinitely unless acted on by a net external force.',
    hint: 'Think about Newton\'s First Law of inertia in frictionless space.'
  },
  {
    id: 's-q4',
    subjectOrSkillId: 'science',
    topicTitle: 'Chemistry: Bonds',
    type: 'mcq',
    question: 'Which type of chemical bond forms when valence electrons are completely transferred from a metal to a non-metal?',
    options: ['Covalent Bond', 'Hydrogen Bond', 'Ionic Bond', 'Metallic Bond'],
    correctAnswer: 2,
    explanation: 'Ionic bonding involves the complete electrostatic transfer of electrons between cations and anions (e.g. NaCl).',
    hint: 'Think of table salt (NaCl).'
  },

  // English
  {
    id: 'e-q1',
    subjectOrSkillId: 'english',
    topicTitle: 'Writing & Rhetoric',
    type: 'mcq',
    question: 'In the PEEL paragraph writing framework, what does the second "E" stand for?',
    options: ['Evaluation', 'Explanation', 'Emphasis', 'Extension'],
    correctAnswer: 1,
    explanation: 'PEEL stands for Point, Evidence, Explanation, and Link.',
    hint: 'It explains how the evidence connects to your claim.'
  },
  {
    id: 'e-q2',
    subjectOrSkillId: 'english',
    topicTitle: 'Thesis Writing',
    type: 'true_false',
    question: 'A strong academic thesis statement should be a simple statement of universal fact rather than an arguable claim.',
    options: ['True', 'False'],
    correctAnswer: 1, // False
    explanation: 'A thesis statement must be a debatable and arguable position that requires supporting evidence and reasoning.',
    hint: 'If everyone already agrees on a simple fact, is there anything to argue?'
  },

  // HTML
  {
    id: 'html-q1',
    subjectOrSkillId: 'html',
    topicTitle: 'HTML5 Elements',
    type: 'mcq',
    question: 'Which HTML5 element is most semantically appropriate for the primary content of a document?',
    options: ['<div class="content">', '<main>', '<section id="main">', '<center>'],
    correctAnswer: 1,
    explanation: 'The <main> tag semantically defines the dominant content of the <body> of a document.',
    hint: 'It represents the main content area.'
  },
  {
    id: 'html-q2',
    subjectOrSkillId: 'html',
    topicTitle: 'HTML Structure',
    type: 'true_false',
    question: 'The <title> tag should be placed directly inside the <head> element of an HTML document.',
    options: ['True', 'False'],
    correctAnswer: 0, // True
    explanation: 'The <title> element provides the document title and must be inside <head>.',
    hint: 'Where do metadata tags go?'
  },

  // CSS
  {
    id: 'css-q1',
    subjectOrSkillId: 'css',
    topicTitle: 'CSS Box Model',
    type: 'mcq',
    question: 'When "box-sizing: border-box" is set, what does an element\'s specified "width" include?',
    options: [
      'Only content width',
      'Content, padding, and border',
      'Content and margin only',
      'Padding and margin only'
    ],
    correctAnswer: 1,
    explanation: 'border-box tells the browser to include padding and border in the element\'s total width and height.',
    hint: 'It stops elements from overflowing when you add padding.'
  },
  {
    id: 'css-q2',
    subjectOrSkillId: 'css',
    topicTitle: 'CSS Layout',
    type: 'mcq',
    question: 'Which CSS property is used in Flexbox to align items along the primary main axis?',
    options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
    correctAnswer: 1,
    explanation: 'justify-content controls alignment along the main axis, whereas align-items controls the cross axis.',
    hint: 'Think of "justifying" text along a row.'
  },

  // JavaScript
  {
    id: 'js-q1',
    subjectOrSkillId: 'javascript',
    topicTitle: 'Variables & Scope',
    type: 'mcq',
    question: 'What is the output of: typeof [1, 2, 3] in standard JavaScript?',
    options: ['"array"', '"object"', '"list"', '"undefined"'],
    correctAnswer: 1,
    explanation: 'In JavaScript, Arrays are technically specialized objects, so typeof [] returns "object". (Use Array.isArray() to distinguish).',
    hint: 'In JavaScript, almost everything non-primitive is an...'
  },
  {
    id: 'js-q2',
    subjectOrSkillId: 'javascript',
    topicTitle: 'Code Quiz',
    type: 'code_quiz',
    question: 'What will be printed to the console?',
    codeSnippet: `const numbers = [10, 20, 30];
const total = numbers.reduce((acc, curr) => acc + curr, 5);
console.log(total);`,
    options: ['60', '65', '50', '35'],
    correctAnswer: 1, // 65
    explanation: 'Initial accumulator is 5. Adding 10, 20, 30 gives 5 + 10 + 20 + 30 = 65.',
    hint: 'Notice the second argument 5 passed to reduce().'
  },
  {
    id: 'js-q3',
    subjectOrSkillId: 'javascript',
    topicTitle: 'Equality',
    type: 'true_false',
    question: 'In JavaScript, the strict equality expression ("5" === 5) evaluates to true.',
    options: ['True', 'False'],
    correctAnswer: 1, // False
    explanation: 'Strict equality (===) checks both value AND type without type coercion. String "5" does not equal Number 5.',
    hint: '=== checks both type and value.'
  }
];
