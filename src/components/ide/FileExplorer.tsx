import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  FolderOpen,
  Check,
  X
} from 'lucide-react';
import { useIDE } from '../../context/IDEContext';

export const FileExplorer: React.FC = () => {
  const {
    currentProject,
    activeFileName,
    openFileInTab,
    createFile,
    renameFile,
    deleteFile
  } = useIDE();

  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [renamedName, setRenamedName] = useState('');

  if (!currentProject) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    createFile(newFileName.trim());
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleRenameSubmit = (oldName: string) => {
    if (renamedName.trim() && renamedName.trim() !== oldName) {
      renameFile(oldName, renamedName.trim());
    }
    setEditingFileName(null);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.html')) return <span className="text-orange-500 font-bold text-xs">H</span>;
    if (name.endsWith('.css')) return <span className="text-sky-500 font-bold text-xs">C</span>;
    if (name.endsWith('.js')) return <span className="text-amber-500 font-bold text-xs">JS</span>;
    if (name.endsWith('.py')) return <span className="text-blue-500 font-bold text-xs">PY</span>;
    if (name.endsWith('.json')) return <span className="text-emerald-500 font-bold text-xs">{}</span>;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 select-none text-xs">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60">
        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>Files</span>
        </span>
        <button
          onClick={() => setIsCreatingFile(true)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          title="New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* File Creation Input */}
      {isCreatingFile && (
        <form onSubmit={handleCreateSubmit} className="p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1">
          <input
            type="text"
            autoFocus
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            placeholder="filename.ext"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingFile(false)}
            className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {Object.keys(currentProject.files).map(fileName => {
          const isSelected = activeFileName === fileName;
          const isRenaming = editingFileName === fileName;

          if (isRenaming) {
            return (
              <div key={fileName} className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded">
                <input
                  type="text"
                  autoFocus
                  value={renamedName}
                  onChange={e => setRenamedName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRenameSubmit(fileName);
                    if (e.key === 'Escape') setEditingFileName(null);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-750 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <button
                  onClick={() => handleRenameSubmit(fileName)}
                  className="text-emerald-600 dark:text-emerald-400 p-0.5"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingFileName(null)} className="text-slate-400 p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={fileName}
              onClick={() => openFileInTab(fileName)}
              className={`group px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition ${
                isSelected
                  ? 'bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-transparent'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 truncate mr-1">
                <div className="w-4 flex items-center justify-center">{getFileIcon(fileName)}</div>
                <span className="truncate">{fileName}</span>
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition shrink-0">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setEditingFileName(fileName);
                    setRenamedName(fileName);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-750"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteFile(fileName);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-200 dark:hover:bg-slate-750"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
