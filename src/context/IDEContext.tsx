import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { IdeProject, IdeFile, ProjectTemplate, SupportedLanguage } from '../types';
import { PROJECT_TEMPLATES } from '../data/projectTemplates';
import { useData } from './DataContext';
import { useApp } from './AppContext';
import { backupService } from '../services/backupService';
import { codeRunnerService } from '../services/codeRunnerService';

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

interface IDEContextType {
  currentProject: IdeProject | null;
  activeFileName: string;
  openTabs: string[];
  consoleLogs: ConsoleLogMessage[];
  previewUrl: string;
  isRunning: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  activeChallengeId: string | null;

  // Actions
  setActiveFileName: (name: string) => void;
  openFileInTab: (name: string) => void;
  closeTab: (name: string) => void;
  updateFileContent: (name: string, content: string) => void;
  createFile: (name: string, language?: SupportedLanguage) => void;
  deleteFile: (name: string) => void;
  renameFile: (oldName: string, newName: string) => void;

  // Project Level Actions
  createNewBlankProject: (name?: string) => Promise<void>;
  createFromTemplate: (templateId: string, projectName?: string) => Promise<void>;
  loadProject: (projectId: string) => void;
  saveCurrentProject: () => Promise<void>;
  resetToTemplate: () => void;
  exportProjectZip: () => Promise<void>;
  exportProjectJson: () => void;
  importProjectZip: (file: File) => Promise<void>;

  // Sandbox Runner
  runProject: () => void;
  stopProject: () => void;
  clearConsole: () => void;
}

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export const IDEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ideProjects, saveIdeProject, deleteIdeProject, markChallengeComplete } = useData();
  const { addToast } = useApp();

  const [currentProject, setCurrentProject] = useState<IdeProject | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('index.html');
  const [openTabs, setOpenTabs] = useState<string[]>(['index.html', 'style.css', 'script.js']);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogMessage[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with the most recent project or default template
  useEffect(() => {
    if (ideProjects.length > 0 && !currentProject) {
      const proj = ideProjects[0];
      setCurrentProject(proj);
      setActiveFileName(proj.activeFileName || Object.keys(proj.files)[0] || 'index.html');
      setOpenTabs(proj.openTabs || Object.keys(proj.files));
    }
  }, [ideProjects, currentProject]);

  // Listen for external open-ide trigger from lessons
  useEffect(() => {
    const handleOpenIdeEvent = async (e: any) => {
      if (e.detail) {
        const { title, starterFiles, challengeId } = e.detail;
        const files: Record<string, IdeFile> = starterFiles || {};
        const fileKeys = Object.keys(files);

        const newProj: IdeProject = {
          id: `proj-${Date.now()}`,
          name: title || 'Lesson Starter Code',
          description: `Created for ${title}`,
          files,
          activeFileName: fileKeys[0] || 'index.html',
          openTabs: fileKeys.length > 0 ? fileKeys : ['index.html'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await saveIdeProject(newProj);
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
            } catch(e) {}
          }
          var _origLog = console.log;
          var _origWarn = console.warn;
          var _origError = console.error;
          var _origInfo = console.info;

          console.log = function() { sendLog("log", arguments); _origLog.apply(console, arguments); };
          console.warn = function() { sendLog("warn", arguments); _origWarn.apply(console, arguments); };
          console.error = function() { sendLog("error", arguments); _origError.apply(console, arguments); };
          console.info = function() { sendLog("info", arguments); _origInfo.apply(console, arguments); };

          window.onerror = function(msg, url, line) {
            sendLog("error", ["Uncaught Error: " + msg + " (Line " + line + ")"]);
          };
        })();
      </script>
    `;

    let doc = htmlFile;
    if (doc.includes('<head>')) {
      doc = doc.replace('<head>', `<head>\n${loggerBridge}\n${cssFiles}`);
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

  const runProject = useCallback(async () => {
    setIsRunning(true);
    setConsoleLogs([]);

    const activeFile = currentProject?.files[activeFileName];
    const isMultiLang = activeFileName.endsWith('.py') || activeFileName.endsWith('.cpp') || activeFileName.endsWith('.java');

    if (isMultiLang && activeFile) {
      const ext = activeFileName.split('.').pop() || 'js';
      const result = await codeRunnerService.executeCode(ext, activeFile.content);

      if (result.stdout) {
        setConsoleLogs(prev => [
          ...prev,
          {
            id: `log-${Date.now()}`,
            type: 'log',
            message: result.stdout,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
      if (result.stderr) {
        setConsoleLogs(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: 'error',
            message: result.stderr,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      }
      setConsoleLogs(prev => [
        ...prev,
        {
          id: `info-${Date.now()}`,
          type: 'info',
          message: `Execution completed in ${result.executionTimeMs}ms (Exit code 0)`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } else {
      // HTML/CSS/JS Sandbox
      const doc = generatePreviewDoc();
      const blob = new Blob([doc], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }

    // If there is an active challenge, mark complete
    if (activeChallengeId) {
      markChallengeComplete(activeChallengeId, currentProject?.files['script.js']?.content || '');
    }
  }, [generatePreviewDoc, activeChallengeId, markChallengeComplete, currentProject, activeFileName]);

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

  // Debounced Autosave (1.5 seconds)
  const scheduleAutosave = useCallback(() => {
    setHasUnsavedChanges(true);
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      saveCurrentProject();
    }, 1500);
  }, [currentProject, activeFileName, openTabs]);

  const updateFileContent = (name: string, content: string) => {
    if (!currentProject) return;
    const file = currentProject.files[name];
    if (!file) return;

    setCurrentProject({
      ...currentProject,
      files: {
        ...currentProject.files,
        [name]: {
          ...file,
          content
        }
      }
    });

    scheduleAutosave();
  };

  const openFileInTab = (name: string) => {
    if (!openTabs.includes(name)) {
      setOpenTabs(prev => [...prev, name]);
    }
    setActiveFileName(name);
  };

  const closeTab = (name: string) => {
    const nextTabs = openTabs.filter(t => t !== name);
    setOpenTabs(nextTabs);
    if (activeFileName === name && nextTabs.length > 0) {
      setActiveFileName(nextTabs[nextTabs.length - 1]);
    }
  };

  const detectLanguageFromName = (name: string): SupportedLanguage => {
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.py')) return 'python';
    if (name.endsWith('.cpp') || name.endsWith('.cc')) return 'cpp';
    if (name.endsWith('.java')) return 'java';
    if (name.endsWith('.json')) return 'json';
    return 'text';
  };

  const createFile = (name: string, language?: SupportedLanguage) => {
    if (!currentProject || !name.trim()) return;
    const cleanName = name.trim();
    if (currentProject.files[cleanName]) {
      addToast('File already exists', `A file named "${cleanName}" already exists.`, 'warning');
      return;
    }

    const lang = language || detectLanguageFromName(cleanName);
    let defaultContent = '';
    if (lang === 'html') defaultContent = '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
    if (lang === 'css') defaultContent = '/* Stylesheet */\nbody {\n  margin: 0;\n  padding: 1rem;\n}';
    if (lang === 'javascript') defaultContent = '// JavaScript\nconsole.log("Ready!");';
    if (lang === 'python') defaultContent = '# Python Script\nprint("Hello from Skudium Python Sandbox!")\n\nfor i in range(1, 4):\n    print(f"Step {i}: Complete")';
    if (lang === 'cpp') defaultContent = '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++ Sandbox!" << std::endl;\n    return 0;\n}';
    if (lang === 'java') defaultContent = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java Sandbox!");\n    }\n}';

    const newFiles = {
      ...currentProject.files,
      [cleanName]: {
        name: cleanName,
        language: lang,
        content: defaultContent
      }
    };

    const updated = {
      ...currentProject,
      files: newFiles
    };

    setCurrentProject(updated);
    openFileInTab(cleanName);
    scheduleAutosave();
    addToast('File Created', `Added "${cleanName}" to project.`, 'success');
  };

  const deleteFile = (name: string) => {
    if (!currentProject) return;
    if (Object.keys(currentProject.files).length <= 1) {
      addToast('Cannot Delete', 'Project must retain at least one file.', 'warning');
      return;
    }

    const { [name]: removed, ...remainingFiles } = currentProject.files;
    const remainingNames = Object.keys(remainingFiles);

    setCurrentProject({
      ...currentProject,
      files: remainingFiles
    });

    closeTab(name);
    if (activeFileName === name) {
      setActiveFileName(remainingNames[0]);
    }

    scheduleAutosave();
    addToast('File Deleted', `Removed "${name}".`, 'info');
  };

  const renameFile = (oldName: string, newName: string) => {
    if (!currentProject || !newName.trim() || oldName === newName) return;
    const cleanNew = newName.trim();
    if (currentProject.files[cleanNew]) {
      addToast('Name in use', `A file named "${cleanNew}" already exists.`, 'warning');
      return;
    }

    const targetFile = currentProject.files[oldName];
    const { [oldName]: removed, ...rest } = currentProject.files;

    const lang = detectLanguageFromName(cleanNew);
    const updatedFiles = {
      ...rest,
      [cleanNew]: {
        ...targetFile,
        name: cleanNew,
        language: lang
      }
    };

    const updatedTabs = openTabs.map(t => (t === oldName ? cleanNew : t));

    setCurrentProject({
      ...currentProject,
      files: updatedFiles,
      openTabs: updatedTabs
    });

    setOpenTabs(updatedTabs);
    if (activeFileName === oldName) {
      setActiveFileName(cleanNew);
    }

    scheduleAutosave();
  };

  const createNewBlankProject = async (name: string = 'Untitled Project') => {
    const newProj: IdeProject = {
      id: `proj-${Date.now()}`,
      name,
      description: 'Custom blank project',
      files: {
        'index.html': {
          name: 'index.html',
          language: 'html',
          content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Document</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Welcome to Skudium</h1>\n  <p>Start coding offline!</p>\n  <script src="script.js"></script>\n</body>\n</html>'
        },
        'style.css': {
          name: 'style.css',
          language: 'css',
          content: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: #f8fafc;\n}'
        },
        'script.js': {
          name: 'script.js',
          language: 'javascript',
          content: 'console.log("Skudium sandbox ready!");'
        }
      },
      activeFileName: 'index.html',
      openTabs: ['index.html', 'style.css', 'script.js'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveIdeProject(newProj);
    setCurrentProject(newProj);
    setActiveFileName('index.html');
    setOpenTabs(['index.html', 'style.css', 'script.js']);
    addToast('New Project', `Created "${name}".`, 'success');
  };

  const createFromTemplate = async (templateId: string, projectName?: string) => {
    const tmpl = PROJECT_TEMPLATES.find(t => t.id === templateId) || PROJECT_TEMPLATES[0];
    const name = projectName || tmpl.name;

    const newProj: IdeProject = {
      id: `proj-${Date.now()}`,
      name,
      description: tmpl.description,
      templateId: tmpl.id,
      files: JSON.parse(JSON.stringify(tmpl.files)),
      activeFileName: Object.keys(tmpl.files)[0] || 'index.html',
      openTabs: Object.keys(tmpl.files),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveIdeProject(newProj);
    setCurrentProject(newProj);
    setActiveFileName(newProj.activeFileName);
    setOpenTabs(newProj.openTabs);
    addToast('Template Loaded', `Created project from "${tmpl.name}".`, 'success');
  };

  const loadProject = (projectId: string) => {
    const found = ideProjects.find(p => p.id === projectId);
    if (!found) return;
    setCurrentProject(found);
    setActiveFileName(found.activeFileName || Object.keys(found.files)[0] || 'index.html');
    setOpenTabs(found.openTabs || Object.keys(found.files));
    stopProject();
    setConsoleLogs([]);
  };

  const resetToTemplate = () => {
    if (!currentProject || !currentProject.templateId) return;
    const tmpl = PROJECT_TEMPLATES.find(t => t.id === currentProject.templateId);
    if (!tmpl) return;

    setCurrentProject({
      ...currentProject,
      files: JSON.parse(JSON.stringify(tmpl.files))
    });
    scheduleAutosave();
    addToast('Project Reset', 'Reset files to initial template state.', 'info');
  };

  const exportProjectZip = async () => {
    if (!currentProject) return;
    await backupService.exportProjectAsZip(currentProject);
    addToast('Export Complete', `Downloaded ${currentProject.name}.zip`, 'success');
  };

  const exportProjectJson = () => {
    if (!currentProject) return;
    backupService.exportProjectAsJson(currentProject);
    addToast('Export Complete', `Downloaded ${currentProject.name}.json`, 'success');
  };

  const importProjectZip = async (file: File) => {
    try {
      const project = await backupService.importProjectFromZip(file);
      await saveIdeProject(project);
      setCurrentProject(project);
      setActiveFileName(project.activeFileName || Object.keys(project.files)[0]);
      setOpenTabs(project.openTabs || Object.keys(project.files));
      addToast('Project Imported', `Imported "${project.name}".`, 'success');
    } catch (err: any) {
      addToast('Import Failed', err.message || 'Could not import ZIP', 'warning');
    }
  };

  return (
    <IDEContext.Provider
      value={{
        currentProject,
        activeFileName,
        openTabs,
        consoleLogs,
        previewUrl,
        isRunning,
        isSaving,
        hasUnsavedChanges,
        activeChallengeId,
        setActiveFileName,
        openFileInTab,
        closeTab,
        updateFileContent,
        createFile,
        deleteFile,
        renameFile,
        createNewBlankProject,
        createFromTemplate,
        loadProject,
        saveCurrentProject,
        resetToTemplate,
        exportProjectZip,
        exportProjectJson,
        importProjectZip,
        runProject,
        stopProject,
        clearConsole
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
