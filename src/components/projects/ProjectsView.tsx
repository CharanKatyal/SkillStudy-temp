import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Code2,
  Trash2,
  Edit2,
  Briefcase
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useApp } from '../../context/AppContext';
import { ManagedProject } from '../../types';
import { ProjectEditorModal } from './ProjectEditorModal';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

export const ProjectsView: React.FC = () => {
  const { managedProjects, deleteManagedProject, saveManagedProject } = useData();
  const { setActiveNav } = useApp();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ManagedProject | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProjects = filterStatus === 'all'
    ? managedProjects
    : managedProjects.filter(p => p.status === filterStatus);

  const handleOpenCreate = () => {
    setProjectToEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (proj: ManagedProject) => {
    setProjectToEdit(proj);
    setIsEditorOpen(true);
  };

  const handleToggleTask = async (proj: ManagedProject, taskId: string) => {
    const updatedTasks = proj.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / (updatedTasks.length || 1)) * 100);
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    await saveManagedProject({
      ...proj,
      tasks: updatedTasks,
      progress,
      status
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50/60 via-white to-white dark:from-slate-850 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Project Management</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Plan, organize, and track your software milestones. Connect live workspace projects and publish completed works to your portfolio.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter status buttons */}
      <div className="flex items-center gap-2">
        {['all', 'in_progress', 'completed', 'not_started'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
              filterStatus === st
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
          <FolderKanban className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p>No projects found in this view.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(proj => (
            <Card key={proj.id} className="p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{proj.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                  <Badge variant={proj.status === 'completed' ? 'success' : 'warning'}>
                    {proj.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Progress</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">{proj.progress}%</span>
                  </div>
                  <ProgressBar value={proj.progress} color="bg-brand-500" height="sm" />
                </div>

                {/* Tasks List snippet */}
                {proj.tasks && proj.tasks.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                      Tasks ({proj.tasks.filter(t => t.completed).length}/{proj.tasks.length})
                    </span>
                    <div className="space-y-1">
                      {proj.tasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(proj, task.id)}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}}
                            className="rounded accent-brand-600 cursor-pointer"
                          />
                          <span className={task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.linkedIdeProjectId && (
                    <button
                      onClick={() => setActiveNav('ide')}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300 hover:bg-brand-100 text-xs font-bold flex items-center gap-1.5 border border-brand-200 dark:border-brand-500/40 transition"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </button>
                  )}
                  {proj.inPortfolio && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Portfolio</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteManagedProject(proj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProjectEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};
