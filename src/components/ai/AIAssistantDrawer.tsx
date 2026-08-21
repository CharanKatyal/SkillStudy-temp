import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Trash2,
  Settings,
  Sparkles,
  Code2,
  BookOpen,
  HelpCircle,
  Minimize2,
  Maximize2,
  Terminal,
  Cpu
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useIDE } from '../../context/IDEContext';
import { AITutorSettingsModal } from './AITutorSettingsModal';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    aiConfig
  } = useAI();

  const { currentProject, activeFileName } = useIDE();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isDrawerOpen, isTyping]);

  if (!isDrawerOpen) {
    return (
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white shadow-2xl shadow-brand-900/50 hover:scale-105 active:scale-95 transition flex items-center gap-2 group"
        title="Open StillSkudy AI Tutor"
      >
        <Bot className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">AI Tutor</span>
      </button>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isTyping) return;
    const text = inputPrompt;
    setInputPrompt('');
    await sendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-[90vw] md:w-[680px] h-[85vh]' : 'w-[90vw] sm:w-[400px] h-[540px]'
        }`}
      >
        {/* Drawer Header */}
        <div className="px-4 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-100">StillSkudy AI Tutor</h3>
                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800/40 uppercase">
                  {aiConfig.provider === 'offline-engine' ? 'Offline' : aiConfig.provider}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Contextual Learning &amp; Code Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              title="AI Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearMessages}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              title="Clear Chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 hidden sm:block"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div className="px-3 py-2 bg-slate-950 border-b border-slate-850 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleQuickPrompt(`Review and debug my active file: ${activeFileName}`)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-brand-300 font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Code2 className="w-3 h-3" />
            <span>Debug My Code</span>
          </button>

          <button
            onClick={() => handleQuickPrompt('Give me a step-by-step Socratic hint for my current exercise.')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-amber-300 font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3" />
            <span>Give Hint</span>
          </button>

          <button
            onClick={() => handleQuickPrompt('Explain the core mathematical formula in simple terms.')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-sky-300 font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3" />
            <span>Explain Math/Science</span>
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-850 border border-slate-750 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{msg.content}</div>

                {msg.codeSnippet && (
                  <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    <code>{msg.codeSnippet}</code>
                  </pre>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-850 rounded-xl w-fit">
              <Bot className="w-3.5 h-3.5 animate-spin text-brand-400" />
              <span>Thinking &amp; analyzing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-850 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder="Ask AI Tutor anything (code, math, hints)..."
            className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl shadow font-bold transition flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <AITutorSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};
