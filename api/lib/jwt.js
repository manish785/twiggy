const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "foodheaven-jwt-secret-for-vercel-demo";

function signUser(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

function verifyBearerToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = {
  signUser,
  verifyBearerToken,
};
