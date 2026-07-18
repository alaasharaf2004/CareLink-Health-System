import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  AUTH_PROFILE_KEY,
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
} from "../constants/authStorage";

const AuthContext = createContext(null);

function readStoredProfile() {
  try {
    const raw = localStorage.getItem(AUTH_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredAuth() {
  return {
    token: localStorage.getItem(AUTH_TOKEN_KEY),
    role: localStorage.getItem(AUTH_ROLE_KEY),
    profile: readStoredProfile(),
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const setSession = useCallback(({ token, role, profile }) => {
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

    if (profile) {
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(AUTH_PROFILE_KEY);
    }

    setAuth({
      token: token ?? null,
      role: role ?? null,
      profile: profile ?? null,
    });
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_PROFILE_KEY);
    setAuth({ token: null, role: null, profile: null });
  }, []);

  const value = useMemo(
    () => ({
      token: auth.token,
      role: auth.role,
      profile: auth.profile,
      isAuthenticated: Boolean(auth.token),
      setSession,
      clearSession,
    }),
    [auth.token, auth.role, auth.profile, setSession, clearSession]
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
