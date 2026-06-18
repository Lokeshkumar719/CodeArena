import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import axiosClient from '../utils/axiosClient';

import SubmissionHistory from '../components/SubmissionHistory';
import Editorial from '../components/Editorial';

import LoadingScreen from '../components/problem/LoadingScreen';
import ProblemTabs from '../components/problem/ProblemTabs';
import ProblemDescription from '../components/problem/ProblemDescription';
import TestCasePanel from '../components/problem/TestCasePanel';
import ResultPanel from '../components/problem/ResultPanel';
import CodeEditorPanel from '../components/problem/CodeEditorPanel';
import useRateLimit from '../hooks/useRateLimit.jsx';

import './ProblemPage.css';

const LANG_STORAGE_KEY = (problemId) => `lang_${problemId}`;
const CODE_STORAGE_KEY = (problemId, lang) => `code_${problemId}_${lang}`;

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeMap, setCodeMap] = useState({});
  const [codeReady, setCodeReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const runRateLimit = useRateLimit();
  const submitRateLimit = useRateLimit();

  const editorRef = useRef(null);
  const splitLayoutRef = useRef(null);
  const { problemId } = useParams();
  const navigate = useNavigate();
  const isMac = navigator.platform.includes('Mac');

  // ── Restore saved language ───────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY(problemId));
    if (saved) setSelectedLanguage(saved);
  }, [problemId]);

  // ── Fetch problem + build codeMap ────────────────────────────────────────
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setCodeReady(false);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const problemData = response.data?.data;

        const map = {};
        problemData?.startCode?.forEach((sc) => {
          const initial = sc.initialCode ?? '';
          const saved = localStorage.getItem(CODE_STORAGE_KEY(problemId, sc.language));
          map[sc.language] = map[sc.language] = saved ?? initial;
        });

        setProblem(problemData);
        setCodeMap(map);
        setCodeReady(true);
      } catch (error) {
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // ── Drag resize ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging || !splitLayoutRef.current) return;
      const rect = splitLayoutRef.current.getBoundingClientRect();
      const next = ((e.clientX - rect.left) / rect.width) * 100;
      if (next >= 20 && next <= 80) setLeftWidth(next);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  // ── Monaco layout on panel resize ───────────────────────────────────────
  useEffect(() => {
    const id = requestAnimationFrame(() => editorRef.current?.layout?.());
    return () => cancelAnimationFrame(id);
  }, [leftWidth, activeRightTab]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const currentCode = codeMap[selectedLanguage] ?? '';

  const handleEditorChange = (value) => {
    const v = value ?? '';
    setCodeMap((prev) => ({ ...prev, [selectedLanguage]: v }));
    localStorage.setItem(CODE_STORAGE_KEY(problemId, selectedLanguage), v);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem(LANG_STORAGE_KEY(problemId), language);
  };

  const handleRun = useCallback(async () => {
    if (isRunning || isSubmitting || runRateLimit.cooldown > 0) return;
    setIsRunning(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: currentCode,
        language: selectedLanguage,
      });
      setRunResult(response.data.data);
      setActiveRightTab('testcase');
    } catch (error) {
      if (error.rateLimitedFor) {
        runRateLimit.startCooldown(error.rateLimitedFor);
        toast.error(error.response?.data?.message || 'Too many requests. Please slow down.');
        return;
      }
      toast.error(error.response?.data?.message || 'Run failed');
      setRunResult({
        success: false,
        error: error.response?.data?.message || 'Internal server error',
      });
      setActiveRightTab('testcase');
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, isSubmitting, runRateLimit.cooldown, problemId, currentCode, selectedLanguage]);

  const handleSubmitCode = useCallback(async () => {
    if (isRunning || isSubmitting || submitRateLimit.cooldown > 0) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: currentCode,
        language: selectedLanguage,
      });
      setSubmitResult(response.data.data);
      setActiveRightTab('result');
    } catch (error) {
      if (error.rateLimitedFor) {
        submitRateLimit.startCooldown(error.rateLimitedFor);
        toast.error(error.response?.data?.message || 'Too many requests. Please slow down.');
        return;
      }
      toast.error(error.response?.data?.message || 'Submission failed');
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setIsSubmitting(false);
    }
  }, [isRunning, isSubmitting, submitRateLimit.cooldown, problemId, currentCode, selectedLanguage]);

  const getLanguageForMonaco = (lang) =>
    ({ javascript: 'javascript', java: 'java', cpp: 'cpp' })[lang] ?? 'javascript';
  const getDifficultyBadge = (d) =>
    ({ easy: 'badge-easy', medium: 'badge-medium', hard: 'badge-hard' })[d] ?? 'badge-tag';

  const LANGS = [
    { key: 'javascript', label: 'JavaScript' },
    { key: 'java', label: 'Java' },
    { key: 'cpp', label: 'C++' },
  ];
  const LEFT_TABS = ['description', 'editorial', 'solutions', 'submissions'];
  const RIGHT_TABS = ['code', 'testcase', 'result'];

  const runBlocked = isRunning || isSubmitting || runRateLimit.cooldown > 0;
  const submitBlocked = isRunning || isSubmitting || submitRateLimit.cooldown > 0;

  useEffect(() => {
    const handleShortcut = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey;

      if (!modifierPressed) return;

      // Cmd/Ctrl + '
      if (e.key === "'") {
        e.preventDefault();
        handleRun();
        return;
      }

      // Cmd/Ctrl + Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitCode();
      }
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, [handleRun, handleSubmitCode]);

  useEffect(() => {
    const handleEditorSubmit = () => {
      handleSubmitCode();
    };

    window.addEventListener('codearena-submit', handleEditorSubmit);

    return () => {
      window.removeEventListener('codearena-submit', handleEditorSubmit);
    };
  }, [handleSubmitCode]);

  if (loading && !problem) return <LoadingScreen />;

  return (
    <div className="problem-page">
      {/* Top Bar */}
      <div className="top-bar">
        <button onClick={() => navigate('/')} className="top-bar-back-btn">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="top-title">CodeArena · Problem Solver</div>
        <div className="top-bar-spacer" />
      </div>

      <div className="split-layout" ref={splitLayoutRef}>
        {/* LEFT PANEL */}
        <div className="panel panel-left" style={{ width: `${leftWidth}%` }}>
          <ProblemTabs tabs={LEFT_TABS} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
          <div className="panel-content">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <ProblemDescription problem={problem} getDifficultyBadge={getDifficultyBadge} />
                )}
                {activeLeftTab === 'editorial' && (
                  <Editorial
                    secureUrl={problem.secureUrl}
                    thumbnailUrl={problem.thumbnailUrl}
                    duration={problem.duration}
                  />
                )}
                {activeLeftTab === 'solutions' && (
                  <div>
                    <p className="section-title">Solutions</p>
                    {problem.referenceSolution?.length > 0 ? (
                      problem.referenceSolution.map((sol, i) => (
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
                      ))
                    ) : (
                      <p className="desc-text">Solutions visible after solving the problem.</p>
                    )}
                  </div>
                )}
                {activeLeftTab === 'submissions' && (
                  <div>
                    <p className="section-title">My Submissions</p>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div
          className="divider"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* RIGHT PANEL */}
        <div
          className="panel panel-right"
          style={{
            width: `${100 - leftWidth}%`,
            display: 'flex',
            flexDirection: 'column',
            background: '#0d1117',
          }}
        >
          <ProblemTabs
            tabs={RIGHT_TABS}
            activeTab={activeRightTab}
            setActiveTab={setActiveRightTab}
          />

          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: '#0d1117',
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                display: activeRightTab === 'code' ? 'flex' : 'none',
                flexDirection: 'column',
                background: '#0d1117',
              }}
            >
              {codeReady ? (
                <CodeEditorPanel
                  key={selectedLanguage}
                  activeRightTab="code"
                  selectedLanguage={selectedLanguage}
                  handleLanguageChange={handleLanguageChange}
                  LANGS={LANGS}
                  getLanguageForMonaco={getLanguageForMonaco}
                  code={currentCode}
                  handleEditorChange={handleEditorChange}
                  handleEditorDidMount={handleEditorDidMount}
                />
              ) : (
                <div style={{ flex: 1, background: '#0d1117' }} />
              )}
            </div>

            {activeRightTab === 'testcase' && <TestCasePanel runResult={runResult} />}
            {activeRightTab === 'result' && <ResultPanel submitResult={submitResult} />}
          </div>

          {/* Action Bar */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #1e293b',
              background: '#0d1117',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredBtn('run')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <button className="run-btn" onClick={handleRun} disabled={runBlocked}>
                {isRunning
                  ? 'Running...'
                  : runRateLimit.cooldown > 0
                    ? `⏳ Run (${runRateLimit.cooldown}s)`
                    : '▶ Run'}
              </button>

              {hoveredBtn === 'run' && !runBlocked && (
                <div className="shortcut-tooltip">
                  <span>Run</span>

                  <div className="shortcut-keys">
                    <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
                    <kbd>'</kbd>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredBtn('submit')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <button className="submit-btn" onClick={handleSubmitCode} disabled={submitBlocked}>
                {isSubmitting
                  ? 'Submitting...'
                  : submitRateLimit.cooldown > 0
                    ? `⏳ Submit (${submitRateLimit.cooldown}s)`
                    : '↗ Submit'}
              </button>

              {hoveredBtn === 'submit' && !submitBlocked && (
                <div className="shortcut-tooltip">
                  <span>Submit</span>

                  <div className="shortcut-keys">
                    <kbd>{isMac? '⌘' : 'Ctrl'}</kbd>
                    <kbd>{isMac? 'Return' : 'Enter'}</kbd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
