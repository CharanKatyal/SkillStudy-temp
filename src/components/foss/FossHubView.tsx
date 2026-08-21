import React, { useState } from 'react';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  Star,
  ExternalLink,
  CheckCircle2,
  Code2,
  FolderGit2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { FOSS_PROJECTS } from '../../data/fossData';
import { FossProject } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const FossHubView: React.FC = () => {
  const { setActiveNav, addToast } = useApp();
  const [selectedProject, setSelectedProject] = useState<FossProject>(FOSS_PROJECTS[0]);
  const [submittedPrs, setSubmittedPrs] = useState<string[]>([]);
  const [prModalIssue, setPrModalIssue] = useState<any | null>(null);
  const [prComment, setPrComment] = useState('');

  const handleStartIssue = (issue: any) => {
    setPrModalIssue(issue);
    setPrComment(`Fix: ${issue.title}\n\n- Verified keyboard navigation & semantic tags\n- Passed local test suite`);
  };

  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prModalIssue) return;
    setSubmittedPrs(prev => [...prev, prModalIssue.id]);
    addToast('Pull Request Submitted! 🎉', `Your PR for "${prModalIssue.title}" was submitted to review.`, 'success');
    setPrModalIssue(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-850 via-slate-850 to-orange-950/30 border border-orange-850/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-700/50 text-orange-300 text-xs font-semibold">
            <GitPullRequest className="w-3.5 h-3.5 text-orange-400" />
            <span>Phase 4: Open Source &amp; FOSS Contributions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Open Source Contribution Hub
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Gain real-world software engineering experience by solving beginner-friendly Good First Issues and submitting mock pull requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">PRs Merged</span>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">{submittedPrs.length}</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FOSS_PROJECTS.map(proj => {
          const isSelected = selectedProject.id === proj.id;
          return (
            <Card
              key={proj.id}
              hoverable
              onClick={() => setSelectedProject(proj)}
              className={`p-5 cursor-pointer transition ${
                isSelected ? 'border-orange-500/80 bg-slate-850 shadow-md' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="purple">{proj.organization}</Badge>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{proj.stars}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{proj.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800">
                {proj.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Project Issues & PR Simulator */}
      <Card className="p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-slate-100">{selectedProject.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{selectedProject.description}</p>
          </div>
          <span className="text-xs text-slate-400">
            {selectedProject.goodFirstIssues.length} Good First Issues
          </span>
        </div>

        <div className="space-y-3">
          {selectedProject.goodFirstIssues.map(issue => {
            const isDone = submittedPrs.includes(issue.id);
            return (
              <div
                key={issue.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{issue.title}</span>
                    <Badge size="sm" variant={issue.difficulty === 'Beginner' ? 'success' : 'warning'}>
                      {issue.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{issue.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isDone ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PR Merged</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartIssue(issue)}
                      className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                    >
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>Submit PR Fix</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pull Request Modal */}
      {prModalIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <GitPullRequest className="w-4 h-4" />
                <h4 className="text-slate-100 text-sm">Create Pull Request</h4>
              </div>
              <button onClick={() => setPrModalIssue(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Submitting pull request to <strong>{selectedProject.organization}/{selectedProject.title}</strong>:
            </p>

            <form onSubmit={handlePrSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  readOnly
                  value={`fix/${prModalIssue.id}-accessible-update`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PR Description &amp; Verification</label>
                <textarea
                  rows={4}
                  value={prComment}
                  onChange={e => setPrComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPrModalIssue(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md"
                >
                  Submit &amp; Merge PR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
