import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
  }, [projectToEdit, ideProjects]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: `task-${Date.now()}`, text: newTaskText.trim(), completed: false }]);
    setNewTaskText('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / (tasks.length || 1)) * 100);

    const project: ManagedProject = {
      id: projectToEdit?.id || `mproj-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      skill,
      difficulty,
      technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
      status: progress === 100 ? 'completed' : status,
      progress,
      inPortfolio,
      notes,
      linkedIdeProjectId: linkedIdeProjectId || undefined,
      tasks,
      milestones: projectToEdit?.milestones || [],
      createdAt: projectToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveManagedProject(project);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Project Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Interactive Calculator"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What does this project do? Key features..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Primary Skill</label>
            <select
              value={skill}
              onChange={e => setSkill(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="HTML5">HTML5</option>
              <option value="CSS3">CSS3</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as ProjectStatus)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Technologies (comma separated)</label>
          <input
            type="text"
            value={technologies}
            onChange={e => setTechnologies(e.target.value)}
            placeholder="e.g. HTML5, CSS Grid, JavaScript ES6"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Milestone Tasks */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-slate-700 dark:text-slate-300 font-bold">Milestone Tasks &amp; Checklist</label>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {tasks.map(t => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => handleToggleTask(t.id)}
                    className="rounded accent-brand-600 cursor-pointer"
                  />
                  <span className={t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}>
                    {t.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(t.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Add next project milestone..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200">Showcase on Student Portfolio</span>
          <input
            type="checkbox"
            checked={inPortfolio}
            onChange={e => setInPortfolio(e.target.checked)}
            className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md transition"
          >
            Save Project
          </button>
        </div>
      </form>
    </Modal>
  );
};
