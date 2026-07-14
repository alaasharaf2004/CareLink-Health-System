import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
} from "../constants/authStorage";

const AuthContext = createContext(null);

function readStoredAuth() {
  return {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    role: localStorage.getItem(AUTH_ROLE_KEY),
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const setSession = useCallback(({ token, role }) => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    if (role) {
      localStorage.setItem(AUTH_ROLE_KEY, role);
    } else {
      localStorage.removeItem(AUTH_ROLE_KEY);
    }

    setAuth({ token: token ?? null, role: role ?? null });
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    setAuth({ token: null, role: null });
  }, []);

  const value = useMemo(
    () => ({
      token: auth.token,
      role: auth.role,
      isAuthenticated: Boolean(auth.token),
      setSession,
      clearSession,
    }),
    [auth.token, auth.role, setSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
