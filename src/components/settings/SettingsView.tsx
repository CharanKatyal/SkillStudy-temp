import React, { useState, useRef } from 'react';
import {
  Settings,
  User,
  Moon,
  Sun,
  Laptop,
  Code2,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { backupService } from '../../services/backupService';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const SettingsView: React.FC = () => {
  const { profile, settings, updateProfile, updateSettings, resetAllData } = useData();
  const { addToast } = useApp();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [gradeLevel, setGradeLevel] = useState(profile?.gradeLevel || 'High School');
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
      addToast('Backup Exported', 'Downloaded complete StillSkudy backup JSON.', 'success');
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
        <h2 className="text-2xl font-bold text-slate-100">Settings &amp; Data Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your student profile, visual preferences, editor configurations, and offline data backups.
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <User className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-slate-100">Student Profile</h3>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Grade Level / Status</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                placeholder="e.g. 10th Grade / Self-Taught Developer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Headline</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 resize-none"
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

      {/* Theme Settings */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Moon className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-slate-100">Appearance &amp; Theme</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'system', label: 'System Default', icon: Laptop }
          ].map(t => {
            const Icon = t.icon;
            const isSelected = settings?.theme === t.id;

            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id as any)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                  isSelected
                    ? 'bg-brand-950/40 border-brand-500 text-brand-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{t.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Code Editor Configuration */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Code2 className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Editor Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Font Size ({settings?.editor?.fontSize || 14}px)
            </label>
            <input
              type="range"
              min="12"
              max="22"
              step="1"
              value={settings?.editor?.fontSize || 14}
              onChange={e => handleEditorChange('fontSize', Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Tab Size</label>
            <select
              value={settings?.editor?.tabSize || 2}
              onChange={e => handleEditorChange('tabSize', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="lineNumbers"
              checked={settings?.editor?.lineNumbers ?? true}
              onChange={e => handleEditorChange('lineNumbers', e.target.checked)}
              className="rounded text-brand-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
            <label htmlFor="lineNumbers" className="text-slate-300 cursor-pointer">
              Show Line Numbers
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="wordWrap"
              checked={settings?.editor?.wordWrap ?? true}
              onChange={e => handleEditorChange('wordWrap', e.target.checked)}
              className="rounded text-brand-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
            <label htmlFor="wordWrap" className="text-slate-300 cursor-pointer">
              Word Wrap
            </label>
          </div>
        </div>
      </Card>

      {/* Data Backup & Restore */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Offline Data Backup &amp; Restore</h3>
          </div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Cloud Storage</span>
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          StillSkudy stores your entire progress, notes, coding files, and study tasks locally in your browser's IndexedDB. Export a JSON backup to move your workspace across computers or preserve your achievements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex flex-col items-center gap-2 shadow-lg shadow-brand-900/30 transition"
          >
            <Download className="w-5 h-5" />
            <span>Export Full Backup (.json)</span>
          </button>

          <button
            onClick={handleImportClick}
            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center gap-2 transition"
          >
            <Upload className="w-5 h-5 text-sky-400" />
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
            className="p-4 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-rose-400 border border-slate-800 hover:border-rose-800 font-bold text-xs flex flex-col items-center gap-2 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset to Defaults</span>
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
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100">Are you sure?</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              This will erase all local progress, notes, IDE projects, and planner tasks on this browser. This action cannot be undone unless you have an exported backup file.
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
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
