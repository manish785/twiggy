/**
 * Express authentication middleware for protected API routes.
 *
 * Expects: `Authorization: Bearer <token>`
 *
 * Token resolution (first match wins):
 * 1. Missing / non-Bearer header → 401
 * 2. `INTERNAL_API_TOKEN` (if set) → synthetic `req.user` with role `system`
 * 3. Otherwise verify JWT with `JWT_SECRET` (from `/auth/login` or `/auth/dev-token`)
 *
 * On success, sets `req.user` to the JWT payload (e.g. `sub`, `email`, `name`, `role`)
 * and calls `next()`. Used on order routes (create order, confirm payment).
 *
 * Env: JWT_SECRET (required for JWT), INTERNAL_API_TOKEN (optional bypass).
 */
const jwt = require("jsonwebtoken");

/**
 * Parses `Authorization: Bearer <token>`; returns the token string or null.
 */
function extractBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authMiddleware(req, res, next) {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Missing or invalid Authorization header",
    });
  }

  const internalApiToken = process.env.INTERNAL_API_TOKEN;
  if (internalApiToken && token === internalApiToken) {
    req.user = { sub: "internal-token-user", role: "system" };
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "JWT secret is not configured",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
