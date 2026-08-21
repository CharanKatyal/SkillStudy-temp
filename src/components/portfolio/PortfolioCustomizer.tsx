import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PortfolioData } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';

interface PortfolioCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioCustomizer: React.FC<PortfolioCustomizerProps> = ({ isOpen, onClose }) => {
  const { portfolio, updatePortfolio } = useData();

  const [customTitle, setCustomTitle] = useState(portfolio?.customTitle || 'Student Developer & Thinker');
  const [bio, setBio] = useState(portfolio?.bio || '');
  const [github, setGithub] = useState(portfolio?.socialLinks?.github || '');
  const [website, setWebsite] = useState(portfolio?.socialLinks?.website || '');
  const [email, setEmail] = useState(portfolio?.socialLinks?.email || '');
  const [skills, setSkills] = useState(portfolio?.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [showAchievements, setShowAchievements] = useState(portfolio?.showAchievements ?? true);
  const [showStats, setShowStats] = useState(portfolio?.showStats ?? true);

  if (!isOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setSkills(prev => [...prev, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const updated: PortfolioData = {
      customTitle: customTitle.trim(),
      bio: bio.trim(),
      skills,
      featuredProjectIds: portfolio?.featuredProjectIds || [],
      featuredIdeProjectIds: portfolio?.featuredIdeProjectIds || [],
      showAchievements,
      showStats,
      socialLinks: {
        github: github.trim(),
        website: website.trim(),
        email: email.trim()
      }
    };

    await updatePortfolio(updated);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customize Student Portfolio" maxWidth="2xl">
      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Headline Title</label>
          <input
            type="text"
            value={customTitle}
            onChange={e => setCustomTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">About / Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">GitHub URL</label>
            <input
              type="text"
              value={github}
              onChange={e => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Website URL</label>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@school.edu"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills Tag Editor */}
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Portfolio Skills</label>
          <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs text-slate-800 dark:text-slate-200 font-semibold shadow-sm"
              >
                <span>{s.name} ({s.level})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              placeholder="Add skill (e.g. JavaScript, CSS Grid)..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <select
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2 text-slate-900 dark:text-slate-200"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showAchievements}
              onChange={e => setShowAchievements(e.target.checked)}
              className="rounded accent-brand-600"
            />
            <span>Show Earned Achievements</span>
          </label>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showStats}
              onChange={e => setShowStats(e.target.checked)}
              className="rounded accent-brand-600"
            />
            <span>Show Learning Statistics</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md transition"
          >
            Save Portfolio
          </button>
        </div>
      </div>
    </Modal>
  );
};
