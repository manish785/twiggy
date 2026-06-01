import axios from "axios";
import { AUTH0_AUDIENCE, DEV_AUTH_KEY, DEV_TOKEN_URL } from "./constants";

const SESSION_JWT_KEY = "foodheaven_session_jwt";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function clearSessionToken() {
  sessionStorage.removeItem(SESSION_JWT_KEY);
}

export function getStoredSessionToken() {
  return sessionStorage.getItem(SESSION_JWT_KEY);
}

function persistSessionToken(token) {
  sessionStorage.setItem(SESSION_JWT_KEY, token);
}

async function fetchDevSessionToken({ user, forceRefresh = false }) {
  const existingToken = getStoredSessionToken();
  if (existingToken && !forceRefresh) {
    return existingToken;
  }

  if (!DEV_AUTH_KEY) {
    throw new Error(
      "Missing REACT_APP_DEV_AUTH_KEY. For production, set REACT_APP_AUTH0_AUDIENCE and configure Auth0 API access."
    );
  }

  const response = await axios.post(DEV_TOKEN_URL, {
    devKey: DEV_AUTH_KEY,
    userId: user?.sub || "guest-user",
    email: user?.email || "guest@foodheaven.app",
    role: "customer",
  });

  const token = response?.data?.data?.token;
  if (!token) {
    throw new Error("Failed to generate session token");
  }

  persistSessionToken(token);
  return token;
}

async function fetchAuth0AccessToken({ getAccessTokenSilently, forceRefresh }) {
  return getAccessTokenSilently({
    authorizationParams: {
      audience: AUTH0_AUDIENCE,
    },
    cacheMode: forceRefresh ? "off" : "on",
  });
}

/**
 * Returns a Bearer token for protected API calls.
 * Production: Auth0 access token only.
 * Development: Auth0 when configured; falls back to dev-token if Auth0 is not ready.
 */
export async function getApiAccessToken({
  getAccessTokenSilently,
  user,
  forceRefresh = false,
}) {
  if (AUTH0_AUDIENCE && getAccessTokenSilently) {
    try {
      return await fetchAuth0AccessToken({ getAccessTokenSilently, forceRefresh });
    } catch (error) {
      if (IS_PRODUCTION || !DEV_AUTH_KEY) {
        throw new Error(
          error?.message ||
            "Failed to get Auth0 access token. Log in again or check Auth0 API configuration."
        );
      }

      return fetchDevSessionToken({ user, forceRefresh });
    }
  }

  return fetchDevSessionToken({ user, forceRefresh });
}

/** @deprecated Use getApiAccessToken */
export async function ensureSessionToken(options) {
  return getApiAccessToken(options);
}
