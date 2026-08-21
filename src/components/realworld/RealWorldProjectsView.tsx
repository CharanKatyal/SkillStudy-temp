import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Award,
  Wallet,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { REAL_WORLD_PROJECTS, STUDENT_OPPORTUNITIES, INITIAL_STUDENT_WALLET } from '../../data/opportunitiesData';
import { RealWorldProjectBrief, StudentOpportunity, StudentWallet } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const RealWorldProjectsView: React.FC = () => {
  const { addToast, setActiveNav } = useApp();
  const [projects, setProjects] = useState<RealWorldProjectBrief[]>(REAL_WORLD_PROJECTS);
  const [opportunities, setOpportunities] = useState<StudentOpportunity[]>(STUDENT_OPPORTUNITIES);
  const [wallet, setWallet] = useState<StudentWallet>(INITIAL_STUDENT_WALLET);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<RealWorldProjectBrief | null>(null);

  const handleApplyOpportunity = (opp: StudentOpportunity) => {
    setOpportunities(prev =>
      prev.map(o => (o.id === opp.id ? { ...o, status: 'applied' } : o))
    );
    addToast('Application Submitted! 💼', `Applied for ${opp.title} (${opp.organization}).`, 'success');
  };

  const handleClaimProject = (brief: RealWorldProjectBrief) => {
    setProjects(prev =>
      prev.map(p => (p.id === brief.id ? { ...p, status: 'in_progress' } : p))
    );
    addToast('Project Accepted! 🚀', `Started work on "${brief.title}". Added to your project workspace.`, 'success');
    setSelectedBrief(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 via-slate-850 to-amber-950/30 border border-amber-850/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Phase 5: Real-World Client Projects &amp; Grants</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Real-World Projects &amp; Opportunities
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Build production software for verified community non-profits, earn educational grants, and establish a verified client track record.
          </p>
        </div>

        {/* Student Wallet Chip */}
        <button
          onClick={() => setIsWalletOpen(true)}
          className="p-4 rounded-2xl bg-slate-900 border border-amber-800/50 hover:border-amber-500 transition text-left shrink-0 flex items-center gap-3 shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Student Grant Wallet</span>
            <p className="text-xl font-bold text-amber-300">${wallet.balanceUSD} USD</p>
          </div>
        </button>
      </div>

      {/* Real-World Client Project Briefs */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Verified Client Project Briefs</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map(proj => (
            <Card key={proj.id} className="p-6 flex flex-col justify-between border-slate-800 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="purple">{proj.clientCategory}</Badge>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/50">
                    ${proj.budgetStipend} Stipend
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100">{proj.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Client: {proj.clientName}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliverables</span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {proj.deliverables.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                {proj.status === 'in_progress' ? (
                  <button
                    onClick={() => setActiveNav('projects')}
                    className="w-full py-2 rounded-xl bg-brand-600/20 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <span>View in Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleClaimProject(proj)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow transition"
                  >
                    Accept Project Brief
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Grants & Micro-Bounties */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Educational Grants &amp; Micro-Bounties</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map(opp => (
            <Card key={opp.id} className="p-5 flex items-center justify-between border-slate-800 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{opp.title}</span>
                  <Badge size="sm" variant={opp.type === 'grant' ? 'purple' : 'info'}>
                    {opp.type.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">{opp.description}</p>
                <span className="text-[11px] font-bold text-emerald-400 block pt-1">
                  Award: ${opp.stipendAmount} USD
                </span>
              </div>

              <div className="shrink-0">
                {opp.status === 'applied' ? (
                  <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyOpportunity(opp)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition"
                  >
                    Apply
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Wallet Modal */}
      {isWalletOpen && (
        <Modal
          isOpen={isWalletOpen}
          onClose={() => setIsWalletOpen(false)}
          title="Student Educational Wallet &amp; Grants"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950/40 border border-amber-800/40 text-center space-y-1">
              <span className="text-slate-400">Total Earned Balance</span>
              <h3 className="text-3xl font-extrabold text-amber-300">${wallet.balanceUSD}.00 USD</h3>
              <p className="text-[10px] text-slate-400">Funds available for educational software &amp; hardware grants</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-300 block">Transaction Ledger</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {wallet.transactions.map(tx => (
                  <div key={tx.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-slate-200">{tx.title}</h5>
                      <span className="text-[10px] text-slate-500">{tx.date} • {tx.category}</span>
                    </div>
                    <span className="font-bold text-emerald-400">+${tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsWalletOpen(false)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
