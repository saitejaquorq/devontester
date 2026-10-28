// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Table, THead, TBody, TR, TH, TD, Avatar, Separator, Tabs, Stat, Empty } = UI;

const rgba = (hex, a) => {
  const h = String(hex || "#000000").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const PATIENT = {
  id: "PT-10492",
  first_name: "Ellie",
  last_name: "Dawson",
  phone: "07700 900412",
  email: "ellie.dawson@example.com",
  created_at: "14 Mar 2025",
  updated_at: "28 Oct 2026",
  registered_with: "Dr Amara Osei",
  synced_at: "14:28 today",
};

const APPOINTMENTS = [
  {
    id: "AP-2184",
    bucket: "upcoming",
    date: "Wed 4 Nov 2026",
    time: "09:20 – 09:40",
    provider: "Dr Amara Osei",
    specialty: "General practice",
    status: "booked",
    reason_note: "Blood-pressure recheck. Asked for the first slot of the day.",
  },
  {
    id: "AP-2203",
    bucket: "upcoming",
    date: "Tue 15 Dec 2026",
    time: "14:00 – 14:20",
    provider: "Nurse Priya Raman",
    specialty: "Practice nursing",
    status: "booked",
    reason_note: "Flu vaccination. Walk-in enquiry converted to a booked slot.",
  },
  {
    id: "AP-2097",
    bucket: "past",
    date: "Thu 9 Oct 2026",
    time: "11:15 – 11:35",
    provider: "Dr Amara Osei",
    specialty: "General practice",
    status: "attended",
    reason_note: "Sore throat, three days. Asked the desk about a sick note.",
  },
  {
    id: "AP-2042",
    bucket: "past",
    date: "Tue 23 Sep 2026",
    time: "16:40 – 17:00",
    provider: "Dr Marcus Feld",
    specialty: "Dermatology",
    status: "no_show",
    reason_note: "Mole review. Rang the mobile at 16:55, no answer.",
  },
  {
    id: "AP-1968",
    bucket: "past",
    date: "Mon 18 Aug 2026",
    time: "08:45 – 09:05",
    provider: "Nurse Priya Raman",
    specialty: "Practice nursing",
    status: "cancelled",
    reason_note: "Cancelled by phone the evening before — away for work.",
  },
  {
    id: "AP-1811",
    bucket: "past",
    date: "Thu 12 Jun 2026",
    time: "10:00 – 10:30",
    provider: "Dr Amara Osei",
    specialty: "General practice",
    status: "attended",
    reason_note: "Annual review. Brought a new address and mobile number.",
  },
];

const STATUS_META = {
  booked: { label: "Booked", tone: "accent", border: "solid" },
  attended: { label: "Attended", tone: "accentFill", border: "solid" },
  no_show: { label: "No-show", tone: "neutral", border: "dashed" },
  cancelled: { label: "Cancelled", tone: "muted", border: "solid" },
};

export default function Screen() {
  const navigate = useNavigate();
  const c = {
    canvas: brand.backgroundColor,
    surface: rgba(brand.primaryColor, 0.035),
    raised: rgba(brand.primaryColor, 0.06),
    line: rgba(brand.primaryColor, 0.11),
    lineSoft: rgba(brand.primaryColor, 0.08),
    text: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    accentSoft: rgba(brand.accentColor, 0.14),
    accentLine: rgba(brand.accentColor, 0.45),
    hover: rgba(brand.primaryColor, 0.045),
  };

  const [form, setForm] = React.useState({
    first_name: PATIENT.first_name,
    last_name: PATIENT.last_name,
    phone: PATIENT.phone,
    email: PATIENT.email,
  });
  const [savedForm, setSavedForm] = React.useState(form);
  const [errors, setErrors] = React.useState({});
  const [saveState, setSaveState] = React.useState("idle"); // idle | saving | error | saved
  const [lastSavedNote, setLastSavedNote] = React.useState(
    "Last saved 28 Oct 2026 at 09:04 by R. Whitfield."
  );
  const [activeTab, setActiveTab] = React.useState("upcoming");
  const [loadingHistory, setLoadingHistory] = React.useState(true);

  const timer = React.useRef(null);
  const tabsRef = React.useRef(null);
  const emailRef = React.useRef(null);

  React.useEffect(() => {
    const t = setTimeout(() => setLoadingHistory(false), 520);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  // The Tabs component renders the strip; tag its controls for the wireframe map.
  React.useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const btns = el.querySelectorAll("button");
    if (btns[0]) btns[0].setAttribute("data-wf", "i-4-0-0");
    if (btns[1]) btns[1].setAttribute("data-wf", "i-4-0-1");
  });

  const dirty =
    form.first_name !== savedForm.first_name ||
    form.last_name !== savedForm.last_name ||
    form.phone !== savedForm.phone ||
    form.email !== savedForm.email;

  const upcoming = APPOINTMENTS.filter((a) => a.bucket === "upcoming");
  const past = APPOINTMENTS.filter((a) => a.bucket === "past");
  const rows = activeTab === "upcoming" ? upcoming : past;

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setSaveState((s) => (s === "saved" ? "idle" : s));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (values) => {
    const next = {};
    if (!values.first_name.trim()) next.first_name = "Add a first name.";
    if (!values.last_name.trim()) next.last_name = "Add a last name.";
    const digits = values.phone.replace(/[^0-9]/g, "");
    if (digits.length && digits.length < 10)
      next.phone = "A UK number needs at least 10 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Enter a valid email address before saving.";
    return next;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setSaveState("error");
      if (found.email && emailRef.current) emailRef.current.focus();
      return; // input is kept exactly as typed
    }
    setSaveState("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSavedForm(form);
      setSaveState("saved");
      setLastSavedNote("Last saved 28 Oct 2026 at 14:32 by R. Whitfield.");
    }, 700);
  };

  const fullName = `${savedForm.first_name} ${savedForm.last_name}`.trim();

  const firstError =
    errors.email || errors.first_name || errors.last_name || errors.phone;

  const label = "text-[11px] uppercase tracking-[0.18em]";

  const inputStyle = (bad) => ({
    backgroundColor: bad ? rgba(brand.primaryColor, 0.02) : c.surface,
    borderColor: bad ? c.accent : c.line,
    color: c.text,
    borderRadius: brand.radius,
    fontFamily: brand.fontBody,
  });

  const StatusBadge = ({ status }) => {
    const meta = STATUS_META[status];
    const isAccent = meta.tone === "accent" || meta.tone === "accentFill";
    const Glyph =
      status === "attended"
        ? Icons.CheckCircle
        : status === "booked"
        ? Icons.Clock
        : status === "no_show"
        ? Icons.AlertCircle
        : Icons.X;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${label}`}
        style={{
          border: `1px ${meta.border} ${isAccent ? c.accentLine : c.line}`,
          backgroundColor:
            meta.tone === "accentFill" ? c.accentSoft : "transparent",
          color: isAccent ? c.accent : c.muted,
          borderRadius: brand.radius,
          whiteSpace: "nowrap",
        }}
      >
        <Glyph className="h-3 w-3" aria-hidden="true" />
        {meta.label}
      </span>
    );
  };

  return (
    <div
      className="v-root mx-auto w-full max-w-6xl px-6 py-8 lg:px-10"
      style={{
        color: c.text,
        fontFamily: brand.fontBody,
        "--v-accent": c.accent,
        "--v-line": c.line,
        "--v-muted": c.muted,
        "--v-text": c.text,
        "--v-surface": c.surface,
        "--v-hover": c.hover,
      }}
    >
      <style>{`
        .v-root :focus-visible { outline: 2px solid var(--v-accent); outline-offset: 2px; border-radius: 6px; }
        .v-root input::placeholder { color: var(--v-muted); opacity: .75; }
        .v-trow { transition: background-color .18s ease; }
        .v-trow:hover { background-color: var(--v-hover); }
        .v-enter { animation: vFade .34s cubic-bezier(.22,.8,.3,1) both; }
        @keyframes vFade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        .v-skel { animation: vPulse 1.3s ease-in-out infinite; background: var(--v-hover); }
        @keyframes vPulse { 0%,100% { opacity: .35; } 50% { opacity: .75; } }
        .v-tabs button { font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
          color: var(--v-muted); background: transparent; border: 0; border-bottom: 1px solid transparent;
          padding: 10px 2px; margin-right: 28px; min-height: 44px; transition: color .18s ease, border-color .18s ease; }
        .v-tabs button:hover { color: var(--v-text); }
        .v-tabs button[aria-selected="true"], .v-tabs button[data-state="active"], .v-tabs .v-active {
          color: var(--v-accent); border-bottom-color: var(--v-accent); }
        .v-empty { border: 1px solid var(--v-line); background: var(--v-surface); border-radius: 6px; padding: 56px 24px; }
        .v-empty h1, .v-empty h2, .v-empty h3, .v-empty strong, .v-empty [class*="title"] { color: var(--v-text); font-family: ${brand.fontHeading}; }
        .v-empty p, .v-empty span { color: var(--v-muted); }
        .v-stat [class*="label"], .v-stat dt { color: var(--v-muted); }
        @media (prefers-reduced-motion: reduce) {
          .v-root *, .v-root *::before { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Row 1 ------------------------------------------------------------- */}
      <div className="grid grid-cols-12 items-end gap-6">
        <div className="col-span-12 md:col-span-8" data-wf="b-0-0">
          <p className={label} style={{ color: c.accent }}>
            Patient record
            <span
              className="ml-3"
              style={{ color: c.muted, fontVariantNumeric: "tabular-nums" }}
            >
              {PATIENT.id}
            </span>
          </p>
          <h1
            className="mt-3 text-[36px] leading-[1.15]"
            style={{ fontFamily: brand.fontHeading, color: c.text }}
          >
            {fullName}
          </h1>
          <p className="mt-2 text-sm" style={{ color: c.muted }}>
            Front-desk record · registered with {PATIENT.registered_with}
          </p>
        </div>
        <div className="col-span-12 md:col-span-4 md:justify-self-end">
          <Button
            data-wf="b-0-1"
            onClick={() => navigate("calendar")}
            className="inline-flex min-h-[44px] items-center gap-2 px-5 text-sm font-medium"
            style={{
              backgroundColor: c.accent,
              color: c.canvas,
              borderRadius: brand.radius,
              border: `1px solid ${c.accent}`,
            }}
          >
            <Icons.Plus className="h-4 w-4" aria-hidden="true" />
            Book appointment
          </Button>
        </div>
      </div>

      <div className="mt-8" style={{ borderTop: `1px solid ${c.accentLine}` }} />

      <form onSubmit={handleSave} noValidate>
        {/* Row 2 ----------------------------------------------------------- */}
        <div className="mt-8 grid grid-cols-12 gap-6">
          <Card
            data-wf="b-1-0"
            className="col-span-12 lg:col-span-7"
            style={{
              backgroundColor: c.surface,
              border: `1px solid ${c.line}`,
              borderRadius: brand.radius,
            }}
          >
            <CardHeader className="px-6 pt-6">
              <CardTitle
                className="text-[20px]"
                style={{ fontFamily: brand.fontHeading, color: c.text }}
              >
                Contact details
              </CardTitle>
              <CardDescription className="text-sm" style={{ color: c.muted }}>
                How the desk reaches this patient. Changes save straight to the
                record.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <Label
                    htmlFor="first_name"
                    className={`${label} block`}
                    style={{ color: c.muted }}
                  >
                    First name
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    data-wf="i-1-0-0"
                    value={form.first_name}
                    onChange={setField("first_name")}
                    aria-invalid={errors.first_name ? "true" : undefined}
                    aria-describedby={errors.first_name ? "err-first" : undefined}
                    className="mt-2 h-11 w-full px-3 text-sm"
                    style={inputStyle(!!errors.first_name)}
                  />
                  {errors.first_name && (
                    <p id="err-first" className="mt-2 text-xs" style={{ color: c.accent }}>
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="last_name"
                    className={`${label} block`}
                    style={{ color: c.muted }}
                  >
                    Last name
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    data-wf="i-1-0-1"
                    value={form.last_name}
                    onChange={setField("last_name")}
                    aria-invalid={errors.last_name ? "true" : undefined}
                    aria-describedby={errors.last_name ? "err-last" : undefined}
                    className="mt-2 h-11 w-full px-3 text-sm"
                    style={inputStyle(!!errors.last_name)}
                  />
                  {errors.last_name && (
                    <p id="err-last" className="mt-2 text-xs" style={{ color: c.accent }}>
                      {errors.last_name}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className={`${label} block`}
                    style={{ color: c.muted }}
                  >
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    data-wf="i-1-0-2"
                    value={form.phone}
                    onChange={setField("phone")}
                    aria-invalid={errors.phone ? "true" : undefined}
                    aria-describedby={errors.phone ? "err-phone" : "hint-phone"}
                    className="mt-2 h-11 w-full px-3 text-sm"
                    style={{
                      ...inputStyle(!!errors.phone),
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                  {errors.phone ? (
                    <p id="err-phone" className="mt-2 text-xs" style={{ color: c.accent }}>
                      {errors.phone}
                    </p>
                  ) : (
                    <p id="hint-phone" className="mt-2 text-xs" style={{ color: c.muted }}>
                      Mobile preferred for day-of calls.
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className={`${label} block`}
                    style={{ color: c.muted }}
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    ref={emailRef}
                    data-wf="i-1-0-3"
                    value={form.email}
                    onChange={setField("email")}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    className="mt-2 h-11 w-full px-3 text-sm"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && (
                    <p id="err-email" className="mt-2 text-xs" style={{ color: c.accent }}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            data-wf="b-1-1"
            className="col-span-12 lg:col-span-5"
            style={{
              backgroundColor: c.raised,
              border: `1px solid ${c.line}`,
              borderRadius: brand.radius,
            }}
          >
            <CardContent className="px-6 py-6">
              <Stat
                className="v-stat"
                label="Appointments on record"
                value="6"
                hint="2 upcoming · 4 past"
              />
              <div className="my-5" style={{ borderTop: `1px solid ${c.lineSoft}` }}>
                <Separator className="opacity-0" />
              </div>
              <dl className="space-y-3 text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
                {[
                  ["Record created", PATIENT.created_at],
                  ["Last updated", PATIENT.updated_at],
                  ["Next visit", "Wed 4 Nov 2026, 09:20"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className={label} style={{ color: c.muted }}>
                      {k}
                    </dt>
                    <dd style={{ color: k === "Next visit" ? c.accent : c.text }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <p
                className="mt-5 flex items-center gap-2 text-xs"
                style={{ color: c.muted }}
              >
                <Icons.Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Synced {PATIENT.synced_at}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Row 3 ----------------------------------------------------------- */}
        <p
          data-wf="b-2-0"
          className="mt-6 flex items-start gap-3 px-4 py-3 text-sm"
          style={{
            color: c.muted,
            borderLeft: `1px solid ${c.accentLine}`,
            backgroundColor: c.surface,
            borderRadius: `0 ${brand.radius} ${brand.radius} 0`,
          }}
        >
          <Icons.FileText
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: c.accent }}
            aria-hidden="true"
          />
          Contact and appointment details only. No diagnoses, prescriptions or lab
          results are held in this tool.
        </p>

        {/* Row 4 ----------------------------------------------------------- */}
        <div className="mt-6 grid grid-cols-12 items-center gap-6">
          <div className="col-span-12 md:col-span-4">
            <Button
              type="submit"
              data-wf="b-3-0"
              disabled={saveState === "saving"}
              className="inline-flex min-h-[44px] items-center gap-2 px-5 text-sm font-medium"
              style={{
                backgroundColor: dirty && saveState !== "saving" ? c.accent : "transparent",
                color: dirty && saveState !== "saving" ? c.canvas : c.accent,
                border: `1px solid ${c.accent}`,
                borderRadius: brand.radius,
                opacity: saveState === "saving" ? 0.65 : 1,
                cursor: saveState === "saving" ? "progress" : "pointer",
                transition: "background-color .2s ease, color .2s ease",
              }}
            >
              {saveState === "saving" ? (
                <>
                  <span
                    className="v-skel inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.accent }}
                    aria-hidden="true"
                  />
                  Saving changes…
                </>
              ) : (
                <>
                  <Icons.Check className="h-4 w-4" aria-hidden="true" />
                  Save changes
                </>
              )}
            </Button>
          </div>
          <div className="col-span-12 text-sm md:col-span-8">
            {saveState === "error" ? (
              <p
                data-wf="b-3-1"
                role="alert"
                className="flex items-center gap-2"
                style={{ color: c.accent }}
              >
                <Icons.AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {firstError} Nothing was saved — your edits are still here.
              </p>
            ) : saveState === "saved" ? (
              <p
                data-wf="b-3-1"
                role="status"
                aria-live="polite"
                className="v-enter flex items-center gap-2"
                style={{ color: c.accent }}
              >
                <Icons.CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Contact details saved. {lastSavedNote}
              </p>
            ) : dirty ? (
              <p data-wf="b-3-1" className="flex items-center gap-2" style={{ color: c.muted }}>
                <Icons.Edit className="h-4 w-4 shrink-0" aria-hidden="true" />
                Unsaved changes on this record.
              </p>
            ) : (
              <p data-wf="b-3-1" style={{ color: c.muted }}>
                {lastSavedNote}
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Row 5 ------------------------------------------------------------- */}
      <div className="mt-12">
        <h2
          className="text-[22px]"
          style={{ fontFamily: brand.fontHeading, color: c.text }}
        >
          Visit history
        </h2>
        <p className="mt-2 max-w-[62ch] text-sm" style={{ color: c.muted }}>
          Every appointment booked for {savedForm.first_name} at this clinic, with
          the front-desk note taken at booking.
        </p>

        <div
          data-wf="b-4-0"
          ref={tabsRef}
          className="v-tabs mt-6"
          style={{ borderBottom: `1px solid ${c.line}` }}
        >
          <Tabs
            tabs={[
              { key: "upcoming", label: `Upcoming (${upcoming.length})` },
              { key: "past", label: `Past (${past.length})` },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {/* Row 6 ------------------------------------------------------------- */}
      <div
        role="region"
        aria-label={
          activeTab === "upcoming" ? "Upcoming appointments" : "Past appointments"
        }
      >
        {loadingHistory ? (
          <div className="mt-6 space-y-3" aria-live="polite">
            <p className={label} style={{ color: c.muted }}>
              Fetching visit history…
            </p>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="v-skel h-14"
                style={{ borderRadius: brand.radius, animationDelay: `${i * 0.12}s` }}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : rows.length > 0 ? (
          <div
            data-wf="b-5-0"
            className="mt-2 overflow-x-auto"
            style={{ border: `1px solid ${c.line}`, borderRadius: brand.radius }}
          >
            <Table
              className="w-full text-sm"
              style={{ fontVariantNumeric: "tabular-nums", borderCollapse: "collapse" }}
            >
              <caption className="sr-only">
                {activeTab === "upcoming" ? "Upcoming" : "Past"} appointments for{" "}
                {fullName}
              </caption>
              <THead>
                <TR style={{ backgroundColor: c.raised }}>
                  <TH
                    data-wf="i-5-0-0"
                    scope="col"
                    className={`${label} px-5 py-3 text-left`}
                    style={{ color: c.muted, borderBottom: `1px solid ${c.line}` }}
                  >
                    Date &amp; time
                  </TH>
                  <TH
                    data-wf="i-5-0-1"
                    scope="col"
                    className={`${label} px-5 py-3 text-left`}
                    style={{ color: c.muted, borderBottom: `1px solid ${c.line}` }}
                  >
                    Provider
                  </TH>
                  <TH
                    data-wf="i-5-0-2"
                    scope="col"
                    className={`${label} px-5 py-3 text-left`}
                    style={{ color: c.muted, borderBottom: `1px solid ${c.line}` }}
                  >
                    Status
                  </TH>
                  <TH
                    data-wf="i-5-0-3"
                    scope="col"
                    className={`${label} px-5 py-3 text-left`}
                    style={{ color: c.muted, borderBottom: `1px solid ${c.line}` }}
                  >
                    Reason note
                  </TH>
                </TR>
              </THead>
              <TBody key={activeTab}>
                {rows.map((a, i) => (
                  <TR
                    key={a.id}
                    className="v-trow v-enter cursor-pointer"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      borderTop: i === 0 ? "none" : `1px solid ${c.lineSoft}`,
                    }}
                    onClick={() => navigate("calendar")}
                  >
                    <TD className="px-5 py-4 align-top" style={{ minWidth: 190 }}>
                      <button
                        type="button"
                        data-wf={`i-5-0-0-${a.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("calendar");
                        }}
                        className="group text-left"
                        aria-label={`Open ${a.date} at ${a.time} with ${a.provider} in the provider calendar`}
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 0,
                          color: c.text,
                        }}
                      >
                        <span
                          className="block"
                          style={{ fontFamily: brand.fontHeading, fontSize: 15 }}
                        >
                          {a.date}
                        </span>
                        <span
                          className="mt-1 flex items-center gap-1.5 text-xs"
                          style={{ color: a.bucket === "upcoming" ? c.accent : c.muted }}
                        >
                          {a.time}
                          <Icons.ChevronRight className="h-3 w-3" aria-hidden="true" />
                        </span>
                      </button>
                    </TD>
                    <TD className="px-5 py-4 align-top">
                      <span className="flex items-center gap-2.5">
                        <Avatar name={a.provider} className="h-7 w-7 shrink-0" />
                        <span>
                          <span className="block" style={{ color: c.text }}>
                            {a.provider}
                          </span>
                          <span className="block text-xs" style={{ color: c.muted }}>
                            {a.specialty}
                          </span>
                        </span>
                      </span>
                    </TD>
                    <TD className="px-5 py-4 align-top">
                      <StatusBadge status={a.status} />
                    </TD>
                    <TD
                      className="px-5 py-4 align-top"
                      style={{ color: c.muted, maxWidth: 360 }}
                    >
                      {a.reason_note}
                      <span className="mt-1 block text-xs" style={{ color: c.muted, opacity: 0.8 }}>
                        Ref {a.id}
                      </span>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        ) : (
          /* Row 7 --------------------------------------------------------- */
          <div data-wf="b-6-0" className="mt-2">
            <Empty
              className="v-empty"
              title={
                activeTab === "upcoming"
                  ? "No upcoming visits booked"
                  : "No appointments on record"
              }
              description={
                activeTab === "upcoming"
                  ? `${savedForm.first_name} has nothing booked ahead. Use Book appointment at the top of this record to add one.`
                  : "No appointments on record for this patient. Once a visit is booked and marked attended it will show here."
              }
            />
          </div>
        )}
      </div>

      <p className="mt-10 text-xs" style={{ color: c.muted }}>
        Selecting a visit opens that slot in the provider calendar, where you can
        reschedule, cancel or mark its status.
      </p>
    </div>
  );
}
