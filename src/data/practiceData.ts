import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // --- Math Questions ---
  {
    id: 'pq-math-1',
    type: 'mcq',
    subjectOrSkillId: 'math-foundations',
    topicTitle: 'Linear Equations',
    question: 'Solve for x in the linear equation: 3x - 7 = 14',
    options: ['x = 5', 'x = 7', 'x = 9', 'x = 6'],
    correctAnswer: 'x = 7',
    explanation: 'Add 7 to both sides: 3x = 21. Then divide both sides by 3: x = 7.',
    hint: 'First isolate the term with x by adding 7 to 14.'
  },
  {
    id: 'pq-math-2',
    type: 'true_false',
    subjectOrSkillId: 'math-foundations',
    topicTitle: 'Coordinate Geometry',
    question: 'A horizontal line parallel to the x-axis has a slope of zero (m = 0).',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'A horizontal line has zero vertical change (rise = 0), so m = 0 / run = 0.',
    hint: 'Think of walking on a flat flat road with no incline.'
  },
  {
    id: 'pq-math-3',
    type: 'short_answer',
    subjectOrSkillId: 'math-foundations',
    topicTitle: 'Algebra',
    question: 'What is the value of x when 2x + 10 = 20?',
    correctAnswer: '5',
    explanation: 'Subtract 10 from 20 to get 10, then divide by 2 to get 5.',
    hint: 'Enter just the numeric value.'
  },

  // --- Science / Physics Questions ---
  {
    id: 'pq-sci-1',
    type: 'mcq',
    subjectOrSkillId: 'science-physics',
    topicTitle: "Newton's Laws",
    question: "According to Newton's Second Law of Motion, what is the formula for Force?",
    options: ['F = m / a', 'F = m × a', 'F = m + a', 'F = a / m'],
    correctAnswer: 'F = m × a',
    explanation: 'Force equals Mass multiplied by Acceleration (F = ma).',
    hint: 'Force is directly proportional to both mass and acceleration.'
  },
  {
    id: 'pq-sci-2',
    type: 'true_false',
    subjectOrSkillId: 'science-physics',
    topicTitle: 'Mechanics',
    question: 'In the absence of external friction, an object in motion will continue moving at a constant speed in a straight line forever.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: "This is Newton's First Law of Motion (Law of Inertia).",
    hint: 'Think of an object moving through deep outer space.'
  },

  // --- Computer Science Questions ---
  {
    id: 'pq-cs-1',
    type: 'mcq',
    subjectOrSkillId: 'computer-science',
    topicTitle: 'Binary Numbers',
    question: 'What is the decimal equivalent of the 8-bit binary number 00001010?',
    options: ['8', '10', '12', '16'],
    correctAnswer: '10',
    explanation: 'Place values: 8 + 2 = 10 in decimal.',
    hint: 'Add the 8s place (2^3) and the 2s place (2^1).'
  },
  {
    id: 'pq-cs-2',
    type: 'code_quiz',
    subjectOrSkillId: 'computer-science',
    topicTitle: 'Boolean Logic',
    question: 'What will be the output of this Python conditional statement?',
    codeSnippet: `is_weekend = True
has_homework = False

if is_weekend and not has_homework:
    print("Free time to code!")
else:
    print("Study session active.")`,
    options: ['Free time to code!', 'Study session active.', 'SyntaxError', 'None'],
    correctAnswer: 'Free time to code!',
    explanation: 'is_weekend is True and not has_homework evaluates to True, so the if-block executes.',
    hint: 'Both conditions in the and expression evaluate to True.'
  },

  // --- Web Development Questions ---
  {
    id: 'pq-web-1',
    type: 'mcq',
    subjectOrSkillId: 'web-dev-basics',
    topicTitle: 'CSS Flexbox',
    question: 'Which CSS property is used to align flex items along the main horizontal axis?',
    options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
    correctAnswer: 'justify-content',
    explanation: 'justify-content controls distribution and alignment along the main axis.',
    hint: 'Use align-items for the cross axis, and justify-content for the main axis.'
  },
  {
    id: 'pq-web-2',
    type: 'code_quiz',
    subjectOrSkillId: 'web-dev-basics',
    topicTitle: 'HTML5 Elements',
    question: 'Which HTML tag represents self-contained, independent article content?',
    codeSnippet: `<article>
  <h2>Daily Study Tip</h2>
  <p>Practice coding for 20 minutes every day.</p>
</article>`,
    options: ['<article>', '<section>', '<div>', '<main>'],
    correctAnswer: '<article>',
    explanation: 'The <article> tag specifies independent, self-contained content.',
    hint: 'Look at the enclosing wrapper element in the snippet.'
  },

  // --- Python Questions ---
  {
    id: 'pq-py-1',
    type: 'code_quiz',
    subjectOrSkillId: 'python-programming',
    topicTitle: 'Python Data Structures',
    question: 'What is the length of the list after executing this code snippet?',
    codeSnippet: `fruits = ["apple", "banana"]
fruits.append("orange")
fruits.pop(0)`,
    options: ['1', '2', '3', '0'],
    correctAnswer: '2',
    explanation: 'Initial length is 2. append adds "orange" (length 3). pop(0) removes "apple" at index 0, returning length to 2.',
    hint: 'Trace the operations: 2 + 1 - 1.'
  }
];
