const { RateLimiterRedis } = require("rate-limiter-flexible");

const { redisClient } = require("../config/redis");

// ---------------------------------------------------------------------------
// SHARED HELPERS
// ---------------------------------------------------------------------------

/**
 * Builds standard rate-limit response headers from plain values.
 *
 * X-RateLimit-Limit     → max tokens/points allowed
 * X-RateLimit-Remaining → tokens/points remaining
 * Retry-After           → seconds until next token is available (only on 429)
 *
 * @param {number} limit          - The configured maximum capacity.
 * @param {number} remaining      - Remaining tokens/points after this request.
 * @param {number|null} retryAfterMs - Milliseconds to wait before retrying (null if not blocked).
 */
const buildHeaders = (limit, remaining, retryAfterMs = null) => {
  const headers = {
    "X-RateLimit-Limit": limit,
    "X-RateLimit-Remaining": Math.max(0, Math.floor(remaining)),
  };
  if (retryAfterMs !== null) {
    headers["Retry-After"] = Math.ceil(retryAfterMs / 1000) || 1;
  }
  return headers;
};

/**
 * Sends a standard 429 Too Many Requests response.
 * Reuses buildHeaders so the response is always consistent.
 *
 * @param {object} res            - Express response object.
 * @param {number} limit          - The configured maximum capacity.
 * @param {number} retryAfterMs   - Milliseconds until next retry is allowed.
 */
const tooManyRequests = (res, limit, retryAfterMs) => {
  const headers = buildHeaders(limit, 0, retryAfterMs);
  res.set(headers);
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down.",
    retryAfterSeconds: headers["Retry-After"],
  });
};

// ---------------------------------------------------------------------------
// TOKEN BUCKET (RUN & SUBMIT) — Redis Lua Script
// ---------------------------------------------------------------------------

/**
 * Atomic Redis Lua script implementing Token Bucket with lazy refilling.
 * Returns a 3-element array: [ allowed (1/0), remaining_tokens, wait_time_ms ]
 *
 * Lazy refill: tokens are calculated on-demand based on time elapsed since the
 * last request, rather than using a background timer. This is accurate, cheap,
 * and works correctly across server restarts.
 */
const TOKEN_BUCKET_LUA = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2]) -- tokens per millisecond
local now = tonumber(ARGV[3])         -- current timestamp in ms
local requested = tonumber(ARGV[4])   -- normally 1

local bucket = redis.call("HMGET", key, "tokens", "last_refill")
local tokens = tonumber(bucket[1])
local last_refill = tonumber(bucket[2])

if not tokens then
  tokens = capacity
  last_refill = now
else
  local elapsed = math.max(0, now - last_refill)
  local refill = elapsed * refill_rate
  tokens = math.min(capacity, tokens + refill)
  last_refill = now
end

if tokens >= requested then
  tokens = tokens - requested
  redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
  return {1, tokens, 0}
else
  redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
  local wait_ms = math.ceil((requested - tokens) / refill_rate)
  return {0, tokens, wait_ms}
end
`;

/**
 * Executes the token bucket Lua script atomically in Redis.
 *
 * @param {string} key             - Redis key scoped to the user (e.g. "rl:run:userId").
 * @param {number} capacity        - Maximum number of tokens the bucket can hold.
 * @param {number} refillRatePerSec - Number of tokens refilled per second.
 * @returns {{ allowed: boolean, remaining: number, waitMs: number }}
 */
const consumeTokenBucket = async (key, capacity, refillRatePerSec) => {
  const now = Date.now();
  const refillRatePerMs = refillRatePerSec / 1000;
  const requested = 1;

  const [allowed, remaining, waitMs] = await redisClient.eval(TOKEN_BUCKET_LUA, {
    keys: [key],
    arguments: [
      capacity.toString(),
      refillRatePerMs.toString(),
      now.toString(),
      requested.toString(),
    ],
  });

  return {
    allowed: allowed === 1,
    remaining: Math.max(0, remaining),
    waitMs,
  };
};

// ---------------------------------------------------------------------------
// FIXED WINDOW LIMITERS (LOGIN & REGISTER)
// We create limiters once at module load (not per request) so Redis
// connections are reused and counters persist across the process lifetime.
// ---------------------------------------------------------------------------

// --- LOGIN  (/user/login) --------------------------------------------------
// Fixed window, keyed by IP (user is not authenticated yet).
// Conservative: 10 attempts per 15 minutes.
const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "rl:login",
  points: 10,        // 10 attempts …
  duration: 15 * 60, // … per 15 minutes
});
const LOGIN_LIMIT = 10;

const changePasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "rl:change-password",
  points: 5,           // 5 attempts ...
  duration: 15 * 60,   // ... per 15 minutes
});

const CHANGE_PASSWORD_LIMIT = 5;

// --- REGISTER  (/user/register) -------------------------------------------
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

// --- TOKEN BUCKET LIMITS (RUN & SUBMIT) -----------------------------------
const RUN_LIMIT = 3;                      // Max burst capacity of 3 runs
const RUN_REFILL_RATE_PER_SEC = 4 / 60;   // 1 token every 15 seconds

const SUBMIT_LIMIT = 3;                   // Max burst capacity of 3 submissions
const SUBMIT_REFILL_RATE_PER_SEC = 2 / 60; // 1 token every 30 seconds

// ---------------------------------------------------------------------------
// MIDDLEWARE FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Middleware: limit code RUN requests.
 * Applied to: POST /submission/run/:id
 * Key: authenticated userId (req.user._id set by userMiddleware)
 */
const limitRunCode = async (req, res, next) => {
  const key = `rl:run:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      RUN_LIMIT,
      RUN_REFILL_RATE_PER_SEC
    );

    res.set(buildHeaders(RUN_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, RUN_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from running code.
    console.error("[rateLimitMiddleware] limitRunCode unexpected error:", error);
    return next();
  }
};

/**
 * Middleware: limit code SUBMIT requests.
 * Applied to: POST /submission/submit/:id
 * Key: authenticated userId
 */
const limitSubmitCode = async (req, res, next) => {
  const key = `rl:submit:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      SUBMIT_LIMIT,
      SUBMIT_REFILL_RATE_PER_SEC
    );

    res.set(buildHeaders(SUBMIT_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, SUBMIT_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from submitting code.
    console.error("[rateLimitMiddleware] limitSubmitCode unexpected error:", error);
    return next();
  }
};

/**
 * Middleware: limit LOGIN attempts.
 * Applied to: POST /user/login
 * Key: IP address (user not yet authenticated)
 *
 * req.ip works correctly because app.set('trust proxy', 1) is set in index.js.
 */
const limitLogin = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await loginLimiter.consume(key);
    res.set(buildHeaders(LOGIN_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] loginLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, LOGIN_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitChangePassword = async (req, res, next) => {
  const key = req.user._id.toString();  // ← authenticated user, not IP
  try {
    const result = await changePasswordLimiter.consume(key);
    res.set(buildHeaders(CHANGE_PASSWORD_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] changePasswordLimiter error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, CHANGE_PASSWORD_LIMIT, rateLimiterRes.msBeforeNext);
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
    res.set(buildHeaders(REGISTER_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error("[rateLimitMiddleware] registerLimiter unexpected error:", rateLimiterRes);
      return next();
    }
    return tooManyRequests(res, REGISTER_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

module.exports = {
  limitRunCode,
  limitSubmitCode,
  limitLogin,
  limitRegister,
  limitChangePassword
};