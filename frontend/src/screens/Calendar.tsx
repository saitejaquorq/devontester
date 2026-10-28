// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Textarea, Label, Select, Badge, Table, THead, TBody, TR, TH, TD } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Search, Calendar, ArrowLeft, ArrowRight } = Icons;

/* ---------------------------------------------------------------
   DevonTester — Provider calendar (route: calendar)
   Velvet: midnight-forest surfaces, hairline borders, display serif.
----------------------------------------------------------------*/

const TODAY = "2026-10-28";
const NOW_SLOT = "11:00";
const NOW_LABEL = "11:12";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* semantic role tokens that are not part of the brand palette */
const WARN = "#d6a56e";   /* no-show / caution */
const DANGER = "#c87f6c"; /* destructive confirm only */

const PROVIDERS = [
  { id: "pr-1", name: "Dr Amina Khan", specialty: "General practice", is_active: true },
  { id: "pr-2", name: "Dr Tomas Lindqvist", specialty: "Dermatology", is_active: true },
  { id: "pr-3", name: "Nurse Grace Obi", specialty: "Nurse-led clinic", is_active: true },
  { id: "pr-4", name: "Dr Priya Raman", specialty: "Paediatrics", is_active: true }
];

const PATIENTS = [
  { id: "pt-1", first_name: "Ellie", last_name: "Dawson", phone: "07700 900412", email: "ellie.dawson@example.com" },
  { id: "pt-2", first_name: "Marcus", last_name: "Whitfield", phone: "07700 900183", email: "m.whitfield@example.com" },
  { id: "pt-3", first_name: "Ada", last_name: "Nwachukwu", phone: "07700 900655", email: "ada.nwa@example.com" },
  { id: "pt-4", first_name: "Joseph", last_name: "Lamb", phone: "07700 900277", email: "joe.lamb@example.com" },
  { id: "pt-5", first_name: "Rosa", last_name: "Marchetti", phone: "07700 900931", email: "r.marchetti@example.com" },
  { id: "pt-6", first_name: "Hugh", last_name: "Bannerman", phone: "07700 900504", email: "hugh.b@example.com" },
  { id: "pt-7", first_name: "Priyanka", last_name: "Sethi", phone: "07700 900718", email: "p.sethi@example.com" },
  { id: "pt-8", first_name: "Tomasz", last_name: "Wojcik", phone: "07700 900266", email: "t.wojcik@example.com" },
  { id: "pt-9", first_name: "Noor", last_name: "Haddad", phone: "07700 900840", email: "noor.haddad@example.com" },
  { id: "pt-10", first_name: "Gavin", last_name: "Pryce", phone: "07700 900119", email: "g.pryce@example.com" },
  { id: "pt-11", first_name: "Beatrice", last_name: "Opoku", phone: "07700 900373", email: "b.opoku@example.com" }
];

const WEEKS = [
  { key: "2026-10-19", label: "Week of 19 Oct 2026" },
  { key: "2026-10-26", label: "Week of 26 Oct 2026" },
  { key: "2026-11-02", label: "Week of 2 Nov 2026" }
];

const SEED_APPOINTMENTS = [
  /* ---- week of 19 Oct — Dr Amina Khan ---- */
  { id: "ap-101", patient_id: "pt-1", provider_id: "pr-1", date: "2026-10-19", start_time: "09:00", end_time: "09:30", status: "attended", reason_note: "First registration appointment, brought ID documents", created_by: "rec.hannah" },
  { id: "ap-102", patient_id: "pt-2", provider_id: "pr-1", date: "2026-10-21", start_time: "11:30", end_time: "12:00", status: "attended", reason_note: "Blood pressure recheck", created_by: "rec.hannah" },
  { id: "ap-103", patient_id: "pt-9", provider_id: "pr-1", date: "2026-10-22", start_time: "14:00", end_time: "14:30", status: "no-show", reason_note: "Sick note renewal — phoned twice, no answer", created_by: "rec.dev" },
  { id: "ap-104", patient_id: "pt-5", provider_id: "pr-1", date: "2026-10-23", start_time: "10:00", end_time: "10:30", status: "cancelled", reason_note: "Cancelled by patient, away for work", created_by: "rec.hannah" },

  /* ---- week of 26 Oct — Dr Amina Khan ---- */
  { id: "ap-201", patient_id: "pt-2", provider_id: "pr-1", date: "2026-10-26", start_time: "08:30", end_time: "09:00", status: "attended", reason_note: "Blood pressure check — follow-up", created_by: "rec.hannah" },
  { id: "ap-202", patient_id: "pt-3", provider_id: "pr-1", date: "2026-10-26", start_time: "09:30", end_time: "10:00", status: "attended", reason_note: "Travel vaccination advice before Ghana trip", created_by: "rec.hannah" },
  { id: "ap-203", patient_id: "pt-4", provider_id: "pr-1", date: "2026-10-26", start_time: "11:00", end_time: "11:30", status: "no-show", reason_note: "Repeat prescription review", created_by: "rec.dev" },
  { id: "ap-204", patient_id: "pt-5", provider_id: "pr-1", date: "2026-10-26", start_time: "14:00", end_time: "15:00", status: "attended", reason_note: "Annual health check — double slot booked", created_by: "rec.hannah" },
  { id: "ap-205", patient_id: "pt-6", provider_id: "pr-1", date: "2026-10-26", start_time: "15:30", end_time: "16:00", status: "cancelled", reason_note: "Patient cancelled, rebooked for Wed 28 Oct", created_by: "rec.hannah" },

  { id: "ap-206", patient_id: "pt-7", provider_id: "pr-1", date: "2026-10-27", start_time: "08:00", end_time: "08:30", status: "attended", reason_note: "Dressing change, asked for earliest slot", created_by: "rec.dev" },
  { id: "ap-207", patient_id: "pt-8", provider_id: "pr-1", date: "2026-10-27", start_time: "10:00", end_time: "10:30", status: "attended", reason_note: "Ear syringing", created_by: "rec.hannah" },
  { id: "ap-208", patient_id: "pt-9", provider_id: "pr-1", date: "2026-10-27", start_time: "11:30", end_time: "12:00", status: "no-show", reason_note: "Sick note renewal", created_by: "rec.hannah" },
  { id: "ap-209", patient_id: "pt-10", provider_id: "pr-1", date: "2026-10-27", start_time: "13:30", end_time: "14:00", status: "attended", reason_note: "Knee pain review, arrived with a walking stick", created_by: "rec.dev" },
  { id: "ap-210", patient_id: "pt-11", provider_id: "pr-1", date: "2026-10-27", start_time: "16:00", end_time: "16:30", status: "attended", reason_note: "Medication review, daughter attending too", created_by: "rec.hannah" },

  { id: "ap-211", patient_id: "pt-2", provider_id: "pr-1", date: "2026-10-28", start_time: "09:00", end_time: "09:30", status: "attended", reason_note: "Follow-up appointment", created_by: "rec.hannah" },
  { id: "ap-212", patient_id: "pt-1", provider_id: "pr-1", date: "2026-10-28", start_time: "10:00", end_time: "10:30", status: "booked", reason_note: "New registration check — asked for a morning slot", created_by: "rec.hannah" },
  { id: "ap-213", patient_id: "pt-6", provider_id: "pr-1", date: "2026-10-28", start_time: "10:30", end_time: "11:00", status: "booked", reason_note: "Rebooked from Monday — travel jab", created_by: "rec.hannah" },
  { id: "ap-214", patient_id: "pt-3", provider_id: "pr-1", date: "2026-10-28", start_time: "12:00", end_time: "12:30", status: "cancelled", reason_note: "Patient called to cancel at 07:55", created_by: "rec.dev" },
  { id: "ap-215", patient_id: "pt-4", provider_id: "pr-1", date: "2026-10-28", start_time: "14:30", end_time: "15:00", status: "booked", reason_note: "Repeat prescription review", created_by: "rec.dev" },
  { id: "ap-216", patient_id: "pt-5", provider_id: "pr-1", date: "2026-10-28", start_time: "16:00", end_time: "17:00", status: "booked", reason_note: "Double slot — Italian interpreter attending", created_by: "rec.hannah" },

  { id: "ap-217", patient_id: "pt-9", provider_id: "pr-1", date: "2026-10-29", start_time: "08:30", end_time: "09:00", status: "booked", reason_note: "Sick note renewal — third attempt", created_by: "rec.hannah" },
  { id: "ap-218", patient_id: "pt-10", provider_id: "pr-1", date: "2026-10-29", start_time: "11:00", end_time: "11:30", status: "booked", reason_note: "Knee pain — physio referral request", created_by: "rec.dev" },
  { id: "ap-219", patient_id: "pt-7", provider_id: "pr-1", date: "2026-10-29", start_time: "13:00", end_time: "13:30", status: "booked", reason_note: "Dressing change", created_by: "rec.hannah" },
  { id: "ap-220", patient_id: "pt-1", provider_id: "pr-1", date: "2026-10-29", start_time: "15:00", end_time: "15:30", status: "booked", reason_note: "Follow-up after registration check", created_by: "rec.hannah" },

  { id: "ap-221", patient_id: "pt-11", provider_id: "pr-1", date: "2026-10-30", start_time: "09:00", end_time: "10:00", status: "booked", reason_note: "Annual review — double slot", created_by: "rec.dev" },
  { id: "ap-222", patient_id: "pt-8", provider_id: "pr-1", date: "2026-10-30", start_time: "11:30", end_time: "12:00", status: "booked", reason_note: "Wound check", created_by: "rec.hannah" },
  { id: "ap-223", patient_id: "pt-2", provider_id: "pr-1", date: "2026-10-30", start_time: "14:00", end_time: "14:30", status: "booked", reason_note: "Blood pressure recheck", created_by: "rec.hannah" },

  /* ---- week of 26 Oct — other providers ---- */
  { id: "ap-301", patient_id: "pt-3", provider_id: "pr-2", date: "2026-10-26", start_time: "09:00", end_time: "09:30", status: "attended", reason_note: "Mole check, referred by Dr Khan", created_by: "rec.hannah" },
  { id: "ap-302", patient_id: "pt-10", provider_id: "pr-2", date: "2026-10-28", start_time: "11:00", end_time: "11:30", status: "booked", reason_note: "Eczema review", created_by: "rec.dev" },
  { id: "ap-303", patient_id: "pt-9", provider_id: "pr-2", date: "2026-10-28", start_time: "13:00", end_time: "13:30", status: "booked", reason_note: "Patch test results appointment", created_by: "rec.hannah" },
  { id: "ap-304", patient_id: "pt-11", provider_id: "pr-2", date: "2026-10-29", start_time: "10:30", end_time: "11:00", status: "booked", reason_note: "Skin tag removal consultation", created_by: "rec.hannah" },
  { id: "ap-305", patient_id: "pt-4", provider_id: "pr-2", date: "2026-10-30", start_time: "15:00", end_time: "15:30", status: "cancelled", reason_note: "Clinic closed — provider leave", created_by: "rec.dev" },

  { id: "ap-401", patient_id: "pt-8", provider_id: "pr-4", date: "2026-10-27", start_time: "14:00", end_time: "14:30", status: "attended", reason_note: "Six-week baby check (Lena Wojcik)", created_by: "rec.hannah" },
  { id: "ap-402", patient_id: "pt-5", provider_id: "pr-4", date: "2026-10-28", start_time: "09:30", end_time: "10:00", status: "booked", reason_note: "Childhood immunisation, second dose", created_by: "rec.hannah" },
  { id: "ap-403", patient_id: "pt-6", provider_id: "pr-4", date: "2026-10-30", start_time: "10:00", end_time: "10:30", status: "booked", reason_note: "Grandson's asthma inhaler technique", created_by: "rec.dev" },

  /* ---- week of 2 Nov ---- */
  { id: "ap-501", patient_id: "pt-4", provider_id: "pr-1", date: "2026-11-02", start_time: "09:30", end_time: "10:00", status: "booked", reason_note: "Repeat prescription review", created_by: "rec.hannah" },
  { id: "ap-502", patient_id: "pt-1", provider_id: "pr-1", date: "2026-11-04", start_time: "10:00", end_time: "10:30", status: "booked", reason_note: "Six-week follow-up", created_by: "rec.hannah" },
  { id: "ap-503", patient_id: "pt-7", provider_id: "pr-1", date: "2026-11-05", start_time: "15:30", end_time: "16:00", status: "booked", reason_note: "Dressing removal", created_by: "rec.dev" },
  { id: "ap-504", patient_id: "pt-5", provider_id: "pr-3", date: "2026-11-02", start_time: "08:30", end_time: "09:00", status: "booked", reason_note: "Flu jab", created_by: "rec.hannah" },
  { id: "ap-505", patient_id: "pt-6", provider_id: "pr-3", date: "2026-11-03", start_time: "09:00", end_time: "09:30", status: "booked", reason_note: "Flu jab", created_by: "rec.hannah" }
];

const STATUS_ORDER = ["booked", "attended", "no-show", "cancelled"];

/* ---------------- helpers ---------------- */
function hexToRgba(hex, a) {
  const h = String(hex).replace("#", "");
  const full = h.length === 3 ? h.split("").map(function (c) { return c + c; }).join("") : h;
  const n = parseInt(full, 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}
function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function parseISO(iso) {
  const p = iso.split("-").map(Number);
  return Date.UTC(p[0], p[1] - 1, p[2]);
}
function isoFromMs(ms) {
  const d = new Date(ms);
  return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
}
function addDays(iso, n) { return isoFromMs(parseISO(iso) + n * 86400000); }
function fmtDayShort(iso) {
  const d = new Date(parseISO(iso));
  return DAY_NAMES[d.getUTCDay()] + " " + d.getUTCDate() + " " + MONTH_NAMES[d.getUTCMonth()];
}
function fmtLong(iso) {
  const d = new Date(parseISO(iso));
  return d.getUTCDate() + " " + MONTH_NAMES[d.getUTCMonth()] + " " + d.getUTCFullYear();
}
function toMin(t) { const p = t.split(":").map(Number); return p[0] * 60 + p[1]; }
function toTime(m) { return pad2(Math.floor(m / 60)) + ":" + pad2(m % 60); }

const SLOTS = (function () {
  const out = [];
  for (let m = 8 * 60; m <= 16 * 60 + 30; m += 30) out.push(toTime(m));
  return out;
})();
const TIME_CHOICES = (function () {
  const out = [];
  for (let m = 8 * 60; m <= 17 * 60; m += 15) out.push(toTime(m));
  return out;
})();

function patientById(id) { return PATIENTS.find(function (p) { return p.id === id; }) || null; }
function patientName(id) { const p = patientById(id); return p ? p.first_name + " " + p.last_name : ""; }
function providerById(id) { return PROVIDERS.find(function (p) { return p.id === id; }) || PROVIDERS[0]; }
function weekKeyFor(date) {
  const w = WEEKS.find(function (k) { return date >= k.key && date <= addDays(k.key, 6); });
  return w ? w.key : null;
}

export default function Screen() {
  const navigate = useNavigate();
  const T = {
    bg: brand.backgroundColor,
    panel: hexToRgba(brand.primaryColor, 0.035),
    panel2: hexToRgba(brand.primaryColor, 0.06),
    hair: hexToRgba(brand.primaryColor, 0.12),
    hairSoft: hexToRgba(brand.primaryColor, 0.07),
    text: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    radius: brand.radius || "6px"
  };

  const STATUS_META = {
    booked: { label: "Booked", Icon: Icons.Calendar, fg: T.text, bg: hexToRgba(brand.primaryColor, 0.07), bd: hexToRgba(brand.primaryColor, 0.22) },
    attended: { label: "Attended", Icon: Icons.CheckCircle, fg: T.accent, bg: hexToRgba(brand.accentColor, 0.15), bd: hexToRgba(brand.accentColor, 0.55) },
    "no-show": { label: "No-show", Icon: Icons.AlertCircle, fg: WARN, bg: hexToRgba(WARN, 0.13), bd: hexToRgba(WARN, 0.5) },
    cancelled: { label: "Cancelled", Icon: Icons.X, fg: T.muted, bg: hexToRgba(brand.neutralColor, 0.08), bd: hexToRgba(brand.neutralColor, 0.3) }
  };

  const [appointments, setAppointments] = React.useState(SEED_APPOINTMENTS);
  const [providerId, setProviderId] = React.useState("pr-1");
  const [weekKey, setWeekKey] = React.useState("2026-10-26");
  const [view, setView] = React.useState("week");
  const [selectedDay, setSelectedDay] = React.useState(TODAY);
  const [banner, setBanner] = React.useState(null);

  const [open, setOpen] = React.useState(true);
  const [mode, setMode] = React.useState("edit");
  const [form, setForm] = React.useState(function () {
    const a = SEED_APPOINTMENTS.find(function (x) { return x.id === "ap-212"; });
    return Object.assign({}, a);
  });
  const [errors, setErrors] = React.useState({});
  const [conflictAck, setConflictAck] = React.useState(false);
  const [pendingCancel, setPendingCancel] = React.useState(false);
  const [modalError, setModalError] = React.useState(null);
  const [savedChip, setSavedChip] = React.useState(null);

  const panelRef = React.useRef(null);
  const newBtnRef = React.useRef(null);

  const provider = providerById(providerId);
  const weekDays = [0, 1, 2, 3, 4].map(function (i) { return addDays(weekKey, i); });
  const visibleDays = view === "week" ? weekDays : [selectedDay];

  const visibleAppts = appointments.filter(function (a) {
    return a.provider_id === providerId && visibleDays.indexOf(a.date) !== -1;
  });

  /* ---------- modal plumbing ---------- */
  const closeModal = React.useCallback(function () {
    setOpen(false);
    setPendingCancel(false);
    setModalError(null);
    setSavedChip(null);
    if (newBtnRef.current) newBtnRef.current.focus();
  }, []);

  React.useEffect(function () {
    if (!open) return undefined;
    const el = panelRef.current;
    if (el) {
      const first = el.querySelector("[data-autofocus]");
      (first || el).focus();
    }
    function onKey(e) {
      if (!panelRef.current) return;
      if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
      if (e.key !== "Tab") return;
      const nodes = Array.prototype.slice
        .call(panelRef.current.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])'))
        .filter(function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!nodes.length) return;
      const idx = nodes.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      else if (!e.shiftKey && idx === nodes.length - 1) { e.preventDefault(); nodes[0].focus(); }
    }
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, [open, closeModal]);

  function openExisting(a) {
    setForm(Object.assign({}, a));
    setMode("edit");
    setErrors({}); setConflictAck(false); setPendingCancel(false); setModalError(null); setSavedChip(null);
    setOpen(true);
  }
  function openNew(date, start) {
    setForm({
      id: null, patient_id: "", provider_id: providerId,
      date: date || selectedDay, start_time: start || "09:00",
      end_time: toTime(toMin(start || "09:00") + 30),
      status: "booked", reason_note: "", created_by: "rec.hannah"
    });
    setMode("create");
    setErrors({}); setConflictAck(false); setPendingCancel(false); setModalError(null); setSavedChip(null);
    setOpen(true);
  }

  const conflict = React.useMemo(function () {
    if (form.status === "cancelled") return null;
    if (!form.date || !form.start_time || !form.end_time) return null;
    const s = toMin(form.start_time), e = toMin(form.end_time);
    if (e <= s) return null;
    return appointments.find(function (a) {
      return a.id !== form.id && a.provider_id === form.provider_id && a.date === form.date &&
        a.status !== "cancelled" && toMin(a.start_time) < e && toMin(a.end_time) > s;
    }) || null;
  }, [appointments, form]);

  function setField(name, value) {
    setForm(function (f) {
      const next = Object.assign({}, f);
      next[name] = value;
      if (name === "start_time" && toMin(next.end_time || "00:00") <= toMin(value)) {
        next.end_time = toTime(Math.min(17 * 60, toMin(value) + 30));
      }
      return next;
    });
    setErrors(function (e) { const n = Object.assign({}, e); delete n[name]; return n; });
    setConflictAck(false);
    setModalError(null);
  }

  function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    const errs = {};
    if (!form.patient_id) errs.patient_id = "Choose the patient this visit is for.";
    if (!form.date) errs.date = "Pick the date of the visit.";
    if (!form.start_time) errs.start_time = "Pick a start time.";
    if (form.start_time && form.end_time && toMin(form.end_time) <= toMin(form.start_time)) {
      errs.end_time = "The end time has to be after the start time.";
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      setModalError("This appointment can't be saved yet — " + Object.keys(errs).length + (Object.keys(errs).length === 1 ? " field needs" : " fields need") + " your attention. Nothing you typed has been lost.");
      return;
    }
    setErrors({});
    if (conflict && !conflictAck) {
      setConflictAck(true);
      setModalError(null);
      return;
    }
    const isNew = !form.id;
    const record = Object.assign({}, form, { id: form.id || "ap-" + (900 + appointments.length), updated_at: "2026-10-28T11:12:00Z" });
    setAppointments(function (list) {
      return isNew ? list.concat([record]) : list.map(function (a) { return a.id === record.id ? record : a; });
    });
    setProviderId(record.provider_id);
    const wk = weekKeyFor(record.date);
    if (wk) setWeekKey(wk);
    if (view === "day") setSelectedDay(record.date);
    setBanner({
      tone: "success",
      text: (isNew ? "Booked" : "Appointment moved") + " — " + patientName(record.patient_id) + ", " +
        fmtDayShort(record.date) + " " + record.start_time + "–" + record.end_time +
        " with " + providerById(record.provider_id).name + "."
    });
    closeModal();
  }

  function applyStatus(status) {
    if (!form.id) return;
    if (form.status === "cancelled" && status !== "booked") {
      setModalError("This visit is cancelled. Set the status back to Booked before marking " + (status === "attended" ? "attendance" : "a no-show") + ".");
      return;
    }
    setModalError(null);
    setAppointments(function (list) {
      return list.map(function (a) { return a.id === form.id ? Object.assign({}, a, { status: status }) : a; });
    });
    setForm(function (f) { return Object.assign({}, f, { status: status }); });
    setSavedChip(STATUS_META[status].label + " saved to " + patientName(form.patient_id) + "'s record");
    setPendingCancel(false);
    setBanner({
      tone: status === "cancelled" ? "neutral" : "success",
      text: patientName(form.patient_id) + " — " + fmtDayShort(form.date) + " " + form.start_time +
        " marked " + STATUS_META[status].label.toLowerCase() + "."
    });
  }

  /* ---------- grid layout per day ---------- */
  function buildColumn(day) {
    const dayAppts = appointments.filter(function (a) { return a.provider_id === providerId && a.date === day; });
    const cells = {};
    dayAppts.forEach(function (a) {
      const sIdx = SLOTS.indexOf(a.start_time);
      if (sIdx < 0) return;
      const span = Math.max(1, Math.round((toMin(a.end_time) - toMin(a.start_time)) / 30));
      cells[sIdx] = { appt: a, span: Math.min(span, SLOTS.length - sIdx) };
      for (let k = 1; k < span; k++) cells[sIdx + k] = { covered: true };
    });
    return cells;
  }
  const columns = visibleDays.map(buildColumn);

  const labelCls = "text-[11px] uppercase tracking-[0.16em]";
  const fieldCls = "w-full";

  function fieldStyle(invalid) {
    return {
      backgroundColor: hexToRgba(brand.primaryColor, 0.04),
      borderColor: invalid ? hexToRgba(DANGER, 0.7) : T.hair,
      color: T.text,
      borderRadius: T.radius,
      fontFamily: brand.fontBody
    };
  }

  const css = "\
.vl *:focus-visible{outline:2px solid " + T.accent + ";outline-offset:2px;border-radius:4px}\
.vl-slot{transition:background-color .15s ease,box-shadow .15s ease}\
.vl-slot:hover{background-color:" + hexToRgba(brand.accentColor, 0.1) + "}\
.vl-slot:hover .vl-slot-plus{opacity:1}\
.vl-appt{transition:filter .15s ease,transform .15s ease}\
.vl-appt:hover{filter:brightness(1.18)}\
.vl-rise{animation:vlrise .2s ease-out both}\
.vl-fade{animation:vlfade .18s ease-out both}\
@keyframes vlrise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\
@keyframes vlfade{from{opacity:0}to{opacity:1}}\
@media (prefers-reduced-motion: reduce){.vl-rise,.vl-fade{animation:none}.vl-slot,.vl-appt{transition:none}}";

  const selectedPatient = patientById(form.patient_id);
  const formProvider = providerById(form.provider_id);
  const modalTitle = (mode === "create" ? "New appointment — " : "Appointment — ") +
    (form.date ? fmtLong(form.date) : "date not set") + ", " + form.start_time + "–" + form.end_time;

  return (
    <div className="vl min-h-full pb-16" style={{ backgroundColor: T.bg, color: T.text, fontFamily: brand.fontBody }}>
      <style>{css}</style>

      {/* ============ Row 1 ============ */}
      <div className="grid grid-cols-12 gap-6 items-start px-8 pt-8">
        <div className="col-span-12 lg:col-span-8" data-wf="b-0-0">
          <p className={labelCls} style={{ color: T.muted }}>Front desk · Scheduling</p>
          <h1 className="mt-2 text-[34px] leading-[1.15] font-semibold" style={{ fontFamily: brand.fontHeading, color: T.text }}>
            Provider calendar — <span style={{ color: T.accent }}>{provider.name}</span>{" "}
            <span className="text-[26px]" style={{ color: T.muted }}>({provider.specialty})</span>
          </h1>
          <p className="mt-3 text-sm" style={{ color: T.muted, fontVariantNumeric: "tabular-nums" }}>
            {visibleAppts.length} appointment{visibleAppts.length === 1 ? "" : "s"} in view ·{" "}
            {WEEKS.find(function (w) { return w.key === weekKey; }).label} · dummy test data
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex lg:justify-end">
          <Button
            ref={newBtnRef}
            data-wf="b-0-1"
            onClick={function () { openNew(view === "day" ? selectedDay : TODAY, "09:00"); }}
            className="h-11 px-5 text-sm font-semibold border"
            style={{ backgroundColor: T.accent, color: T.bg, borderColor: T.accent, borderRadius: T.radius }}
          >
            <Icons.Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            New appointment
          </Button>
        </div>
      </div>

      {/* ============ Row 2 ============ */}
      <div className="grid grid-cols-12 gap-6 items-end px-8 mt-8">
        <div
          className="col-span-12 lg:col-span-7 border p-4 flex flex-wrap gap-4 items-end"
          data-wf="b-1-0"
          style={{ backgroundColor: T.panel, borderColor: T.hair, borderRadius: T.radius }}
        >
          <div className="min-w-[220px] flex-1">
            <Label htmlFor="cal-provider" className={labelCls} style={{ color: T.muted }}>Provider</Label>
            <Select
              id="cal-provider"
              data-wf="i-1-0-0"
              value={providerId}
              onChange={function (e) { setProviderId(e.target.value); }}
              className={fieldCls + " mt-2 h-10 border px-3 text-sm"}
              style={fieldStyle(false)}
            >
              {PROVIDERS.map(function (p) {
                return <option key={p.id} value={p.id} style={{ backgroundColor: T.bg }}>{p.name} — {p.specialty}</option>;
              })}
            </Select>
          </div>
          <div className="min-w-[190px] flex-1">
            <Label htmlFor="cal-week" className={labelCls} style={{ color: T.muted }}>Period</Label>
            <Select
              id="cal-week"
              data-wf="i-1-0-1"
              value={weekKey}
              onChange={function (e) {
                const k = e.target.value;
                setWeekKey(k);
                setSelectedDay(weekKeyFor(TODAY) === k ? TODAY : k);
              }}
              className={fieldCls + " mt-2 h-10 border px-3 text-sm"}
              style={Object.assign(fieldStyle(false), { fontVariantNumeric: "tabular-nums" })}
            >
              {WEEKS.map(function (w) {
                return <option key={w.key} value={w.key} style={{ backgroundColor: T.bg }}>{w.label}</option>;
              })}
            </Select>
          </div>
          <Button
            data-wf="i-1-0-2"
            onClick={function () { setWeekKey("2026-10-26"); setSelectedDay(TODAY); }}
            className="h-10 px-4 text-sm border"
            style={{ backgroundColor: "transparent", color: T.text, borderColor: T.hair, borderRadius: T.radius }}
          >
            <Icons.Clock className="w-4 h-4 mr-2" aria-hidden="true" />
            Today
          </Button>
        </div>

        <div className="col-span-12 lg:col-span-5 flex items-center justify-between gap-4" data-wf="b-1-1">
          <div
            role="tablist"
            aria-label="Calendar layout"
            className="inline-flex p-1 border"
            style={{ backgroundColor: T.panel, borderColor: T.hair, borderRadius: T.radius }}
            onKeyDown={function (e) {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next = view === "day" ? "week" : "day";
              setView(next);
              const node = document.getElementById(next === "day" ? "vl-tab-day" : "vl-tab-week");
              if (node) node.focus();
            }}
          >
            {[{ key: "day", label: "Day" }, { key: "week", label: "Week" }].map(function (t, i) {
              const on = view === t.key;
              return (
                <button
                  key={t.key}
                  id={"vl-tab-" + t.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="vl-calendar-panel"
                  tabIndex={on ? 0 : -1}
                  data-wf={i === 0 ? "i-1-1-0" : "i-1-1-1"}
                  onClick={function () { setView(t.key); }}
                  className="h-9 px-6 text-sm transition-colors"
                  style={{
                    backgroundColor: on ? hexToRgba(brand.accentColor, 0.16) : "transparent",
                    color: on ? T.accent : T.muted,
                    borderRadius: T.radius,
                    fontWeight: on ? 600 : 400
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs flex items-center gap-2" style={{ color: T.muted, fontVariantNumeric: "tabular-nums" }}>
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: T.accent }} />
            Synced {NOW_LABEL}
          </p>
        </div>
      </div>

      {/* banner */}
      {banner ? (
        <div className="px-8 mt-6">
          <div
            className="vl-rise border px-4 py-3 flex items-start gap-3"
            role="status"
            style={{
              backgroundColor: hexToRgba(banner.tone === "success" ? brand.accentColor : brand.neutralColor, 0.1),
              borderColor: hexToRgba(banner.tone === "success" ? brand.accentColor : brand.neutralColor, 0.4),
              borderRadius: T.radius
            }}
          >
            <Icons.CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: banner.tone === "success" ? T.accent : T.muted }} aria-hidden="true" />
            <p className="text-sm flex-1" style={{ color: T.text }}>{banner.text}</p>
          </div>
        </div>
      ) : null}

      {/* ============ Row 3 — the grid ============ */}
      <section
        className="px-8 mt-6"
        data-wf="b-2-0"
        id="vl-calendar-panel"
        role="tabpanel"
        aria-labelledby={view === "day" ? "vl-tab-day" : "vl-tab-week"}
      >
        <div className="border" style={{ backgroundColor: T.panel, borderColor: T.hair, borderRadius: T.radius }}>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b" style={{ borderColor: T.hair }}>
            <div>
              <h2 className="text-lg" style={{ fontFamily: brand.fontHeading, color: T.text }}>Slots 08:00–17:00</h2>
              <p className="text-xs mt-1" style={{ color: T.muted }}>
                Select any free slot to book it, or an appointment to reschedule, restatus or cancel.
              </p>
            </div>
            {view === "day" ? (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose day">
                {weekDays.map(function (d) {
                  const on = d === selectedDay;
                  const count = appointments.filter(function (a) { return a.provider_id === providerId && a.date === d; }).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={function () { setSelectedDay(d); }}
                      className="h-9 px-3 text-xs border transition-colors"
                      style={{
                        backgroundColor: on ? hexToRgba(brand.accentColor, 0.16) : "transparent",
                        borderColor: on ? hexToRgba(brand.accentColor, 0.5) : T.hair,
                        color: on ? T.accent : T.muted,
                        borderRadius: T.radius,
                        fontVariantNumeric: "tabular-nums"
                      }}
                    >
                      {fmtDayShort(d)} · {count}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {visibleAppts.length === 0 ? (
            <div className="px-5 py-4 border-b flex items-start gap-3" style={{ borderColor: T.hair, backgroundColor: hexToRgba(brand.neutralColor, 0.06) }}>
              <Icons.Calendar className="w-4 h-4 mt-0.5 shrink-0" style={{ color: T.muted }} aria-hidden="true" />
              <p className="text-sm" style={{ color: T.muted }}>
                Nothing booked — {provider.name} has no appointments {view === "week" ? "in the " + WEEKS.find(function (w) { return w.key === weekKey; }).label.toLowerCase() : "on " + fmtDayShort(selectedDay)}.
                Pick a slot below to book the first one.
              </p>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <Table className="w-full" style={{ fontVariantNumeric: "tabular-nums", borderCollapse: "collapse" }}>
              <THead>
                <TR>
                  <TH
                    data-wf="i-2-0-0"
                    scope="col"
                    className={"w-[92px] text-left px-4 py-3 " + labelCls}
                    style={{ color: T.muted, borderBottom: "1px solid " + T.hair }}
                  >
                    Time
                  </TH>
                  {weekDays.map(function (d, i) {
                    const shown = visibleDays.indexOf(d) !== -1;
                    if (!shown) return null;
                    const isToday = d === TODAY;
                    return (
                      <TH
                        key={d}
                        scope="col"
                        data-wf={"i-2-0-" + (i + 1)}
                        className="text-left px-3 py-3"
                        style={{ borderBottom: "1px solid " + (isToday ? hexToRgba(brand.accentColor, 0.6) : T.hair) }}
                      >
                        <button
                          type="button"
                          onClick={function () { setSelectedDay(d); setView("day"); }}
                          className="text-left"
                          title={"Show " + fmtDayShort(d) + " on its own"}
                        >
                          <span className={labelCls} style={{ color: isToday ? T.accent : T.muted }}>
                            {fmtDayShort(d)}
                          </span>
                          {isToday ? (
                            <span className="block text-[11px] mt-0.5" style={{ color: T.accent }}>Today</span>
                          ) : null}
                        </button>
                      </TH>
                    );
                  })}
                </TR>
              </THead>
              <TBody>
                {SLOTS.map(function (slot, rowIdx) {
                  const onHour = slot.slice(3) === "00";
                  const isNowRow = slot === NOW_SLOT && weekDays.indexOf(TODAY) !== -1;
                  return (
                    <TR key={slot} style={{ borderTop: "1px solid " + (onHour ? T.hair : T.hairSoft) }}>
                      <TH
                        scope="row"
                        className="px-4 py-1 text-left align-top font-normal"
                        style={{ color: onHour ? T.text : T.muted, fontSize: "12px", width: "92px" }}
                      >
                        <span className="inline-flex items-center gap-2">
                          {slot}
                          {isNowRow ? (
                            <>
                              <span
                                aria-hidden="true"
                                className="inline-block w-1.5 h-1.5 rotate-45"
                                style={{ backgroundColor: T.accent }}
                              />
                              <span className="sr-only">current time, {NOW_LABEL}</span>
                            </>
                          ) : null}
                        </span>
                      </TH>
                      {visibleDays.map(function (day, colIdx) {
                        const cell = columns[colIdx][rowIdx];
                        if (cell && cell.covered) return null;
                        const isToday = day === TODAY;
                        const base = {
                          verticalAlign: "top",
                          padding: "3px",
                          borderLeft: "1px solid " + T.hairSoft,
                          backgroundColor: isToday ? hexToRgba(brand.accentColor, 0.035) : "transparent"
                        };
                        if (cell && cell.appt) {
                          const a = cell.appt;
                          const meta = STATUS_META[a.status];
                          const SIcon = meta.Icon;
                          return (
                            <TD key={day} rowSpan={cell.span} style={base}>
                              <button
                                type="button"
                                className="vl-appt w-full h-full text-left px-2.5 py-2 border"
                                style={{ backgroundColor: meta.bg, borderColor: meta.bd, borderRadius: T.radius, minHeight: 44 * cell.span }}
                                onClick={function () { openExisting(a); }}
                                aria-label={patientName(a.patient_id) + " with " + provider.name + ", " + fmtDayShort(a.date) + " " + a.start_time + " to " + a.end_time + ", " + meta.label + ". Open appointment."}
                              >
                                <span className="flex items-center justify-between gap-2">
                                  <span className="text-[11px]" style={{ color: T.muted }}>{a.start_time}–{a.end_time}</span>
                                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.1em]" style={{ color: meta.fg }}>
                                    <SIcon className="w-3 h-3" aria-hidden="true" />
                                    {meta.label}
                                  </span>
                                </span>
                                <span
                                  className="block text-sm mt-1 truncate"
                                  style={{ color: T.text, textDecoration: a.status === "cancelled" ? "line-through" : "none" }}
                                >
                                  {patientName(a.patient_id)}
                                </span>
                                {cell.span > 1 ? (
                                  <span className="block text-[11px] mt-1 leading-snug" style={{ color: T.muted }}>{a.reason_note}</span>
                                ) : null}
                              </button>
                            </TD>
                          );
                        }
                        return (
                          <TD key={day} style={base}>
                            <button
                              type="button"
                              className="vl-slot w-full flex items-center justify-end px-2"
                              style={{ minHeight: 44, borderRadius: T.radius, color: T.accent }}
                              onClick={function () { openNew(day, slot); }}
                              aria-label={"Book " + provider.name + ", " + fmtDayShort(day) + " at " + slot}
                            >
                              <Icons.Plus className="vl-slot-plus w-3.5 h-3.5 opacity-0" aria-hidden="true" />
                            </button>
                          </TD>
                        );
                      })}
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center gap-5 px-5 py-3 border-t" style={{ borderColor: T.hair }}>
            {STATUS_ORDER.map(function (s) {
              const m = STATUS_META[s];
              const I = m.Icon;
              return (
                <span key={s} className="inline-flex items-center gap-2 text-xs" style={{ color: T.muted }}>
                  <span className="inline-flex items-center justify-center w-4 h-4 border" style={{ borderColor: m.bd, backgroundColor: m.bg, borderRadius: "3px" }}>
                    <I className="w-2.5 h-2.5" style={{ color: m.fg }} aria-hidden="true" />
                  </span>
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Rows 4–7 — appointment dialog ============ */}
      {open ? (
        <div
          className="vl-fade fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4"
          style={{ backgroundColor: hexToRgba("#060b08", 0.74) }}
          onMouseDown={function (e) { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vl-modal-title"
            tabIndex={-1}
            data-wf="b-3-0"
            className="vl-rise w-full max-w-3xl border outline-none"
            style={{
              backgroundColor: "#1b2721",
              borderColor: T.hair,
              borderRadius: T.radius,
              boxShadow: "0 24px 60px " + hexToRgba("#000000", 0.55)
            }}
          >
            <form onSubmit={handleSave}>
              <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-5 border-b" style={{ borderColor: T.hair }}>
                <div>
                  <p className={labelCls} style={{ color: T.accent }}>
                    {mode === "create" ? "Booking" : "Appointment " + form.id}
                  </p>
                  <h2 id="vl-modal-title" className="mt-2 text-[24px]" style={{ fontFamily: brand.fontHeading, color: T.text, fontVariantNumeric: "tabular-nums" }}>
                    {modalTitle}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} aria-label="Close appointment panel" className="p-2" style={{ color: T.muted }}>
                  <Icons.X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-6">
                {modalError ? (
                  <div
                    className="vl-rise border px-4 py-3 flex items-start gap-3"
                    role="alert"
                    style={{ backgroundColor: hexToRgba(DANGER, 0.12), borderColor: hexToRgba(DANGER, 0.5), borderRadius: T.radius }}
                  >
                    <Icons.AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: DANGER }} aria-hidden="true" />
                    <p className="text-sm" style={{ color: T.text }}>{modalError}</p>
                  </div>
                ) : null}

                {savedChip ? (
                  <p className="vl-fade text-xs inline-flex items-center gap-2" style={{ color: T.accent }}>
                    <Icons.Check className="w-3.5 h-3.5" aria-hidden="true" />
                    {savedChip}
                  </p>
                ) : null}

                {/* patient + provider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="ap-patient" className={labelCls} style={{ color: T.muted }}>Patient</Label>
                    <Select
                      id="ap-patient"
                      data-wf="i-3-0-0"
                      data-autofocus="true"
                      value={form.patient_id}
                      aria-invalid={errors.patient_id ? "true" : "false"}
                      aria-describedby={errors.patient_id ? "ap-patient-err" : "ap-patient-hint"}
                      onChange={function (e) { setField("patient_id", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={fieldStyle(!!errors.patient_id)}
                    >
                      <option value="" style={{ backgroundColor: T.bg }}>Choose a patient…</option>
                      {PATIENTS.slice().sort(function (a, b) { return a.last_name < b.last_name ? -1 : 1; }).map(function (p) {
                        return (
                          <option key={p.id} value={p.id} style={{ backgroundColor: T.bg }}>
                            {p.first_name} {p.last_name} ({p.phone})
                          </option>
                        );
                      })}
                    </Select>
                    {errors.patient_id ? (
                      <p id="ap-patient-err" className="mt-2 text-xs inline-flex items-center gap-1.5" style={{ color: DANGER }}>
                        <Icons.AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />{errors.patient_id}
                      </p>
                    ) : (
                      <p id="ap-patient-hint" className="mt-2 text-xs" style={{ color: T.muted }}>
                        {selectedPatient ? selectedPatient.phone + " · " + selectedPatient.email : "Search the patient list if they are not here yet."}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ap-provider" className={labelCls} style={{ color: T.muted }}>Provider</Label>
                    <Select
                      id="ap-provider"
                      data-wf="i-3-0-1"
                      value={form.provider_id}
                      onChange={function (e) { setField("provider_id", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={fieldStyle(false)}
                    >
                      {PROVIDERS.map(function (p) {
                        return <option key={p.id} value={p.id} style={{ backgroundColor: T.bg }}>{p.name} — {p.specialty}</option>;
                      })}
                    </Select>
                    <p className="mt-2 text-xs" style={{ color: T.muted }}>
                      Moving the visit to another provider reschedules it into their calendar.
                    </p>
                  </div>
                </div>

                {/* date / times */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <Label htmlFor="ap-date" className={labelCls} style={{ color: T.muted }}>Date</Label>
                    <Input
                      id="ap-date"
                      data-wf="i-3-0-2"
                      type="date"
                      value={form.date}
                      aria-invalid={errors.date ? "true" : "false"}
                      aria-describedby={errors.date ? "ap-date-err" : undefined}
                      onChange={function (e) { setField("date", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={Object.assign(fieldStyle(!!errors.date), { fontVariantNumeric: "tabular-nums", colorScheme: "dark" })}
                    />
                    {errors.date ? (
                      <p id="ap-date-err" className="mt-2 text-xs" style={{ color: DANGER }}>{errors.date}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="ap-start" className={labelCls} style={{ color: T.muted }}>Start time</Label>
                    <Select
                      id="ap-start"
                      data-wf="i-3-0-3"
                      value={form.start_time}
                      onChange={function (e) { setField("start_time", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={Object.assign(fieldStyle(!!errors.start_time), { fontVariantNumeric: "tabular-nums" })}
                    >
                      {TIME_CHOICES.map(function (t) {
                        return <option key={t} value={t} style={{ backgroundColor: T.bg }}>{t}</option>;
                      })}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ap-end" className={labelCls} style={{ color: T.muted }}>End time</Label>
                    <Select
                      id="ap-end"
                      data-wf="i-3-0-4"
                      value={form.end_time}
                      aria-invalid={errors.end_time ? "true" : "false"}
                      aria-describedby={errors.end_time ? "ap-end-err" : undefined}
                      onChange={function (e) { setField("end_time", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={Object.assign(fieldStyle(!!errors.end_time), { fontVariantNumeric: "tabular-nums" })}
                    >
                      {TIME_CHOICES.map(function (t) {
                        return <option key={t} value={t} style={{ backgroundColor: T.bg }}>{t}</option>;
                      })}
                    </Select>
                    {errors.end_time ? (
                      <p id="ap-end-err" className="mt-2 text-xs" style={{ color: DANGER }}>{errors.end_time}</p>
                    ) : null}
                  </div>
                </div>

                {/* note */}
                <div>
                  <Label htmlFor="ap-note" className={labelCls} style={{ color: T.muted }}>Reason for visit / front-desk note</Label>
                  <Textarea
                    id="ap-note"
                    data-wf="i-3-0-5"
                    rows={3}
                    value={form.reason_note}
                    onChange={function (e) { setField("reason_note", e.target.value); }}
                    placeholder="e.g. Repeat prescription review — asked for a morning slot"
                    aria-describedby="ap-note-hint"
                    className="mt-2 w-full border px-3 py-2.5 text-sm leading-relaxed"
                    style={fieldStyle(false)}
                  />
                  <p id="ap-note-hint" className="mt-2 text-xs" style={{ color: T.muted }}>
                    Front-desk information only. Never record diagnoses, prescriptions or lab results here.
                  </p>
                </div>

                {/* status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                  <div>
                    <Label htmlFor="ap-status" className={labelCls} style={{ color: T.muted }}>Status</Label>
                    <Select
                      id="ap-status"
                      data-wf="i-3-0-6"
                      value={form.status}
                      onChange={function (e) { setField("status", e.target.value); }}
                      className="mt-2 w-full h-11 border px-3 text-sm"
                      style={fieldStyle(false)}
                    >
                      {STATUS_ORDER.map(function (s) {
                        return <option key={s} value={s} style={{ backgroundColor: T.bg }}>{STATUS_META[s].label}</option>;
                      })}
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pb-1">
                    <span className={labelCls} style={{ color: T.muted }}>Currently</span>
                    <Badge
                      className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs"
                      style={{
                        backgroundColor: STATUS_META[form.status].bg,
                        borderColor: STATUS_META[form.status].bd,
                        color: STATUS_META[form.status].fg,
                        borderRadius: T.radius
                      }}
                    >
                      {React.createElement(STATUS_META[form.status].Icon, { className: "w-3.5 h-3.5", "aria-hidden": "true" })}
                      {STATUS_META[form.status].label}
                    </Badge>
                  </div>
                </div>

                {/* ---- Row 5: conflict ---- */}
                {conflict ? (
                  <p
                    data-wf="b-4-0"
                    role="alert"
                    className="vl-rise text-sm border px-4 py-3 flex items-start gap-3"
                    style={{ backgroundColor: hexToRgba(WARN, 0.12), borderColor: hexToRgba(WARN, 0.5), borderRadius: T.radius, color: T.text }}
                  >
                    <Icons.AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: WARN }} aria-hidden="true" />
                    <span>
                      Conflict: {formProvider.name} already has an appointment from {conflict.start_time} to {conflict.end_time}.
                      Confirm to continue anyway.
                      <span className="block mt-1" style={{ color: T.muted }}>
                        {patientName(conflict.patient_id)} · {conflict.reason_note}
                        {conflictAck ? " — press Save anyway to double-book the slot." : ""}
                      </span>
                    </span>
                  </p>
                ) : null}

                {/* cancel confirmation */}
                {pendingCancel ? (
                  <div
                    className="vl-rise border px-4 py-4"
                    role="alertdialog"
                    aria-label="Confirm cancellation"
                    style={{ backgroundColor: hexToRgba(DANGER, 0.1), borderColor: hexToRgba(DANGER, 0.5), borderRadius: T.radius }}
                  >
                    <p className="text-sm" style={{ color: T.text }}>
                      Cancel {patientName(form.patient_id) || "this patient"}'s appointment on {fmtDayShort(form.date)} at {form.start_time}?
                      The slot is freed and the visit shows as cancelled in their history.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        onClick={function () { applyStatus("cancelled"); }}
                        className="h-10 px-4 text-sm border"
                        style={{ backgroundColor: hexToRgba(DANGER, 0.2), borderColor: hexToRgba(DANGER, 0.7), color: T.text, borderRadius: T.radius }}
                      >
                        Yes, cancel appointment
                      </Button>
                      <Button
                        type="button"
                        onClick={function () { setPendingCancel(false); }}
                        className="h-10 px-4 text-sm border"
                        style={{ backgroundColor: "transparent", borderColor: T.hair, color: T.text, borderRadius: T.radius }}
                      >
                        Keep appointment
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ---- Row 6: actions ---- */}
              <div className="px-7 pb-5 pt-5 border-t" style={{ borderColor: T.hair }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Button
                    type="submit"
                    data-wf="b-5-0"
                    className="h-11 px-4 text-sm font-semibold border"
                    style={{
                      backgroundColor: conflict && conflictAck ? "transparent" : T.accent,
                      color: conflict && conflictAck ? WARN : T.bg,
                      borderColor: conflict && conflictAck ? hexToRgba(WARN, 0.7) : T.accent,
                      borderRadius: T.radius
                    }}
                  >
                    <Icons.Check className="w-4 h-4 mr-2" aria-hidden="true" />
                    {conflict && conflictAck ? "Save anyway" : "Save appointment"}
                  </Button>
                  <Button
                    type="button"
                    data-wf="b-5-1"
                    disabled={!form.id}
                    onClick={function () { applyStatus("attended"); }}
                    className="h-11 px-4 text-sm border disabled:opacity-40"
                    style={{ backgroundColor: "transparent", borderColor: T.hair, color: T.text, borderRadius: T.radius }}
                    title={form.id ? undefined : "Save the booking first"}
                  >
                    Mark attended
                  </Button>
                  <Button
                    type="button"
                    data-wf="b-5-2"
                    disabled={!form.id}
                    onClick={function () { applyStatus("no-show"); }}
                    className="h-11 px-4 text-sm border disabled:opacity-40"
                    style={{ backgroundColor: "transparent", borderColor: T.hair, color: T.text, borderRadius: T.radius }}
                    title={form.id ? undefined : "Save the booking first"}
                  >
                    Mark no-show
                  </Button>
                  <Button
                    type="button"
                    data-wf="b-5-3"
                    disabled={!form.id || form.status === "cancelled"}
                    onClick={function () { setModalError(null); setPendingCancel(true); }}
                    className="h-11 px-4 text-sm border disabled:opacity-40"
                    style={{ backgroundColor: "transparent", borderColor: hexToRgba(DANGER, 0.5), color: DANGER, borderRadius: T.radius }}
                    title={form.status === "cancelled" ? "Already cancelled" : undefined}
                  >
                    Cancel appointment
                  </Button>
                </div>
                {!form.id ? (
                  <p className="mt-3 text-xs" style={{ color: T.muted }}>
                    Attendance can be marked once the appointment is saved into {formProvider.name}'s calendar.
                  </p>
                ) : null}
              </div>

              {/* ---- Row 7: history link ---- */}
              <div className="px-7 pb-7 pt-4 border-t" style={{ borderColor: T.hair }}>
                <button
                  type="button"
                  data-wf="b-6-0"
                  onClick={function () { navigate("patient-detail"); }}
                  className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                  style={{ color: T.accent }}
                >
                  <Icons.FileText className="w-4 h-4" aria-hidden="true" />
                  View Ellie Dawson's visit history
                  <Icons.ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
