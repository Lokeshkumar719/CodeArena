const {
  RateLimiterRedis,
  BurstyRateLimiter,
  RateLimiterMemory,
} = require("rate-limiter-flexible");

const redisClient = require("../config/redis");

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Builds the Response headers we send back on every rate-limited request.
 * Standard headers let the frontend know the current state without guessing.
 *
 * X-RateLimit-Limit     → max points allowed in the window
 * X-RateLimit-Remaining → points left before the user is blocked
 * Retry-After           → seconds until the window resets (only on 429)
 */
const buildHeaders = (rateLimiterRes, limit, retryAfter = null) => {
  const headers = {
    "X-RateLimit-Limit": limit,
    "X-RateLimit-Remaining": Math.max(0, rateLimiterRes.remainingPoints),
  };
  if (retryAfter !== null) {
    // msBeforeNext → convert to whole seconds, minimum 1
    headers["Retry-After"] = Math.ceil(retryAfter / 1000) || 1;
  }
  return headers;
};

/**
 * Shared 429 response writer.
 * Always includes Retry-After so the frontend can show a countdown.
 */
const tooManyRequests = (res, rateLimiterRes, limit) => {
  const headers = buildHeaders(rateLimiterRes, limit, rateLimiterRes.msBeforeNext);
  res.set(headers);
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down.",
    retryAfterSeconds: headers["Retry-After"],
  });
};

// ---------------------------------------------------------------------------
// LIMITER FACTORIES
// We create limiters once at module load (not per request) so Redis
// connections are reused and counters persist across the process lifetime.
// ---------------------------------------------------------------------------

// --- 1. CODE RUN  (/submission/run/:id) ------------------------------------
// Token bucket via BurstyRateLimiter:
//   - Base  : 10 runs per minute  (refills slowly — normal coding pace)
//   - Burst : 3 extra back-to-back runs are forgiven instantly
//
// Why BurstyRateLimiter?  A user debugging will hit "Run" several times in
// quick succession, then pause to think. Bursting allows that natural rhythm
// without blocking them, while still capping sustained spam.
//
// Key: userId (req.user._id) — per authenticated user, not per IP.
// userMiddleware runs before this, so req.user is guaranteed.

const runBaseStore = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true, 
  keyPrefix: "rl:run:base",
  points: 10,       // 10 runs …
  duration: 60,     // … per 60 seconds
});

const runBurstStore = new RateLimiterMemory({
  // Burst bucket lives in memory — it's intentionally short-lived (10 s).
  // Using memory here avoids an extra Redis round-trip for the burst window.
  keyPrefix: "rl:run:burst",
  points: 3,        // 3 extra back-to-back runs allowed
  duration: 10,     // burst window of 10 seconds
});

const runLimiter = new BurstyRateLimiter(runBaseStore, runBurstStore);
const RUN_LIMIT = 10; // used only for the header value

// --- 2. CODE SUBMIT  (/submission/submit/:id) --------------------------------
// Stricter token bucket — submitting is a deliberate final action.
// No burst bucket here: submitting 3 times in 2 seconds is unusual.
//
// 5 submissions per minute keeps legitimate users completely unaffected
// while stopping automated flooding.

const submitLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true, 
  keyPrefix: "rl:submit",
  points: 5,        // 5 submissions …
  duration: 60,     // … per 60 seconds
});
const SUBMIT_LIMIT = 5;

// --- 3. LOGIN  (/user/login) -------------------------------------------------
// Fixed window, keyed by IP (user is not authenticated yet).
//
// Why fixed window?  Brute force protection only needs a hard wall per time
// window. Sliding window precision is unnecessary here.
//
// Conservative: 10 attempts per 15 minutes.
// A legitimate user who forgot their password will stay well under this.

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true, 
  keyPrefix: "rl:login",
  points: 10,       // 10 attempts …
  duration: 15 * 60, // … per 15 minutes
});
const LOGIN_LIMIT = 10;

// --- 4. REGISTER  (/user/register) -------------------------------------------
// More lenient than login — registering 5 times is suspicious but
// less directly dangerous than brute-forcing credentials.

const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true, 
  keyPrefix: "rl:register",
  points: 5,
  duration: 60 * 60, // 5 attempts per hour
});
const REGISTER_LIMIT = 5;

// ---------------------------------------------------------------------------
// MIDDLEWARE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Middleware: limit code RUN requests.
 * Applied to: POST /submission/run/:id
 * Key: authenticated userId (req.user._id set by userMiddleware)
 */
const limitRunCode = async (req, res, next) => {
  const key = req.user._id.toString();

  try {
    const result = await runLimiter.consume(key);
    // Pass remaining info downstream so controllers can log if needed
    let header = buildHeaders(result, RUN_LIMIT);
    res.set(header);
    console.log(header);
    next();
  } catch (rateLimiterRes) {
    // BurstyRateLimiter throws a RateLimiterRes object (not an Error) when
    // all points (base + burst) are exhausted.
    if (rateLimiterRes instanceof Error) {
      // Genuine unexpected error (e.g. Redis down) — fail open so users
      // aren't blocked due to infrastructure issues. Log and continue.
      console.error("[rateLimitMiddleware] runLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, rateLimiterRes, RUN_LIMIT);
  }
};

/**
 * Middleware: limit code SUBMIT requests.
 * Applied to: POST /submission/submit/:id
 * Key: authenticated userId
 */
const limitSubmitCode = async (req, res, next) => {
  const key = req.user._id.toString();

  try {
    const result = await submitLimiter.consume(key);
    res.set(buildHeaders(result, SUBMIT_LIMIT));
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] submitLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, rateLimiterRes, SUBMIT_LIMIT);
  }
};

/**
 * Middleware: limit LOGIN attempts.
 * Applied to: POST /user/login
 * Key: IP address (user not yet authenticated)
 *
 * req.ip works when Express's trust proxy is configured correctly.
 * Falls back to the raw socket address if not.
 */
const limitLogin = async (req, res, next) => {
  // x-forwarded-for is only trusted if you've set app.set('trust proxy', 1)
  // For local dev, req.ip is fine as-is.
  const key = req.ip;

  try {
    const result = await loginLimiter.consume(key);
    res.set(buildHeaders(result, LOGIN_LIMIT));
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] loginLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, rateLimiterRes, LOGIN_LIMIT);
  }
};

/**
 * Middleware: limit REGISTER attempts.
 * Applied to: POST /user/register
 * Key: IP address
 */
const limitRegister = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await registerLimiter.consume(key);
    res.set(buildHeaders(result, REGISTER_LIMIT));
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] registerLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, rateLimiterRes, REGISTER_LIMIT);
  }
};

module.exports = {
  limitRunCode,
  limitSubmitCode,
  limitLogin,
  limitRegister,
};