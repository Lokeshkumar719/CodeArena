function TestCasePanel({ runResult }) {
  const getVerdictMessage = (status) => {
    switch (status) {
      case 'accepted':
        return '✓ All test cases passed';

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
        return '✗ Execution Failed';
    }
  };

  return (
    <div className="result-panel">
      <p className="section-title" style={{ fontSize: '14px' }}>
        Test Results
      </p>

      {runResult ? (
        <div className={`result-card ${runResult.accepted ? 'result-success' : 'result-error'}`}>
          <p className="result-heading">{getVerdictMessage(runResult.status)}</p>

          {runResult.error && (
            <p
              className="result-meta"
              style={{
                color: '#ff7b72',
                marginTop: '8px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {runResult.error}
            </p>
          )}

          <p className="result-meta">Runtime: {runResult.runtime} sec</p>

          <p className="result-meta">Memory: {runResult.memory} KB</p>

          <div style={{ marginTop: '12px' }}>
            {runResult.testCases?.map((tc, i) => (
              <div key={i} className="tc-card">
                <div className="tc-row">
                  <span className="tc-key">Input:</span>

                  <span style={{ whiteSpace: 'pre-wrap' }}>{tc.stdin}</span>
                </div>

                <div className="tc-row">
                  <span className="tc-key">Expected:</span>

                  <span style={{ whiteSpace: 'pre-wrap' }}>{tc.expected_output}</span>
                </div>

                <div className="tc-row">
                  <span className="tc-key">Output:</span>

                  <span style={{ whiteSpace: 'pre-wrap' }}>{tc.stdout || 'No Output'}</span>
                </div>

                <div className={tc.status?.id === 3 ? 'tc-pass' : 'tc-fail'}>
                  {tc.status?.id === 3
                    ? '✓ Passed'
                    : `✗ ${tc.errorMessage || tc.status?.description || 'Failed'}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="result-empty">Click "Run" to test your code with the example test cases.</p>
      )}
    </div>
  );
}

export default TestCasePanel;
