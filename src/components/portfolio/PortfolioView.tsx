import React, { useState } from 'react';
import {
  Printer,
  Edit2,
  ExternalLink,
  Trophy,
  GraduationCap,
  GitBranch,
  Mail,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { PortfolioCustomizer } from './PortfolioCustomizer';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const PortfolioView: React.FC = () => {
  const { profile, portfolio, managedProjects, achievements } = useData();
  const { setActiveNav } = useApp();

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const portfolioProjects = managedProjects.filter(p => p.inPortfolio);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto portfolio-print-container">
      {/* Action Bar (Hidden on print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-850 border border-slate-750 shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <GraduationCap className="w-4 h-4 text-brand-400" />
          <span>Student Showcase Portfolio (Generated Offline)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-750 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Portfolio Header & Bio */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-850 via-slate-850 to-slate-900 border border-slate-750 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shrink-0">
              {profile?.displayName ? profile.displayName[0].toUpperCase() : 'S'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {profile?.displayName || 'Alex Scholar'}
              </h1>
              <p className="text-sm font-semibold text-brand-400 mt-0.5">
                {portfolio?.customTitle || 'Student Developer & Thinker'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile?.gradeLevel || 'High School / Self-Taught'}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            {portfolio?.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <GitBranch className="w-3.5 h-3.5 text-brand-400" />
                <span>GitHub</span>
              </a>
            )}
            {portfolio?.socialLinks?.email && (
              <a
                href={`mailto:${portfolio.socialLinks.email}`}
                className="flex items-center gap-1 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Email</span>
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
          {portfolio?.bio || profile?.bio}
        </p>

        {/* Skills Tag Pills */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Competencies &amp; Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {portfolio?.skills?.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-750 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>{s.name}</span>
                <span className="text-[10px] text-slate-500 font-normal">({s.level})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects Showcase */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-brand-400" />
          <span>Featured Software Projects</span>
        </h3>

        {portfolioProjects.length === 0 ? (
          <Card className="text-center py-10 text-slate-400 text-xs">
            <p>No projects currently selected for portfolio. Toggle "Showcase in Portfolio" inside Projects view.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portfolioProjects.map(proj => (
              <Card key={proj.id} className="p-6 border-slate-750 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="text-base font-bold text-slate-100">{proj.name}</h4>
                    <Badge variant={proj.status === 'completed' ? 'success' : 'warning'}>
                      {proj.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-brand-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{proj.difficulty} Level</span>
                  {proj.linkedIdeProjectId && (
                    <button
                      onClick={() => setActiveNav('ide')}
                      className="no-print text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                    >
                      <span>Launch in IDE</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Earned Achievements & Badges */}
      {portfolio?.showAchievements && unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Honors &amp; Badges Earned</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unlockedAchievements.map(ach => (
              <div
                key={ach.id}
                className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex flex-col items-center text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">{ach.title}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Footer */}
      <div className="text-center pt-8 border-t border-slate-800 text-xs text-slate-500">
        <p>Verified Student Transcript &amp; Portfolio • Skudium Offline-First Education System</p>
      </div>

      <PortfolioCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};
