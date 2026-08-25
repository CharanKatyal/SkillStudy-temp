import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const AdaptiveRecommendationsCard: React.FC = () => {
  const { nextActions, skillGaps } = useAI();
  const { setActiveNav } = useApp();

  const handleActionClick = (action: any) => {
    if (action.type === 'lesson') {
      setActiveNav('academics', { lessonId: action.targetId });
    } else if (action.type === 'challenge') {
      setActiveNav('skills');
    } else if (action.type === 'quiz') {
      setActiveNav('practice');
    } else if (action.type === 'project') {
      setActiveNav('projects');
    }
  };

  const weakTopics = skillGaps.filter(g => g.status === 'Needs Review');

  return (
    <Card className="p-6 border-brand-500/20 bg-gradient-to-r from-brand-50/50 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-brand-950/20">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Study Navigator &amp; Insights</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Personalized next best learning actions and topic reviews</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Best Actions List */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Recommended Next Actions
          </span>
          <div className="space-y-2">
            {nextActions.slice(0, 3).map(act => (
              <div
                key={act.id}
                onClick={() => handleActionClick(act)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition flex items-center justify-between group shadow-sm dark:shadow-none"
              >
                <div className="truncate mr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant={act.priorityBadge === 'High Priority' ? 'warning' : 'info'} size="sm">
                      {act.priorityBadge}
                    </Badge>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{act.subjectOrSkillName}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-300 truncate">
                    {act.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{act.reason}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap & Mastery Status */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Topic Retention &amp; Review
          </span>
          {weakTopics.length > 0 ? (
            <div className="space-y-2">
              {weakTopics.slice(0, 2).map(gap => (
                <div
                  key={gap.id}
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>{gap.topicTitle}</span>
                    </span>
                    <Badge variant="danger" size="sm">Review Recommended</Badge>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">{gap.recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200">Study Progress on Track</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Your quiz accuracy and lesson retention are well-balanced!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
