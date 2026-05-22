function ProblemDescription({ problem, getDifficultyBadge }) {
  return (
    <div>
      <h1 className="problem-title">{problem.title}</h1>

      <div className="badge-row">
        <span className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
          {problem.difficulty.charAt(0).toUpperCase() +
            problem.difficulty.slice(1)}
        </span>

        {problem.tags?.map((tag, index) => (
          <span key={index} className="badge badge-tag">
            {tag}
          </span>
        ))}
      </div>

      <p className="desc-text whitespace-pre-wrap">{problem.description}</p>

      {/* Input Format */}
      {problem.inputFormat && (
        <div className="mt-6">
          <p className="examples-heading">Input Format</p>

          <div className="example-card font-mono whitespace-pre-wrap">
            {problem.inputFormat}
          </div>
        </div>
      )}

      {/* Output Format */}
      {problem.outputFormat && (
        <div className="mt-6">
          <p className="examples-heading">Output Format</p>

          <div className="example-card font-mono whitespace-pre-wrap">
            {problem.outputFormat}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && (
        <div className="mt-6">
          <p className="examples-heading">Constraints</p>

          <div className="example-card font-mono whitespace-pre-wrap">
            {problem.constraints}
          </div>
        </div>
      )}

      <p className="examples-heading mt-6">Examples</p>

      {problem.visibleTestCases.map((ex, i) => (
        <div key={i} className="example-card">
          <div className="example-label">Example {i + 1}</div>

          <div className="example-row">
            <span className="example-key">Input:</span>

            <span className="example-val font-mono whitespace-pre-wrap">
              {ex.input}
            </span>
          </div>

          <div className="example-row">
            <span className="example-key">Output:</span>

            <span className="example-val font-mono whitespace-pre-wrap">
              {ex.output}
            </span>
          </div>

          {ex.explanation && (
            <div className="example-row">
              <span className="example-key">Explanation:</span>

              <span className="example-val whitespace-pre-wrap">
                {ex.explanation}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProblemDescription;
