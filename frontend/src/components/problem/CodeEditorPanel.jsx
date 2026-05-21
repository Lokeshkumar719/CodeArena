import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";

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
  return (
    <div
      style={{
        display: activeRightTab === "code" ? "flex" : "none",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        background: "#0d1117",
      }}
    >
      <LanguageSelector
        LANGS={LANGS}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
      />

      <div className="editor-wrap" style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          language={getLanguageForMonaco(selectedLanguage)}
          value={code}
          onChange={handleEditorChange}
          onMount={(editor, monaco) => {
            handleEditorDidMount(editor, monaco);
            monaco.editor.defineTheme("custom-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [],
              colors: {
                "editor.background": "#0d1117",
                "editor.lineHighlightBackground": "#161b22",
              },
            });
            monaco.editor.setTheme("custom-dark");
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
            });
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
            });
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            roundedSelection: false,
            cursorStyle: "line",
            mouseWheelZoom: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;