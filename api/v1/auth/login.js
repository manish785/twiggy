const { signUser } = require("../../lib/jwt");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { email, name } = req.body || {};

  if (!email || !name) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const displayName = String(name).trim();
  const user = {
    sub: String(email).trim().toLowerCase(),
    email: String(email).trim(),
    name: displayName,
    role: "customer",
  };

  const token = signUser(user);

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
};
