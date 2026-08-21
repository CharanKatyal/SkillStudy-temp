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
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { ACADEMIC_SUBJECTS } from '../../data/academicData';
import { SKILL_SUBJECTS } from '../../data/skillData';

export const DashboardView: React.FC = () => {
  const { setActiveNav, setSelectedSubjectId, setSelectedSkillId } = useApp();
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950/90 via-slate-850 to-slate-900 border border-brand-800/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-700/50 text-brand-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Offline Ready — Zero Server Required</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Welcome back, {profile?.displayName || 'Scholar'}! 👋
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Continue your self-paced journey across academics, programming, and real-world projects. All your data is safely persisted in local storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveNav('ide')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-brand-900/40 transition transform active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              <span>Open IDE</span>
            </button>
            <button
              onClick={() => setActiveNav('learn')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Lessons</span>
            <GraduationCap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{completedLessonsCount}</span>
            <span className="text-xs text-slate-500 ml-1">/ {totalLessons}</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Challenges</span>
            <Code2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{completedChallengesCount}</span>
            <span className="text-xs text-emerald-400 ml-1 font-medium">solved</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Quizzes</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {progress?.stats?.practiceQuizzesTaken || 0}
            </span>
            <span className="text-xs text-slate-500 ml-1">taken</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {progress?.stats?.practiceAccuracy || 100}%
            </span>
            <span className="text-xs text-slate-500 ml-1">avg</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {progress?.streak?.current || 1}
            </span>
            <span className="text-xs text-orange-400 ml-1 font-medium">days</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Badges</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">{unlockedAchievementsCount}</span>
            <span className="text-xs text-slate-500 ml-1">/ {achievements.length}</span>
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
                <CalendarCheck className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-slate-100">Today's Learning Tasks</h3>
              </div>
              <button
                onClick={() => setActiveNav('planner')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Open Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                <p>No tasks scheduled for today. Add study tasks in your planner!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => togglePlannerTask(task.id)}
                        className="w-4 h-4 rounded text-brand-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                      />
                      <span
                        className={`text-sm ${
                          task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'
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
                      <span className="text-xs text-slate-400 flex items-center gap-1">
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
                <GraduationCap className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-slate-100">Academic Subjects</h3>
              </div>
              <button
                onClick={() => setActiveNav('academics')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
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
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{subject.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{subject.description}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{completedInSubj} / {subjectLessons.length} lessons</span>
                        <span className="font-semibold text-slate-200">{percentage}%</span>
                      </div>
                      <ProgressBar value={percentage} color="bg-sky-500" height="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Practical Skills Progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Practical Skills</h3>
              </div>
              <button
                onClick={() => setActiveNav('skills')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Explore Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SKILL_SUBJECTS.slice(0, 4).map(skill => {
                const completedInSkill = skill.lessons.filter(
                  l => progress?.completedLessons?.[l.id]
                ).length;
                const pct = Math.round((completedInSkill / (skill.lessons.length || 1)) * 100);

                return (
                  <div
                    key={skill.id}
                    onClick={() => {
                      setSelectedSkillId(skill.id);
                      setActiveNav('skills');
                    }}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                        <Badge size="sm">{skill.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={pct} color="bg-brand-500" height="sm" />
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
                <Code2 className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-bold text-slate-100">Recent Code Projects</h3>
              </div>
              <button
                onClick={() => setActiveNav('ide')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                IDE
              </button>
            </div>

            <div className="space-y-2.5">
              {ideProjects.slice(0, 3).map(proj => (
                <div
                  key={proj.id}
                  onClick={() => setActiveNav('ide')}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{proj.name}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {Object.keys(proj.files).length} files • {Object.keys(proj.files).join(', ')}
                    </p>
                  </div>
                  <Play className="w-4 h-4 text-brand-400 shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Active Managed Projects */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Project Workspace</h3>
              </div>
              <button
                onClick={() => setActiveNav('projects')}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {managedProjects.slice(0, 2).map(p => (
                <div
                  key={p.id}
                  onClick={() => setActiveNav('projects')}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-200">{p.name}</h4>
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

          {/* Recent Achievements */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Achievements</h3>
              </div>
              <button
                onClick={() => setActiveNav('achievements')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                All Badges
              </button>
            </div>

            <div className="space-y-2">
              {achievements.slice(0, 3).map(ach => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    ach.unlocked
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-200 truncate">{ach.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{ach.description}</p>
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
