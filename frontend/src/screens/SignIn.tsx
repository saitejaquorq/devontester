// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AlertCircle } = Icons;

const PRODUCT = "DevonTester";
const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const DEMO_ACCOUNT = { username: "r.okonkwo", password: "frontdesk" };
const SESSION_NOTE = "Your last session ended at 4:12 pm after 30 minutes idle.";

export default function Screen() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("idle"); // idle | checking | signed-in
  const [error, setError] = React.useState(null); // null | "missing" | "credentials"
  const [focused, setFocused] = React.useState(null);

  React.useEffect(() => {
    if (status !== "checking") return undefined;
    const t = setTimeout(() => {
      const ok =
        username.trim().toLowerCase() === DEMO_ACCOUNT.username &&
        password === DEMO_ACCOUNT.password;
      if (ok) {
        setError(null);
        setStatus("signed-in");
      } else {
        setStatus("idle");
        setError("credentials");
      }
    }, 650);
    return () => clearTimeout(t);
  }, [status, username, password]);

  React.useEffect(() => {
    if (status !== "signed-in") return undefined;
    const t = setTimeout(() => navigate("today"), 700);
    return () => clearTimeout(t);
  }, [status]);

  const submit = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!username.trim() || !password) {
      setError("missing");
      return;
    }
    setError(null);
    setStatus("checking");
  };

  const busy = status !== "idle";
  const invalid = error === "credentials";
  const field = (name) => ({
    border: invalid
      ? "1px solid rgba(255,255,255,0.28)"
      : HAIRLINE,
    borderRadius: brand.radius,
    height: 46,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
    boxShadow: focused === name ? `0 0 0 2px ${brand.accentColor}` : "none",
    transition: "box-shadow 140ms ease, border-color 140ms ease",
  });
  const label = { color: brand.neutralColor, letterSpacing: "0.18em" };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor }}
    >
      <style>{`
        @keyframes vl-rise { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .vl-rise { animation: vl-rise 200ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .vl-rise { animation: none; } }
      `}</style>

      <main
        className="w-full max-w-md p-10"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: HAIRLINE, borderRadius: brand.radius }}
      >
        <p className="text-xs uppercase" style={label}>{PRODUCT}</p>
        <h1 data-wf="b-0-0" className="mt-3 text-3xl leading-tight" style={{ fontFamily: brand.fontHeading }}>
          Sign in to DevonTester front desk
        </h1>
        <div aria-hidden className="mt-4 h-px w-12" style={{ backgroundColor: brand.accentColor }} />

        <div data-wf="b-1-0" className="mt-4">
          <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
            Front-desk staff accounts only. Patients and clinicians do not have logins to this tool.
          </p>
          <p className="mt-3 text-[11px] uppercase" style={label}>{SESSION_NOTE}</p>
        </div>

        {status === "signed-in" ? (
          <div className="mt-8">
            <p role="status" className="text-xl" style={{ fontFamily: brand.fontHeading }}>
              Signed in as Rose Okonkwo.
            </p>
            <p className="mt-2 text-sm" style={{ color: brand.neutralColor }}>
              Opening today&rsquo;s appointments&hellip;
            </p>
          </div>
        ) : (
          <form data-wf="b-2-0" className="mt-8 space-y-5" onSubmit={submit} noValidate>
            <div className="space-y-2">
              <label htmlFor="vl-username" className="block text-xs uppercase" style={label}>Username</label>
              <input
                data-wf="i-2-0-0"
                id="vl-username"
                name="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                disabled={busy}
                value={username}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={invalid || (error === "missing" && !username.trim()) || undefined}
                aria-describedby="vl-signin-message"
                className="w-full px-3 text-sm outline-none disabled:opacity-60"
                style={field("username")}
              />
              {error === "missing" && !username.trim() ? (
                <p className="text-xs" style={{ color: brand.accentColor }}>Enter your staff username.</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="vl-password" className="block text-xs uppercase" style={label}>Password</label>
              <input
                data-wf="i-2-0-1"
                id="vl-password"
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={busy}
                value={password}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={invalid || (error === "missing" && !password) || undefined}
                aria-describedby="vl-signin-message"
                className="w-full px-3 text-sm outline-none disabled:opacity-60"
                style={field("password")}
              />
              {error === "missing" && !password ? (
                <p className="text-xs" style={{ color: brand.accentColor }}>Enter your password.</p>
              ) : null}
            </div>

            <p className="text-[11px] uppercase" style={label}>
              Test desk account: {DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
            </p>

            <div data-wf="b-3-0" id="vl-signin-message" role="alert" aria-live="polite">
              {error === "credentials" ? (
                <p
                  className="vl-rise flex items-start gap-2 px-3 py-3 text-sm"
                  style={{ border: HAIRLINE, borderLeft: `2px solid ${brand.accentColor}`, borderRadius: brand.radius, backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                  <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" style={{ color: brand.accentColor }} />
                  <span>Username or password is incorrect. Please try again.</span>
                </p>
              ) : error === "missing" ? (
                <p className="vl-rise text-sm" style={{ color: brand.neutralColor }}>
                  Fill in both fields to sign in.
                </p>
              ) : null}
            </div>

            <div data-wf="b-4-0">
              <button
                type="submit"
                disabled={busy}
                className="h-12 w-full text-xs font-bold uppercase tracking-[0.25em] outline-none transition-opacity hover:opacity-90 focus-visible:opacity-100 disabled:opacity-70"
                style={{
                  backgroundColor: brand.accentColor,
                  color: brand.backgroundColor,
                  borderRadius: brand.radius,
                  boxShadow: focused === "submit" ? `0 0 0 2px ${brand.backgroundColor}, 0 0 0 4px ${brand.accentColor}` : "none",
                }}
                onFocus={() => setFocused("submit")}
                onBlur={() => setFocused(null)}
              >
                {status === "checking" ? "Checking credentials…" : "Sign in"}
              </button>
              <p className="mt-4 text-[11px] uppercase" style={label}>
                Encrypted in transit (HTTPS) &middot; sign out when you leave the desk
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
