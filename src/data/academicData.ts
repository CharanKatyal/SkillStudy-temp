import { AcademicSubject } from '../types';

export const ACADEMIC_SUBJECTS: AcademicSubject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Binary',
    color: '#3b82f6',
    description: 'Foundations of Algebra, Geometry, Functions, and Statistical Reasoning.',
    chapters: [
      {
        id: 'math-ch1',
        subjectId: 'mathematics',
        title: 'Algebra & Equations',
        description: 'Linear equations, quadratic formulas, variables, and systems of equations.',
        topics: [
          {
            id: 'math-top-1-1',
            chapterId: 'math-ch1',
            title: 'Linear Equations & Modeling',
            practiceQuestionIds: ['m-q1', 'm-q2', 'm-q3'],
            lessons: [
              {
                id: 'math-les-1',
                title: 'Solving Single-Variable Linear Equations',
                description: 'Understand the properties of equality and balance operations.',
                category: 'academic',
                subjectOrSkillId: 'mathematics',
                durationMinutes: 15,
                order: 1,
                objectives: [
                  'Isolate unknown variables using inverse operations',
                  'Maintain mathematical equivalence across equal signs',
                  'Verify solutions through substitution'
                ],
                content: `### Linear Equations & The Balance Principle

A **linear equation** in one variable is an equation that can be written in the standard form:

$$ax + b = 0$$

where $a$ and $b$ are real numbers and $a \\neq 0$.

#### Key Algebraic Rules:
1. **Addition/Subtraction Property of Equality**: If $a = b$, then $a + c = b + c$ and $a - c = b - c$.
2. **Multiplication/Division Property of Equality**: If $a = b$ and $c \\neq 0$, then $a \\cdot c = b \\cdot c$ and $a / c = b / c$.

#### Worked Example:
Solve for $x$:
$$3x - 7 = 14$$

* Step 1: Add $7$ to both sides $\\rightarrow 3x = 21$
* Step 2: Divide both sides by $3 \\rightarrow x = 7$
* Verification: $3(7) - 7 = 21 - 7 = 14$ (True!)`
              },
              {
                id: 'math-les-2',
                title: 'Systems of Two Linear Equations',
                description: 'Solve intersecting equations using substitution and elimination methods.',
                category: 'academic',
                subjectOrSkillId: 'mathematics',
                durationMinutes: 20,
                order: 2,
                objectives: [
                  'Identify points of intersection algebraically and graphically',
                  'Apply the substitution method for variable isolation',
                  'Apply linear combination / elimination'
                ],
                content: `### Systems of Linear Equations

A **system of linear equations** consists of two or more linear equations with the same set of variables. The solution is the point $(x, y)$ that satisfies all equations simultaneously.

#### Methods of Solution:
* **Substitution**: Solve one equation for one variable and substitute the result into the second equation.
* **Elimination**: Multiply one or both equations by constants so that adding or subtracting them eliminates one variable.

#### Example (Elimination):
$$\\begin{cases} 2x + y = 9 \\\\ 3x - y = 6 \\end{cases}$$

Add the equations directly:
$$(2x + 3x) + (y - y) = 9 + 6 \\implies 5x = 15 \\implies x = 3$$
Substitute $x = 3$ into equation 1:
$$2(3) + y = 9 \\implies 6 + y = 9 \\implies y = 3$$
Solution: $(3, 3)$.`
              }
            ]
          },
          {
            id: 'math-top-1-2',
            chapterId: 'math-ch1',
            title: 'Quadratic Functions & Graphs',
            practiceQuestionIds: ['m-q4', 'm-q5'],
            lessons: [
              {
                id: 'math-les-3',
                title: 'Factoring & The Quadratic Formula',
                description: 'Solve second-degree polynomials using factorization and discriminant analysis.',
                category: 'academic',
                subjectOrSkillId: 'mathematics',
                durationMinutes: 25,
                order: 3,
                objectives: [
                  'Understand standard form: ax² + bx + c = 0',
                  'Compute the discriminant (b² - 4ac) to determine root types',
                  'Apply the quadratic formula to find real and complex roots'
                ],
                content: `### The Quadratic Formula

For any quadratic equation in standard form:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

The roots are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

#### The Discriminant $(\\Delta = b^2 - 4ac)$:
* If $\\Delta > 0$: 2 distinct real roots
* If $\\Delta = 0$: Exactly 1 real root (repeated)
* If $\\Delta < 0$: 2 complex conjugate roots`
              }
            ]
          }
        ]
      },
      {
        id: 'math-ch2',
        subjectId: 'mathematics',
        title: 'Geometry & Trigonometry',
        description: 'Pythagorean theorem, circle geometry, angle relationships, and trigonometric ratios.',
        topics: [
          {
            id: 'math-top-2-1',
            chapterId: 'math-ch2',
            title: 'Trigonometric Ratios & Right Triangles',
            practiceQuestionIds: ['m-q6', 'm-q7'],
            lessons: [
              {
                id: 'math-les-4',
                title: 'Sine, Cosine, and Tangent Fundamentals',
                description: 'Master SOH-CAH-TOA and fundamental angle ratios.',
                category: 'academic',
                subjectOrSkillId: 'mathematics',
                durationMinutes: 20,
                order: 1,
                objectives: [
                  'Define Sine, Cosine, and Tangent with respect to opposite, adjacent, hypotenuse',
                  'Calculate unknown side lengths in right triangles',
                  'Apply inverse trig functions to solve for angles'
                ],
                content: `### SOH-CAH-TOA Definitions

For a right-angled triangle with angle $\\theta$:

$$\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$$
$$\\cos(\\theta) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$$
$$\\tan(\\theta) = \\frac{\\text{Opposite}}{\\text{Adjacent}}$$

#### Pythagorean Identity:
$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'Atom',
    color: '#10b981',
    description: 'Physics mechanics, chemical reactions, cell biology, and scientific method.',
    chapters: [
      {
        id: 'sci-ch1',
        subjectId: 'science',
        title: 'Physics: Forces & Energy',
        description: 'Newtonian mechanics, kinetic and potential energy, and conservation laws.',
        topics: [
          {
            id: 'sci-top-1-1',
            chapterId: 'sci-ch1',
            title: "Newton's Laws of Motion",
            practiceQuestionIds: ['s-q1', 's-q2', 's-q3'],
            lessons: [
              {
                id: 'sci-les-1',
                title: 'The Three Laws of Classical Mechanics',
                description: 'Understand inertia, acceleration (F = ma), and action-reaction pairs.',
                category: 'academic',
                subjectOrSkillId: 'science',
                durationMinutes: 20,
                order: 1,
                objectives: [
                  'Formulate Newton\'s 1st Law (Inertia)',
                  'Calculate force, mass, and acceleration using F = ma',
                  'Analyze third-law action-reaction interaction pairs'
                ],
                content: `### Newton's Three Laws of Motion

Sir Isaac Newton formulated the three fundamental principles governing physical movement:

#### 1. Law of Inertia (1st Law)
An object at rest stays at rest, and an object in uniform motion stays in uniform motion unless acted upon by a net external force.

#### 2. Fundamental Equation of Dynamics (2nd Law)
$$\\vec{F}_{net} = m \\vec{a}$$
The acceleration of an object is directly proportional to the net force applied and inversely proportional to its mass.

#### 3. Action and Reaction (3rd Law)
For every action, there is an equal and opposite reaction. If object A exerts a force $\\vec{F}_{AB}$ on object B, then object B exerts a force $\\vec{F}_{BA} = -\\vec{F}_{AB}$ on object A.`
              }
            ]
          }
        ]
      },
      {
        id: 'sci-ch2',
        subjectId: 'science',
        title: 'Chemistry: Matter & Reactions',
        description: 'Atomic structure, periodic trends, chemical bonding, and conservation of mass.',
        topics: [
          {
            id: 'sci-top-2-1',
            chapterId: 'sci-ch2',
            title: 'Atomic Structure & Chemical Bonding',
            practiceQuestionIds: ['s-q4', 's-q5'],
            lessons: [
              {
                id: 'sci-les-2',
                title: 'Ionic vs. Covalent Bonds',
                description: 'Explore electron transfer, electron sharing, and molecular geometry.',
                category: 'academic',
                subjectOrSkillId: 'science',
                durationMinutes: 20,
                order: 1,
                objectives: [
                  'Understand valence electron configurations',
                  'Distinguish between ionic, covalent, and metallic bonds',
                  'Predict bond types using electronegativity differences'
                ],
                content: `### Chemical Bonding Mechanisms

Atoms form chemical bonds to achieve a stable octet (8 valence electrons).

* **Ionic Bonds**: Complete transfer of valence electrons from a metal (cation) to a non-metal (anion). Example: $NaCl$.
* **Covalent Bonds**: Sharing of electron pairs between non-metal atoms. Example: $H_2O, CO_2, CH_4$.
* **Electronegativity Difference ($\\Delta EN$)**:
  * $\\Delta EN < 0.4$: Non-polar Covalent
  * $0.4 \\le \\Delta EN \\le 1.7$: Polar Covalent
  * $\\Delta EN > 1.7$: Ionic Bond`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English & Communication',
    icon: 'BookText',
    color: '#f59e0b',
    description: 'Grammar mechanics, critical reading, structured essay composition, and rhetoric.',
    chapters: [
      {
        id: 'eng-ch1',
        subjectId: 'english',
        title: 'Writing & Rhetoric',
        description: 'Persuasive writing, thesis development, and paragraph argumentation.',
        topics: [
          {
            id: 'eng-top-1-1',
            chapterId: 'eng-ch1',
            title: 'Crafting Persuasive Arguments & Thesis Statements',
            practiceQuestionIds: ['e-q1', 'e-q2', 'e-q3'],
            lessons: [
              {
                id: 'eng-les-1',
                title: 'The Anatomy of an Academic Thesis',
                description: 'Write specific, debatable, and evidence-driven thesis statements.',
                category: 'academic',
                subjectOrSkillId: 'english',
                durationMinutes: 15,
                order: 1,
                objectives: [
                  'Identify the difference between a statement of fact and a claim',
                  'Incorporate counterarguments into complex thesis statements',
                  'Structure PEEL paragraphs (Point, Evidence, Explanation, Link)'
                ],
                content: `### Crafting Compelling Thesis Statements

A **thesis statement** is the central claim of an academic essay. It directly answers the prompt and outlines the scope of your argument.

#### Formula for a Strong Thesis:
$$\\text{Although [Counter-argument]}, \\text{ [Main Claim]} \\text{ because [Reason 1] and [Reason 2]}.$$

#### The PEEL Paragraph Framework:
1. **P - Point**: State the topic sentence clearly.
2. **E - Evidence**: Introduce quotes, facts, or citations.
3. **E - Explanation**: Analyze how the evidence supports your point.
4. **L - Link**: Connect back to your central thesis statement.`
              }
            ]
          }
        ]
      }
    ]
  }
];
