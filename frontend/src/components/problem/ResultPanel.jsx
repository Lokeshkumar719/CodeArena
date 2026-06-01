function ResultPanel({ submitResult }) {
  const getVerdictMessage = (status) => {
    switch (status) {
      case 'accepted':
        return '🎉 Accepted';

      case 'wrong_answer':
        return '✗ Wrong Answer';

      case 'compile_error':
        return '⚠ Compile Error';

      case 'runtime_error':
        return '⚠ Runtime Error';

      case 'time_limit_exceeded':
        return '⏳ Time Limit Exceeded';

      case 'memory_limit_exceeded':
        return '🧠 Memory Limit Exceeded';

      case 'output_limit_exceeded':
        return '📄 Output Limit Exceeded';

      default:
        return '✗ Submission Failed';
    }
  };

  return (
    <div className="result-panel">
      <p className="section-title" style={{ fontSize: '14px' }}>
        Submission Result
      </p>

      {submitResult ? (
        <div className={`result-card ${submitResult.accepted ? 'result-success' : 'result-error'}`}>
          <p className="result-heading">{getVerdictMessage(submitResult.status)}</p>

          {submitResult.error && (
            <p
              className="result-meta"
              style={{
                color: '#ff7b72',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {submitResult.error}
            </p>
          )}

          <p className="result-meta">
            Test Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases}
          </p>

          <p className="result-meta">Runtime: {submitResult.runtime} sec</p>

          <p className="result-meta">Memory: {submitResult.memory} KB</p>
        </div>
      ) : (
        <p className="result-empty">Click "Submit" to submit your solution for evaluation.</p>
      )}
    </div>
  );
}

export default ResultPanel;
