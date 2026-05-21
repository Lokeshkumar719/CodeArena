import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";

import SubmissionHistory from "../components/SubmissionHistory";
import Editorial from "../components/Editorial";

import LoadingScreen from "../components/problem/LoadingScreen";
import ProblemTabs from "../components/problem/ProblemTabs";
import ProblemDescription from "../components/problem/ProblemDescription";
import TestCasePanel from "../components/problem/TestCasePanel";
import ResultPanel from "../components/problem/ResultPanel";
import CodeEditorPanel from "../components/problem/CodeEditorPanel";

import "./ProblemPage.css";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const editorRef = useRef(null);
  const splitLayoutRef = useRef(null);
  const { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode =
          response.data.startCode.find((sc) => sc.language === selectedLanguage)?.initialCode || "";
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
      setLoading(false);
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      if (!splitLayoutRef.current) return;
      const rect = splitLayoutRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find((sc) => sc.language === selectedLanguage)?.initialCode || "";
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (editorRef.current && typeof editorRef.current.layout === "function") {
        editorRef.current.layout();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [leftWidth, activeRightTab]);

  const handleEditorChange = (value) => setCode(value || "");
  const handleEditorDidMount = (editor) => { editorRef.current = editor; };
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(response.data);
      setActiveRightTab("testcase");
    } catch (error) {
      setRunResult({ success: false, error: "Internal server error" });
      setActiveRightTab("testcase");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(response.data);
      setActiveRightTab("result");
    } catch (error) {
      setSubmitResult(null);
      setActiveRightTab("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript": return "javascript";
      case "java": return "java";
      case "cpp": return "cpp";
      default: return "javascript";
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty === "easy") return "badge-easy";
    if (difficulty === "medium") return "badge-medium";
    if (difficulty === "hard") return "badge-hard";
    return "badge-tag";
  };

  const LANGS = [
    { key: "javascript", label: "JavaScript" },
    { key: "java", label: "Java" },
    { key: "cpp", label: "C++" },
  ];

  const LEFT_TABS = ["description", "editorial", "solutions", "submissions"];
  const RIGHT_TABS = ["code", "testcase", "result"];

  if (loading && !problem) return <LoadingScreen />;

  const startDragging = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className="problem-page">
      <div className="top-bar">
        <div className="top-title">LeetLab · Problem Solver</div>
      </div>

      <div className="split-layout" ref={splitLayoutRef}>
        {/* LEFT PANEL */}
        <div className="panel panel-left" style={{ width: `${leftWidth}%` }}>
          <ProblemTabs
            tabs={LEFT_TABS}
            activeTab={activeLeftTab}
            setActiveTab={setActiveLeftTab}
          />
          <div className="panel-content">
            {problem && (
              <>
                {activeLeftTab === "description" && (
                  <ProblemDescription
                    problem={problem}
                    getDifficultyBadge={getDifficultyBadge}
                  />
                )}
                {activeLeftTab === "editorial" && (
                  <Editorial
                    secureUrl={problem.secureUrl}
                    thumbnailUrl={problem.thumbnailUrl}
                    duration={problem.duration}
                  />
                )}
                {activeLeftTab === "solutions" && (
                  <div>
                    <p className="section-title">Solutions</p>
                    {problem.referenceSolution?.length > 0 ? (
                      problem.referenceSolution.map((sol, i) => (
                        <div key={i} className="solution-card">
                          <div className="solution-header">
                            {problem.title} — {sol.language}
                          </div>
                          <div className="solution-body">
                            <pre><code>{sol.completeCode}</code></pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="desc-text">Solutions visible after solving the problem.</p>
                    )}
                  </div>
                )}
                {activeLeftTab === "submissions" && (
                  <div>
                    <p className="section-title">My Submissions</p>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* DRAGGABLE DIVIDER */}
        <div
          className="divider"
          onMouseDown={startDragging}
          onMouseDownCapture={startDragging}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* RIGHT PANEL */}
        <div
          className="panel panel-right"
          style={{
            width: `${100 - leftWidth}%`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tab Bar */}
          <ProblemTabs
            tabs={RIGHT_TABS}
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
          />

          {/* Tab Content */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Editor — display:none se space nahi lega, state preserve rahegi */}
            <CodeEditorPanel
              activeRightTab={activeRightTab}
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
              LANGS={LANGS}
              getLanguageForMonaco={getLanguageForMonaco}
              code={code}
              handleEditorChange={handleEditorChange}
              handleEditorDidMount={handleEditorDidMount}
            />

            {activeRightTab === "testcase" && (
              <TestCasePanel runResult={runResult} />
            )}

            {activeRightTab === "result" && (
              <ResultPanel submitResult={submitResult} />
            )}
          </div>

          {/* Action Bar — hamesha neeche fixed */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #1e293b",
              background: "#0d1117",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <button
              className="run-btn"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "▶ Run"}
            </button>
            <button
              className="submit-btn"
              onClick={handleSubmitCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "↗ Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;