function ActionBar({ isRunning, isSubmitting, handleRun, handleSubmitCode }) {
  return (
    <div className="action-btns">
      <button
        className="run-btn flex items-center gap-2"
        onClick={handleRun}
        disabled={isRunning || isSubmitting}
      >
        {isRunning ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Running...
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run
          </>
        )}
      </button>

      <button
        className="submit-btn flex items-center gap-2"
        onClick={handleSubmitCode}
        disabled={isRunning || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Submitting...
          </>
        ) : (
          <>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Submit
          </>
        )}
      </button>
    </div>
  );
}

export default ActionBar;
