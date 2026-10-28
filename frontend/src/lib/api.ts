/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails --
// which `vite build` does not catch, because it tree-shakes this module out when no screen
// imports it yet.
//
// Where the generated API lives.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build. The
// fallback is the local backend so a bare `npm run dev` still points somewhere real.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// Every authenticated call sends the signed-in receptionist's session JWT, issued by
// POST /auth/login and held here for the lifetime of the browser tab (and across reloads,
// via localStorage). There is no build-time secret anymore -- see docs/sdlc ADR for US-001.
const SESSION_STORAGE_KEY = "devontester.session_token";

// Dispatched on `window` the moment the API rejects a request as unauthenticated (401), so
// anything holding session state (see lib/auth.ts) can clear itself and the route guard can
// send the user back to /sign-in, without api.ts needing to know about routing.
export const SESSION_EXPIRED_EVENT = "devontester:session-expired";

export function getSessionToken(): string | null {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, token);
  } catch {
    // Storage unavailable (e.g. private mode) -- the session just won't survive a reload.
  }
}

export function clearSessionToken(): void {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getSessionToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (response.status === 401) {
    clearSessionToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new Error(`${init?.method ?? "GET"} ${path} failed: 401`);
  }
  if (!response.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} failed: ${response.status}`);
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
