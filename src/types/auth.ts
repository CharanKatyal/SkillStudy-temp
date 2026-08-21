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
  status?: string;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingChangesCount: number;
}
