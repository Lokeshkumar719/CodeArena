function TestCasePanel({ runResult }) {
  return (
    <div className="result-panel">
      <p className="section-title" style={{ fontSize: "14px" }}>
        Test Results
      </p>

      {runResult ? (
        <div
          className={`result-card ${
            runResult.accepted ? "result-success" : "result-error"
          }`}
        >
          <p className="result-heading">
            {runResult.accepted
              ? "✓ All test cases passed"
              : "✗ Some test cases failed"}
          </p>

          {runResult.accepted && (
            <>
              <p className="result-meta">Runtime: {runResult.runtime} sec</p>

              <p className="result-meta">Memory: {runResult.memory} KB</p>
            </>
          )}

          <div style={{ marginTop: "12px" }}>
            {runResult.testCases?.map((tc, i) => (
              <div key={i} className="tc-card">
                <div className="tc-row">
                  <span className="tc-key">Input:</span>

                  <span>{tc.stdin}</span>
                </div>

                <div className="tc-row">
                  <span className="tc-key">Expected:</span>

                  <span>{tc.expected_output}</span>
                </div>

                <div className="tc-row">
                  <span className="tc-key">Output:</span>

                  <span>{tc.stdout}</span>
                </div>

                <div className={tc.status_id === 3 ? "tc-pass" : "tc-fail"}>
                  {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="result-empty">
          Click "Run" to test your code with the example test cases.
        </p>
      )}
    </div>
  );
}

export default TestCasePanel;
