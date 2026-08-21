import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
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
    if (name.endsWith('.html')) return <span className="text-orange-400 font-bold text-xs">H</span>;
    if (name.endsWith('.css')) return <span className="text-sky-400 font-bold text-xs">C</span>;
    if (name.endsWith('.js')) return <span className="text-amber-400 font-bold text-xs">JS</span>;
    if (name.endsWith('.py')) return <span className="text-blue-400 font-bold text-xs">PY</span>;
    if (name.endsWith('.json')) return <span className="text-emerald-400 font-bold text-xs">{}</span>;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 select-none text-xs">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 bg-slate-850/60">
        <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-brand-400" />
          <span>Files</span>
        </span>
        <button
          onClick={() => setIsCreatingFile(true)}
          className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          title="New File"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New File Input */}
      {isCreatingFile && (
        <form onSubmit={handleCreateSubmit} className="p-2 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              placeholder="filename.js"
              className="w-full bg-slate-950 border border-brand-500 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none"
            />
            <button type="submit" className="text-emerald-400 p-1 hover:bg-slate-800 rounded">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFile(false)}
              className="text-slate-400 p-1 hover:bg-slate-800 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
        {Object.values(currentProject.files).map(file => {
          const isActive = activeFileName === file.name;
          const isEditing = editingFileName === file.name;

          return (
            <div
              key={file.name}
              onClick={() => !isEditing && openFileInTab(file.name)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition ${
                isActive
                  ? 'bg-slate-800/90 text-brand-300 font-semibold border-l-2 border-brand-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    autoFocus
                    value={renamedName}
                    onChange={e => setRenamedName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenameSubmit(file.name);
                      if (e.key === 'Escape') setEditingFileName(null);
                    }}
                    className="w-full bg-slate-950 border border-brand-500 rounded px-1.5 py-0.5 text-xs text-slate-100 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRenameSubmit(file.name)}
                    className="text-emerald-400 p-0.5"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditingFileName(null)} className="text-slate-400 p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 truncate mr-2">
                    <div className="w-4 flex items-center justify-center shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <span className="truncate">{file.name}</span>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setRenamedName(file.name);
                        setEditingFileName(file.name);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-700"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {Object.keys(currentProject.files).length > 1 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteFile(file.name);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-700"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
