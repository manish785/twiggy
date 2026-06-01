const SESSION_JWT_KEY = "foodheaven_session_jwt";

export function clearSessionToken() {
  sessionStorage.removeItem(SESSION_JWT_KEY);
}

export function getStoredSessionToken() {
  return sessionStorage.getItem(SESSION_JWT_KEY);
}

export function persistSessionToken(token) {
  sessionStorage.setItem(SESSION_JWT_KEY, token);
}

export async function getApiAccessToken() {
  const token = getStoredSessionToken();

  if (!token) {
    const error = new Error("Please log in to continue.");
    error.needsReauth = true;
    throw error;
  }

  return token;
}
