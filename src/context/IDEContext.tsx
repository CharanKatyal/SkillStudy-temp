import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { IdeProject, IdeFile, ProjectTemplate } from '../types';
import { useData } from './DataContext';
import { useApp } from './AppContext';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';
import { backupService } from '../services/backupService';

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface IDEContextType {
  currentProject: IdeProject | null;
  activeFileName: string;
  openTabs: string[];
  consoleLogs: ConsoleLogMessage[];
  isRunning: boolean;
  previewUrl: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  activeChallengeId: string | null;
  setActiveChallengeId: (id: string | null) => void;
  loadProject: (projectId: string) => void;
  createNewProjectFromTemplate: (templateId: string, customName?: string) => Promise<IdeProject>;
  createNewBlankProject: (name: string) => Promise<IdeProject>;
  setActiveFileName: (name: string) => void;
  openFileInTab: (name: string) => void;
  closeTab: (name: string) => void;
  updateFileContent: (filename: string, content: string) => void;
  createFile: (filename: string, language?: IdeFile['language']) => void;
  renameFile: (oldName: string, newName: string) => void;
  deleteFile: (filename: string) => void;
  runProject: () => void;
  stopProject: () => void;
  clearConsole: () => void;
  saveCurrentProject: () => Promise<void>;
  resetToTemplate: () => void;
  exportProjectZip: () => Promise<void>;
  exportProjectJson: () => void;
  importProjectZip: (file: File) => Promise<void>;
}

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export const IDEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ideProjects, saveIdeProject, deleteIdeProject, markChallengeComplete } = useData();
  const { addToast } = useApp();

  const [currentProject, setCurrentProject] = useState<IdeProject | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('index.html');
  const [openTabs, setOpenTabs] = useState<string[]>(['index.html', 'style.css', 'script.js']);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize first project from database
  useEffect(() => {
    if (ideProjects.length > 0 && !currentProject) {
      const initial = ideProjects[0];
      setCurrentProject(initial);
      setActiveFileName(initial.activeFileName || Object.keys(initial.files)[0] || 'index.html');
      setOpenTabs(initial.openTabs || Object.keys(initial.files).slice(0, 3));
    }
  }, [ideProjects, currentProject]);

  // Listen to external custom events e.g. "Open in IDE" from lesson or challenge
  useEffect(() => {
    const handleOpenIdeEvent = (e: any) => {
      const { title, starterFiles, challengeId } = e.detail;
      if (starterFiles) {
        const files: Record<string, IdeFile> = {};
        Object.entries(starterFiles).forEach(([name, val]: [string, any]) => {
          files[name] = {
            name,
            content: typeof val === 'string' ? val : val.content || '',
            language: typeof val === 'object' && val.language ? val.language : name.endsWith('.html') ? 'html' : name.endsWith('.css') ? 'css' : name.endsWith('.js') ? 'javascript' : 'text'
          };
        });

        const newProj: IdeProject = {
          id: `proj-challenge-${Date.now()}`,
          name: title || 'Challenge Workspace',
          description: challengeId ? `Workspace for coding challenge ${challengeId}` : 'Interactive lesson playground',
          files,
          activeFileName: Object.keys(files)[0] || 'index.html',
          openTabs: Object.keys(files).slice(0, 3),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        saveIdeProject(newProj);
        setCurrentProject(newProj);
        setActiveFileName(newProj.activeFileName);
        setOpenTabs(newProj.openTabs);
        if (challengeId) setActiveChallengeId(challengeId);
        addToast('Environment Loaded', `Opened starter code for "${title}".`, 'info');
      }
    };

    window.addEventListener('stillskudy:open-ide', handleOpenIdeEvent);
    return () => window.removeEventListener('stillskudy:open-ide', handleOpenIdeEvent);
  }, [saveIdeProject, addToast]);

  // Message listener for sandboxed iframe console messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'stillskudy-sandbox') {
        const { type, message } = event.data;
        const newMsg: ConsoleLogMessage = {
          id: `log-${Date.now()}-${Math.random()}`,
          type: type || 'log',
          message: typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message),
          timestamp: new Date().toLocaleTimeString()
        };
        setConsoleLogs(prev => [...prev.slice(-199), newMsg]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Build the sandboxed HTML bundle with intercepted console
  const generatePreviewDoc = useCallback(() => {
    if (!currentProject) return '';

    const htmlFile = currentProject.files['index.html']?.content || '<h3>No index.html file found</h3>';
    const cssFiles = Object.values(currentProject.files)
      .filter(f => f.name.endsWith('.css'))
      .map(f => `<style>/* ${f.name} */\n${f.content}\n</style>`)
      .join('\n');

    const jsFiles = Object.values(currentProject.files)
      .filter(f => f.name.endsWith('.js'))
      .map(f => `// ${f.name}\n${f.content}`)
      .join('\n');

    // Secure offline logger bridge
    const loggerBridge = `
      <script>
        (function() {
          function sendLog(type, args) {
            try {
              var formatted = Array.prototype.slice.call(args).map(function(item) {
                if (item === null) return "null";
                if (item === undefined) return "undefined";
                if (typeof item === "object") {
                  try { return JSON.stringify(item); } catch(e) { return String(item); }
                }
                return String(item);
              }).join(" ");
              window.parent.postMessage({
                source: "stillskudy-sandbox",
                type: type,
                message: formatted
              }, "*");
            } catch(err) {}
          }

          var oldLog = console.log;
          var oldWarn = console.warn;
          var oldError = console.error;
          var oldInfo = console.info;

          console.log = function() { sendLog("log", arguments); oldLog.apply(console, arguments); };
          console.warn = function() { sendLog("warn", arguments); oldWarn.apply(console, arguments); };
          console.error = function() { sendLog("error", arguments); oldError.apply(console, arguments); };
          console.info = function() { sendLog("info", arguments); oldInfo.apply(console, arguments); };

          window.onerror = function(message, source, lineno, colno, error) {
            sendLog("error", ["Runtime Error: " + message + " (Line " + lineno + ")"]);
            return false;
          };
        })();
      </script>
    `;

    // Inject CSS into <head> and JS into end of <body>
    let doc = htmlFile;
    if (doc.includes('</head>')) {
      doc = doc.replace('</head>', `${loggerBridge}\n${cssFiles}\n</head>`);
    } else {
      doc = `${loggerBridge}\n${cssFiles}\n${doc}`;
    }

    const scriptTag = `<script>\n${jsFiles}\n</script>`;
    if (doc.includes('</body>')) {
      doc = doc.replace('</body>', `${scriptTag}\n</body>`);
    } else {
      doc = `${doc}\n${scriptTag}`;
    }

    return doc;
  }, [currentProject]);

  const runProject = useCallback(() => {
    setIsRunning(true);
    setConsoleLogs([]);
    const doc = generatePreviewDoc();
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    // If there is an active challenge, check if completing it
    if (activeChallengeId) {
      markChallengeComplete(activeChallengeId, currentProject?.files['script.js']?.content || '');
    }
  }, [generatePreviewDoc, activeChallengeId, markChallengeComplete, currentProject]);

  const stopProject = () => {
    setIsRunning(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setConsoleLogs(prev => [
      ...prev,
      {
        id: `stop-${Date.now()}`,
        type: 'info',
        message: 'Sandbox stopped.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  const saveCurrentProject = async () => {
    if (!currentProject) return;
    setIsSaving(true);
    const updated: IdeProject = {
      ...currentProject,
      activeFileName,
      openTabs,
      updatedAt: new Date().toISOString()
    };
    await saveIdeProject(updated);
    setCurrentProject(updated);
    setHasUnsavedChanges(false);
    setIsSaving(false);
  };

  // Run automatically when project is initially loaded or changed
  useEffect(() => {
    if (currentProject) {
      runProject();
    }
  }, [currentProject?.id]);

  const loadProject = (projectId: string) => {
    const found = ideProjects.find(p => p.id === projectId);
    if (found) {
      setCurrentProject(found);
      setActiveFileName(found.activeFileName || Object.keys(found.files)[0] || 'index.html');
      setOpenTabs(found.openTabs || Object.keys(found.files).slice(0, 3));
      setActiveChallengeId(null);
    }
  };

  const createNewProjectFromTemplate = async (templateId: string, customName?: string): Promise<IdeProject> => {
    const template = PROJECT_TEMPLATES.find(t => t.id === templateId) || PROJECT_TEMPLATES[0];
    const newProj: IdeProject = {
      id: `proj-${Date.now()}`,
      name: customName || template.name,
      description: template.description,
      templateId: template.id,
      files: JSON.parse(JSON.stringify(template.files)),
      activeFileName: 'index.html',
      openTabs: Object.keys(template.files).slice(0, 3),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveIdeProject(newProj);
    setCurrentProject(newProj);
    setActiveFileName('index.html');
    setOpenTabs(newProj.openTabs);
    setActiveChallengeId(null);
    addToast('New Project Ready', `Created project "${newProj.name}".`, 'success');
    return newProj;
  };

  const createNewBlankProject = async (name: string): Promise<IdeProject> => {
    const defaultTemplate = PROJECT_TEMPLATES[0];
    return createNewProjectFromTemplate(defaultTemplate.id, name);
  };

  const openFileInTab = (filename: string) => {
    if (!openTabs.includes(filename)) {
      setOpenTabs(prev => [...prev, filename]);
    }
    setActiveFileName(filename);
  };

  const closeTab = (filename: string) => {
    const remaining = openTabs.filter(t => t !== filename);
    setOpenTabs(remaining);
    if (activeFileName === filename) {
      setActiveFileName(remaining[0] || Object.keys(currentProject?.files || {})[0] || '');
    }
  };

  const updateFileContent = (filename: string, content: string) => {
    if (!currentProject) return;

    const file = currentProject.files[filename];
    if (!file) return;

    const updatedFiles = {
      ...currentProject.files,
      [filename]: {
        ...file,
        content
      }
    };

    const updatedProj: IdeProject = {
      ...currentProject,
      files: updatedFiles,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProj);
    setHasUnsavedChanges(true);

    // Debounced autosave
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(async () => {
      await saveIdeProject(updatedProj);
      setHasUnsavedChanges(false);
    }, 1500);
  };

  const createFile = (filename: string, language?: IdeFile['language']) => {
    if (!currentProject) return;

    let lang: IdeFile['language'] = language || 'text';
    if (!language) {
      if (filename.endsWith('.html')) lang = 'html';
      else if (filename.endsWith('.css')) lang = 'css';
      else if (filename.endsWith('.js')) lang = 'javascript';
      else if (filename.endsWith('.py')) lang = 'python';
      else if (filename.endsWith('.json')) lang = 'json';
    }

    const updatedFiles = {
      ...currentProject.files,
      [filename]: {
        name: filename,
        content: '',
        language: lang
      }
    };

    const updatedProj: IdeProject = {
      ...currentProject,
      files: updatedFiles,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProj);
    openFileInTab(filename);
    saveIdeProject(updatedProj);
    addToast('File Created', `Created ${filename}`, 'info');
  };

  const renameFile = (oldName: string, newName: string) => {
    if (!currentProject || !currentProject.files[oldName] || !newName || oldName === newName) return;

    const file = currentProject.files[oldName];
    const updatedFiles = { ...currentProject.files };
    delete updatedFiles[oldName];
    updatedFiles[newName] = { ...file, name: newName };

    const updatedTabs = openTabs.map(t => (t === oldName ? newName : t));

    const updatedProj: IdeProject = {
      ...currentProject,
      files: updatedFiles,
      activeFileName: activeFileName === oldName ? newName : activeFileName,
      openTabs: updatedTabs,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProj);
    if (activeFileName === oldName) setActiveFileName(newName);
    setOpenTabs(updatedTabs);
    saveIdeProject(updatedProj);
  };

  const deleteFile = (filename: string) => {
    if (!currentProject || !currentProject.files[filename]) return;
    if (Object.keys(currentProject.files).length <= 1) {
      addToast('Cannot Delete', 'A project must have at least one file.', 'warning');
      return;
    }

    const updatedFiles = { ...currentProject.files };
    delete updatedFiles[filename];
    const updatedTabs = openTabs.filter(t => t !== filename);
    const newActive = activeFileName === filename ? updatedTabs[0] || Object.keys(updatedFiles)[0] : activeFileName;

    const updatedProj: IdeProject = {
      ...currentProject,
      files: updatedFiles,
      activeFileName: newActive,
      openTabs: updatedTabs,
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProj);
    setActiveFileName(newActive);
    setOpenTabs(updatedTabs);
    saveIdeProject(updatedProj);
    addToast('File Deleted', `Removed ${filename}`, 'info');
  };

  const resetToTemplate = () => {
    if (!currentProject || !currentProject.templateId) return;
    const template = PROJECT_TEMPLATES.find(t => t.id === currentProject.templateId);
    if (!template) return;

    const updatedProj: IdeProject = {
      ...currentProject,
      files: JSON.parse(JSON.stringify(template.files)),
      updatedAt: new Date().toISOString()
    };

    setCurrentProject(updatedProj);
    saveIdeProject(updatedProj);
    runProject();
    addToast('Reset Starter', 'Starter template files restored.', 'info');
  };

  const exportProjectZip = async () => {
    if (!currentProject) return;
    await backupService.exportProjectAsZip(currentProject);
    addToast('ZIP Exported', `Downloaded ${currentProject.name}.zip`, 'success');
  };

  const exportProjectJson = () => {
    if (!currentProject) return;
    backupService.exportProjectAsJson(currentProject);
    addToast('JSON Exported', `Downloaded ${currentProject.name}.stillskudy.json`, 'success');
  };

  const importProjectZip = async (file: File) => {
    try {
      const newProj = await backupService.importProjectFromZip(file);
      await saveIdeProject(newProj);
      setCurrentProject(newProj);
      setActiveFileName(newProj.activeFileName);
      setOpenTabs(newProj.openTabs);
      addToast('Project Imported', `Successfully imported "${newProj.name}" from ZIP!`, 'success');
    } catch (err: any) {
      addToast('Import Failed', err.message || 'Could not parse ZIP archive.', 'warning');
    }
  };

  return (
    <IDEContext.Provider
      value={{
        currentProject,
        activeFileName,
        openTabs,
        consoleLogs,
        isRunning,
        previewUrl,
        isSaving,
        hasUnsavedChanges,
        activeChallengeId,
        setActiveChallengeId,
        loadProject,
        createNewProjectFromTemplate,
        createNewBlankProject,
        setActiveFileName,
        openFileInTab,
        closeTab,
        updateFileContent,
        createFile,
        renameFile,
        deleteFile,
        runProject,
        stopProject,
        clearConsole,
        saveCurrentProject,
        resetToTemplate,
        exportProjectZip,
        exportProjectJson,
        importProjectZip
      }}
    >
      {children}
    </IDEContext.Provider>
  );
};

export const useIDE = () => {
  const context = useContext(IDEContext);
  if (!context) throw new Error('useIDE must be used within an IDEProvider');
  return context;
};
