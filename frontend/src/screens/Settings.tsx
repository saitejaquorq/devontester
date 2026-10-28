// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Select, Badge, Table, THead, TBody, TR, TH, TD, Avatar, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, X, ChevronRight, ChevronDown, Calendar, Clock, Edit, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } = Icons;

const withAlpha = (hex, a) => {
  const h = String(hex || '#000000').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Velvet token roles — every colour traced back to a brand role.
// "ember" is the one warning tone: a warm copper that sits inside the
// Velvet metal language and never competes with the sage accent.
const EMBER = '#c9896b';

const SESSION = { username: 'm.bennett', role: 'admin' };

const INITIAL_ACCOUNTS = [
  { id: 'ACC-0407', username: 'm.bennett', role: 'admin', is_active: true, created_at: '2024-03-11' },
  { id: 'ACC-0412', username: 'd.okafor', role: 'staff', is_active: true, created_at: '2025-01-08' },
  { id: 'ACC-0418', username: 'r.lindqvist', role: 'staff', is_active: true, created_at: '2025-06-02' },
  { id: 'ACC-0421', username: 't.whitfield', role: 'staff', is_active: false, created_at: '2024-09-19' },
];

// Starters already cleared by the practice manager, waiting for a login.
const ONBOARDING_QUEUE = [
  { id: 'ACC-0426', username: 'a.castellanos', role: 'staff', note: 'Maternity cover, Tuesday to Thursday desk.' },
  { id: 'ACC-0427', username: 'j.nakamura', role: 'staff', note: 'Saturday morning clinic cover.' },
  { id: 'ACC-0431', username: 'p.osei', role: 'admin', note: 'Practice manager, second admin on the rota.' },
];

const HELP_ITEMS = [
  {
    id: 'help-signin',
    wf: 'i-5-0-0',
    title: 'Signing in and signing out at the front desk',
    summary: 'Start your shift, and close the session before you step away.',
    steps: [
      'Open DevonTester and enter the username and password an admin issued to you.',
      'If sign-in fails, the message will not say which field was wrong — retype both and try again.',
      'Select Sign out whenever you leave the desk, even for a five-minute break.',
      'Once signed out, the browser back button will not bring patient data back on screen.',
    ],
  },
  {
    id: 'help-patients',
    wf: 'i-5-0-1',
    title: 'Adding a patient and keeping contact details up to date',
    summary: 'Name, phone and email only — no clinical information is stored here.',
    steps: [
      'Open Patients and select Add patient.',
      'Enter first name and last name. The record will not save without a name.',
      'Add phone and email. A malformed email address is rejected so the record stays usable.',
      'To correct details later, open the patient record, edit the contact fields and save.',
    ],
  },
  {
    id: 'help-booking',
    wf: 'i-5-0-2',
    title: "Booking an appointment into a provider's calendar",
    summary: 'Pick the provider, pick the slot, link the patient, add the reason note.',
    steps: [
      'Open the provider calendar and choose the provider, then the day or week view.',
      'Select an open slot and link the patient by searching their name.',
      'Add a short reason-for-visit note, such as “Follow-up — knee brace fitting”.',
      'Save. The visit appears in the slot with the status Booked.',
      'If the provider already has something overlapping that slot, you are warned before it is confirmed.',
    ],
    navLabel: 'Open provider calendar',
    navRoute: 'calendar',
  },
  {
    id: 'help-reschedule',
    wf: 'i-5-0-3',
    title: 'Rescheduling or cancelling an appointment',
    summary: 'Move a visit to a new time or provider, or release the slot entirely.',
    steps: [
      "Open the appointment from the calendar or from the patient's visit history.",
      'To move it, change the date, time or provider and save — it leaves the original slot.',
      'To cancel, select Cancel appointment and confirm. Nothing changes until you confirm.',
      "Cancelled visits stay in the patient's history, marked Cancelled.",
    ],
  },
  {
    id: 'help-status',
    wf: 'i-5-0-4',
    title: 'Marking attended, no-show or cancelled',
    summary: 'Keep the day honest so the history reads correctly tomorrow.',
    steps: [
      'Every appointment starts as Booked the moment you save it.',
      'When the patient arrives at the desk, set the status to Attended.',
      'If they have not arrived by the end of the slot, set No-show.',
      "The status shows on the appointment, the calendar and the patient's visit history.",
    ],
  },
];

const NOT_IN_SCOPE = [
  'No payments, billing or invoicing',
  'No automated patient SMS or email reminders',
  'No EHR / HL7 / FHIR integration',
  'No patient or clinician logins',
];

const formatCreated = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Screen() {
  const navigate = useNavigate();
  const surface = withAlpha(brand.primaryColor, 0.035);
  const surfaceHi = withAlpha(brand.primaryColor, 0.06);
  const hairline = withAlpha(brand.primaryColor, 0.11);
  const hairlineSoft = withAlpha(brand.primaryColor, 0.07);
  const accent = brand.accentColor;
  const muted = brand.neutralColor;

  const [tab, setTab] = React.useState('accounts');
  const [accounts, setAccounts] = React.useState(INITIAL_ACCOUNTS);
  const [queueIndex, setQueueIndex] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [banner, setBanner] = React.useState(null);
  const [newRowId, setNewRowId] = React.useState(null);
  const [openHelp, setOpenHelp] = React.useState('help-booking');

  const timers = React.useRef([]);
  const tabRefs = React.useRef({});

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const defer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const sessionRole = SESSION.role;
  const isAdmin = sessionRole === 'admin';
  const tabs = isAdmin
    ? [{ key: 'accounts', label: 'Accounts', wf: 'i-1-0-0' }, { key: 'help', label: 'How-to guide', wf: 'i-1-0-1' }]
    : [{ key: 'help', label: 'How-to guide', wf: 'i-1-0-1' }];
  const activeTab = isAdmin ? tab : 'help';

  const nextHire = ONBOARDING_QUEUE[queueIndex] || null;

  const addNextAccount = () => {
    if (!nextHire || saving) return;
    setSaving(true);
    defer(() => {
      const record = {
        id: nextHire.id,
        username: nextHire.username,
        role: nextHire.role,
        is_active: true,
        created_at: new Date().toISOString().slice(0, 10),
      };
      setAccounts((prev) => [...prev, record]);
      setQueueIndex((i) => i + 1);
      setNewRowId(record.id);
      setSaving(false);
      setBanner({
        tone: 'success',
        text: `${record.username} added as ${record.role === 'admin' ? 'an admin' : 'a staff'} account. Hand them their temporary password at the desk.`,
      });
      defer(() => setNewRowId(null), 2400);
    }, 650);
  };

  const toggleRole = (acct) => {
    const nextRole = acct.role === 'admin' ? 'staff' : 'admin';
    setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, role: nextRole } : a)));
    setNewRowId(acct.id);
    setBanner({
      tone: 'success',
      text:
        nextRole === 'admin'
          ? `${acct.username} is now an admin and can manage accounts from this screen.`
          : `${acct.username} is now a staff account. The Accounts tab is hidden from them.`,
    });
    defer(() => setNewRowId(null), 2400);
  };

  const deactivate = (acct) => {
    setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, is_active: false } : a)));
    setBanner({
      tone: 'success',
      text: `${acct.username} deactivated. They cannot sign in until an admin reactivates the account — their appointments stay as they are.`,
    });
    setNewRowId(acct.id);
    defer(() => setNewRowId(null), 2400);
  };

  const reactivate = (acct) => {
    setAccounts((prev) => prev.map((a) => (a.id === acct.id ? { ...a, is_active: true } : a)));
    setBanner({ tone: 'success', text: `${acct.username} reactivated. Their old password still works.` });
    setNewRowId(acct.id);
    defer(() => setNewRowId(null), 2400);
  };

  const onTabKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.key === activeTab);
    const nextIdx = e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    const nextKey = tabs[nextIdx].key;
    setTab(nextKey);
    defer(() => tabRefs.current[nextKey] && tabRefs.current[nextKey].focus(), 10);
  };

  const labelStyle = {
    fontSize: '11px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: muted,
  };

  const panelStyle = {
    backgroundColor: surface,
    border: `1px solid ${hairline}`,
    borderRadius: brand.radius,
  };

  const ghostBtn = 'vel-focus vel-ghost inline-flex items-center gap-2 px-3 h-11 text-sm transition-colors';
  const ghostStyle = {
    border: `1px solid ${hairline}`,
    borderRadius: brand.radius,
    color: brand.primaryColor,
    backgroundColor: 'transparent',
    fontFamily: brand.fontBody,
  };

  return (
    <div
      className="vel-screen min-h-full w-full px-6 py-10 sm:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        '--vel-accent': accent,
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
            <span aria-hidden="true" style={{ display: 'block', width: 28, height: 1, backgroundColor: accent }} />
            <p style={labelStyle}>Front desk · Administration</p>
          </div>
          <h1
            className="mt-4 text-[34px] leading-tight sm:text-[40px]"
            style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
          >
            Accounts &amp; help
          </h1>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed" style={{ color: muted }}>
            Manage who can sign in at the front desk of Devon Street Clinic, and read the how-to guide for the
            everyday jobs on the desk.
          </p>
        </header>

        {/* Row 2 — tabs */}
        <div data-wf="b-1-0" className="mb-8" style={{ borderBottom: `1px solid ${hairline}` }}>
          <div role="tablist" aria-label="Accounts and help sections" className="flex gap-1" onKeyDown={onTabKeyDown}>
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
                    borderBottom: `2px solid ${selected ? accent : 'transparent'}`,
                    fontFamily: brand.fontBody,
                    letterSpacing: '0.01em',
                  }}
                >
                  {t.label}
                  {t.key === 'accounts' ? (
                    <span className="ml-2 text-[11px]" style={{ color: selected ? accent : muted }}>
                      admin only
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'accounts' ? (
          <section id="panel-accounts" role="tabpanel" aria-labelledby="tab-accounts" tabIndex={-1} className="vel-fade">
            {/* Row 3 — primary action */}
            <Button
              data-wf="b-2-0"
              type="button"
              onClick={addNextAccount}
              disabled={saving || !nextHire}
              aria-describedby="add-account-hint"
              className="vel-focus vel-primary inline-flex h-12 items-center gap-2 px-5 text-sm font-medium transition-[filter]"
              style={{
                backgroundColor: accent,
                color: brand.backgroundColor,
                borderRadius: brand.radius,
                border: 'none',
                fontFamily: brand.fontBody,
                letterSpacing: '0.01em',
                opacity: saving || !nextHire ? 0.55 : 1,
                cursor: !nextHire ? 'not-allowed' : saving ? 'progress' : 'pointer',
              }}
            >
              {saving ? (
                <Clock className="h-4 w-4 animate-pulse" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {saving ? 'Creating account…' : 'Add receptionist account'}
            </Button>

            <p id="add-account-hint" className="mt-3 max-w-[66ch] text-sm leading-relaxed" style={{ color: muted }} aria-live="polite">
              {saving ? (
                'Writing to the account list — the temporary password is shown once, at the desk.'
              ) : nextHire ? (
                <>
                  Next on the onboarding list:{' '}
                  <span style={{ color: accent }}>{nextHire.username}</span> ·{' '}
                  {nextHire.role === 'admin' ? 'Admin' : 'Staff'} — {nextHire.note}
                </>
              ) : (
                'Everyone cleared by the practice manager now has a login. New starters are added to the onboarding list first.'
              )}
            </p>

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
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" style={{ color: accent }} />
                <p className="flex-1 text-sm" style={{ color: brand.primaryColor }}>
                  {banner.text}
                </p>
              </div>
            ) : null}

            {/* Row 4 — accounts table */}
            <section data-wf="b-3-0" className="mt-8 overflow-hidden" style={panelStyle}>
              <div
                className="flex flex-wrap items-end justify-between gap-3 px-6 py-5"
                style={{ borderBottom: `1px solid ${hairline}` }}
              >
                <div>
                  <h2 className="text-[22px]" style={{ fontFamily: brand.fontHeading }}>
                    Receptionist accounts{' '}
                    <span style={{ color: accent, fontVariantNumeric: 'tabular-nums' }}>({accounts.length})</span>
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: muted }}>
                    {accounts.filter((a) => a.is_active).length} active ·{' '}
                    {accounts.filter((a) => !a.is_active).length} deactivated
                  </p>
                </div>
                <p className="flex items-center gap-2 text-xs" style={{ color: muted }}>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Last refreshed 08:14 today
                </p>
              </div>

              {accounts.length === 0 ? (
                <div className="px-6 py-10">
                  <Empty
                    title="No receptionist accounts yet"
                    description="Nobody can sign in to DevonTester until an admin creates the first front-desk account."
                    action={
                      <Button
                        type="button"
                        onClick={addNextAccount}
                        className="vel-focus vel-primary inline-flex h-11 items-center gap-2 px-4 text-sm"
                        style={{ backgroundColor: accent, color: brand.backgroundColor, borderRadius: brand.radius, border: 'none' }}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add receptionist account
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full text-sm" style={{ fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
                    <THead>
                      <TR style={{ borderBottom: `1px solid ${hairline}` }}>
                        <TH data-wf="i-3-0-0" scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Username
                        </TH>
                        <TH data-wf="i-3-0-1" scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Role
                        </TH>
                        <TH data-wf="i-3-0-2" scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Active
                        </TH>
                        <TH data-wf="i-3-0-3" scope="col" className="px-6 py-3 text-left font-normal" style={labelStyle}>
                          Created
                        </TH>
                        <TH scope="col" className="px-6 py-3 text-right font-normal" style={labelStyle}>
                          <span className="sr-only">Account actions</span>
                        </TH>
                      </TR>
                    </THead>
                    <TBody>
                      {accounts.map((a) => (
                        <TR
                          key={a.id}
                          className={`vel-row transition-colors ${newRowId === a.id ? 'vel-row-new' : ''}`}
                          style={{ borderBottom: `1px solid ${hairlineSoft}` }}
                        >
                          <TD className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar name={a.username} className="h-9 w-9 shrink-0" />
                              <span>
                                <span className="block" style={{ color: brand.primaryColor }}>
                                  {a.username}
                                </span>
                                <span className="block text-xs" style={{ color: accent, letterSpacing: '0.08em' }}>
                                  {a.id}
                                </span>
                              </span>
                            </div>
                          </TD>
                          <TD className="px-6 py-4 align-middle">
                            <Badge
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs"
                              style={{
                                backgroundColor: a.role === 'admin' ? withAlpha(accent, 0.12) : 'transparent',
                                border: `1px solid ${a.role === 'admin' ? withAlpha(accent, 0.4) : hairline}`,
                                color: a.role === 'admin' ? accent : brand.primaryColor,
                                borderRadius: brand.radius,
                              }}
                            >
                              {a.role === 'admin' ? 'Admin' : 'Staff'}
                            </Badge>
                          </TD>
                          <TD className="px-6 py-4 align-middle">
                            <span className="inline-flex items-center gap-2" style={{ color: a.is_active ? brand.primaryColor : muted }}>
                              {a.is_active ? (
                                <CheckCircle className="h-4 w-4" aria-hidden="true" style={{ color: accent }} />
                              ) : (
                                <X className="h-4 w-4" aria-hidden="true" />
                              )}
                              {a.is_active ? 'Active' : 'Deactivated'}
                            </span>
                          </TD>
                          <TD className="px-6 py-4 align-middle" style={{ color: muted }}>
                            {formatCreated(a.created_at)}
                          </TD>
                          <TD className="px-6 py-4 text-right align-middle">
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                onClick={() => toggleRole(a)}
                                aria-label={
                                  a.role === 'admin'
                                    ? `Change ${a.username} to a staff account`
                                    : `Change ${a.username} to an admin account`
                                }
                                className={ghostBtn}
                                style={ghostStyle}
                              >
                                <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                                {a.role === 'admin' ? 'Make staff' : 'Make admin'}
                              </Button>
                              {a.is_active ? (
                                <Button
                                  type="button"
                                  onClick={() => deactivate(a)}
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
                                  aria-label={`Reactivate account ${a.username}`}
                                  className={ghostBtn}
                                  style={ghostStyle}
                                >
                                  Reactivate
                                </Button>
                              )}
                            </div>
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </div>
              )}
            </section>

            {/* Row 5 — admin-only note */}
            <div data-wf="b-4-0" className="mt-6">
              <p className="max-w-[72ch] text-sm leading-relaxed" style={{ color: muted }}>
                Account management is visible to admin accounts only. Staff accounts see the how-to guide alone.
              </p>
            </div>
          </section>
        ) : null}

        {activeTab === 'help' ? (
          <section id="panel-help" role="tabpanel" aria-labelledby="tab-help" tabIndex={-1} className="vel-fade">
            {!isAdmin ? (
              <div
                className="mb-8 flex flex-wrap items-start gap-4 px-6 py-5"
                style={{ ...panelStyle, backgroundColor: surfaceHi }}
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" style={{ color: accent }} />
                <div className="min-w-[18rem] flex-1">
                  <h2 className="text-[18px]" style={{ fontFamily: brand.fontHeading }}>
                    Accounts is for admins
                  </h2>
                  <p className="mt-2 max-w-[66ch] text-sm leading-relaxed" style={{ color: muted }}>
                    You are signed in as a staff account, so creating, editing and deactivating receptionist logins is
                    hidden. Ask <span style={{ color: accent }}>m.bennett</span> — the clinic admin — to set up or close
                    an account for you.
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
                        <li key={item.id} style={{ borderBottom: i === HELP_ITEMS.length - 1 ? 'none' : `1px solid ${hairlineSoft}` }}>
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
                                style={{ color: accent, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em' }}
                              >
                                {String(i + 1).padStart(2, '0')}
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
                                style={{ color: muted, transform: open ? 'rotate(180deg)' : 'none' }}
                              />
                            </button>
                          </h3>
                          {open ? (
                            <div id={`${item.id}-steps`} className="vel-steps px-6 pb-6 pl-[4.25rem]">
                              <ol className="space-y-2">
                                {item.steps.map((s, si) => (
                                  <li key={si} className="flex gap-3 text-sm leading-relaxed" style={{ color: brand.primaryColor }}>
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
                    <CardTitle className="text-[20px]" style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}>
                      What this tool does not do
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm leading-relaxed" style={{ color: muted }}>
                      Agreed scope for DevonTester. If a patient asks for any of these at the desk, handle it the way
                      the clinic did before.
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
                        Single clinic · dummy test records only, never real patient data. Everything the desk needs sits
                        under Today, Calendar and Patients.
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
