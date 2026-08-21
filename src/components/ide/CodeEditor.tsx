import React, { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useIDE } from '../../context/IDEContext';
import { useData } from '../../context/DataContext';

export const CodeEditor: React.FC = () => {
  const { currentProject, activeFileName, updateFileContent } = useIDE();
  const { settings } = useData();

  const currentFile = currentProject?.files[activeFileName];

  const extensions = useMemo(() => {
    if (!currentFile) return [];
    const exts = [];

    if (currentFile.name.endsWith('.html')) exts.push(html());
    else if (currentFile.name.endsWith('.css')) exts.push(css());
    else if (currentFile.name.endsWith('.js')) exts.push(javascript({ jsx: true }));
    else if (currentFile.name.endsWith('.py')) exts.push(python());
    else if (currentFile.name.endsWith('.json')) exts.push(javascript());

    return exts;
  }, [currentFile?.name]);

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
        Select a file from the explorer to begin editing.
      </div>
    );
  }

  const fontSize = settings?.editor?.fontSize || 14;

  return (
    <div className="h-full w-full bg-slate-950 overflow-hidden flex flex-col font-mono text-sm">
      <CodeMirror
        value={currentFile.content}
        height="100%"
        theme={oneDark}
        extensions={extensions}
        onChange={value => updateFileContent(currentFile.name, value)}
        basicSetup={{
          lineNumbers: settings?.editor?.lineNumbers ?? true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true
        }}
        style={{
          fontSize: `${fontSize}px`,
          height: '100%'
        }}
        className="h-full flex-1 overflow-auto"
      />
    </div>
  );
};
