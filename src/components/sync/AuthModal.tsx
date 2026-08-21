import React, { useState } from 'react';
import { User, ShieldCheck, CheckCircle2, UserPlus, LogOut } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, logout, isParent } = useAuth();
  const [mode, setMode] = useState<'switch' | 'new'>('switch');
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Scholar');
  const [role, setRole] = useState<'student' | 'parent'>(user?.role === 'parent' ? 'parent' : 'student');
  const [gradeLevel, setGradeLevel] = useState(user?.gradeLevel || '10th Grade');

  const handleSwitch = async (targetRole: 'student' | 'parent') => {
    await login(targetRole === 'parent' ? 'guardian@skillforge.local' : 'student@skillforge.local', '');
    onClose();
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    await register(
      `${displayName.toLowerCase().replace(/\s+/g, '')}@skillforge.local`,
      '',
      displayName,
      role,
      gradeLevel
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Local Profile & Guardian Switcher"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Offline Notice Banner */}
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-semibold text-emerald-200">100% Offline &amp; Private Platform</p>
            <p className="text-emerald-400/90 leading-relaxed">
              SkillForge operates completely on your local device. No online accounts or cloud databases are required.
            </p>
          </div>
        </div>

        {/* Current Active Profile */}
        <div className="p-4 bg-slate-850 border border-slate-750 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-base shadow">
              {user?.displayName ? user.displayName[0].toUpperCase() : 'S'}
            </div>
            <div>
              <p className="text-xs text-slate-400">Current Active Profile</p>
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{user?.displayName || 'Student Scholar'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isParent
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-brand-950 text-brand-300 border border-brand-800'
                  }`}
                >
                  {isParent ? 'Guardian View' : 'Student Mode'}
                </span>
              </h4>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMode('switch')}
            className={`py-2 rounded-lg transition ${
              mode === 'switch'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quick Role Switch
          </button>
          <button
            onClick={() => setMode('new')}
            className={`py-2 rounded-lg transition ${
              mode === 'new'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Profile
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select which mode you want to navigate SkillForge with:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSwitch('student')}
                className={`p-4 rounded-xl border text-left transition ${
                  !isParent
                    ? 'bg-brand-950/40 border-brand-500 text-brand-300 ring-1 ring-brand-500'
                    : 'bg-slate-850 border-slate-750 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <User className="w-5 h-5 text-brand-400" />
                  {!isParent && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                </div>
                <h4 className="text-xs font-bold">Student Mode</h4>
                <p className="text-[11px] text-slate-400 mt-1">Full curriculum, IDE, projects &amp; quizzes.</p>
              </button>

              <button
                type="button"
                onClick={() => handleSwitch('parent')}
                className={`p-4 rounded-xl border text-left transition ${
                  isParent
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                    : 'bg-slate-850 border-slate-750 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  {isParent && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </div>
                <h4 className="text-xs font-bold">Guardian / Parent</h4>
                <p className="text-[11px] text-slate-400 mt-1">Read-only academic progress &amp; study logs.</p>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Reset to Default Student</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="student">Student</option>
                  <option value="parent">Guardian / Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Grade Level</label>
                <select
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="6th Grade">6th Grade</option>
                  <option value="7th Grade">7th Grade</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade (Freshman)">9th Grade (Freshman)</option>
                  <option value="10th Grade (Sophomore)">10th Grade (Sophomore)</option>
                  <option value="11th Grade (Junior)">11th Grade (Junior)</option>
                  <option value="12th Grade (Senior)">12th Grade (Senior)</option>
                  <option value="College / Self-Taught">College / Self-Taught</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save Offline Profile</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
