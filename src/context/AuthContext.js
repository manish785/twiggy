import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

import { getApiBaseUrl, getLoginUrl } from "../utils/constants";
import {
  clearSessionToken,
  getStoredSessionToken,
  persistSessionToken,
} from "../utils/sessionAuth";

const USER_STORAGE_KEY = "foodheaven_user";

const AuthContext = createContext(null);

function loadStoredUser() {
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = loadStoredUser();
    const token = getStoredSessionToken();

    if (storedUser && token) {
      setUser(storedUser);
    } else {
      clearSessionToken();
      clearUser();
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async ({ email, name }) => {
    const response = await axios.post(getLoginUrl(), {
      email: email.trim(),
      name: name.trim(),
    });

    const { token, user: loggedInUser } = response?.data?.data || {};

    if (!token || !loggedInUser) {
      throw new Error("Login failed. Please try again.");
    }

    persistSessionToken(token);
    saveUser(loggedInUser);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    clearSessionToken();
    clearUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && getStoredSessionToken()),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
