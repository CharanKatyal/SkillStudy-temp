import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavSection, Achievement } from '../types';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
}

interface AppContextType {
  activeNav: NavSection;
  setActiveNav: (nav: NavSection, meta?: { subjectId?: string; skillId?: string; lessonId?: string; challengeId?: string; projectId?: string }) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedSkillId: string | null;
  setSelectedSkillId: (id: string | null) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  selectedChallengeId: string | null;
  setSelectedChallengeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  unlockedAchievementPopup: Achievement | null;
  setUnlockedAchievementPopup: (ach: Achievement | null) => void;
  openInIdeWithCode: (title: string, starterFiles: Record<string, { name: string; content: string; language: string }>, challengeId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNavState] = useState<NavSection>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [unlockedAchievementPopup, setUnlockedAchievementPopup] = useState<Achievement | null>(null);

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveNav = (
    nav: NavSection,
    meta?: { subjectId?: string; skillId?: string; lessonId?: string; challengeId?: string; projectId?: string }
  ) => {
    if (meta) {
      if (meta.subjectId !== undefined) setSelectedSubjectId(meta.subjectId);
      if (meta.skillId !== undefined) setSelectedSkillId(meta.skillId);
      if (meta.lessonId !== undefined) setSelectedLessonId(meta.lessonId);
      if (meta.challengeId !== undefined) setSelectedChallengeId(meta.challengeId);
      if (meta.projectId !== undefined) setSelectedProjectId(meta.projectId);
    }
    setActiveNavState(nav);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInIdeWithCode = (
    title: string,
    starterFiles: Record<string, { name: string; content: string; language: string }>,
    challengeId?: string
  ) => {
    // Custom event or state trigger to open IDE with starter files
    window.dispatchEvent(
      new CustomEvent('stillskudy:open-ide', {
        detail: { title, starterFiles, challengeId }
      })
    );
    setActiveNav('ide');
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedSkillId,
        setSelectedSkillId,
        selectedLessonId,
        setSelectedLessonId,
        selectedChallengeId,
        setSelectedChallengeId,
        selectedProjectId,
        setSelectedProjectId,
        toasts,
        addToast,
        removeToast,
        unlockedAchievementPopup,
        setUnlockedAchievementPopup,
        openInIdeWithCode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
