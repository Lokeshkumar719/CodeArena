require("dotenv").config();

const { createClient } = require("redis");

// create a single redis client instance for the entire application
// this follows singleton pattern so that we don't create multiple
// redis connections accidentally
const redisClient = createClient({
  // redis server url stored inside .env
  // example:
  // REDIS_URL=redis://localhost:6379
  url: process.env.REDIS_URL,

  // socket configuration controls low-level redis connection behavior
  socket: {
    // reconnectStrategy() runs automatically whenever
    // redis connection gets disconnected unexpectedly
    reconnectStrategy: (retries) => {
      // if redis fails too many times,
      // stop reconnecting after 10 retries
      if (retries > 10) {
        return new Error("Redis max retries reached");
      }

      // retry delay increases gradually:
      // 1st retry -> 100ms
      // 2nd retry -> 200ms
      // ...
      // max delay capped at 3000ms
      // this technique is called "backoff strategy"
      return Math.min(retries * 100, 3000);
    },
  },
});

// "connect" event fires when redis starts trying to connect
redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

// "ready" event fires when redis connection is successful
// and redis is ready to accept commands
redisClient.on("ready", () => {
  console.log("Redis connected successfully");
});

// "reconnecting" event fires whenever redis loses connection
// and starts reconnecting automatically
redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

// "end" event fires when redis connection closes completely
// example:
// - server shutdown
// - redisClient.quit()
// - redis server stopped
redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// "error" event handles all redis-related errors
// without this, some redis errors may crash the application
redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

// reusable function to connect redis safely
const connectRedis = async () => {
  // isOpen checks whether redis connection already exists
  // prevents duplicate redis connections
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

// exporting both:
// 1. redisClient -> used for redis operations like set/get
// 2. connectRedis -> used once during server startup
module.exports = {
  redisClient,
  connectRedis,
};
