import React from 'react';
import { Bot, ShieldCheck, Clock, Check } from 'lucide-react';
import { Modal } from '../common/Modal';

interface AITutorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorSettingsModal: React.FC<AITutorSettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Skudium AI Architecture"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/50 rounded-xl flex items-start gap-2.5">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-200">AI Co-Pilot Status: In Development</h4>
            <p className="text-amber-400/90 text-[11px] mt-0.5 leading-relaxed">
              Skudium operates strictly without external APIs, tracking, or cloud infrastructure.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-850 border border-slate-750 rounded-xl space-y-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Bot className="w-4 h-4 text-brand-400" />
            <span>Planned Engine: On-Device WebLLM &amp; WebGPU</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            When released in an upcoming offline update, Skudium will embed an optimized open-weights quantized model (e.g. Qwen / Phi) running 100% inside your browser sandbox via WebAssembly.
          </p>
        </div>

        <div className="p-4 bg-slate-850 border border-slate-750 rounded-xl space-y-2">
          <h5 className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Core Privacy Commitments</span>
          </h5>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero telemetry or prompt logging</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>No OpenAI / Cloud API keys required</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% functional on airplane mode without internet</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold shadow"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
