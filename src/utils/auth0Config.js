import { AUTH0_AUDIENCE } from "./constants";

export const AUTH0_LOGIN_SCOPE = "openid profile email";

/** Params for Auth0Provider and loginWithRedirect — includes API audience */
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
