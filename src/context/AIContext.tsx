import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AIMessage, AIProviderConfig, SkillGapInsight, NextBestAction, SmartTimetablePlan } from '../types/ai';
import { aiTutorService } from '../services/aiTutorService';
import { adaptiveLearningService } from '../services/adaptiveLearningService';
import { smartTimetableService } from '../services/smartTimetableService';
import { useApp } from './AppContext';
import { useData } from './DataContext';
import { useIDE } from './IDEContext';

interface AIContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  messages: AIMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  isTyping: boolean;
  aiConfig: AIProviderConfig;
  saveAiConfig: (cfg: AIProviderConfig) => void;
  skillGaps: SkillGapInsight[];
  nextActions: NextBestAction[];
  refreshInsights: () => Promise<void>;
  generateSmartTimetable: (days?: number, dailyMinutes?: number, areas?: string[]) => Promise<SmartTimetablePlan>;
  applySmartTimetable: (plan: SmartTimetablePlan) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useApp();
  const { refreshData } = useData();
  const { currentProject, activeFileName } = useIDE();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 **Hi there! I'm the Skudium AI Co-Pilot (Coming Soon).**\n\nFull on-device offline AI tutoring is currently in development. You can explore all 100% offline curriculum lessons, coding sandboxes, quizzes, and projects right now!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIProviderConfig>(aiTutorService.getConfig());
  const [skillGaps, setSkillGaps] = useState<SkillGapInsight[]>([]);
  const [nextActions, setNextActions] = useState<NextBestAction[]>([]);

  const refreshInsights = useCallback(async () => {
    try {
      const [gaps, actions] = await Promise.all([
        adaptiveLearningService.computeSkillGaps(),
        adaptiveLearningService.computeNextBestActions()
      ]);
      setSkillGaps(gaps);
      setNextActions(actions);
    } catch (err) {
      console.warn('Could not compute adaptive insights:', err);
    }
  }, []);

  useEffect(() => {
    refreshInsights();
  }, [refreshInsights]);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const activeFile = currentProject?.files?.[activeFileName];
      const context = {
        activeCode: activeFile?.content,
        activeFileName,
        activeSubjectOrSkill: currentProject?.name
      };

      const response = await aiTutorService.generateResponse(text, context);
      setMessages(prev => [...prev, response]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Sorry, I encountered an issue: ${err.message || 'Unknown error'}. Try asking again!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared. How can I assist your study session today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const saveAiConfig = (cfg: AIProviderConfig) => {
    aiTutorService.saveConfig(cfg);
    setAiConfig(cfg);
    addToast('AI Configuration Saved', `Active Provider: ${cfg.provider}`, 'success');
  };

  const generateSmartTimetable = async (days = 5, dailyMinutes = 60, areas = ['Coding', 'Academic', 'Project', 'Revision']) => {
    return smartTimetableService.generateSmartPlan(days, dailyMinutes, areas);
  };

  const applySmartTimetable = async (plan: SmartTimetablePlan) => {
    await smartTimetableService.applyPlanToPlanner(plan);
    await refreshData();
    addToast('Timetable Applied! 📅', `Added ${plan.tasks.length} smart study tasks to your planner.`, 'success');
  };

  return (
    <AIContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        messages,
        sendMessage,
        clearMessages,
        isTyping,
        aiConfig,
        saveAiConfig,
        skillGaps,
        nextActions,
        refreshInsights,
        generateSmartTimetable,
        applySmartTimetable
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};
