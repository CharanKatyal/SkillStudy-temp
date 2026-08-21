import React, { useState } from 'react';
import {
  Printer,
  Edit2,
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
      <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
          <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Student Showcase Portfolio</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-750 transition"
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
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-md shrink-0">
              {profile?.displayName ? profile.displayName[0].toUpperCase() : 'S'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {profile?.displayName || 'Alex Scholar'}
              </h1>
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                {portfolio?.customTitle || 'Student Developer & Thinker'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {profile?.gradeLevel || 'High School / Self-Taught'}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            {portfolio?.socialLinks?.github && (
              <a
                href={portfolio.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <GitBranch className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>GitHub</span>
              </a>
            )}
            {portfolio?.socialLinks?.email && (
              <a
                href={`mailto:${portfolio.socialLinks.email}`}
                className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>Email</span>
              </a>
            )}
          </div>
        </div>

        {portfolio?.bio && (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl pt-2 border-t border-slate-200 dark:border-slate-800">
            {portfolio.bio}
          </p>
        )}
      </div>

      {/* Verified Skills Section */}
      {portfolio?.skills && portfolio.skills.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Verified Core Competencies</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {portfolio.skills.map((s, idx) => (
              <Card key={idx} className="p-3.5 text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">{s.name}</h4>
                <Badge variant={s.level === 'Expert' ? 'purple' : s.level === 'Advanced' ? 'info' : 'success'}>
                  {s.level}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Featured Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Showcase Projects ({portfolioProjects.length})</span>
          </h2>
        </div>

        {portfolioProjects.length === 0 ? (
          <Card className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            <p>No projects marked for portfolio showcase yet.</p>
            <button
              onClick={() => setActiveNav('projects')}
              className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
            >
              Add Projects to Portfolio
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioProjects.map(proj => (
              <Card key={proj.id} className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{proj.name}</h3>
                    <Badge variant={proj.status === 'completed' ? 'success' : 'warning'}>
                      {proj.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{proj.tasks.filter(t => t.completed).length} milestones completed</span>
                  {proj.linkedIdeProjectId && (
                    <button
                      onClick={() => setActiveNav('ide')}
                      className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                    >
                      View Live Code &rarr;
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Badges & Achievements */}
      {portfolio?.showAchievements && unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Honors &amp; Badges ({unlockedAchievements.length})</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unlockedAchievements.map(ach => (
              <Card key={ach.id} className="p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{ach.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ach.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Printable Footer */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <p>Verified Student Transcript &amp; Portfolio • Skudium Education System</p>
      </div>

      <PortfolioCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};
