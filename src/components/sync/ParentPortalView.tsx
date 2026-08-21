import React, { useState } from 'react';
import {
  Heart,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Code2,
  Trophy,
  Clock,
  Link,
  Target,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const ParentPortalView: React.FC = () => {
  const { user, linkedStudents, linkStudentByCode } = useAuth();
  const { profile, progress, managedProjects, practiceAttempts, achievements } = useData();

  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCodeInput.trim()) return;
    setIsLinking(true);
    await linkStudentByCode(studentCodeInput.trim());
    setStudentCodeInput('');
    setIsLinking(false);
  };

  const completedLessonsCount = Object.keys(progress?.completedLessons || {}).length;
  const completedChallengesCount = Object.keys(progress?.completedChallenges || {}).length;
  const completedProjectsCount = managedProjects.filter(p => p.status === 'completed').length;
  const unlockedBadgesCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Parent Welcome Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-850 to-slate-900 border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-purple-400" />
            <span>Phase 2: Parent &amp; Guardian Oversight</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Parent Progress Dashboard
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor your student's daily study consistency, completed curriculum lessons, coding practice, and project milestones in real-time.
          </p>
        </div>

        {/* Link Student Code Form */}
        <form onSubmit={handleLink} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 shrink-0 w-full md:w-72">
          <span className="text-xs font-bold text-slate-200 block">Link Student Account</span>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={studentCodeInput}
              onChange={e => setStudentCodeInput(e.target.value.toUpperCase())}
              placeholder="e.g. SKUDY-4921"
              className="flex-1 bg-slate-950 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={isLinking || !studentCodeInput.trim()}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition"
            >
              {isLinking ? '...' : 'Link'}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">Enter code generated in student settings.</p>
        </form>
      </div>

      {/* Student Profile Card */}
      <Card className="p-6 border-purple-850/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-bold text-lg">
              {profile?.displayName ? profile.displayName[0].toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{profile?.displayName || 'Student'}</h3>
                <Badge variant="purple">Active Student</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile?.gradeLevel || 'High School'} • {progress?.streak?.current || 1} Day Active Streak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Est. {completedLessonsCount * 20} mins learning time</span>
            </span>
          </div>
        </div>

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Lessons Completed</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">{completedLessonsCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Coding Challenges</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">{completedChallengesCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Quiz Accuracy</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {progress?.stats?.practiceAccuracy || 100}%
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Projects Shipped</span>
            <p className="text-2xl font-bold text-purple-400 mt-1">{completedProjectsCount}</p>
          </div>
        </div>
      </Card>

      {/* 2-Column: Recent Projects & Quiz History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-brand-400" />
            <h4 className="text-sm font-bold text-slate-100">Student Projects &amp; Software</h4>
          </div>

          <div className="space-y-3">
            {managedProjects.slice(0, 3).map(proj => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{proj.name}</span>
                  <Badge variant={proj.status === 'completed' ? 'success' : 'warning'}>
                    {proj.status.replace('_', ' ')}
                  </Badge>
                </div>
                <ProgressBar value={proj.progress} height="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-5 h-5 text-sky-400" />
            <h4 className="text-sm font-bold text-slate-100">Recent Quiz Assessments</h4>
          </div>

          <div className="space-y-2.5">
            {practiceAttempts.slice(0, 3).map(att => (
              <div key={att.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-slate-200">{att.subjectOrSkillName}</h5>
                  <p className="text-[10px] text-slate-500">{new Date(att.date).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">{att.accuracy}%</span>
              </div>
            ))}
            {practiceAttempts.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No quiz attempts logged yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
