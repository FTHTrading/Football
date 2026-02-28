import pino from "pino";

// ─── Application Logger ───────────────────────────────
// Structured logging with pino for production observability.

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  ...(process.env.NODE_ENV !== "production" && {
    transport: {
      target: "pino/file",
      options: { destination: 1 }, // stdout
    },
  }),
  base: {
    service: "under-center",
    env: process.env.NODE_ENV,
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

// Convenience exports
export const log = {
  info: (msg: string, data?: Record<string, unknown>) =>
    data ? logger.info(data, msg) : logger.info(msg),
  warn: (msg: string, data?: Record<string, unknown>) =>
    data ? logger.warn(data, msg) : logger.warn(msg),
  error: (msg: string, data?: Record<string, unknown>) =>
    data ? logger.error(data, msg) : logger.error(msg),
  debug: (msg: string, data?: Record<string, unknown>) =>
    data ? logger.debug(data, msg) : logger.debug(msg),

  // Domain-specific loggers
  auth: (msg: string, data?: Record<string, unknown>) =>
    logger.child({ module: "auth" }).info(data ?? {}, msg),
  stripe: (msg: string, data?: Record<string, unknown>) =>
    logger.child({ module: "stripe" }).info(data ?? {}, msg),
  admin: (msg: string, data?: Record<string, unknown>) =>
    logger.child({ module: "admin" }).info(data ?? {}, msg),
  analytics: (msg: string, data?: Record<string, unknown>) =>
    logger.child({ module: "analytics" }).info(data ?? {}, msg),
};
