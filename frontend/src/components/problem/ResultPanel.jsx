function ResultPanel({
  submitResult
}){
  return (
    <div className="result-panel">
      <p
        className="section-title"
        style={{fontSize:'14px'}}
      >
        Submission Result
      </p>

      {submitResult ? (
        <div
          className={`result-card ${
            submitResult.accepted
              ? 'result-success'
              : 'result-error'
          }`}
        >
          <p className="result-heading">
            {submitResult.accepted
              ? '🎉 Accepted'
              : `✗ ${submitResult.error}`
            }
          </p>

          <p className="result-meta">
            Test Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases}
          </p>

          {submitResult.accepted && (
            <>
              <p className="result-meta">
                Runtime: {submitResult.runtime} sec
              </p>

              <p className="result-meta">
                Memory: {submitResult.memory} KB
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="result-empty">
          Click "Submit" to submit your solution for evaluation.
        </p>
      )}
    </div>
  );
}

export default ResultPanel;