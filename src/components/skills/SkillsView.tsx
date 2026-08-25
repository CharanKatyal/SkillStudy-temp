import React, { useState } from 'react';
import {
  Code2,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { SKILL_SUBJECTS } from '../../data/skillData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const SkillsView: React.FC = () => {
  const { selectedSkillId, setSelectedSkillId, setActiveNav, openInIdeWithCode } = useApp();
  const { progress } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Languages', 'Tools', 'Design', 'Foundations'];

  const filteredSkills = activeCategory === 'All'
    ? SKILL_SUBJECTS
    : SKILL_SUBJECTS.filter(s => s.category === activeCategory);

  const selectedSkill = SKILL_SUBJECTS.find(s => s.id === selectedSkillId) || null;

  if (selectedSkill) {
    const completedLessons = selectedSkill.lessons.filter(l => progress?.completedLessons?.[l.id]).length;
    const completedChallenges = selectedSkill.challenges.filter(c => progress?.completedChallenges?.[c.id]).length;
    const totalItems = selectedSkill.lessons.length + selectedSkill.challenges.length;
    const finishedItems = completedLessons + completedChallenges;
    const pct = Math.round((finishedItems / (totalItems || 1)) * 100);

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSkillId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Skills</span>
          </button>
          <div className="flex gap-2">
            <Badge variant="purple">{selectedSkill.category}</Badge>
            <Badge variant={selectedSkill.difficulty === 'Beginner' ? 'success' : 'warning'}>
              {selectedSkill.difficulty}
            </Badge>
          </div>
        </div>

        {/* Header Hero */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/50 via-white to-white dark:from-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{selectedSkill.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">{selectedSkill.description}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-300">Prerequisites:</span>
              {selectedSkill.prerequisites.map((p, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Skill Mastery</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">{pct}%</span>
            </div>
            <ProgressBar value={pct} color="bg-brand-500" height="md" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {finishedItems} of {totalItems} modules completed
            </p>
          </div>
        </div>

        {/* 2-Column: Lessons & Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lessons List */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Lessons</h3>
            </div>

            <div className="space-y-3">
              {selectedSkill.lessons.map(lesson => {
                const isDone = !!progress?.completedLessons?.[lesson.id];

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveNav('academics', { lessonId: lesson.id })}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate mr-2">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{lesson.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Coding Challenges */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Coding Challenges</h3>
            </div>

            {selectedSkill.challenges.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                <p>Coding challenges for this skill are in development.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSkill.challenges.map(ch => {
                  const isDone = !!progress?.completedChallenges?.[ch.id];

                  return (
                    <div
                      key={ch.id}
                      className={`p-4 rounded-xl border space-y-3 ${
                        isDone
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ch.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{ch.description}</p>
                        </div>
                        <Badge size="sm">{ch.difficulty}</Badge>
                      </div>

                      <button
                        onClick={() => openInIdeWithCode(ch.title, ch.starterFiles, ch.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Solve in Code Studio</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Project Ideas */}
        {selectedSkill.projectIdeas.length > 0 && (
          <Card className="bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Inspiration</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedSkill.projectIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveNav('projects')}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition flex items-center justify-between shadow-sm"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">{idea}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Skills */}
      {filteredSkills.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 dark:text-slate-400">
          <Code2 className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-50" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Practical Skills Available</h3>
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Practical skills and coding tracks are currently empty.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map(skill => {
            const completedLessons = skill.lessons.filter(l => progress?.completedLessons?.[l.id]).length;
            const pct = Math.round((completedLessons / (skill.lessons.length || 1)) * 100);

            return (
              <Card
                key={skill.id}
                hoverable
                onClick={() => setSelectedSkillId(skill.id)}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: skill.color }}
                    >
                      <Code2 className="w-5 h-5" />
                    </div>
                    <Badge size="sm">{skill.difficulty}</Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{skill.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>{skill.lessons.length} Lessons</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color="bg-brand-500" height="sm" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
