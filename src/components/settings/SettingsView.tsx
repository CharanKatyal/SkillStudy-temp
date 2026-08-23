import React, { useState, useRef } from 'react';
import {
  User,
  Moon,
  Sun,
  Laptop,
  Code2,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { backupService } from '../../services/backupService';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const SettingsView: React.FC = () => {
  const { profile, settings, updateProfile, updateSettings, resetAllData } = useData();
  const { addToast } = useApp();

  const [displayName, setDisplayName] = useState(profile?.displayName || 'Student');
  const [bio, setBio] = useState(profile?.bio || '');
  const [gradeLevel, setGradeLevel] = useState(profile?.gradeLevel || '10th Grade');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    updateProfile({
      ...profile,
      displayName: displayName.trim() || 'Student',
      bio: bio.trim(),
      gradeLevel: gradeLevel.trim()
    });
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    if (!settings) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
    updateSettings({
      ...settings,
      theme
    });
  };

  const handleEditorChange = (field: string, value: any) => {
    if (!settings) return;
    updateSettings({
      ...settings,
      editor: {
        ...settings.editor,
        [field]: value
      }
    });
  };

  const handleExportBackup = async () => {
    try {
      await backupService.exportFullBackupToFile();
      addToast('Backup Exported', 'Downloaded Skudium backup JSON file.', 'success');
    } catch (err: any) {
      addToast('Export Failed', err.message, 'warning');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = await backupService.restoreFromBackupJson(text);
      if (res.success) {
        addToast('Backup Restored', 'All student data successfully imported!', 'success');
        window.location.reload();
      } else {
        addToast('Restore Failed', res.message, 'warning');
      }
    } catch (err: any) {
      addToast('Import Error', 'Could not read backup file.', 'warning');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmReset = async () => {
    await resetAllData();
    setIsResetModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Customize your student profile, visual theme, code editor configurations, and data backups.
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Student Profile</h3>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Grade Level / Track</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                placeholder="e.g. 10th Grade / Web Development"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 resize-none transition"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Card>

      {/* Visual Theme Preferences */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          Visual Theme
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'dark'
                ? 'bg-brand-50 dark:bg-slate-900 border-brand-500 text-brand-700 dark:text-brand-400 ring-2 ring-brand-500/20 font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark Theme</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'light'
                ? 'bg-brand-50 dark:bg-slate-900 border-brand-500 text-brand-700 dark:text-brand-400 ring-2 ring-brand-500/20 font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light Theme</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'system'
                ? 'bg-brand-50 dark:bg-slate-900 border-brand-500 text-brand-700 dark:text-brand-400 ring-2 ring-brand-500/20 font-bold shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs">System Default</span>
          </button>
        </div>
      </Card>

      {/* Editor Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Code2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Code Editor Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Editor Font Size: {settings?.editor?.fontSize || 14}px
            </label>
            <input
              type="range"
              min={12}
              max={22}
              step={1}
              value={settings?.editor?.fontSize || 14}
              onChange={e => handleEditorChange('fontSize', Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tab Size</label>
            <select
              value={settings?.editor?.tabSize || 2}
              onChange={e => handleEditorChange('tabSize', Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none transition"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Show Line Numbers</span>
            <input
              type="checkbox"
              checked={settings?.editor?.lineNumbers ?? true}
              onChange={e => handleEditorChange('lineNumbers', e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300 font-bold">Word Wrap</span>
            <input
              type="checkbox"
              checked={settings?.editor?.wordWrap ?? true}
              onChange={e => handleEditorChange('wordWrap', e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Data Backup & Restore */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Data Backup &amp; Restore</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Export a complete JSON backup to preserve or transfer your progress, notes, code files, and study tasks across devices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex flex-col items-center gap-2 shadow transition"
          >
            <Download className="w-5 h-5" />
            <span>Export Backup (.json)</span>
          </button>

          <button
            onClick={handleImportClick}
            className="p-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex flex-col items-center gap-2 transition"
          >
            <Upload className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span>Import Backup File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-900 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-slate-800 font-bold text-xs flex flex-col items-center gap-2 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset All Data</span>
          </button>
        </div>
      </Card>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Data"
        maxWidth="sm"
      >
        <div className="space-y-4 text-center">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Are you sure?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            This will erase all progress, notes, code files, and planner tasks stored in this browser.
          </p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
