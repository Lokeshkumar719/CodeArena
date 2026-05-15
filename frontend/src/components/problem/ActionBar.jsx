function ActionBar({
  loading,
  handleRun,
  handleSubmitCode,
}){
  return (
    <div className="action-btns">
      <button
        className="run-btn"
        onClick={handleRun}
        disabled={loading}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>

        Run
      </button>

      <button
        className="submit-btn"
        onClick={handleSubmitCode}
        disabled={loading}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>

        Submit
      </button>
    </div>
  );
}

export default ActionBar;