import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import axiosClient from "../utils/axiosClient";

import SubmissionHistory from "../components/SubmissionHistory";
import Editorial from "../components/Editorial";

import LoadingScreen from "../components/problem/LoadingScreen";
import ProblemTabs from "../components/problem/ProblemTabs";
import ProblemDescription from "../components/problem/ProblemDescription";
import TestCasePanel from "../components/problem/TestCasePanel";
import ResultPanel from "../components/problem/ResultPanel";
import CodeEditorPanel from "../components/problem/CodeEditorPanel";
import useRateLimit from "../hooks/useRateLimit.jsx";

import "./ProblemPage.css";

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const runRateLimit = useRateLimit();
  const submitRateLimit = useRateLimit();

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [codeMap, setCodeMap] = useState({});
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
        const problemData = response.data?.data;

        const initialCodeMap = {};
        problemData?.startCode?.forEach((sc) => {
          initialCodeMap[sc.language] = sc.initialCode || "";
        });

        setProblem(problemData);
        setCodeMap(initialCodeMap);
      } catch (error) {
        toast.error("Failed to load problem");
      } finally {
        setLoading(false);
      }
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
    const id = requestAnimationFrame(() => {
      if (editorRef.current && typeof editorRef.current.layout === "function") {
        editorRef.current.layout();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [leftWidth, activeRightTab]);

  const currentCode = codeMap[selectedLanguage] || "";

  const handleEditorChange = (value) => {
    setCodeMap((prev) => ({ ...prev, [selectedLanguage]: value || "" }));
  };

  const handleEditorDidMount = (editor) => { editorRef.current = editor; };
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: currentCode,
        language: selectedLanguage,
      });
      setRunResult(response.data.data);
      setActiveRightTab("testcase");
    } catch (error) {
      if (error.rateLimitedFor) {
        runRateLimit.startCooldown(error.rateLimitedFor);
        toast.error(error.response?.data?.message || "Too many requests. Please slow down.");
        return;
      }
      toast.error(error.response?.data?.message || "Run failed");
      setRunResult({
        success: false,
        error: error.response?.data?.message || "Internal server error",
      });
      setActiveRightTab("testcase");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: currentCode,
        language: selectedLanguage,
      });
      setSubmitResult(response.data.data);
      setActiveRightTab("result");
    } catch (error) {
      if (error.rateLimitedFor) {
        submitRateLimit.startCooldown(error.rateLimitedFor);
        toast.error(error.response?.data?.message || "Too many requests. Please slow down.");
        return;
      }
      toast.error(error.response?.data?.message || "Submission failed");
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

  const runBlocked = isRunning || isSubmitting || runRateLimit.cooldown > 0;
  const submitBlocked = isRunning || isSubmitting || submitRateLimit.cooldown > 0;

  return (
    <div className="problem-page">
      <div className="top-bar">
        <div className="top-title">CodeArena · Problem Solver</div>
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
          style={{ width: `${100 - leftWidth}%`, display: "flex", flexDirection: "column" }}
        >
          <ProblemTabs
            tabs={RIGHT_TABS}
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
          />

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Always mounted — hides via display:none + flex:0 to release space */}
            <CodeEditorPanel
              activeRightTab={activeRightTab}
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
              LANGS={LANGS}
              getLanguageForMonaco={getLanguageForMonaco}
              code={currentCode}
              handleEditorChange={handleEditorChange}
              handleEditorDidMount={handleEditorDidMount}
            />

            {/* Claims the full flex:1 space when editor is hidden */}
            {activeRightTab === "testcase" && (
              <div style={{ flex: 1, overflow: "auto" }}>
                <TestCasePanel runResult={runResult} />
              </div>
            )}

            {activeRightTab === "result" && (
              <div style={{ flex: 1, overflow: "auto" }}>
                <ResultPanel submitResult={submitResult} />
              </div>
            )}

          </div>

          {/* Action Bar */}
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
            <button className="run-btn" onClick={handleRun} disabled={runBlocked}>
              {isRunning
                ? "Running..."
                : runRateLimit.cooldown > 0
                ? `⏳ Run (${runRateLimit.cooldown}s)`
                : "▶ Run"}
            </button>
            <button className="submit-btn" onClick={handleSubmitCode} disabled={submitBlocked}>
              {isSubmitting
                ? "Submitting..."
                : submitRateLimit.cooldown > 0
                ? `⏳ Submit (${submitRateLimit.cooldown}s)`
                : "↗ Submit"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;