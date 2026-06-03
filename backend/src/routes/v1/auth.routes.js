/**
 * Auth routes (mounted at /api/v1 in app.js).
 * Issues JWTs for protected routes (e.g. orders). Verification lives in middlewares/auth.js.
 */
// Express — build a sub-router for auth endpoints only
const express = require("express");
// jsonwebtoken — sign dev-token payloads (login signing is in auth.controller.js)
const jwt = require("jsonwebtoken");
// Catches async errors from login controller and forwards to errorHandler
const asyncHandler = require("../../utils/asyncHandler");
// Joi body validation middleware (runs before route handler)
const { validateBody } = require("../../middlewares/validate");
// Request body schemas for /auth/login and /auth/dev-token
const { createDevTokenSchema, loginSchema } = require("../../validators/auth.validator");
// login handler — mints JWT from email + name, returns token + user
const { login } = require("../../controllers/auth.controller");

// Router instance; paths here are relative to mount prefix /api/v1
const router = express.Router();

// POST /api/v1/auth/login — public; validate body, then issue JWT (no password / DB)
router.post("/auth/login", validateBody(loginSchema), asyncHandler(login));

// POST /api/v1/auth/dev-token — local/testing only; mint JWT with custom sub/role
router.post("/auth/dev-token", validateBody(createDevTokenSchema), (req, res) => {
  // Hide dev endpoint in production (same 404 shape as unknown routes)
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }

  // Server must have secret to sign and key to authorize dev callers
  const jwtSecret = process.env.JWT_SECRET;
  const devAuthKey = process.env.DEV_AUTH_KEY;

  if (!jwtSecret || !devAuthKey) {
    return res.status(500).json({
      success: false,
      message: "Dev auth configuration is missing",
    });
  }

  // req.body.devKey validated by Joi; must match env DEV_AUTH_KEY
  if (req.body.devKey !== devAuthKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid dev key",
    });
  }

  // Payload shape matches what authMiddleware expects after jwt.verify
  const token = jwt.sign(
    {
      sub: req.body.userId, // subject — often a test user id, not email
      email: req.body.email,
      name: req.body.email.split("@")[0], // display name from local part of email
      role: req.body.role || "customer", // defaults from createDevTokenSchema if omitted
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // shorter default than login (7d)
  );

  return res.status(200).json({
    success: true,
    data: { token }, // client sends as Authorization: Bearer <token>
  });
});

// Exported router — app.js: app.use("/api/v1", authRoutes)
module.exports = router;
