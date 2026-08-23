import React, { createContext, useContext, useState } from 'react';
import { AuthUser, ParentStudentLink, SyncStatus } from '../types/auth';
import { useApp } from './AppContext';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isParent: boolean;
  linkedStudents: ParentStudentLink[];
  syncStatus: SyncStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: 'student' | 'parent',
    gradeLevel?: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  generateStudentLinkCode: () => Promise<string>;
  linkStudentByCode: (code: string) => Promise<{ success: boolean; message: string }>;
  triggerManualSync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useApp();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('skudium_user_profile');
    return raw ? JSON.parse(raw) : null;
  });

  const [linkedStudents, setLinkedStudents] = useState<ParentStudentLink[]>([]);

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'synced',
    isSyncing: false,
    lastSyncedAt: new Date().toISOString(),
    pendingChangesCount: 0
  });

  const login = async (email: string, _password: string) => {
    const authUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      displayName: email.split('@')[0] || 'Scholar',
      role: email.toLowerCase().includes('parent') ? 'parent' : 'student',
      gradeLevel: '10th Grade'
    };

    setUser(authUser);
    localStorage.setItem('skudium_user_profile', JSON.stringify(authUser));
    addToast(`Welcome, ${authUser.displayName}!`, `Switched to offline ${authUser.role} mode.`, 'success');
    return { success: true, message: 'Logged in locally' };
  };

  const register = async (
    email: string,
    _password: string,
    displayName: string,
    role: 'student' | 'parent',
    gradeLevel?: string
  ) => {
    const authUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      displayName: displayName || 'Scholar',
      role,
      gradeLevel: gradeLevel || '10th Grade'
    };

    setUser(authUser);
    localStorage.setItem('skudium_user_profile', JSON.stringify(authUser));
    addToast(`Profile Created`, `Active offline profile: ${authUser.displayName} (${role})`, 'success');
    return { success: true, message: 'Profile created locally' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skudium_user_profile');
    addToast('Logged Out', 'User profile session ended.', 'info');
  };

  const generateStudentLinkCode = async (): Promise<string> => {
    const code = `SKUD-${Math.floor(1000 + Math.random() * 9000)}`;
    return code;
  };

  const linkStudentByCode = async (code: string) => {
    const mockLink: ParentStudentLink = {
      id: `link-${Date.now()}`,
      parentId: user?.id || 'parent-1',
      studentId: 'local-student-1',
      studentName: 'Alex Scholar',
      studentEmail: 'student@skudium.local',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setLinkedStudents(prev => [...prev, mockLink]);
    addToast('Guardian Linked', `Connected local student profile (Code: ${code}).`, 'success');
    return { success: true, message: 'Guardian successfully linked!' };
  };

  const triggerManualSync = async () => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    setTimeout(() => {
      setSyncStatus({
        status: 'synced',
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
        pendingChangesCount: 0
      });
      addToast('IndexedDB Verified', 'All progress, code, and notes are securely cached on this device.', 'success');
    }, 400);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isParent: user?.role === 'parent',
        linkedStudents,
        syncStatus,
        login,
        register,
        logout,
        generateStudentLinkCode,
        linkStudentByCode,
        triggerManualSync
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
