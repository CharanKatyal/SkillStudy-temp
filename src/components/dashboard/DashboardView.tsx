import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Code2,
  Trophy,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Flame,
  Clock,
  Play,
  FolderKanban,
  Target,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { useAI } from '../../context/AIContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { AdaptiveRecommendationsCard } from '../ai/AdaptiveRecommendationsCard';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { SKILL_SUBJECTS } from '../../data/skillData';

export const DashboardView: React.FC = () => {
  const { setActiveNav, setSelectedSubjectId, setSelectedSkillId } = useApp();
  const { setIsDrawerOpen } = useAI();
  const {
    profile,
    progress,
    ideProjects,
    managedProjects,
    plannerTasks,
    achievements,
    togglePlannerTask
  } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = plannerTasks.filter(t => t.date === todayStr);

  const completedLessonsCount = Object.keys(progress?.completedLessons || {}).length;
  const completedChallengesCount = Object.keys(progress?.completedChallenges || {}).length;
  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  const totalAcademicLessons = ACADEMIC_SUBJECTS.reduce(
    (sum, s) => sum + s.chapters.reduce((csum, c) => csum + c.topics.reduce((tsum, t) => tsum + t.lessons.length, 0), 0),
    0
  );

  const totalSkillLessons = SKILL_SUBJECTS.reduce((sum, s) => sum + s.lessons.length, 0);
  const totalLessons = totalAcademicLessons + totalSkillLessons;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-50 via-white to-emerald-50/60 dark:from-brand-900/40 dark:via-brand-950/20 dark:to-slate-900 border border-brand-200 dark:border-brand-500/20 p-6 sm:p-8 shadow-sm dark:shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span>Interactive Learning Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back, {profile?.displayName || 'Scholar'}! 👋
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl leading-relaxed">
              Continue your self-paced learning journey across academic subjects, modern coding skills, and hands-on portfolio projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveNav('ide')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center gap-2 shadow-md transition transform active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Studio</span>
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-brand-300 border border-slate-200 dark:border-brand-800/40 font-semibold text-sm flex items-center gap-2 shadow-sm transition"
            >
              <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Phase 3 Adaptive Learning & Recommendations */}
      <AdaptiveRecommendationsCard />

      {/* Core Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Lessons</span>
            <GraduationCap className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedLessonsCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ {totalLessons}</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Challenges</span>
            <Code2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedChallengesCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-1 font-medium">solved</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Quizzes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {progress?.stats?.practiceQuizzesTaken || 0}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">taken</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {progress?.stats?.practiceAccuracy || 100}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">avg</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {progress?.streak?.current || 1}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 ml-1 font-medium">days</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Badges</span>
            <Trophy className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{unlockedAchievementsCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ {achievements.length}</span>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Two-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tasks & Academic + Skill progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Today's Learning Tasks</h3>
              </div>
              <button
                onClick={() => setActiveNav('planner')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
              >
                <span>Open Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                <p>No tasks scheduled for today. Add study tasks in your planner or generate an AI timetable!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => togglePlannerTask(task.id)}
                        className="w-4 h-4 rounded text-brand-600 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-0 cursor-pointer"
                      />
                      <span
                        className={`text-sm ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.category === 'Coding'
                            ? 'info'
                            : task.category === 'Academic'
                            ? 'purple'
                            : 'default'
                        }
                      >
                        {task.category}
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.durationMinutes}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Academic Learning Progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Academic Subjects</h3>
              </div>
              <button
                onClick={() => setActiveNav('academics')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1"
              >
                <span>View All Subjects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ACADEMIC_SUBJECTS.map(subject => {
                const subjectLessons = subject.chapters.flatMap(c => c.topics.flatMap(t => t.lessons));
                const completedInSubj = subjectLessons.filter(
                  l => progress?.completedLessons?.[l.id]
                ).length;
                const percentage = Math.round((completedInSubj / (subjectLessons.length || 1)) * 100);

                return (
                  <div
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubjectId(subject.id);
                      setActiveNav('academics');
                    }}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-850 cursor-pointer shadow-sm dark:shadow-none transition flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{subject.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{subject.description}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span>{completedInSubj} / {subjectLessons.length} lessons</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{percentage}%</span>
                      </div>
                      <ProgressBar value={percentage} color="bg-sky-500" height="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 1 Column: IDE Projects & Achievements */}
        <div className="space-y-6">
          {/* Active / Recent IDE Projects */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Code Projects</h3>
              </div>
              <button
                onClick={() => setActiveNav('ide')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
                IDE
              </button>
            </div>

            <div className="space-y-2.5">
              {ideProjects.slice(0, 3).map(proj => (
                <div
                  key={proj.id}
                  onClick={() => setActiveNav('ide')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-850 cursor-pointer shadow-sm dark:shadow-none transition flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{proj.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {Object.keys(proj.files).length} files • {Object.keys(proj.files).join(', ')}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Active Managed Projects */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Workspace</h3>
              </div>
              <button
                onClick={() => setActiveNav('projects')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {managedProjects.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  onClick={() => setActiveNav('projects')}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-white dark:hover:bg-slate-850 cursor-pointer shadow-sm dark:shadow-none transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{p.name}</h4>
                    <Badge variant={p.status === 'completed' ? 'success' : 'warning'}>
                      {p.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={p.progress} height="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
