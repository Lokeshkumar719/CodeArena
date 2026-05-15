function ProblemDescription({
  problem,
  getDifficultyBadge
}){
  return (
    <div>
      <h1 className="problem-title">
        {problem.title}
      </h1>

      <div className="badge-row">
        <span className={`badge ${getDifficultyBadge(problem.difficulty)}`}>
          {problem.difficulty.charAt(0).toUpperCase()+problem.difficulty.slice(1)}
        </span>

        {problem.tags?.map((tag,index)=>(
          <span
            key={index}
            className="badge badge-tag"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="desc-text">
        {problem.description}
      </p>

      <p className="examples-heading">
        Examples
      </p>

      {problem.visibleTestCases.map((ex,i)=>(
        <div
          key={i}
          className="example-card"
        >
          <div className="example-label">
            Example {i+1}
          </div>

          <div className="example-row">
            <span className="example-key">
              Input:
            </span>

            <span className="example-val">
              {ex.input}
            </span>
          </div>

          <div className="example-row">
            <span className="example-key">
              Output:
            </span>

            <span className="example-val">
              {ex.output}
            </span>
          </div>

          {ex.explanation && (
            <div className="example-row">
              <span className="example-key">
                Explanation:
              </span>

              <span className="example-val">
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