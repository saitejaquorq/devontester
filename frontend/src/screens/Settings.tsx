// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Select,
  Badge,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Avatar,
  Empty,
} = UI;

const {
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  Edit,
  AlertCircle,
  CheckCircle,
} = Icons;

const withAlpha = (hex, a) => {
  const h = String(hex || "#000000").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Velvet token roles — every colour traced back to a brand role.
// "ember" is the one warning tone: a warm copper that sits inside the
// Velvet metal language and never competes with the sage accent.
const EMBER = "#c9896b";

// useAuth() throws outside an AuthProvider. Settings is sometimes exercised in
// isolation (e.g. a bare scope-boundary test), and in that situation there is
// no session to read a role from -- so this screen must never crash, and must
// never guess "admin" when it cannot ask. It simply behaves as if signed in as
// staff until a real session says otherwise.
function useSafeAuth() {
  try {
    return useAuth();
  } catch {
    return null;
  }
}

const ROLE_LABELS = { username: "Username", password: "Password", role: "Role" };

// Turns a thrown ApiError into the same { fields, message } shape the client-side
// validator produces, so the form can highlight the field(s) the API rejected (422)
// without inventing a second error-rendering path.
function describeAccountError(err) {
  if (err instanceof ApiError && err.status === 422 && err.body && Array.isArray(err.body.detail)) {
    const fields = [];
    const sentences = [];
    err.body.detail.forEach((d) => {
      const loc = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : null;
      if (loc && fields.indexOf(loc) === -1) fields.push(loc);
      const label = (loc && ROLE_LABELS[loc]) || "This field";
      sentences.push(label + " " + (d.msg || "is invalid") + ".");
    });
    if (sentences.length) return { fields, message: sentences.join(" ") };
  }
  if (err instanceof ApiError && err.status === 409) {
    return { fields: ["username"], message: "That username is already taken." };
  }
  return {
    fields: [],
    message: "Something went wrong saving this account. Nothing you typed has been lost.",
  };
}

const HELP_ITEMS = [
  {
    id: "help-signin",
    wf: "i-5-0-0",
    title: "Signing in and signing out at the front desk",
    summary: "Start your shift, and close the session before you step away.",
    steps: [
      "Open DevonTester and enter the username and password an admin issued to you.",
      "If sign-in fails, the message will not say which field was wrong — retype both and try again.",
      "Select Sign out whenever you leave the desk, even for a five-minute break.",
      "Once signed out, the browser back button will not bring patient data back on screen.",
    ],
  },
  {
    id: "help-patients",
    wf: "i-5-0-1",
    title: "Adding a patient and keeping contact details up to date",
    summary: "Name, phone and email only — no clinical information is stored here.",
    steps: [
      "Open Patients and select Add patient.",
      "Enter first name and last name. The record will not save without a name.",
      "Add phone and email. A malformed email address is rejected so the record stays usable.",
      "To correct details later, open the patient record, edit the contact fields and save.",
    ],
  },
  {
    id: "help-booking",
    wf: "i-5-0-2",
    title: "Booking an appointment into a provider's calendar",
    summary: "Pick the provider, pick the slot, link the patient, add the reason note.",
    steps: [
      "Open the provider calendar and choose the provider, then the day or week view.",
      "Select an open slot and link the patient by searching their name.",
      "Add a short reason-for-visit note, such as “Follow-up — knee brace fitting”.",
      "Save. The visit appears in the slot with the status Booked.",
      "If the provider already has something overlapping that slot, you are warned before it is confirmed.",
    ],
    navLabel: "Open provider calendar",
    navRoute: "calendar",
  },
  {
    id: "help-reschedule",
    wf: "i-5-0-3",
    title: "Rescheduling or cancelling an appointment",
    summary: "Move a visit to a new time or provider, or release the slot entirely.",
    steps: [
      "Open the appointment from the calendar or from the patient's visit history.",
      "To move it, change the date, time or provider and save — it leaves the original slot.",
      "To cancel, select Cancel appointment and confirm. Nothing changes until you confirm.",
      "Cancelled visits stay in the patient's history, marked Cancelled.",
    ],
  },
  {
    id: "help-status",
    wf: "i-5-0-4",
    title: "Marking attended, no-show or cancelled",
    summary: "Keep the day honest so the history reads correctly tomorrow.",
    steps: [
      "Every appointment starts as Booked the moment you save it.",
      "When the patient arrives at the desk, set the status to Attended.",
      "If they have not arrived by the end of the slot, set No-show.",
      "The status shows on the appointment, the calendar and the patient's visit history.",
    ],
  },
];

const NOT_IN_SCOPE = [
  "No payments, billing or invoicing",
  "No automated patient SMS or email reminders",
  "No EHR / HL7 / FHIR integration",
  "No patient or clinician logins",
];

function formatCreated(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Screen() {
  const navigate = useNavigate();
  const auth = useSafeAuth();
  const isAdmin = auth?.status === "authenticated" && auth.user?.role === "admin";

  const surface = withAlpha(brand.primaryColor, 0.035);
  const surfaceHi = withAlpha(brand.primaryColor, 0.06);
  const hairline = withAlpha(brand.primaryColor, 0.11);
  const hairlineSoft = withAlpha(brand.primaryColor, 0.07);
  const accent = brand.accentColor;
  const muted = brand.neutralColor;

  const [tab, setTab] = React.useState("accounts");
  const [openHelp, setOpenHelp] = React.useState("help-booking");

  const [accounts, setAccounts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  const [form, setForm] = React.useState({ username: "", password: "", role: "staff" });
  const [formError, setFormError] = React.useState(null);
  const [creating, setCreating] = React.useState(false);

  const [editingId, setEditingId] = React.useState(null);
  const [editRole, setEditRole] = React.useState("staff");
  const [confirmId, setConfirmId] = React.useState(null);
  const [rowBusyId, setRowBusyId] = React.useState(null);
  const [rowError, setRowError] = React.useState(null);

  const [banner, setBanner] = React.useState(null);

  const timers = React.useRef([]);
  const tabRefs = React.useRef({});

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const defer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const tabs = isAdmin
    ? [
        { key: "accounts", label: "Accounts", wf: "i-1-0-0" },
        { key: "help", label: "How-to guide", wf: "i-1-0-1" },
      ]
    : [{ key: "help", label: "How-to guide", wf: "i-1-0-1" }];
  const activeTab = isAdmin ? tab : "help";

  const loadAccounts = React.useCallback(() => {
    setLoading(true);
    setLoadError(null);
    return apiFetch("/accounts")
      .then((data) => setAccounts(Array.isArray(data) ? data : []))
      .catch((err) => setLoadError(err))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (isAdmin) loadAccounts();
  }, [isAdmin, loadAccounts]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    const username = form.username.trim();
    const password = form.password;
    const role = form.role;

    const fields = [];
    const sentences = [];
    if (!username) {
      fields.push("username");
      sentences.push("Username is required.");
    }
    if (!password) {
      fields.push("password");
      sentences.push("Password is required.");
    }
    if (fields.length) {
      setFormError({ fields, message: sentences.join(" ") });
      return;
    }

    setFormError(null);
    setCreating(true);
    try {
      await apiFetch("/accounts", {
        method: "POST",
        body: JSON.stringify({ username, password, role }),
      });
      setForm({ username: "", password: "", role: "staff" });
      setBanner({
        text: `${username} added as ${role === "admin" ? "an admin" : "a staff"} account.`,
      });
      await loadAccounts();
    } catch (err) {
      setFormError(describeAccountError(err));
    } finally {
      setCreating(false);
    }
  }

  function startEdit(acct) {
    setEditingId(acct.id);
    setEditRole(acct.role);
    setRowError(null);
    setConfirmId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setRowError(null);
  }

  async function saveEdit(acct) {
    setRowBusyId(acct.id);
    setRowError(null);
    try {
      const updated = await apiFetch(`/accounts/${acct.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: editRole }),
      });
      setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, ...updated } : a)));
      setEditingId(null);
      setBanner({
        text: `${acct.username} is now ${editRole === "admin" ? "an admin" : "a staff"} account.`,
      });
    } catch (err) {
      setRowError(describeAccountError(err).message);
    } finally {
      setRowBusyId(null);
    }
  }

  function askDeactivate(acct) {
    setConfirmId(acct.id);
    setRowError(null);
    setEditingId(null);
  }

  function cancelDeactivate() {
    setConfirmId(null);
  }

  async function confirmDeactivate(acct) {
    setRowBusyId(acct.id);
    setRowError(null);
    try {
      const updated = await apiFetch(`/accounts/${acct.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: false }),
      });
      setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, ...updated } : a)));
      setConfirmId(null);
      setBanner({
        text: `${acct.username} deactivated. They cannot sign in until an admin reactivates the account.`,
      });
    } catch (err) {
      setRowError(describeAccountError(err).message);
    } finally {
      setRowBusyId(null);
    }
  }

  async function reactivate(acct) {
    setRowBusyId(acct.id);
    setRowError(null);
    try {
      const updated = await apiFetch(`/accounts/${acct.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: true }),
      });
      setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, ...updated } : a)));
      setBanner({ text: `${acct.username} reactivated. Their old password still works.` });
    } catch (err) {
      setRowError(describeAccountError(err).message);
    } finally {
      setRowBusyId(null);
    }
  }

  const onTabKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.key === activeTab);
    const nextIdx =
      e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    const nextKey = tabs[nextIdx].key;
    setTab(nextKey);
    defer(() => tabRefs.current[nextKey] && tabRefs.current[nextKey].focus(), 10);
  };

  const labelStyle = {
    fontSize: "11px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: muted,
  };

  const panelStyle = {
    backgroundColor: surface,
    border: `1px solid ${hairline}`,
    borderRadius: brand.radius,
  };

  const ghostBtn =
    "vel-focus vel-ghost inline-flex items-center gap-2 px-3 h-11 text-sm transition-colors";
  const ghostStyle = {
    border: `1px solid ${hairline}`,
    borderRadius: brand.radius,
    color: brand.primaryColor,
    backgroundColor: "transparent",
    fontFamily: brand.fontBody,
  };

  const fieldStyle = (invalid) => ({
    backgroundColor: brand.backgroundColor,
    border: `1px solid ${invalid ? EMBER : hairline}`,
    color: brand.primaryColor,
    borderRadius: brand.radius,
    fontFamily: brand.fontBody,
    height: "44px",
  });

  const invalidField = (key) => Boolean(formError && formError.fields.indexOf(key) !== -1);

  return (
    <div
      className="vel-screen min-h-full w-full px-6 py-10 sm:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        "--vel-accent": accent,
      }}
    >
      <style>{`
        .vel-screen .vel-focus:focus-visible { outline: 2px solid var(--vel-accent); outline-offset: 2px; }
        .vel-screen .vel-ghost:hover { background-color: ${withAlpha(brand.primaryColor, 0.06)}; }
        .vel-screen .vel-primary:hover { filter: brightness(1.08); }
        .vel-screen .vel-primary:active { filter: brightness(0.95); }
        .vel-screen .vel-row:hover { background-color: ${withAlpha(brand.primaryColor, 0.03)}; }
        .vel-screen .vel-link:hover { color: var(--vel-accent); }
        @keyframes vel-row-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
        @keyframes vel-panel-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes vel-fade { from { opacity: 0; } to { opacity: 1; } }
        .vel-screen .vel-row-new { animation: vel-row-in 420ms ease-out both; }
        .vel-screen .vel-panel-in { animation: vel-panel-in 220ms ease-out both; }
        .vel-screen .vel-fade { animation: vel-fade 200ms ease-out both; }
        .vel-screen .vel-steps { animation: vel-panel-in 200ms ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .vel-screen *, .vel-screen *::before, .vel-screen *::after {
            animation-duration: 0.001ms !important; transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl">
        {/* Row 1 — page title */}
        <header data-wf="b-0-0" className="mb-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              style={{ display: "block", width: 28, height: 1, backgroundColor: accent }}
            />
            <p style={labelStyle}>Front desk · Administration</p>
          </div>
          <h1
            className="mt-4 text-[34px] leading-tight sm:text-[40px]"
            style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
          >
            {isAdmin ? "Accounts & help" : "Help"}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: muted }}>
            {isAdmin
              ? "Manage who can sign in at the front desk of Devon Street Clinic, and read the how-to guide for the everyday jobs on the desk."
              : "Read the how-to guide for the everyday jobs on the desk."}
          </p>
        </header>

        {/* Row 2 — tabs */}
        <div data-wf="b-1-0" className="mb-8" style={{ borderBottom: `1px solid ${hairline}` }}>
          <div
            role="tablist"
            aria-label="Accounts and help sections"
            className="flex gap-1"
            onKeyDown={onTabKeyDown}
          >
            {tabs.map((t) => {
              const selected = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  data-wf={t.wf}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${t.key}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  className="vel-focus relative -mb-px px-4 pb-3 pt-2 text-sm transition-colors"
                  style={{
                    color: selected ? brand.primaryColor : muted,
                    borderBottom: `2px solid ${selected ? accent : "transparent"}`,
                    fontFamily: brand.fontBody,
                    letterSpacing: "0.01em",
                  }}
                >
                  {t.label}
                  {t.key === "accounts" ? (
                    <span className="ml-2 text-[11px]" style={{ color: selected ? accent : muted }}>
                      admin only
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "accounts" ? (
          <section
            id="panel-accounts"
            role="tabpanel"
            aria-labelledby="tab-accounts"
            tabIndex={-1}
            className="vel-fade"
          >
            {/* Row 3 — new account form */}
            <section data-wf="b-2-0" className="overflow-hidden" style={panelStyle}>
              <div className="px-6 py-5" style={{ borderBottom: `1px solid ${hairline}` }}>
                <h2 className="text-[22px]" style={{ fontFamily: brand.fontHeading }}>
                  Create an account
                </h2>
              </div>
              <form onSubmit={handleCreate} noValidate className="px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="new-username" className="block" style={labelStyle}>
                      Username
                    </Label>
                    <Input
                      id="new-username"
                      value={form.username}
                      onChange={(e) => setField("username", e.target.value)}
                      aria-invalid={invalidField("username") ? "true" : undefined}
                      className="mt-2 w-full"
                      style={fieldStyle(invalidField("username"))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password" className="block" style={labelStyle}>
                      Temporary password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      aria-invalid={invalidField("password") ? "true" : undefined}
                      className="mt-2 w-full"
                      style={fieldStyle(invalidField("password"))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-role" className="block" style={labelStyle}>
                      Role
                    </Label>
                    <Select
                      id="new-role"
                      value={form.role}
                      onChange={(e) => setField("role", e.target.value)}
                      className="mt-2 w-full"
                      style={fieldStyle(false)}
                      options={[
                        { value: "staff", label: "Staff" },
                        { value: "admin", label: "Admin" },
                      ]}
                    />
                  </div>
                </div>

                {formError ? (
                  <p role="alert" className="mt-4 text-sm" style={{ color: EMBER }}>
                    {formError.message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={creating}
                  className="vel-focus vel-primary mt-5 inline-flex h-11 items-center gap-2 px-5 text-sm font-medium"
                  style={{
                    backgroundColor: accent,
                    color: brand.backgroundColor,
                    borderRadius: brand.radius,
                    border: "none",
                    opacity: creating ? 0.6 : 1,
                  }}
                >
                  {creating ? (
                    <Clock className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {creating ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </section>

            {banner ? (
              <div
                role="status"
                className="vel-panel-in mt-6 flex items-start gap-3 px-4 py-3"
                style={{
                  backgroundColor: withAlpha(accent, 0.1),
                  border: `1px solid ${withAlpha(accent, 0.35)}`,
                  borderRadius: brand.radius,
                }}
              >
                <CheckCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                  style={{ color: accent }}
                />
                <p className="flex-1 text-sm" style={{ color: brand.primaryColor }}>
                  {banner.text}
                </p>
              </div>
            ) : null}

            {rowError ? (
              <p role="alert" className="mt-4 text-sm" style={{ color: EMBER }}>
                {rowError}
              </p>
            ) : null}

            {/* Row 4 — accounts table */}
            <section data-wf="b-3-0" className="mt-8 overflow-hidden" style={panelStyle}>
              <div
                className="flex flex-wrap items-end justify-between gap-3 px-6 py-5"
                style={{ borderBottom: `1px solid ${hairline}` }}
              >
                <div>
                  <h2 className="text-[22px]" style={{ fontFamily: brand.fontHeading }}>
                    Receptionist accounts{" "}
                    <span style={{ color: accent, fontVariantNumeric: "tabular-nums" }}>
                      ({accounts.length})
                    </span>
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: muted }}>
                    {accounts.filter((a) => a.is_active).length} active ·{" "}
                    {accounts.filter((a) => !a.is_active).length} deactivated
                  </p>
                </div>
              </div>

              {loading ? (
                <p role="status" className="px-6 py-10 text-sm" style={{ color: muted }}>
                  Loading accounts…
                </p>
              ) : loadError ? (
                <div className="px-6 py-10">
                  <Empty
                    title="Couldn't load accounts"
                    description="There was a problem reaching the account list. Check your connection and try again."
                    action={
                      <Button
                        type="button"
                        onClick={loadAccounts}
                        className="vel-focus vel-primary inline-flex h-11 items-center gap-2 px-4 text-sm"
                        style={{
                          backgroundColor: accent,
                          color: brand.backgroundColor,
                          borderRadius: brand.radius,
                          border: "none",
                        }}
                      >
                        Try again
                      </Button>
                    }
                  />
                </div>
              ) : accounts.length === 0 ? (
                <div className="px-6 py-10">
                  <Empty
                    title="No receptionist accounts yet"
                    description="Nobody can sign in to DevonTester until an admin creates the first front-desk account."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table
                    className="w-full text-sm"
                    style={{ fontVariantNumeric: "tabular-nums", borderCollapse: "collapse" }}
                  >
                    <THead>
                      <TR style={{ borderBottom: `1px solid ${hairline}` }}>
                        <TH scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Username
                        </TH>
                        <TH scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Role
                        </TH>
                        <TH scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Active
                        </TH>
                        <TH scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Created
                        </TH>
                        <TH scope="col" className="px-6 py-3 text-right font-normal" style={labelStyle}>
                          <span className="sr-only">Account actions</span>
                        </TH>
                      </TR>
                    </THead>
                    <TBody>
                      {accounts.map((a) => {
                        const isEditing = editingId === a.id;
                        const isConfirming = confirmId === a.id;
                        const busy = rowBusyId === a.id;
                        return (
                          <TR key={a.id} className="vel-row transition-colors" style={{ borderBottom: `1px solid ${hairlineSoft}` }}>
                            <TD className="px-6 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <Avatar name={a.username} className="h-9 w-9 shrink-0" />
                                <span>
                                  <span className="block" style={{ color: brand.primaryColor }}>
                                    {a.username}
                                  </span>
                                </span>
                              </div>
                            </TD>
                            <TD className="px-6 py-4 align-middle">
                              {isEditing ? (
                                <Select
                                  aria-label={`Role for ${a.username}`}
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  style={fieldStyle(false)}
                                  options={[
                                    { value: "staff", label: "Staff" },
                                    { value: "admin", label: "Admin" },
                                  ]}
                                />
                              ) : (
                                <Badge
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs"
                                  style={{
                                    backgroundColor:
                                      a.role === "admin" ? withAlpha(accent, 0.12) : "transparent",
                                    border: `1px solid ${a.role === "admin" ? withAlpha(accent, 0.4) : hairline}`,
                                    color: a.role === "admin" ? accent : brand.primaryColor,
                                    borderRadius: brand.radius,
                                  }}
                                >
                                  {a.role === "admin" ? "Admin" : "Staff"}
                                </Badge>
                              )}
                            </TD>
                            <TD className="px-6 py-4 align-middle">
                              <span
                                className="inline-flex items-center gap-2"
                                style={{ color: a.is_active ? brand.primaryColor : muted }}
                              >
                                {a.is_active ? (
                                  <CheckCircle className="h-4 w-4" aria-hidden="true" style={{ color: accent }} />
                                ) : (
                                  <X className="h-4 w-4" aria-hidden="true" />
                                )}
                                {a.is_active ? "Active" : "Deactivated"}
                              </span>
                            </TD>
                            <TD className="px-6 py-4 align-middle" style={{ color: muted }}>
                              {formatCreated(a.created_at)}
                            </TD>
                            <TD className="px-6 py-4 text-right align-middle">
                              {isConfirming ? (
                                <div className="flex items-center justify-end gap-3">
                                  <span className="text-sm" style={{ color: muted }}>
                                    Deactivate {a.username}?
                                  </span>
                                  <Button
                                    type="button"
                                    onClick={() => confirmDeactivate(a)}
                                    disabled={busy}
                                    aria-label={`Confirm deactivating ${a.username}`}
                                    className={ghostBtn}
                                    style={{ ...ghostStyle, color: EMBER, border: `1px solid ${withAlpha(EMBER, 0.45)}` }}
                                  >
                                    {busy ? "Deactivating…" : "Confirm"}
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={cancelDeactivate}
                                    aria-label={`Cancel deactivating ${a.username}`}
                                    className={ghostBtn}
                                    style={ghostStyle}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : isEditing ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    onClick={() => saveEdit(a)}
                                    disabled={busy}
                                    aria-label={`Save role for ${a.username}`}
                                    className={ghostBtn}
                                    style={ghostStyle}
                                  >
                                    {busy ? "Saving…" : "Save"}
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={cancelEdit}
                                    aria-label={`Cancel editing ${a.username}`}
                                    className={ghostBtn}
                                    style={ghostStyle}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    onClick={() => startEdit(a)}
                                    aria-label={`Edit ${a.username}`}
                                    className={ghostBtn}
                                    style={ghostStyle}
                                  >
                                    <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                                    Edit
                                  </Button>
                                  {a.is_active ? (
                                    <Button
                                      type="button"
                                      onClick={() => askDeactivate(a)}
                                      aria-label={`Deactivate account ${a.username}`}
                                      className={ghostBtn}
                                      style={{ ...ghostStyle, color: EMBER, border: `1px solid ${withAlpha(EMBER, 0.45)}` }}
                                    >
                                      Deactivate
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      onClick={() => reactivate(a)}
                                      disabled={busy}
                                      aria-label={`Reactivate account ${a.username}`}
                                      className={ghostBtn}
                                      style={ghostStyle}
                                    >
                                      {busy ? "Reactivating…" : "Reactivate"}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </div>
              )}
            </section>
          </section>
        ) : null}

        {activeTab === "help" ? (
          <section
            id="panel-help"
            role="tabpanel"
            aria-labelledby="tab-help"
            tabIndex={-1}
            className="vel-fade"
          >
            {!isAdmin ? (
              <div
                className="mb-8 flex flex-wrap items-start gap-4 px-6 py-5"
                style={{ ...panelStyle, backgroundColor: surfaceHi }}
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                  style={{ color: accent }}
                />
                <div className="min-w-[18rem] flex-1">
                  <h2 className="text-[18px]" style={{ fontFamily: brand.fontHeading }}>
                    Accounts is for admins
                  </h2>
                  <p className="mt-2 max-w-[66ch] text-sm leading-relaxed" style={{ color: muted }}>
                    You are signed in as a staff account, so creating, editing and deactivating
                    receptionist logins is not available here. Ask an admin to set up or close an
                    account for you.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Row 6 — guide + scope */}
            <div className="grid gap-6 lg:grid-cols-12">
              <section data-wf="b-5-0" className="lg:col-span-7">
                <div className="overflow-hidden" style={panelStyle}>
                  <div className="px-6 py-5" style={{ borderBottom: `1px solid ${hairline}` }}>
                    <h2 className="text-[22px]" style={{ fontFamily: brand.fontHeading }}>
                      How-to guide for receptionists
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: muted }}>
                      Five everyday jobs at the desk · updated 24 Oct 2026
                    </p>
                  </div>
                  <ul>
                    {HELP_ITEMS.map((item, i) => {
                      const open = openHelp === item.id;
                      return (
                        <li
                          key={item.id}
                          style={{
                            borderBottom:
                              i === HELP_ITEMS.length - 1 ? "none" : `1px solid ${hairlineSoft}`,
                          }}
                        >
                          <h3>
                            <button
                              data-wf={item.wf}
                              type="button"
                              aria-expanded={open}
                              aria-controls={`${item.id}-steps`}
                              onClick={() => setOpenHelp(open ? null : item.id)}
                              className="vel-focus vel-row flex w-full items-start gap-4 px-6 py-5 text-left transition-colors"
                            >
                              <span
                                className="mt-0.5 shrink-0 text-xs"
                                style={{
                                  color: accent,
                                  fontVariantNumeric: "tabular-nums",
                                  letterSpacing: "0.1em",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1">
                                <span className="block text-[16px]" style={{ color: brand.primaryColor }}>
                                  {item.title}
                                </span>
                                <span className="mt-1 block text-sm" style={{ color: muted }}>
                                  {item.summary}
                                </span>
                              </span>
                              <ChevronDown
                                className="mt-1 h-4 w-4 shrink-0 transition-transform duration-200"
                                aria-hidden="true"
                                style={{ color: muted, transform: open ? "rotate(180deg)" : "none" }}
                              />
                            </button>
                          </h3>
                          {open ? (
                            <div id={`${item.id}-steps`} className="vel-steps px-6 pb-6 pl-[4.25rem]">
                              <ol className="space-y-2">
                                {item.steps.map((s, si) => (
                                  <li
                                    key={si}
                                    className="flex gap-3 text-sm leading-relaxed"
                                    style={{ color: brand.primaryColor }}
                                  >
                                    <span aria-hidden="true" style={{ color: accent }}>
                                      ·
                                    </span>
                                    <span className="max-w-[68ch]">{s}</span>
                                  </li>
                                ))}
                              </ol>
                              {item.navRoute ? (
                                <Button
                                  type="button"
                                  onClick={() => navigate(item.navRoute)}
                                  className={`${ghostBtn} mt-5`}
                                  style={ghostStyle}
                                >
                                  <Calendar className="h-4 w-4" aria-hidden="true" />
                                  {item.navLabel}
                                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                                </Button>
                              ) : null}
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              <aside data-wf="b-5-1" className="lg:col-span-5">
                <Card className="h-full" style={{ ...panelStyle, backgroundColor: surfaceHi }}>
                  <CardHeader className="px-6 pt-6">
                    <CardTitle
                      className="text-[20px]"
                      style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
                    >
                      What this tool does not do
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm leading-relaxed" style={{ color: muted }}>
                      Agreed scope for DevonTester. If a patient asks for any of these at the desk,
                      handle it the way the clinic did before.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-2 pt-5">
                    <ul className="space-y-4">
                      {NOT_IN_SCOPE.map((line) => (
                        <li key={line} className="flex items-start gap-3 text-sm leading-relaxed">
                          <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" style={{ color: EMBER }} />
                          <span style={{ color: brand.primaryColor }}>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="block px-6 pb-6 pt-5">
                    <div style={{ borderTop: `1px solid ${hairline}` }} className="pt-4">
                      <p className="text-xs leading-relaxed" style={{ color: muted }}>
                        Single clinic · dummy test records only, never real patient data. Everything
                        the desk needs sits under Today, Calendar and Patients.
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </aside>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
