# `frontend/src/hooks/useRateLimit.jsx`

**Layer:** React Hook  
**Path:** `frontend/src/hooks/useRateLimit.jsx`  
**Purpose:** Manages a countdown timer for rate-limited UI actions.  
**Last reviewed:** 2026-05-29

## Overview

When the backend returns a `429 Too Many Requests` error, it includes a `retryAfterSeconds` field (parsed into `error.rateLimitedFor` by the `axiosClient` interceptor).

The UI needs to lock buttons (Run, Submit) and show a countdown (e.g., "Wait 15s") until the user is allowed to try again. This custom hook manages that countdown state.

## Implementation

```javascript
const useRateLimit = () => {
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef(null);

  const startCooldown = (seconds) => { ... }

  return { cooldown, startCooldown };
};
```

## Usage

In `ProblemPage.jsx` and other components:
```javascript
const runRateLimit = useRateLimit();

const handleAction = async () => {
  if (runRateLimit.cooldown > 0) return;
  try {
    // ... api call
  } catch (error) {
    if (error.rateLimitedFor) {
      runRateLimit.startCooldown(error.rateLimitedFor);
    }
  }
}
```

## Used By

- [`ProblemPage.jsx`](../pages/ProblemPage.md)
- [`Login.jsx`](../pages/Login.md)
- [`Signup.jsx`](../pages/Signup.md)
- [`ChangePassword.jsx`](../pages/ChangePassword.md)
- [`CreateProblem.jsx`](../components/admin/CreateProblem.md)
- [`UpdateProblem.jsx`](../components/admin/UpdateProblem.md)

  }
}

// In the JSX
<button disabled={runRateLimit.cooldown > 0}>
  {runRateLimit.cooldown > 0 ? `⏳ Run (${runRateLimit.cooldown}s)` : "▶ Run"}
</button>
```

## Details
- It uses `setInterval` internally to decrement the `cooldown` state every 1000ms.
- It safely clears the interval when the timer reaches 0 or if `startCooldown` is called again while active.
