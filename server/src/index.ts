import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));

// In-Memory Mock Database for Phase 2 dev (ready to bind to PostgreSQL pool)
interface InMemoryDb {
  users: Record<string, any>;
  links: Record<string, any>;
  inviteCodes: Record<string, string>; // code -> studentId
  progress: Record<string, any>;
  projects: Record<string, any>;
  portfolios: Record<string, any>;
}

const mockDb: InMemoryDb = {
  users: {
    'student-demo': {
      id: 'student-demo',
      email: 'alex@student.stillskudy.local',
      displayName: 'Alex Scholar',
      role: 'student',
      gradeLevel: '10th Grade'
    },
    'parent-demo': {
      id: 'parent-demo',
      email: 'parent@stillskudy.local',
      displayName: 'Sarah Scholar',
      role: 'parent'
    }
  },
  links: {},
  inviteCodes: {
    'SKUDY-1001': 'student-demo'
  },
  progress: {},
  projects: {},
  portfolios: {}
};

// -------------------------------------------------------------
// Healthcheck & Metadata
// -------------------------------------------------------------
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '2.0.0-phase2',
    app: 'StillSkudy Cloud Backend',
    database: 'PostgreSQL-Ready'
  });
});

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/v1/auth/register', (req: Request, res: Response) => {
  const { email, password, displayName, role, gradeLevel } = req.body;

  if (!email || !displayName) {
    return res.status(400).json({ message: 'Email and Display Name are required' });
  }

  const id = `usr-${Date.now()}`;
  const user = {
    id,
    email,
    displayName,
    role: role || 'student',
    gradeLevel: gradeLevel || 'High School'
  };

  mockDb.users[id] = user;
  const token = `jwt-${id}-${Date.now()}`;

  res.json({
    success: true,
    user,
    token
  });
});

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;

  const found = Object.values(mockDb.users).find((u: any) => u.email === email);
  if (found) {
    return res.json({
      success: true,
      user: found,
      token: `jwt-${found.id}-${Date.now()}`
    });
  }

  // Auto-provision user on demo login
  const id = `usr-${Date.now()}`;
  const user = {
    id,
    email,
    displayName: email.split('@')[0],
    role: email.includes('parent') ? 'parent' : 'student'
  };
  mockDb.users[id] = user;

  res.json({
    success: true,
    user,
    token: `jwt-${id}-${Date.now()}`
  });
});

// -------------------------------------------------------------
// Two-Way Delta Sync Endpoints
// -------------------------------------------------------------
app.post('/api/v1/sync/push', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const payload = req.body;

  // Store student synced data
  const studentId = authHeader ? authHeader.replace('Bearer ', '') : 'student-demo';

  if (payload.progress) {
    mockDb.progress[studentId] = payload.progress;
  }
  if (payload.ideProjects) {
    mockDb.projects[studentId] = payload.ideProjects;
  }
  if (payload.portfolio) {
    mockDb.portfolios[studentId] = payload.portfolio;
  }

  res.json({
    success: true,
    serverTimestamp: new Date().toISOString(),
    message: 'Local delta synchronized to cloud database'
  });
});

app.get('/api/v1/sync/pull', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const studentId = authHeader ? authHeader.replace('Bearer ', '') : 'student-demo';

  res.json({
    success: true,
    remoteData: {
      progress: mockDb.progress[studentId] || null,
      portfolio: mockDb.portfolios[studentId] || null
    },
    serverTimestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// Parent Account Endpoints
// -------------------------------------------------------------
app.post('/api/v1/parent/generate-link-code', (req: Request, res: Response) => {
  const code = `SKUDY-${Math.floor(1000 + Math.random() * 9000)}`;
  mockDb.inviteCodes[code] = 'student-demo';

  res.json({
    success: true,
    code,
    expiresIn: '24 hours'
  });
});

app.post('/api/v1/parent/link-student', (req: Request, res: Response) => {
  const { code } = req.body;
  const studentId = mockDb.inviteCodes[code];

  if (!studentId && code !== 'DEMO') {
    return res.status(400).json({ message: 'Invalid or expired student link code.' });
  }

  const targetStudent = mockDb.users[studentId || 'student-demo'] || {
    id: 'student-demo',
    displayName: 'Alex Scholar',
    email: 'alex@student.stillskudy.local'
  };

  const link = {
    id: `link-${Date.now()}`,
    parentId: 'parent-current',
    studentId: targetStudent.id,
    studentName: targetStudent.displayName,
    studentEmail: targetStudent.email,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    link
  });
});

app.get('/api/v1/parent/student-progress/:studentId', (req: Request, res: Response) => {
  const { studentId } = req.params;

  res.json({
    studentId,
    progress: mockDb.progress[studentId] || {
      completedLessons: { 'html-les-1': { completedAt: new Date().toISOString() } },
      stats: { lessonsCompleted: 4, challengesCompleted: 2, practiceAccuracy: 95 }
    },
    projects: mockDb.projects[studentId] || []
  });
});

app.listen(PORT, () => {
  console.log(`[StillSkudy Phase 2] Cloud API Server running on port ${PORT}`);
});
