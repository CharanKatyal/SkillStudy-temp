import { AcademicSubject } from '../types';

export const ACADEMIC_SUBJECTS: AcademicSubject[] = [
  {
    id: 'math-foundations',
    name: 'Mathematics & Logic',
    icon: 'Calculator',
    color: '#6366f1',
    description: 'Master core arithmetic, algebra, coordinate geometry, and logical deduction through visual steps.',
    chapters: [
      {
        id: 'math-ch-1',
        subjectId: 'math-foundations',
        title: 'Linear Equations & Graphs',
        description: 'Understand linear relationships, solving for variables, and visualizing graphs on coordinate planes.',
        topics: [
          {
            id: 'math-top-1',
            chapterId: 'math-ch-1',
            title: 'Algebra Fundamentals',
            practiceQuestionIds: ['pq-math-1', 'pq-math-2'],
            lessons: [
              {
                id: 'les-math-101',
                title: 'Introduction to Linear Equations',
                description: 'Learn how to balance equations and isolate variables using inverse arithmetic operations.',
                category: 'academic',
                subjectOrSkillId: 'math-foundations',
                durationMinutes: 15,
                order: 1,
                objectives: [
                  'Understand the concept of variable equality in algebra',
                  'Isolate unknown variables using addition and subtraction principles',
                  'Solve basic one-step and two-step linear equations'
                ],
                content: `### What is a Linear Equation?
A linear equation is a mathematical statement where two algebraic expressions are equal. It is called **linear** because graphing it produces a straight line.

The standard slope-intercept formula is:
**y = mx + b**

- **m** represents the **slope** (rate of change or steepness of the line)
- **b** represents the **y-intercept** (where the line crosses the vertical Y-axis)

---

### Key Rule: The Balancing Principle
Whatever mathematical operation you perform on the left side of the equation (=), you must also perform on the right side.

#### Step-by-Step Example:
Solve for x: **2x + 6 = 14**

1. **Subtract 6 from both sides:**
   2x = 14 - 6  →  **2x = 8**
2. **Divide both sides by 2:**
   x = 8 / 2  →  **x = 4**

---

### Key Takeaway
Always isolate the unknown variable by reversing operations in reverse BODMAS/PEMDAS order: first addition and subtraction, then multiplication and division.`,
                codeExamples: [
                  {
                    lang: 'javascript',
                    title: 'Solving a Linear Equation with Code',
                    code: `// Solve for x in: ax + b = c
function solveLinearEquation(a, b, c) {
  if (a === 0) {
    throw new Error("Coefficient 'a' cannot be zero.");
  }
  const x = (c - b) / a;
  return x;
}

// Example: 2x + 6 = 14
console.log("x =", solveLinearEquation(2, 6, 14)); // Output: 4`
                  }
                ]
              },
              {
                id: 'les-math-102',
                title: 'Slope and Coordinate Geometry',
                description: 'Explore the Cartesian plane, positive/negative slopes, and real-world rates of change.',
                category: 'academic',
                subjectOrSkillId: 'math-foundations',
                durationMinutes: 20,
                order: 2,
                objectives: [
                  'Identify the X and Y coordinates of points on a grid',
                  'Calculate the slope (rise over run) between two points',
                  'Differentiate between positive, negative, zero, and undefined slopes'
                ],
                content: `### Understanding the Slope (m)
The slope of a line measures its steepness and direction. It is defined as the vertical change (**rise**) divided by the horizontal change (**run**):

**Slope (m) = (y₂ - y₁) / (x₂ - x₁) = Δy / Δx**

---

### Four Types of Slopes:
1. **Positive Slope (m > 0):** The line rises upwards from left to right.
2. **Negative Slope (m < 0):** The line falls downwards from left to right.
3. **Zero Slope (m = 0):** A completely horizontal flat line (e.g. y = 5).
4. **Undefined Slope:** A completely vertical vertical line (e.g. x = 3).`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'science-physics',
    name: 'General Science & Physics',
    icon: 'Atom',
    color: '#0284c7',
    description: 'Explore fundamental forces, energy conservation, kinetic motion, and the scientific method.',
    chapters: [
      {
        id: 'sci-ch-1',
        subjectId: 'science-physics',
        title: 'Forces & Energy',
        description: 'Discover how forces govern the movement of objects on Earth and in space.',
        topics: [
          {
            id: 'sci-top-1',
            chapterId: 'sci-ch-1',
            title: "Newtonian Mechanics",
            practiceQuestionIds: ['pq-sci-1', 'pq-sci-2'],
            lessons: [
              {
                id: 'les-sci-101',
                title: "Newton's Three Laws of Motion",
                description: 'Understand inertia, acceleration through force (F = m · a), and action-reaction pairs.',
                category: 'academic',
                subjectOrSkillId: 'science-physics',
                durationMinutes: 20,
                order: 1,
                objectives: [
                  'Explain the concept of Inertia in daily life',
                  'Apply the equation Force = Mass × Acceleration',
                  'Identify action and reaction pairs in physical interactions'
                ],
                content: `### The Foundations of Classical Physics

Sir Isaac Newton formulated three foundational laws that describe how objects move and interact:

#### 1. First Law (Law of Inertia)
> An object at rest stays at rest, and an object in motion stays in motion with constant speed and direction, unless acted upon by an external net force.

#### 2. Second Law (Law of Acceleration)
> The acceleration of an object depends directly upon the net force acting upon it, and inversely upon the object's mass:
**Force = Mass × Acceleration (F = m · a)**

#### 3. Third Law (Action and Reaction)
> For every action force, there is an equal in magnitude and opposite in direction reaction force.

---

### Everyday Real-World Examples:
- **Seatbelts in cars:** Prevent your body from continuing forward when the car decelerates (First Law).
- **Pushing a shopping cart:** A heavier cart requires more force to accelerate at the same rate (Second Law).
- **Rocket propulsion:** Burning fuel pushes gas downward, which pushes the rocket upward (Third Law).`
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'computer-science',
    name: 'Computer Science & Logic',
    icon: 'Binary',
    color: '#059669',
    description: 'Understand how computational machines think, binary numbers, logic gates, and algorithm efficiency.',
    chapters: [
      {
        id: 'cs-ch-1',
        subjectId: 'computer-science',
        title: 'Binary & Boolean Logic',
        description: 'The mathematical language of digital microprocessors and silicon transistors.',
        topics: [
          {
            id: 'cs-top-1',
            chapterId: 'cs-ch-1',
            title: 'Digital Foundations',
            practiceQuestionIds: ['pq-cs-1', 'pq-cs-2'],
            lessons: [
              {
                id: 'les-cs-101',
                title: 'Binary Number System & Bits',
                description: 'Demystify base-2 counting and convert decimal numbers into 8-bit binary bytes.',
                category: 'academic',
                subjectOrSkillId: 'computer-science',
                durationMinutes: 15,
                order: 1,
                objectives: [
                  'Understand why computers use base-2 (0 and 1) electrical voltages',
                  'Convert integers between decimal and binary representation',
                  'Calculate byte sizes and powers of 2'
                ],
                content: `### Why do computers use Binary?
At the hardware level, digital computers are built from billions of microscopic **transistors** that act as electronic switches. These switches have only two stable electrical states:
- **0 (OFF):** Low voltage / no current
- **1 (ON):** High voltage / current flowing

---

### Decimal (Base-10) vs Binary (Base-2)
In our everyday decimal system, each place value is a power of 10 (1, 10, 100, 1000).  
In binary, each position represents an increasing **power of 2**:

- 2⁷ (128) = 0
- 2⁶ (64) = 0
- 2⁵ (32) = 1
- 2⁴ (16) = 0
- 2³ (8) = 1
- 2² (4) = 0
- 2¹ (2) = 1
- 2⁰ (1) = 0

Calculation: 32 + 8 + 2 = **42**  
Thus, decimal **42** in 8-bit binary is **00101010**.`,
                codeExamples: [
                  {
                    lang: 'python',
                    title: 'Binary Conversion in Python',
                    code: `# Convert integer to binary string
number = 42
binary_str = bin(number)
print(f"Decimal: {number} -> Binary: {binary_str}") # Output: 0b101010`
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
