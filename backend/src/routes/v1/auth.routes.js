const express = require("express");
const jwt = require("jsonwebtoken");
const { validateBody } = require("../../middlewares/validate");
const { createDevTokenSchema } = require("../../validators/auth.validator");

const router = express.Router();

router.post("/auth/dev-token", validateBody(createDevTokenSchema), (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({
      success: false,
      message: "Route not found",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;
  const devAuthKey = process.env.DEV_AUTH_KEY;

  if (!jwtSecret || !devAuthKey) {
    return res.status(500).json({
      success: false,
      message: "Dev auth configuration is missing",
    });
  }

  if (req.body.devKey !== devAuthKey) {
    return res.status(401).json({
      success: false,
      message: "Invalid dev key",
    });
  }

  const token = jwt.sign(
    {
      sub: req.body.userId,
      email: req.body.email,
      role: req.body.role || "customer",
    },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return res.status(200).json({
    success: true,
    data: { token },
  });
});

module.exports = router;
