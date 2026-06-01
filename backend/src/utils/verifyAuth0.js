const jwt = require("jsonwebtoken");

let cachedJwksClient = null;

function getAuth0Config() {
  const domain = process.env.AUTH0_DOMAIN;
  const audience = process.env.AUTH0_AUDIENCE;

  if (!domain || !audience) {
    return null;
  }

  const normalizedDomain = domain.replace(/\/$/, "");

  return {
    audience,
    issuer: `https://${normalizedDomain}/`,
    jwksUri: `https://${normalizedDomain}/.well-known/jwks.json`,
  };
}

function getJwksClient(jwksUri) {
  if (!cachedJwksClient || cachedJwksClient.jwksUri !== jwksUri) {
    // Lazy load so Jest (no Auth0 env) does not parse jwks-rsa's ESM dependencies
    const jwksClient = require("jwks-rsa");
    cachedJwksClient = jwksClient({
      jwksUri,
      cache: true,
      rateLimit: true,
    });
    cachedJwksClient.jwksUri = jwksUri;
  }

  return cachedJwksClient;
}

function verifyAuth0Token(token, config) {
  const client = getJwksClient(config.jwksUri);

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      (header, callback) => {
        client.getSigningKey(header.kid, (error, key) => {
          if (error) {
            callback(error);
            return;
          }

          callback(null, key.getPublicKey());
        });
      },
      {
        audience: config.audience,
        issuer: config.issuer,
        algorithms: ["RS256"],
      },
      (error, decoded) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(decoded);
      }
    );
  });
}

module.exports = {
  getAuth0Config,
  verifyAuth0Token,
};
