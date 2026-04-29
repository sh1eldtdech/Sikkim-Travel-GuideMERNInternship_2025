const redis = require("redis");

// ── Redis is optional — used only for token revocation (logout blacklisting).
// ── If Redis is unavailable the app runs in degraded mode: tokens remain valid
//    until their natural expiry (15 min access / 7 day refresh). Everything else
//    works normally.

let redisClient = null;
let _errorLogged = false; // prevent log spam when Redis is down

const REDIS_URL =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
    process.env.REDIS_PORT || 6379
  }`;

// Only attempt to connect if a Redis URL is explicitly configured OR we're in
// production (where Redis is expected). In development with no config the
// connection attempt is skipped entirely to avoid noisy ECONNREFUSED logs.
const shouldConnect =
  process.env.REDIS_URL ||
  process.env.REDIS_HOST ||
  process.env.NODE_ENV === "production";

if (shouldConnect) {
  redisClient = redis.createClient({
    url: REDIS_URL,
    socket: {
      // Do NOT auto-reconnect — log once and stay silent
      reconnectStrategy: (retries) => {
        if (retries === 0) return 200; // one quick retry after 200ms
        // After first retry fails, stop reconnecting
        if (!_errorLogged) {
          console.warn(
            "⚠  Redis unavailable — token revocation is disabled. " +
              "Start Redis to enable it."
          );
          _errorLogged = true;
        }
        return false; // returning false stops reconnection
      },
    },
  });

  redisClient.connected = false;

  redisClient.on("ready", () => {
    redisClient.connected = true;
    _errorLogged = false;
    console.log("✓ Redis connected — token revocation enabled");
  });

  redisClient.on("end", () => {
    redisClient.connected = false;
  });

  // Suppress per-attempt error logs — reconnectStrategy already handles messaging
  redisClient.on("error", () => {
    redisClient.connected = false;
  });

  // Initiate connection (non-blocking — errors handled above)
  redisClient.connect().catch(() => {});
} else {
  console.log(
    "ℹ  Redis not configured — token revocation disabled (development mode)"
  );
}

// ── Safe wrappers ────────────────────────────────────────────────────────────

const getKey = async (key) => {
  if (!redisClient || !redisClient.connected) return null;
  try {
    return await redisClient.get(key);
  } catch {
    return null;
  }
};

const setKeyWithTTL = async (key, ttlSeconds, value) => {
  if (!redisClient || !redisClient.connected) return;
  try {
    await redisClient.setEx(key, ttlSeconds, value);
  } catch {
    // swallow — revocation is best-effort
  }
};

module.exports = {
  client: redisClient,
  getKey,
  setKeyWithTTL,
};
