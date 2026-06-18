import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';

const CodeEditorPanel = ({
  activeRightTab,
  selectedLanguage,
  handleLanguageChange,
  LANGS,
  getLanguageForMonaco,
  code,
  handleEditorChange,
  handleEditorDidMount,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const setupEditorShortcuts = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      editor.trigger('keyboard', 'undo', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ, () => {
      editor.trigger('keyboard', 'redo', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      editor.trigger('keyboard', 'redo', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      editor.trigger('keyboard', 'editor.action.clipboardCopyAction', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        editor.trigger('keyboard', 'editor.action.clipboardCutAction', null);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, async () => {
      try {
        const text = await navigator.clipboard.readText();
        const selection = editor.getSelection();
        editor.executeEdits('', [{ range: selection, text, forceMoveMarkers: true }]);
      } catch {
        editor.trigger('keyboard', 'editor.action.clipboardPasteAction', null);
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, () => {
      editor.trigger('keyboard', 'editor.action.selectAll', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.trigger('keyboard', 'editor.action.commentLine', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      window.dispatchEvent(new CustomEvent('codearena-submit'));
    });
  };

  const onMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // safety: set theme again on mount
    monaco.editor.setTheme('codearena-dark');

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true,
    });

    setupEditorShortcuts(editor, monaco);

    if (typeof handleEditorDidMount === 'function') {
      handleEditorDidMount(editor, monaco);
    }

    editor.focus();
  };

  return (
    <div
      style={{
        display: activeRightTab === 'code' ? 'flex' : 'none',
        flexDirection: 'column',
        flex: activeRightTab === 'code' ? 1 : 0, // releases space when hidden
        overflow: 'hidden',
        background: '#0d1117',
      }}
    >
      <LanguageSelector
        LANGS={LANGS}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
      />

      <div className="editor-wrap" style={{ flex: 1, overflow: 'hidden', background: '#0d1117' }}>
        <Editor
          height="100%"
          language={getLanguageForMonaco(selectedLanguage)}
          value={code}
          theme="codearena-dark"
          beforeMount={(monaco) => {
            // Define theme BEFORE first render — no white flash
            monaco.editor.defineTheme('codearena-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#0d1117',
                'editor.lineHighlightBackground': '#161b22',
                'editorCursor.foreground': '#ffffff',
              },
            });
          }}
          onChange={(value) => {
            if (typeof handleEditorChange === 'function') {
              handleEditorChange(value);
            }
          }}
          onMount={onMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",

            minimap: { enabled: false },

            scrollBeyondLastLine: false,
            automaticLayout: true,

            tabSize: 2,
            insertSpaces: true,

            wordWrap: 'off',

            lineNumbers: 'on',
            lineNumbersMinChars: 3,

            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,

            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'explicit',
            cursorBlinking: 'smooth',
            cursorStyle: 'line',
            cursorWidth: 2,

            renderWhitespace: 'selection',
            renderLineHighlight: 'line',

            mouseWheelZoom: true,
            contextmenu: true,

            padding: { top: 12, bottom: 12 },

            bracketPairColorization: { enabled: true },

            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordBasedSuggestions: 'off',
            parameterHints: { enabled: false },
            hover: { enabled: false },
            inlineSuggest: { enabled: false },
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            suggest: { preview: false, showWords: false },

            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              horizontal: 'auto',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
