const AUTH_RETURN_TO_KEY = "foodheaven_auth_return_to";

export function saveAuthReturnTo(path) {
  if (typeof window === "undefined" || !path) {
    return;
  }
  sessionStorage.setItem(AUTH_RETURN_TO_KEY, path);
}

export function peekAuthReturnTo() {
  if (typeof window === "undefined") {
    return null;
  }
  return sessionStorage.getItem(AUTH_RETURN_TO_KEY);
}

export function consumeAuthReturnTo() {
  const path = peekAuthReturnTo();
  if (path) {
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  }
  return path;
}

export function clearAuthReturnTo() {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
}
