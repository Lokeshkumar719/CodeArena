import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ActionBar from "./ActionBar";

const CodeEditorPanel = ({
  activeRightTab,
  selectedLanguage,
  handleLanguageChange,
  LANGS,
  getLanguageForMonaco,
  code,
  handleEditorChange,
  handleEditorDidMount,
  isRunning,
  isSubmitting,
  handleRun,
  handleSubmitCode,
}) => {
  if (activeRightTab !== "code") {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <LanguageSelector
        LANGS={LANGS}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
      />

      <div className="editor-wrap">
        <Editor
          height="100%"
          language={getLanguageForMonaco(selectedLanguage)}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
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

      <div className="action-bar justify-end">
        <ActionBar
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          handleRun={handleRun}
          handleSubmitCode={handleSubmitCode}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
