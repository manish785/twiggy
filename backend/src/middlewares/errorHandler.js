/**
 * Global HTTP error handling (registered last in app.js).
 * notFoundHandler — no route matched; errorHandler — catches thrown/passed errors.
 */
const logger = require("../utils/logger");

// 404 when no earlier route handled the request (app.js mounts this before errorHandler)
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Express error middleware: (err, req, res, next) — four arguments required
function errorHandler(err, req, res, next) {
  // Services may set err.statusCode (e.g. buildHttpError); default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Skip logging during tests to keep test output clean
  if (process.env.NODE_ENV !== "test") {
    logger.error(
      {
        err,
        requestId: req.id, // set by request-id middleware in app.js
        method: req.method,
        path: req.originalUrl,
      },
      "Request failed"
    );
  }

  // Consistent JSON error shape across the API (no stack trace exposed to client)
  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
