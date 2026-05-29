const { RateLimiterRedis } = require("rate-limiter-flexible");
const { redisClient } = require("../config/redis");
const {
  LOGIN_LIMIT,
  LOGIN_DURATION,
  CHANGE_PASSWORD_LIMIT,
  CHANGE_PASSWORD_DURATION,
  REGISTER_LIMIT,
  REGISTER_DURATION,
  RUN_LIMIT,
  RUN_REFILL_RATE_PER_SEC,
  SUBMIT_LIMIT,
  SUBMIT_REFILL_RATE_PER_SEC,
} = require("../constants/rateLimitConstants");

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

const tooManyRequests = (res, limit, retryAfterMs) => {
  const headers = buildHeaders(limit, 0, retryAfterMs);
  res.set(headers);
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down.",
    retryAfterSeconds: headers["Retry-After"],
  });
};

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

const consumeTokenBucket = async (key, capacity, refillRatePerSec) => {
  const now = Date.now();
  const refillRatePerMs = refillRatePerSec / 1000;
  const requested = 1;

  const [allowed, remaining, waitMs] = await redisClient.eval(
    TOKEN_BUCKET_LUA,
    {
      keys: [key],
      arguments: [
        capacity.toString(),
        refillRatePerMs.toString(),
        now.toString(),
        requested.toString(),
      ],
    },
  );

  return {
    allowed: allowed === 1,
    remaining: Math.max(0, remaining),
    waitMs,
  };
};

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "rl:login",
  points: LOGIN_LIMIT,
  duration: LOGIN_DURATION,
});

const changePasswordLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "rl:change-password",
  points: CHANGE_PASSWORD_LIMIT,
  duration: CHANGE_PASSWORD_DURATION,
});

const registerLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  useRedisPackage: true,
  keyPrefix: "rl:register",
  points: REGISTER_LIMIT,
  duration: REGISTER_DURATION,
});

const limitRunCode = async (req, res, next) => {
  const key = `rl:run:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      RUN_LIMIT,
      RUN_REFILL_RATE_PER_SEC,
    );

    res.set(buildHeaders(RUN_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, RUN_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from running code.
    console.error(
      "[rateLimitMiddleware] limitRunCode unexpected error:",
      error,
    );
    return next();
  }
};

const limitSubmitCode = async (req, res, next) => {
  const key = `rl:submit:${req.user._id.toString()}`;

  try {
    const { allowed, remaining, waitMs } = await consumeTokenBucket(
      key,
      SUBMIT_LIMIT,
      SUBMIT_REFILL_RATE_PER_SEC,
    );

    res.set(buildHeaders(SUBMIT_LIMIT, remaining));

    if (allowed) {
      return next();
    }

    return tooManyRequests(res, SUBMIT_LIMIT, waitMs);
  } catch (error) {
    // Fail-open: Redis being down must not block users from submitting code.
    console.error(
      "[rateLimitMiddleware] limitSubmitCode unexpected error:",
      error,
    );
    return next();
  }
};

const limitLogin = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await loginLimiter.consume(key);
    res.set(buildHeaders(LOGIN_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error(
        "[rateLimitMiddleware] loginLimiter unexpected error:",
        rateLimiterRes,
      );
      return next();
    }
    return tooManyRequests(res, LOGIN_LIMIT, rateLimiterRes.msBeforeNext);
  }
};

const limitChangePassword = async (req, res, next) => {
  const key = req.user._id.toString(); // ← authenticated user, not IP
  try {
    const result = await changePasswordLimiter.consume(key);
    res.set(buildHeaders(CHANGE_PASSWORD_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error(
        "[rateLimitMiddleware] changePasswordLimiter error:",
        rateLimiterRes,
      );
      return next();
    }
    return tooManyRequests(
      res,
      CHANGE_PASSWORD_LIMIT,
      rateLimiterRes.msBeforeNext,
    );
  }
};

const limitRegister = async (req, res, next) => {
  const key = req.ip;

  try {
    const result = await registerLimiter.consume(key);
    res.set(buildHeaders(REGISTER_LIMIT, result.remainingPoints));
    return next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes instanceof Error) {
      console.error(
        "[rateLimitMiddleware] registerLimiter unexpected error:",
        rateLimiterRes,
      );
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
  limitChangePassword,
};
