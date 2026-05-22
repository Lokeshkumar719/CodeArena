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

  const editorRef = useRef(null);

  const { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);

      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`,
        );

        const problemData = response.data?.data;

        const initialCode =
          problemData?.startCode?.find((sc) => sc.language === selectedLanguage)
            ?.initialCode || "";

        setProblem(problemData);
        setCode(initialCode);
      } catch (error) {
        toast.error("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find((sc) => sc.language === selectedLanguage)
          ?.initialCode || "";

      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data.data);
      setActiveRightTab("testcase");
    } catch (error) {
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
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language: selectedLanguage,
        },
      );

      setSubmitResult(response.data.data);
      setActiveRightTab("result");
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");

      setSubmitResult(null);
      setActiveRightTab("result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";

      case "java":
        return "java";

      case "cpp":
        return "cpp";

      default:
        return "javascript";
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty === "easy") return "badge-easy";

    if (difficulty === "medium") return "badge-medium";

    if (difficulty === "hard") return "badge-hard";

    return "badge-tag";
  };

  const LANGS = [
    {
      key: "javascript",
      label: "JavaScript",
    },
    {
      key: "java",
      label: "Java",
    },
    {
      key: "cpp",
      label: "C++",
    },
  ];

  const LEFT_TABS = ["description", "editorial", "solutions", "submissions"];

  const RIGHT_TABS = ["code", "testcase", "result"];

  if (loading && !problem) {
    return <LoadingScreen />;
  }

  return (
    <div className="problem-page">
      <div className="top-bar">
        <div className="top-title">CodeArena · Problem Solver</div>
      </div>

      <div className="split-layout">
        {/* LEFT PANEL */}
        <div className="panel panel-left">
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

                    {problem.referenceSolution?.map((sol, i) => (
                      <div key={i} className="solution-card">
                        <div className="solution-header">
                          {problem.title} — {sol.language}
                        </div>

                        <div className="solution-body">
                          <pre>
                            <code>{sol.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
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

        {/* RIGHT PANEL */}
        <div className="panel panel-right">
          <ProblemTabs
            tabs={RIGHT_TABS}
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
          />

          <CodeEditorPanel
            activeRightTab={activeRightTab}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
            LANGS={LANGS}
            getLanguageForMonaco={getLanguageForMonaco}
            code={code}
            handleEditorChange={handleEditorChange}
            handleEditorDidMount={handleEditorDidMount}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            handleRun={handleRun}
            handleSubmitCode={handleSubmitCode}
          />

          {activeRightTab === "testcase" && (
            <TestCasePanel runResult={runResult} />
          )}

          {activeRightTab === "result" && (
            <ResultPanel submitResult={submitResult} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
