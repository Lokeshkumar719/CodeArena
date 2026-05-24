function ActionBar({ isRunning, isSubmitting, handleRun, handleSubmitCode, runCooldown, submitCooldown }) {
  const runBlocked = isRunning || isSubmitting || runCooldown > 0;
  const submitBlocked = isRunning || isSubmitting || submitCooldown > 0;

  return (
    <div className="action-btns">
      <button
        className="run-btn flex items-center gap-2"
        onClick={handleRun}
        disabled={runBlocked}
      >
        {isRunning ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Running...
          </>
        ) : runCooldown > 0 ? (
          <>⏳ Run ({runCooldown}s)</>
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
        disabled={submitBlocked}
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Submitting...
          </>
        ) : submitCooldown > 0 ? (
          <>⏳ Submit ({submitCooldown}s)</>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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