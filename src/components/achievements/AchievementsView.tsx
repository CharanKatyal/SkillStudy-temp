import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  Code2,
  CheckCircle2,
  FolderKanban,
  Zap,
  Lock,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const AchievementsView: React.FC = () => {
  const { achievements, progress } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'learning', 'coding', 'practice', 'projects', 'streak'];

  const filtered = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const pct = Math.round((unlockedCount / (totalCount || 1)) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <Award className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6" />;
      case 'Code2': return <Code2 className="w-6 h-6" />;
      case 'Terminal': return <Code2 className="w-6 h-6" />;
      case 'FolderKanban': return <FolderKanban className="w-6 h-6" />;
      case 'Rocket': return <Sparkles className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>{progress?.streak?.current || 1} Day Streak (Best: {progress?.streak?.longest || 1})</span>
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Achievements &amp; Honors</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Unlock badges automatically as you complete lessons, solve code challenges, pass quizzes, and ship projects.
          </p>
        </div>

        <div className="w-full md:w-64 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
            <span>Unlocked Badges</span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{unlockedCount} / {totalCount}</span>
          </div>
          <ProgressBar value={pct} color="bg-amber-500" height="md" />
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">{pct}% Completed</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ach => (
          <Card
            key={ach.id}
            className={`p-5 flex flex-col justify-between border transition ${
              ach.unlocked
                ? 'bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-850 dark:to-amber-950/20 border-amber-300 dark:border-amber-700/50 shadow-sm'
                : 'opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/40 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-750'
                  }`}
                >
                  {ach.unlocked ? getIcon(ach.icon) : <Lock className="w-5 h-5" />}
                </div>
                <Badge variant={ach.unlocked ? 'warning' : 'default'} size="sm">
                  {ach.category}
                </Badge>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{ach.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
              {ach.unlocked ? (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                  {ach.unlockedAt && (
                    <span className="text-[10px] text-slate-500">
                      {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1 font-medium">
                    <span>Progress</span>
                    <span>{ach.progress} / {ach.maxProgress}</span>
                  </div>
                  <ProgressBar
                    value={Math.round((ach.progress / (ach.maxProgress || 1)) * 100)}
                    color="bg-amber-500"
                    height="sm"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
