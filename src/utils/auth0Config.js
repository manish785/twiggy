import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID } from "./constants";
import { clearSessionToken } from "./sessionAuth";

export const AUTH0_LOGIN_SCOPE = "openid profile email";

/** Remove Auth0 SPA cache from localStorage (used on logout fallback). */
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

/**
 * Sign out reliably without depending on Auth0 Allowed Logout URLs.
 * Clears local Auth0 cache and reloads the app (header shows Login).
 */
export async function performLogout(logout) {
  clearSessionToken();
  clearAuth0Cache();

  const returnTo =
    typeof window !== "undefined"
      ? window.location.origin.replace(/\/$/, "")
      : "/";

  await logout({ openUrl: false });
  window.location.replace(returnTo);
}

/** Params for Auth0Provider and loginWithRedirect ù includes API audience */
export function getAuth0AuthorizationParams() {
  const params = {
    scope: AUTH0_LOGIN_SCOPE,
  };

  if (AUTH0_AUDIENCE) {
    params.audience = AUTH0_AUDIENCE;
  }

  if (typeof window !== "undefined") {
    params.redirect_uri = window.location.origin;
  }

  return params;
}

export function getLoginWithRedirectOptions(appState) {
  return {
    appState,
    authorizationParams: getAuth0AuthorizationParams(),
  };
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
