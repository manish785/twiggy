const jwt = require("jsonwebtoken");
const { getAuth0Config, verifyAuth0Token } = require("../utils/verifyAuth0");

function extractBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

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

  const auth0Config = getAuth0Config();
  const isProduction = process.env.NODE_ENV === "production";

  if (auth0Config) {
    try {
      req.user = await verifyAuth0Token(token, auth0Config);
      return next();
    } catch (error) {
      if (isProduction) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
    }
  } else if (isProduction) {
    return res.status(500).json({
      success: false,
      message: "Auth0 is not configured for production",
    });
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
