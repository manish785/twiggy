// Fast structured JSON logger used across the backend (e.g. pino-http in app.js)
const pino = require("pino");

// Single shared logger instance — import this instead of creating new loggers
const logger = pino({
  // Minimum severity to emit (debug | info | warn | error); default info
  level: process.env.LOG_LEVEL || "info",
  // Omit pid/hostname from every log line for cleaner output
  base: undefined,
  // Use ISO 8601 timestamps (e.g. 2026-05-31T12:00:00.000Z)
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
