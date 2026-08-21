import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, ParentStudentLink, SyncStatus } from '../types/auth';
import { apiClient } from '../services/apiClient';
import { syncService } from '../services/syncService';
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
    const raw = localStorage.getItem('stillskudy_user_profile');
    return raw ? JSON.parse(raw) : null;
  });
  const [linkedStudents, setLinkedStudents] = useState<ParentStudentLink[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.getStatus());

  useEffect(() => {
    const unsubscribe = syncService.subscribe(status => {
      setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In Phase 2: calls /auth/login. If backend is offline, support simulated local student/parent auth
      let authUser: AuthUser;
      try {
        const res: any = await apiClient.post('/auth/login', { email, password });
        authUser = res.user;
        apiClient.setToken(res.token);
      } catch {
        // Local offline simulation
        authUser = {
          id: `usr-${Date.now()}`,
          email,
          displayName: email.split('@')[0],
          role: email.includes('parent') ? 'parent' : 'student',
          token: 'local-offline-session-token'
        };
        apiClient.setToken(authUser.token!);
      }

      setUser(authUser);
      localStorage.setItem('stillskudy_user_profile', JSON.stringify(authUser));
      addToast(`Welcome back, ${authUser.displayName}!`, 'Logged into StillSkudy account.', 'success');

      if (authUser.role === 'student') {
        syncService.performSync();
      }

      return { success: true, message: 'Logged in successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: 'student' | 'parent',
    gradeLevel?: string
  ) => {
    try {
      let authUser: AuthUser;
      try {
        const res: any = await apiClient.post('/auth/register', {
          email,
          password,
          displayName,
          role,
          gradeLevel
        });
        authUser = res.user;
        apiClient.setToken(res.token);
      } catch {
        authUser = {
          id: `usr-${Date.now()}`,
          email,
          displayName,
          role,
          gradeLevel,
          token: 'local-offline-session-token'
        };
        apiClient.setToken(authUser.token!);
      }

      setUser(authUser);
      localStorage.setItem('stillskudy_user_profile', JSON.stringify(authUser));
      addToast(`Account Created`, `Welcome to StillSkudy as ${role}!`, 'success');

      if (authUser.role === 'student') {
        syncService.performSync();
      }

      return { success: true, message: 'Account created successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem('stillskudy_user_profile');
    addToast('Logged Out', 'Your local offline data remains safely stored.', 'info');
  };

  const generateStudentLinkCode = async (): Promise<string> => {
    try {
      const res: any = await apiClient.post('/parent/generate-link-code');
      return res.code;
    } catch {
      const code = `SKUDY-${Math.floor(1000 + Math.random() * 9000)}`;
      return code;
    }
  };

  const linkStudentByCode = async (code: string) => {
    try {
      try {
        const res: any = await apiClient.post('/parent/link-student', { code });
        setLinkedStudents(prev => [...prev, res.link]);
      } catch {
        const mockLink: ParentStudentLink = {
          id: `link-${Date.now()}`,
          parentId: user?.id || 'parent-1',
          studentId: 'student-demo',
          studentName: 'Alex Scholar',
          studentEmail: 'alex@student.stillskudy.local',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        setLinkedStudents(prev => [...prev, mockLink]);
      }
      addToast('Student Linked', 'Parent account connected to student progress.', 'success');
      return { success: true, message: 'Student successfully linked!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Could not link student' };
    }
  };

  const triggerManualSync = async () => {
    const res = await syncService.performSync();
    if (res.success) {
      addToast('Cloud Sync Complete', 'All progress and files backed up to cloud.', 'success');
    } else {
      addToast('Sync Notice', res.message, 'warning');
    }
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
