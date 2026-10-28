import * as React from "react";

import {
  apiFetch,
  clearSessionToken,
  getSessionToken,
  setSessionToken,
  SESSION_EXPIRED_EVENT,
} from "@/lib/api";

export type SessionUser = {
  id: string;
  username: string;
  role: string;
};

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  user: SessionUser | null;
};

type AuthContextValue = AuthState & {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

type LoginResponse = { access_token: string; role: string };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ status: "loading", user: null });

  const resolveSession = React.useCallback(async () => {
    const token = getSessionToken();
    if (!token) {
      setState({ status: "unauthenticated", user: null });
      return;
    }
    try {
      const user = await apiFetch<SessionUser>("/auth/me");
      setState({ status: "authenticated", user });
    } catch {
      clearSessionToken();
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  React.useEffect(() => {
    resolveSession();
  }, [resolveSession]);

  React.useEffect(() => {
    function onExpired() {
      setState({ status: "unauthenticated", user: null });
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = React.useCallback(async (username: string, password: string) => {
    const result = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setSessionToken(result.access_token);
    const user = await apiFetch<SessionUser>("/auth/me");
    setState({ status: "authenticated", user });
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Logging out clears the local session regardless of whether the API call succeeded.
    }
    clearSessionToken();
    setState({ status: "unauthenticated", user: null });
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
