// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label, Select, Checkbox, Badge, Table, THead, TBody, TR, TH, TD, Avatar, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Search } = Icons;

const NOW_ISO = "2026-10-28T11:42:00";
const NOW_LABEL = "11:42";
const TODAY_LABEL = "Wednesday 28 October 2026";

const SURFACE = "rgba(233,237,233,0.035)";
const SURFACE_RAISED = "rgba(233,237,233,0.065)";
const HAIRLINE = "rgba(233,237,233,0.12)";
const HAIRLINE_SOFT = "rgba(233,237,233,0.07)";
/* Warm copper: the Velvet "warm metal" role, used only for the no-show / warning state. */
const COPPER = "#c08a4e";

const PROVIDERS = [
  { id: "prv-01", name: "Dr. Rhea Kapoor", specialty: "General practice", is_active: true },
  { id: "prv-02", name: "Dr. Amara Nwosu", specialty: "Dermatology", is_active: true },
  { id: "prv-03", name: "Nils Bergström, PT", specialty: "Physiotherapy", is_active: true },
];

const PATIENTS = [
  { id: "pat-204", first_name: "Marcus", last_name: "Webb", phone: "07700 900 118", email: "m.webb@example.org" },
  { id: "pat-118", first_name: "Priya", last_name: "Raghunathan", phone: "07700 900 342", email: "priya.r@example.org" },
  { id: "pat-337", first_name: "Eleanor", last_name: "Shaw", phone: "07700 900 905", email: "e.shaw@example.org" },
  { id: "pat-412", first_name: "Tomás", last_name: "Oliveira", phone: "07700 900 271", email: "t.oliveira@example.org" },
  { id: "pat-159", first_name: "Hafsa", last_name: "Yilmaz", phone: "07700 900 488", email: "h.yilmaz@example.org" },
  { id: "pat-523", first_name: "Dennis", last_name: "Okafor", phone: "07700 900 660", email: "d.okafor@example.org" },
  { id: "pat-087", first_name: "Jo", last_name: "Lindqvist", phone: "07700 900 773", email: "jo.lindqvist@example.org" },
];

const APPOINTMENTS = [
  {
    id: "APT-4821", patient_id: "pat-204", provider_id: "prv-01",
    start_time: "2026-10-28T08:30:00", end_time: "2026-10-28T08:50:00",
    status: "attended", reason_note: "Blood pressure check — follow-up from 14 Oct, patient bringing home readings.",
    created_by: "r.mensah",
  },
  {
    id: "APT-4822", patient_id: "pat-118", provider_id: "prv-02",
    start_time: "2026-10-28T09:15:00", end_time: "2026-10-28T09:45:00",
    status: "attended", reason_note: "Mole review, right shoulder. Booked from the 2 Oct phone call.",
    created_by: "r.mensah",
  },
  {
    id: "APT-4823", patient_id: "pat-337", provider_id: "prv-03",
    start_time: "2026-10-28T10:00:00", end_time: "2026-10-28T10:30:00",
    status: "no-show", reason_note: "Knee rehab, session 4 of 6. Left voicemail at 10:15.",
    created_by: "d.ferreira",
  },
  {
    id: "APT-4824", patient_id: "pat-412", provider_id: "prv-01",
    start_time: "2026-10-28T10:45:00", end_time: "2026-10-28T11:15:00",
    status: "cancelled", reason_note: "Travel vaccination advice — Peru, departs 12 Nov. Cancelled by patient 08:05, wants Thursday.",
    created_by: "r.mensah",
  },
  {
    id: "APT-4825", patient_id: "pat-159", provider_id: "prv-02",
    start_time: "2026-10-28T11:30:00", end_time: "2026-10-28T12:00:00",
    status: "booked", reason_note: "Eczema review, repeat ointment request. Arrived 11:26, in room 2.",
    created_by: "d.ferreira",
  },
  {
    id: "APT-4826", patient_id: "pat-523", provider_id: "prv-03",
    start_time: "2026-10-28T13:15:00", end_time: "2026-10-28T13:45:00",
    status: "booked", reason_note: "Lower back assessment, new referral from Dr. Kapoor.",
    created_by: "r.mensah",
  },
  {
    id: "APT-4827", patient_id: "pat-087", provider_id: "prv-01",
    start_time: "2026-10-28T15:00:00", end_time: "2026-10-28T15:20:00",
    status: "booked", reason_note: "Repeat sick note for employer — no clinical details given at the desk.",
    created_by: "d.ferreira",
  },
];

const STATUS_ORDER = ["booked", "attended", "no-show", "cancelled"];

export default function Screen() {
  const navigate = useNavigate();
  const accent = brand.accentColor;
  const neutral = brand.neutralColor;
  const ink = brand.primaryColor;

  const [appointments, setAppointments] = React.useState(APPOINTMENTS);
  const [providerFilter, setProviderFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [flash, setFlash] = React.useState(null);
  const [justChanged, setJustChanged] = React.useState([]);

  const patientOf = (a) => PATIENTS.find((p) => p.id === a.patient_id);
  const providerOf = (a) => PROVIDERS.find((p) => p.id === a.provider_id);
  const fullName = (a) => {
    const p = patientOf(a);
    return p ? p.first_name + " " + p.last_name : "Unknown patient";
  };
  const hhmm = (iso) => iso.slice(11, 16);

  const statusMeta = {
    booked: { label: "Booked", Icon: Icons.Clock, fg: ink, rail: "rgba(233,237,233,0.28)", border: HAIRLINE, bg: "transparent" },
    attended: { label: "Attended", Icon: Icons.CheckCircle, fg: accent, rail: accent, border: "rgba(143,174,139,0.45)", bg: "rgba(143,174,139,0.10)" },
    "no-show": { label: "No-show", Icon: Icons.AlertCircle, fg: COPPER, rail: COPPER, border: "rgba(192,138,78,0.5)", bg: "rgba(192,138,78,0.10)" },
    cancelled: { label: "Cancelled", Icon: Icons.X, fg: neutral, rail: "transparent", border: HAIRLINE_SOFT, bg: "transparent" },
  };

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = appointments.filter((a) => a.status === s).length;
    return acc;
  }, {});

  const filtersActive = providerFilter !== "all" || statusFilter !== "all" || query.trim() !== "";

  const filtered = appointments.filter((a) => {
    if (providerFilter !== "all" && a.provider_id !== providerFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const p = patientOf(a);
    return (
      fullName(a).toLowerCase().includes(q) ||
      (p && p.phone.toLowerCase().includes(q)) ||
      a.id.toLowerCase().includes(q)
    );
  });

  const nowIndex = (() => {
    if (!filtered.length) return -1;
    const i = filtered.findIndex((a) => a.start_time > NOW_ISO);
    return i;
  })();

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.concat(id)));
  };

  const clearFilters = () => {
    setProviderFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  const joinNames = (list) => {
    const names = list.map(fullName);
    if (names.length === 1) return names[0];
    if (names.length === 2) return names[0] + " and " + names[1];
    return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
  };

  const markStatus = (next) => {
    const chosen = appointments.filter((a) => selectedIds.includes(a.id));
    if (!chosen.length) return;

    let blocked = [];
    let eligible = chosen;
    if (next === "no-show") {
      blocked = chosen.filter((a) => a.start_time > NOW_ISO);
      eligible = chosen.filter((a) => a.start_time <= NOW_ISO);
    }

    if (eligible.length) {
      const ids = eligible.map((a) => a.id);
      setAppointments((prev) =>
        prev.map((a) => (ids.includes(a.id) ? Object.assign({}, a, { status: next, updated_at: NOW_ISO }) : a))
      );
      setJustChanged(ids);
    } else {
      setJustChanged([]);
    }

    setSelectedIds(blocked.map((b) => b.id));

    if (blocked.length) {
      setFlash({
        tone: "warning",
        title: "That slot hasn’t started yet",
        body:
          fullName(blocked[0]) +
          "’s " +
          hhmm(blocked[0].start_time) +
          " appointment can only be marked no-show once the slot begins. " +
          (eligible.length
            ? eligible.length + (eligible.length === 1 ? " appointment was" : " appointments were") + " marked no-show."
            : "Nothing was changed — your selection is still here."),
      });
    } else {
      setFlash({
        tone: "success",
        title: next === "attended" ? "Arrival recorded" : "No-show recorded",
        body:
          joinNames(eligible) +
          " marked " +
          statusMeta[next].label.toLowerCase() +
          ". The visit history on each patient record is up to date.",
      });
    }
  };

  const singleSelected = selectedIds.length === 1 ? appointments.find((a) => a.id === selectedIds[0]) : null;

  const labelCls = "block text-[11px] uppercase tracking-[0.16em] mb-2";
  const fieldStyle = {
    backgroundColor: "rgba(22,33,28,0.6)",
    border: "1px solid " + HAIRLINE,
    color: ink,
    borderRadius: brand.radius,
    minHeight: "44px",
  };

  const actionButtonStyle = (enabled, kind) => {
    if (kind === "primary") {
      return {
        backgroundColor: enabled ? accent : "transparent",
        color: enabled ? brand.backgroundColor : neutral,
        border: "1px solid " + (enabled ? accent : HAIRLINE),
        borderRadius: brand.radius,
        minHeight: "48px",
        opacity: enabled ? 1 : 0.6,
        cursor: enabled ? "pointer" : "not-allowed",
      };
    }
    return {
      backgroundColor: "transparent",
      color: enabled ? ink : neutral,
      border: "1px solid " + (enabled ? "rgba(233,237,233,0.28)" : HAIRLINE),
      borderRadius: brand.radius,
      minHeight: "48px",
      opacity: enabled ? 1 : 0.6,
      cursor: enabled ? "pointer" : "not-allowed",
    };
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        color: ink,
        "--vl-accent": accent,
        "--vl-hair": HAIRLINE,
      }}
    >
      <style>{`
        .vl-focus:focus-visible { outline: 2px solid var(--vl-accent); outline-offset: 2px; border-radius: 4px; }
        .vl-row { transition: background-color 160ms ease; }
        .vl-row:hover { background-color: rgba(143,174,139,0.07); }
        .vl-rise { animation: vl-rise 220ms ease-out both; }
        @keyframes vl-rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        .vl-changed { animation: vl-changed 1400ms ease-out both; }
        @keyframes vl-changed { 0% { background-color: rgba(143,174,139,0.22); } 100% { background-color: transparent; } }
        .vl-link { text-underline-offset: 4px; transition: color 140ms ease; }
        .vl-link:hover { color: var(--vl-accent); }
        .vl-btn { transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease; }
        .vl-btn:not(:disabled):hover { border-color: var(--vl-accent); }
        @media (prefers-reduced-motion: reduce) {
          .vl-rise, .vl-changed { animation: none !important; }
          .vl-row, .vl-btn, .vl-link { transition: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1180px] px-6 py-10 md:px-10">
        {/* Row 1 — title + primary action */}
        <div className="grid grid-cols-12 gap-6 items-end">
          <div data-wf="b-0-0" className="col-span-12 md:col-span-8">
            <p className={labelCls} style={{ color: neutral }}>
              Front desk · Clinic day view
            </p>
            <h1
              className="text-[32px] md:text-[38px] leading-[1.14] font-normal"
              style={{ fontFamily: brand.fontHeading, color: ink }}
            >
              Today at the front desk{" "}
              <span style={{ color: neutral }}>— {TODAY_LABEL}</span>
            </h1>
            <p className="mt-4 text-sm" style={{ color: neutral, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: accent }}>{counts.booked} booked</span>
              <span aria-hidden="true"> · </span>
              {counts.attended} attended
              <span aria-hidden="true"> · </span>
              {counts["no-show"]} no-show
              <span aria-hidden="true"> · </span>
              {counts.cancelled} cancelled
              <span aria-hidden="true"> · </span>
              across {PROVIDERS.length} providers
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <Button
              data-wf="b-0-1"
              type="button"
              onClick={() => navigate("calendar")}
              className="vl-focus vl-btn inline-flex items-center justify-center gap-2 px-5 text-sm tracking-[0.04em] w-full md:w-auto"
              style={{
                backgroundColor: "transparent",
                color: accent,
                border: "1px solid " + accent,
                borderRadius: brand.radius,
                minHeight: "48px",
              }}
            >
              <Icons.Plus className="w-4 h-4" aria-hidden="true" />
              Book appointment
            </Button>
          </div>
        </div>

        <div className="mt-8" style={{ height: "1px", backgroundColor: HAIRLINE }} />

        {/* Row 2 — filters */}
        <div
          data-wf="b-1-0"
          className="mt-8 grid grid-cols-12 gap-4 md:gap-6 p-5 md:p-6"
          style={{ backgroundColor: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: brand.radius }}
        >
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="provider-filter" className={labelCls} style={{ color: neutral }}>
              All providers
            </Label>
            <Select
              data-wf="i-1-0-0"
              id="provider-filter"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="vl-focus w-full px-3 text-sm"
              style={fieldStyle}
            >
              <option value="all">All providers</option>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.specialty}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="status-filter" className={labelCls} style={{ color: neutral }}>
              All statuses
            </Label>
            <Select
              data-wf="i-1-0-1"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="vl-focus w-full px-3 text-sm"
              style={fieldStyle}
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {statusMeta[s].label}
                </option>
              ))}
            </Select>
          </div>

          <div className="col-span-12 md:col-span-5">
            <Label htmlFor="search-today" className={labelCls} style={{ color: neutral }}>
              Search patient today
            </Label>
            <div className="relative">
              <Icons.Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: neutral }}
                aria-hidden="true"
              />
              <Input
                data-wf="i-1-0-2"
                id="search-today"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, phone or appointment ref"
                className="vl-focus w-full pl-9 pr-3 text-sm"
                style={fieldStyle}
              />
            </div>
          </div>
        </div>

        {/* Live region + result of marking */}
        <div role="status" aria-live="polite" className="mt-6">
          {flash ? (
            <div
              className="vl-rise flex items-start gap-3 p-4 md:px-5"
              style={{
                border: "1px solid " + (flash.tone === "warning" ? "rgba(192,138,78,0.45)" : "rgba(143,174,139,0.45)"),
                backgroundColor: flash.tone === "warning" ? "rgba(192,138,78,0.08)" : "rgba(143,174,139,0.08)",
                borderRadius: brand.radius,
              }}
            >
              {flash.tone === "warning" ? (
                <Icons.AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: COPPER }} aria-hidden="true" />
              ) : (
                <Icons.CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }} aria-hidden="true" />
              )}
              <div className="flex-1">
                <p className="text-sm" style={{ color: ink }}>
                  {flash.title}
                </p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: neutral, maxWidth: "68ch" }}>
                  {flash.body}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Row 3 — today's appointments */}
        <section
          data-wf="b-2-0"
          className="mt-6 overflow-hidden"
          style={{ backgroundColor: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: brand.radius }}
        >
          <header
            className="px-5 md:px-6 py-5 flex flex-wrap items-start justify-between gap-4"
            style={{ borderBottom: "1px solid " + HAIRLINE }}
          >
            <div>
              <h2 className="text-[20px] leading-tight" style={{ fontFamily: brand.fontHeading, color: ink }}>
                Today’s appointments ({filtered.length})
              </h2>
              <p className="text-xs mt-2" style={{ color: neutral }}>
                Tick a row to mark the arrival. Open the time link to see the slot in the provider calendar.
              </p>
            </div>
            <p
              className="text-[11px] uppercase tracking-[0.16em] flex items-center gap-2"
              style={{ color: neutral, fontVariantNumeric: "tabular-nums" }}
            >
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              Synced 11:41 · Front desk 2
            </p>
          </header>

          <Table className="w-full text-left" style={{ fontVariantNumeric: "tabular-nums" }}>
            <THead>
              <TR style={{ borderBottom: "1px solid " + HAIRLINE }}>
                <TH scope="col" className="px-5 md:px-6 py-3 w-[48px]">
                  <span className="sr-only">Select appointment</span>
                </TH>
                <TH
                  data-wf="i-2-0-0"
                  scope="col"
                  className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] font-normal"
                  style={{ color: neutral }}
                >
                  Time
                </TH>
                <TH
                  data-wf="i-2-0-1"
                  scope="col"
                  className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] font-normal"
                  style={{ color: neutral }}
                >
                  Patient
                </TH>
                <TH
                  data-wf="i-2-0-2"
                  scope="col"
                  className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] font-normal"
                  style={{ color: neutral }}
                >
                  Provider
                </TH>
                <TH
                  data-wf="i-2-0-3"
                  scope="col"
                  className="px-3 py-3 text-[11px] uppercase tracking-[0.16em] font-normal"
                  style={{ color: neutral }}
                >
                  Reason note
                </TH>
                <TH
                  data-wf="i-2-0-4"
                  scope="col"
                  className="px-3 md:px-6 py-3 text-[11px] uppercase tracking-[0.16em] font-normal"
                  style={{ color: neutral }}
                >
                  Status
                </TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((a, idx) => {
                const meta = statusMeta[a.status];
                const patient = patientOf(a);
                const provider = providerOf(a);
                const selected = selectedIds.includes(a.id);
                const locked = a.status === "cancelled";
                const StatusIcon = meta.Icon;
                const rows = [];

                if (idx === nowIndex) {
                  rows.push(
                    <TR key="now-rule">
                      <TD colSpan={6} className="px-5 md:px-6 py-0">
                        <div className="flex items-center gap-3 py-2">
                          <span
                            className="text-[11px] uppercase tracking-[0.18em]"
                            style={{ color: accent, fontVariantNumeric: "tabular-nums" }}
                          >
                            Now · {NOW_LABEL}
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex-1"
                            style={{ height: "1px", backgroundColor: "rgba(143,174,139,0.45)" }}
                          />
                        </div>
                      </TD>
                    </TR>
                  );
                }

                rows.push(
                  <TR
                    key={a.id}
                    className={
                      "vl-row cursor-pointer " + (justChanged.includes(a.id) ? "vl-changed" : "")
                    }
                    onClick={() => navigate("calendar")}
                    style={{
                      borderTop: "1px solid " + HAIRLINE_SOFT,
                      backgroundColor: selected ? "rgba(143,174,139,0.09)" : "transparent",
                    }}
                  >
                    <TD
                      className="px-5 md:px-6 py-4 align-top"
                      style={{ boxShadow: "inset 2px 0 0 " + meta.rail }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        className="vl-focus"
                        checked={selected}
                        disabled={locked}
                        onChange={() => toggle(a.id)}
                        aria-label={
                          locked
                            ? fullName(a) + " at " + hhmm(a.start_time) + " is cancelled and cannot be marked"
                            : "Select " + fullName(a) + " at " + hhmm(a.start_time)
                        }
                      />
                    </TD>

                    <TD className="px-3 py-4 align-top whitespace-nowrap">
                      <button
                        type="button"
                        className="vl-focus vl-link text-[17px] underline decoration-1"
                        style={{
                          color: a.status === "cancelled" ? neutral : ink,
                          textDecorationLine: a.status === "cancelled" ? "line-through" : "underline",
                          fontVariantNumeric: "tabular-nums",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("calendar");
                        }}
                        aria-label={
                          "Open " + hhmm(a.start_time) + " " + fullName(a) + " with " + provider.name + " in the calendar"
                        }
                      >
                        {hhmm(a.start_time)}
                      </button>
                      <span className="block text-xs mt-1" style={{ color: neutral }}>
                        to {hhmm(a.end_time)}
                      </span>
                      <span className="block text-[11px] mt-1 tracking-[0.08em]" style={{ color: accent }}>
                        {a.id}
                      </span>
                    </TD>

                    <TD className="px-3 py-4 align-top">
                      <span className="flex items-start gap-3">
                        <Avatar name={fullName(a)} className="w-8 h-8 shrink-0" />
                        <span className="block">
                          <span className="block text-sm" style={{ color: ink }}>
                            {fullName(a)}
                          </span>
                          <span className="block text-xs mt-1" style={{ color: neutral }}>
                            {patient.phone}
                          </span>
                        </span>
                      </span>
                    </TD>

                    <TD className="px-3 py-4 align-top">
                      <span className="block text-sm" style={{ color: ink }}>
                        {provider.name}
                      </span>
                      <span className="block text-xs mt-1" style={{ color: neutral }}>
                        {provider.specialty}
                      </span>
                    </TD>

                    <TD className="px-3 py-4 align-top">
                      <span
                        className="block text-sm leading-relaxed"
                        style={{ color: neutral, maxWidth: "34ch" }}
                      >
                        {a.reason_note}
                      </span>
                    </TD>

                    <TD className="px-3 md:px-6 py-4 align-top">
                      <Badge
                        className="inline-flex items-center gap-2 px-2.5 py-1 text-xs whitespace-nowrap"
                        style={{
                          backgroundColor: meta.bg,
                          color: meta.fg,
                          border: "1px solid " + meta.border,
                          borderRadius: brand.radius,
                          borderStyle: a.status === "cancelled" ? "dashed" : "solid",
                        }}
                      >
                        <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
                        {meta.label}
                      </Badge>
                    </TD>
                  </TR>
                );

                return rows;
              })}
            </TBody>
          </Table>

          {filtered.length === 0 ? (
            <p className="px-5 md:px-6 py-5 text-xs" style={{ color: neutral }}>
              Nothing to list under the current view.
            </p>
          ) : null}
        </section>

        {/* Row 4 — arrival actions */}
        <div className="mt-6">
          <p className="text-xs mb-3" style={{ color: neutral, fontVariantNumeric: "tabular-nums" }}>
            {selectedIds.length === 0
              ? "Tick an appointment above to record an arrival."
              : selectedIds.length + (selectedIds.length === 1 ? " appointment selected" : " appointments selected") +
                " — " + joinNames(appointments.filter((a) => selectedIds.includes(a.id)))}
          </p>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4">
              <Button
                data-wf="b-3-0"
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => markStatus("attended")}
                className="vl-focus vl-btn w-full inline-flex items-center justify-center gap-2 px-4 text-sm tracking-[0.04em]"
                style={actionButtonStyle(selectedIds.length > 0, "primary")}
              >
                <Icons.Check className="w-4 h-4" aria-hidden="true" />
                Mark attended
              </Button>
            </div>
            <div className="col-span-12 sm:col-span-4">
              <Button
                data-wf="b-3-1"
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => markStatus("no-show")}
                className="vl-focus vl-btn w-full inline-flex items-center justify-center gap-2 px-4 text-sm tracking-[0.04em]"
                style={actionButtonStyle(selectedIds.length > 0, "ghost")}
              >
                <Icons.X className="w-4 h-4" aria-hidden="true" />
                Mark no-show
              </Button>
            </div>
            <div className="col-span-12 sm:col-span-4 flex items-center sm:justify-end">
              <button
                data-wf="b-3-2"
                type="button"
                disabled={!singleSelected}
                onClick={() => navigate("patient-detail")}
                className="vl-focus vl-link inline-flex items-center gap-2 px-2 text-sm underline decoration-1"
                style={{
                  color: singleSelected ? accent : neutral,
                  minHeight: "48px",
                  opacity: singleSelected ? 1 : 0.6,
                  cursor: singleSelected ? "pointer" : "not-allowed",
                }}
              >
                Open patient record
                {singleSelected ? (
                  <span style={{ color: neutral }}>— {fullName(singleSelected)}</span>
                ) : null}
                <Icons.ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {!singleSelected && selectedIds.length > 1 ? (
            <p className="text-xs mt-3" style={{ color: neutral }}>
              Select a single appointment to open that patient’s record and visit history.
            </p>
          ) : null}
        </div>

        {/* Row 5 — empty state */}
        {filtered.length === 0 ? (
          <div
            data-wf="b-4-0"
            className="vl-rise mt-6 px-6 py-10"
            style={{ backgroundColor: SURFACE_RAISED, border: "1px solid " + HAIRLINE, borderRadius: brand.radius }}
          >
            {appointments.length === 0 ? (
              <Empty
                title="No appointments booked for today."
                description={
                  "The day is clear across all " +
                  PROVIDERS.length +
                  " providers. Walk-ins can go straight into a provider’s calendar."
                }
                action={
                  <Button
                    type="button"
                    onClick={() => navigate("calendar")}
                    className="vl-focus vl-btn inline-flex items-center justify-center gap-2 px-5 text-sm"
                    style={{
                      backgroundColor: accent,
                      color: brand.backgroundColor,
                      border: "1px solid " + accent,
                      borderRadius: brand.radius,
                      minHeight: "44px",
                    }}
                  >
                    <Icons.Plus className="w-4 h-4" aria-hidden="true" />
                    Book appointment
                  </Button>
                }
              />
            ) : (
              <Empty
                title="Nothing matches this view of today."
                description={
                  "No appointments today for " +
                  (providerFilter === "all"
                    ? "all providers"
                    : PROVIDERS.find((p) => p.id === providerFilter).name) +
                  (statusFilter === "all" ? "" : " with status " + statusMeta[statusFilter].label.toLowerCase()) +
                  (query.trim() ? " matching “" + query.trim() + "”" : "") +
                  ". Clear the filters to see all " +
                  appointments.length +
                  " of today’s appointments."
                }
                action={
                  <Button
                    type="button"
                    onClick={clearFilters}
                    className="vl-focus vl-btn inline-flex items-center justify-center gap-2 px-5 text-sm"
                    style={{
                      backgroundColor: "transparent",
                      color: accent,
                      border: "1px solid " + accent,
                      borderRadius: brand.radius,
                      minHeight: "44px",
                    }}
                  >
                    <Icons.Filter className="w-4 h-4" aria-hidden="true" />
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>
        ) : null}

        <p className="mt-10 text-xs" style={{ color: neutral, maxWidth: "70ch" }}>
          Front-desk notes only — DevonTester records contact details, times and visit status. No diagnoses,
          prescriptions or lab results are stored here.
        </p>
      </div>
    </div>
  );
}
