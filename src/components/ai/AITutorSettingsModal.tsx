import React, { useState } from 'react';
import { Bot, Key, Cpu, ShieldCheck, Check } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { AIProvider } from '../../types/ai';
import { Modal } from '../common/Modal';

interface AITutorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorSettingsModal: React.FC<AITutorSettingsModalProps> = ({ isOpen, onClose }) => {
  const { aiConfig, saveAiConfig } = useAI();

  const [provider, setProvider] = useState<AIProvider>(aiConfig.provider);
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '');
  const [endpoint, setEndpoint] = useState(aiConfig.endpoint || 'http://localhost:11434/v1');

  if (!isOpen) return null;

  const handleSave = () => {
    saveAiConfig({
      provider,
      apiKey: apiKey.trim() || undefined,
      endpoint: endpoint.trim() || undefined
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Tutor Engine Settings" maxWidth="md">
      <div className="space-y-4">
        {/* Provider Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">AI Engine Provider</label>
          <div className="space-y-2">
            {[
              {
                id: 'offline-engine' as const,
                title: 'Built-in Educational Engine (100% Offline)',
                desc: 'Zero API keys required. High-speed pedagogical heuristics & rule engine.'
              },
              {
                id: 'gemini' as const,
                title: 'Google Gemini AI',
                desc: 'Uses Gemini 1.5 Flash API with rich reasoning when online.'
              },
              {
                id: 'openai' as const,
                title: 'OpenAI GPT-4o-mini',
                desc: 'Uses OpenAI API for natural conversational tutoring.'
              },
              {
                id: 'local-ollama' as const,
                title: 'Local Ollama / WebLLM',
                desc: 'Connect to your local Ollama server running Llama 3 or Mistral.'
              }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => setProvider(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                  provider === item.id
                    ? 'bg-brand-950/40 border-brand-500 text-brand-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                {provider === item.id && (
                  <span className="w-4 h-4 rounded-full bg-brand-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API Key / Endpoint input if cloud provider selected */}
        {(provider === 'gemini' || provider === 'openai') && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {provider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy... / sk-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Your API key is stored strictly on your local device in localStorage.
            </p>
          </div>
        )}

        {provider === 'local-ollama' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ollama API URL</label>
            <input
              type="text"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder="http://localhost:11434/v1"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </Modal>
  );
};
