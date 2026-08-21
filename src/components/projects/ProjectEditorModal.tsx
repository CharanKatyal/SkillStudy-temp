import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { ManagedProject, Difficulty, ProjectStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: ManagedProject | null;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  onClose,
  projectToEdit
}) => {
  const { saveManagedProject, ideProjects } = useData();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [technologies, setTechnologies] = useState('HTML5, CSS3, JavaScript');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [inPortfolio, setInPortfolio] = useState(true);
  const [notes, setNotes] = useState('');
  const [linkedIdeProjectId, setLinkedIdeProjectId] = useState<string>('');
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Set up file structure and skeleton', completed: true },
    { id: '2', text: 'Implement core functionality', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setSkill(projectToEdit.skill);
      setDifficulty(projectToEdit.difficulty);
      setTechnologies(projectToEdit.technologies.join(', '));
      setStatus(projectToEdit.status);
      setInPortfolio(projectToEdit.inPortfolio);
      setNotes(projectToEdit.notes || '');
      setLinkedIdeProjectId(projectToEdit.linkedIdeProjectId || '');
      setTasks(projectToEdit.tasks || []);
    } else {
      setName('');
      setDescription('');
      setSkill('JavaScript');
      setDifficulty('Beginner');
      setTechnologies('HTML5, CSS3, JavaScript');
      setStatus('in_progress');
      setInPortfolio(true);
      setNotes('');
      setLinkedIdeProjectId(ideProjects[0]?.id || '');
      setTasks([
        { id: '1', text: 'Design UI layout', completed: false },
        { id: '2', text: 'Implement interactive logic', completed: false }
      ]);
    }
  }, [projectToEdit, isOpen, ideProjects]);

  if (!isOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: String(Date.now()), text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const handleRemoveTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
    const calculatedStatus: ProjectStatus =
      progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    const updated: ManagedProject = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      skill,
      difficulty,
      technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
      status: calculatedStatus,
      progress,
      tasks,
      milestones: projectToEdit?.milestones || [],
      notes: notes.trim(),
      linkedIdeProjectId: linkedIdeProjectId || undefined,
      inPortfolio,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveManagedProject(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Interactive Calculator App"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Summarize the project objectives and architecture..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Skill, Difficulty & Technologies */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Skill</label>
            <input
              type="text"
              value={skill}
              onChange={e => setSkill(e.target.value)}
              placeholder="e.g. JavaScript"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies</label>
            <input
              type="text"
              value={technologies}
              onChange={e => setTechnologies(e.target.value)}
              placeholder="HTML5, CSS3, JS"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Linked IDE Project */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Linked IDE Workspace (Optional)
          </label>
          <select
            value={linkedIdeProjectId}
            onChange={e => setLinkedIdeProjectId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
          >
            <option value="">None</option>
            {ideProjects.map(proj => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({Object.keys(proj.files).length} files)
              </option>
            ))}
          </select>
        </div>

        {/* Tasks Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Milestone Tasks ({tasks.filter(t => t.completed).length} of {tasks.length} done)
          </label>
          <div className="space-y-2 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
            {tasks.map(t => (
              <div key={t.id} className="flex items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer truncate">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => handleToggleTask(t.id)}
                    className="rounded text-brand-600 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className={t.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {t.text}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveTask(t.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <form onSubmit={handleAddTask} className="flex gap-2 pt-1 border-t border-slate-800">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="Add subtask..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio Visibility Toggle */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="portfolioCheck"
            checked={inPortfolio}
            onChange={e => setInPortfolio(e.target.checked)}
            className="rounded text-brand-600 focus:ring-0 bg-slate-900 border-slate-700"
          />
          <label htmlFor="portfolioCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
            Showcase this project in Student Portfolio
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition"
          >
            Save Project
          </button>
        </div>
      </div>
    </Modal>
  );
};
