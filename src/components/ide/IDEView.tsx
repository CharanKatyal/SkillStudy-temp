import React, { useState, useRef } from 'react';
import {
  Play,
  Square,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  FolderOpen,
  X,
  Plus,
  Terminal,
  Eye,
  Code2,
  ChevronDown
} from 'lucide-react';
import { useIDE } from '../../context/IDEContext';
import { useData } from '../../context/DataContext';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { ConsoleOutput } from './ConsoleOutput';
import { TemplatePicker } from './TemplatePicker';
import { Badge } from '../common/Badge';

export const IDEView: React.FC = () => {
  const {
    currentProject,
    activeFileName,
    openTabs,
    openFileInTab,
    closeTab,
    runProject,
    stopProject,
    isRunning,
    isSaving,
    hasUnsavedChanges,
    saveCurrentProject,
    resetToTemplate,
    exportProjectZip,
    exportProjectJson,
    importProjectZip,
    loadProject,
    createNewBlankProject
  } = useIDE();

  const { ideProjects } = useData();

  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'console'>('editor');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentProject) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center space-y-4">
        <Code2 className="w-12 h-12 text-brand-400 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-200">Initializing Offline Workspace...</h3>
        <button
          onClick={() => setIsTemplatePickerOpen(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg shadow"
        >
          Choose a Template
        </button>
        <TemplatePicker
          isOpen={isTemplatePickerOpen}
          onClose={() => setIsTemplatePickerOpen(false)}
        />
      </div>
    );
  }

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importProjectZip(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl animate-fadeIn">
      {/* Top Toolbar */}
      <div className="h-13 px-3 py-2 bg-slate-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Left: Project selector & Name */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-750 hover:border-slate-600 text-slate-200 text-xs font-bold transition"
            >
              <span className="truncate max-w-[140px]">{currentProject.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProjectDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
                  Your Projects ({ideProjects.length})
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {ideProjects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        loadProject(proj.id);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center justify-between ${
                        proj.id === currentProject.id
                          ? 'bg-brand-600/20 text-brand-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{proj.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {Object.keys(proj.files).length} files
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 border-t border-slate-800 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      createNewBlankProject(`Project ${ideProjects.length + 1}`);
                      setIsProjectDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-brand-400 hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Blank Project</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTemplatePickerOpen(true);
                      setIsProjectDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-amber-400 hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New from Template...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsTemplatePickerOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-750 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Templates</span>
          </button>
        </div>

        {/* Center: Execution & Save Controls */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={runProject}
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-900/40 transition active:scale-95"
              title="Re-run code in sandbox"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
            </button>
          ) : (
            <button
              onClick={runProject}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
            </button>
          )}

          <button
            onClick={stopProject}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            title="Stop Sandbox"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={saveCurrentProject}
            disabled={isSaving}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
              hasUnsavedChanges
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Save Project (Autosave is active)"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? 'Save *' : 'Saved'}</span>
          </button>

          {currentProject.templateId && (
            <button
              onClick={resetToTemplate}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Reset Starter Code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Import / Export options */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={exportProjectZip}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition"
            title="Export as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export ZIP</span>
          </button>

          <button
            onClick={handleImportClick}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition"
            title="Import ZIP"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".zip"
            className="hidden"
          />
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible only on small screens) */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 text-xs">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 font-bold text-center border-b-2 ${
            mobileTab === 'editor' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 font-bold text-center border-b-2 ${
            mobileTab === 'preview' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400'
          }`}
        >
          Live Preview
        </button>
        <button
          onClick={() => setMobileTab('console')}
          className={`flex-1 py-2 font-bold text-center border-b-2 ${
            mobileTab === 'console' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400'
          }`}
        >
          Console
        </button>
      </div>

      {/* Main IDE Workspace: Explorer + Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Explorer */}
        <div className={`w-48 shrink-0 ${showFiles ? 'block' : 'hidden'} hidden md:block`}>
          <FileExplorer />
        </div>

        {/* Center: Tabs + Code Editor + Console */}
        <div
          className={`flex-1 flex flex-col min-w-0 border-r border-slate-800 ${
            mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* File Tabs Bar */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center px-2 gap-1 overflow-x-auto select-none">
            {openTabs.map(tabName => {
              const isActive = activeFileName === tabName;

              return (
                <div
                  key={tabName}
                  onClick={() => openFileInTab(tabName)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-t-lg text-xs cursor-pointer border-t-2 transition ${
                    isActive
                      ? 'bg-slate-950 text-slate-100 font-semibold border-brand-500'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-transparent'
                  }`}
                >
                  <span className="truncate max-w-[120px]">{tabName}</span>
                  {openTabs.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        closeTab(tabName);
                      }}
                      className="p-0.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* CodeMirror Editor Area */}
          <div className="flex-1 min-h-0 relative">
            <CodeEditor />
          </div>

          {/* Bottom Console Drawer */}
          {showConsole && (
            <div className="h-44 shrink-0">
              <ConsoleOutput />
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div
          className={`w-full lg:w-1/2 flex-1 flex flex-col min-w-0 ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <LivePreview />
        </div>

        {/* Mobile Console View */}
        {mobileTab === 'console' && (
          <div className="lg:hidden flex-1 flex flex-col">
            <ConsoleOutput />
          </div>
        )}
      </div>

      <TemplatePicker
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
      />
    </div>
  );
};
