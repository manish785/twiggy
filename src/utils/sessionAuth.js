import axios from "axios";
import { AUTH0_AUDIENCE, DEV_AUTH_KEY, getDevTokenUrl } from "./constants";
import {
  AUTH0_LOGIN_SCOPE,
  isAuthSessionError,
} from "./auth0Config";

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
      "Dev auth is not configured. On Vercel, set REACT_APP_AUTH0_AUDIENCE and redeploy; locally set REACT_APP_DEV_AUTH_KEY."
    );
  }

  const response = await axios.post(getDevTokenUrl(), {
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
  const tokenOptions = {
    authorizationParams: {
      audience: AUTH0_AUDIENCE,
      scope: AUTH0_LOGIN_SCOPE,
    },
    cacheMode: forceRefresh ? "off" : "on",
  };

  try {
    return await getAccessTokenSilently(tokenOptions);
  } catch (error) {
    if (!forceRefresh && isAuthSessionError(error)) {
      return getAccessTokenSilently({
        ...tokenOptions,
        cacheMode: "off",
      });
    }
    throw error;
  }
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
  if (!getAccessTokenSilently) {
    if (IS_PRODUCTION) {
      throw new Error("Auth session unavailable. Please log in again.");
    }
    return fetchDevSessionToken({ user, forceRefresh });
  }

  if (!AUTH0_AUDIENCE) {
    if (IS_PRODUCTION) {
      throw new Error(
        "Set REACT_APP_AUTH0_AUDIENCE=https://api.foodheaven.app in Vercel and redeploy."
      );
    }
    return fetchDevSessionToken({ user, forceRefresh });
  }

  try {
    return await fetchAuth0AccessToken({ getAccessTokenSilently, forceRefresh });
  } catch (error) {
    if (IS_PRODUCTION || !DEV_AUTH_KEY) {
      const hint = isAuthSessionError(error)
        ? "Please log out, log in again, then retry payment."
        : "Log in again or check Auth0 API configuration.";
      const authError = new Error(
        error?.message ? `${error.message} ${hint}` : hint
      );
      authError.needsReauth = isAuthSessionError(error);
      throw authError;
    }

    return fetchDevSessionToken({ user, forceRefresh });
  }
}

/** @deprecated Use getApiAccessToken */
export async function ensureSessionToken(options) {
  return getApiAccessToken(options);
}
