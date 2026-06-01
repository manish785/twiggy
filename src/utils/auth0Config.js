import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./constants";
import {
  clearAuthReturnTo,
  saveAuthReturnTo,
} from "./authReturnTo";
import { clearSessionToken } from "./sessionAuth";

export const AUTH0_LOGIN_SCOPE = "openid profile email";

/** Login redirect only — no API audience (requested later for payment). */
export function getAuth0LoginParams() {
  return {
    scope: AUTH0_LOGIN_SCOPE,
    redirect_uri:
      typeof window !== "undefined" ? window.location.origin : undefined,
  };
}

/** Params when fetching an access token for the backend API. */
export function getAuth0ApiTokenParams() {
  const params = {
    scope: AUTH0_LOGIN_SCOPE,
  };

  if (AUTH0_AUDIENCE) {
    params.audience = AUTH0_AUDIENCE;
  }

  return params;
}

export function clearAuth0Cache() {
  if (typeof window === "undefined") {
    return;
  }

  const prefixes = ["@@auth0spajs@@"];
  if (AUTH0_CLIENT_ID) {
    prefixes.push(`@@auth0spajs@@::${AUTH0_CLIENT_ID}`);
  }

  for (const key of Object.keys(window.localStorage)) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      window.localStorage.removeItem(key);
    }
  }
}

export async function performLogout(logout) {
  clearSessionToken();
  clearAuthReturnTo();

  try {
    await Promise.race([
      logout({ openUrl: false }),
      new Promise((resolve) => {
        setTimeout(resolve, 2500);
      }),
    ]);
  } catch {
    // Continue with local cleanup
  }

  clearAuth0Cache();

  if (typeof window !== "undefined") {
    window.location.assign("/");
  }
}

export function startLogin(returnTo = "/") {
  saveAuthReturnTo(returnTo);
}

export async function loginWithAuth(loginWithRedirect, returnTo = "/") {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    throw new Error("Auth0 domain or client id is missing.");
  }

  startLogin(returnTo);

  await loginWithRedirect({
    appState: { returnTo },
    authorizationParams: getAuth0LoginParams(),
  });
}

export function isAuthSessionError(error) {
  const code = error?.error || "";
  const message = error?.message || "";
  return (
    code === "login_required" ||
    code === "consent_required" ||
    code === "missing_refresh_token" ||
    message.includes("login_required") ||
    message.includes("Consent required") ||
    message.includes("Missing Refresh Token") ||
    message.includes("Login required")
  );
}
