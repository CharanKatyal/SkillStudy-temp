export type UserRole = 'student' | 'parent' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  gradeLevel?: string;
  bio?: string;
  avatarIcon?: string;
  token?: string;
  linkedStudentIds?: string[];
}

export interface ParentStudentLink {
  id: string;
  parentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingChangesCount: number;
  syncError: string | null;
}

export interface DeltaSyncPayload {
  lastSyncedTimestamp: string;
  profile?: any;
  settings?: any;
  progress?: any;
  ideProjects?: any[];
  managedProjects?: any[];
  plannerTasks?: any[];
  portfolio?: any;
  practiceAttempts?: any[];
}
