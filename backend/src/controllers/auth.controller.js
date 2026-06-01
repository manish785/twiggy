const jwt = require("jsonwebtoken");

async function login(req, res) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured on the server",
    });
  }

  const { email, name } = req.body;
  const displayName = name || email.split("@")[0];
  const user = {
    sub: email,
    email,
    name: displayName,
    role: "customer",
  };

  const token = jwt.sign(user, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        sub: user.sub,
        email: user.email,
        name: user.name,
      },
    },
  });
}

module.exports = {
  login,
};
