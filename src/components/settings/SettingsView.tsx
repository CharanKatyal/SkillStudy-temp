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
  ShieldCheck,
  Heart,
  Copy,
  Check,
  HardDrive
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { backupService } from '../../services/backupService';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';

export const SettingsView: React.FC = () => {
  const { profile, settings, updateProfile, updateSettings, resetAllData } = useData();
  const { user, isParent, generateStudentLinkCode } = useAuth();
  const { addToast } = useApp();

  const [displayName, setDisplayName] = useState(profile?.displayName || 'Alex Scholar');
  const [bio, setBio] = useState(profile?.bio || 'Building responsive offline web applications with SkillForge.');
  const [gradeLevel, setGradeLevel] = useState(profile?.gradeLevel || '10th Grade');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
    addToast('Profile Saved', 'Offline student profile updated successfully.', 'success');
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

  const handleGenerateLink = async () => {
    const code = await generateStudentLinkCode();
    setLinkCode(code);
  };

  const handleCopyCode = () => {
    if (!linkCode) return;
    navigator.clipboard.writeText(linkCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportBackup = async () => {
    try {
      await backupService.exportFullBackupToFile();
      addToast('Backup Exported', 'Downloaded complete SkillForge backup JSON file.', 'success');
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
        addToast('Backup Restored', 'All student data successfully imported into IndexedDB!', 'success');
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
          Manage your offline student profile, code editor preferences, guardian links, and local IndexedDB backups.
        </p>
      </div>

      {/* 100% Offline Storage Architecture Banner */}
      <Card className="p-6 border-emerald-800/40 bg-gradient-to-r from-slate-850 to-emerald-950/20">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">100% Offline Data Sovereignty</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Zero Cloud Dependency
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          SkillForge stores your entire curriculum progress, notes, sandboxed code projects, study schedules, and quiz attempts inside your browser's local <strong>IndexedDB database</strong>. Your data never leaves your hardware.
        </p>

        {!isParent && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                <Heart className="w-4 h-4 text-purple-400" />
                <span>Guardian / Parent Review Code</span>
              </div>
              <button
                onClick={handleGenerateLink}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-purple-300 rounded-lg text-xs font-semibold"
              >
                {linkCode ? 'Refresh Code' : 'Generate Code'}
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Generate a local pairing code to switch to Guardian Review mode for academic progress tracking.
            </p>

            {linkCode && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-purple-850">
                <span className="font-mono text-sm font-bold text-purple-300 tracking-wider">
                  {linkCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="ml-auto text-slate-400 hover:text-slate-200 p-1 flex items-center gap-1 text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

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
              Save Profile Changes
            </button>
          </div>
        </form>
      </Card>

      {/* Theme & Visual Preferences */}
      <Card className="p-6 border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-4 pb-3 border-b border-slate-800">
          Visual Theme
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'dark'
                ? 'bg-slate-900 border-brand-500 text-brand-400 ring-1 ring-brand-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs font-semibold">Dark Theme</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'light'
                ? 'bg-slate-900 border-brand-500 text-brand-400 ring-1 ring-brand-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs font-semibold">Light Theme</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              settings?.theme === 'system'
                ? 'bg-slate-900 border-brand-500 text-brand-400 ring-1 ring-brand-500'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs font-semibold">System Default</span>
          </button>
        </div>
      </Card>

      {/* Editor Preferences */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <Code2 className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-slate-100">Code Editor Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
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
            <label className="block text-slate-300 font-semibold mb-1">Tab Size</label>
            <select
              value={settings?.editor?.tabSize || 2}
              onChange={e => handleEditorChange('tabSize', Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300 font-semibold">Show Line Numbers</span>
            <input
              type="checkbox"
              checked={settings?.editor?.lineNumbers ?? true}
              onChange={e => handleEditorChange('lineNumbers', e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-300 font-semibold">Word Wrap</span>
            <input
              type="checkbox"
              checked={settings?.editor?.wordWrap ?? true}
              onChange={e => handleEditorChange('wordWrap', e.target.checked)}
              className="w-4 h-4 accent-brand-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Offline Data Backup & Restore */}
      <Card className="p-6 border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Offline Data Backup &amp; Restore</h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          SkillForge stores your entire progress, notes, coding files, and study tasks locally in your browser's IndexedDB. Export a JSON backup to move your workspace across computers.
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
          <h4 className="text-base font-bold text-slate-100">Are you sure?</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            This will erase all local progress, notes, IDE projects, and planner tasks on this browser.
          </p>

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
