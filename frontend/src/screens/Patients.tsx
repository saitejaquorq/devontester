// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label, Table, THead, TBody, TR, TH, TD, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, ChevronRight, Clock, AlertCircle, CheckCircle } = Icons;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SEED_PATIENTS = [
  { id: 'PT-1042', first_name: 'Ellie', last_name: 'Dawson', phone: '07700 900 318', email: 'ellie.dawson@example.com', created_at: '2026-10-27' },
  { id: 'PT-1041', first_name: 'Hamza', last_name: 'Yilmaz', phone: '07700 900 274', email: 'h.yilmaz@example.com', created_at: '2026-10-26' },
  { id: 'PT-1040', first_name: 'Beatrice', last_name: 'Mensah', phone: '020 7946 0188', email: 'bea.mensah@example.com', created_at: '2026-10-26' },
  { id: 'PT-1039', first_name: 'Callum', last_name: 'Fraser', phone: '07700 900 907', email: '', created_at: '2026-10-24' },
  { id: 'PT-1038', first_name: 'Priya', last_name: 'Raghunathan', phone: '07700 900 441', email: 'priya.r@example.com', created_at: '2026-10-22' },
  { id: 'PT-1037', first_name: 'Noah', last_name: 'Eberhardt', phone: '07700 900 655', email: 'noah.eberhardt@example.com', created_at: '2026-10-20' },
  { id: 'PT-1036', first_name: 'Saoirse', last_name: 'Byrne', phone: '020 7946 0921', email: 'saoirse.byrne@example.com', created_at: '2026-10-15' },
  { id: 'PT-1035', first_name: 'Jamal', last_name: 'Osei', phone: '07700 900 103', email: 'jamal.osei@example.com', created_at: '2026-10-09' },
  { id: 'PT-1034', first_name: 'Tilly', last_name: 'Ashworth', phone: '07700 900 762', email: 'tilly.ashworth@example.com', created_at: '2026-10-02' },
  { id: 'PT-1033', first_name: 'Marcus', last_name: 'Delaney', phone: '', email: 'm.delaney@example.com', created_at: '2026-09-28' },
  { id: 'PT-1032', first_name: 'Fatima', last_name: 'Al-Rashid', phone: '07700 900 519', email: 'fatima.alrashid@example.com', created_at: '2026-09-21' },
  { id: 'PT-1031', first_name: 'Grace', last_name: 'Okafor', phone: '07700 900 237', email: 'grace.okafor@example.com', created_at: '2026-09-14' },
  { id: 'PT-1030', first_name: 'Oliver', last_name: 'Brandt', phone: '020 7946 0450', email: 'oliver.brandt@example.com', created_at: '2026-09-03' },
  { id: 'PT-1029', first_name: 'Divya', last_name: 'Nair', phone: '07700 900 846', email: 'divya.nair@example.com', created_at: '2026-08-27' },
  { id: 'PT-1028', first_name: 'William', last_name: 'Ngata', phone: '07700 900 390', email: '', created_at: '2026-08-19' },
  { id: 'PT-1027', first_name: 'Rosa', last_name: 'Castellanos', phone: '07700 900 712', email: 'rosa.castellanos@example.com', created_at: '2026-08-11' },
  { id: 'PT-1026', first_name: 'Joon-ho', last_name: 'Park', phone: '07700 900 158', email: 'joonho.park@example.com', created_at: '2026-08-04' },
  { id: 'PT-1025', first_name: 'Esme', last_name: 'Lindqvist', phone: '020 7946 0376', email: 'esme.lindqvist@example.com', created_at: '2026-07-29' },
  { id: 'PT-1024', first_name: 'Samir', last_name: 'Haddad', phone: '07700 900 604', email: 'samir.haddad@example.com', created_at: '2026-07-16' },
  { id: 'PT-1023', first_name: 'Isla', last_name: 'MacLeod', phone: '07700 900 285', email: 'isla.macleod@example.com', created_at: '2026-07-08' },
  { id: 'PT-1022', first_name: 'Felix', last_name: 'Hartmann', phone: '07700 900 931', email: 'felix.hartmann@example.com', created_at: '2026-06-30' },
  { id: 'PT-1021', first_name: 'Nina', last_name: 'Kowalski', phone: '07700 900 147', email: 'nina.kowalski@example.com', created_at: '2026-06-22' },
  { id: 'PT-1020', first_name: 'Quentin', last_name: 'Hale', phone: '020 7946 0714', email: '', created_at: '2026-06-11' },
  { id: 'PT-1019', first_name: 'Gabriela', last_name: 'Souza', phone: '07700 900 528', email: 'gabriela.souza@example.com', created_at: '2026-05-29' },
  { id: 'PT-1018', first_name: 'Harriet', last_name: 'Gillingham', phone: '07700 900 873', email: 'h.gillingham@example.com', created_at: '2026-05-18' },
  { id: 'PT-1017', first_name: 'Umar', last_name: 'Siddiqui', phone: '07700 900 366', email: 'umar.siddiqui@example.com', created_at: '2026-05-06' },
  { id: 'PT-1016', first_name: 'Clara', last_name: 'Webb', phone: '07700 900 492', email: 'clara.webb@example.com', created_at: '2026-04-24' },
  { id: 'PT-1015', first_name: 'Amara', last_name: 'Adeyemi', phone: '020 7946 0233', email: 'amara.adeyemi@example.com', created_at: '2026-04-15' },
  { id: 'PT-1014', first_name: 'Pascal', last_name: 'Rivard', phone: '07700 900 681', email: 'pascal.rivard@example.com', created_at: '2026-04-02' },
  { id: 'PT-1013', first_name: 'Katrina', last_name: 'Petrova', phone: '07700 900 215', email: 'katrina.petrova@example.com', created_at: '2026-03-21' },
  { id: 'PT-1012', first_name: 'Liam', last_name: "O'Donnell", phone: '07700 900 798', email: 'liam.odonnell@example.com', created_at: '2026-03-09' },
  { id: 'PT-1011', first_name: 'Maya', last_name: 'Thornbury', phone: '020 7946 0567', email: 'maya.thornbury@example.com', created_at: '2026-02-26' },
  { id: 'PT-1010', first_name: 'Yusuf', last_name: 'Demir', phone: '07700 900 342', email: 'yusuf.demir@example.com', created_at: '2026-02-14' },
  { id: 'PT-1009', first_name: 'Vera', last_name: 'Novak', phone: '07700 900 627', email: 'vera.novak@example.com', created_at: '2026-01-30' },
  { id: 'PT-1008', first_name: 'Aiden', last_name: 'Mulvaney', phone: '07700 900 184', email: '', created_at: '2026-01-19' },
  { id: 'PT-1007', first_name: 'Xiomara', last_name: 'Reyes', phone: '020 7946 0802', email: 'xiomara.reyes@example.com', created_at: '2025-12-11' },
  { id: 'PT-1006', first_name: 'Luca', last_name: 'Bianchi', phone: '07700 900 459', email: 'luca.bianchi@example.com', created_at: '2025-11-27' },
  { id: 'PT-1005', first_name: 'Olga', last_name: 'Dimitrova', phone: '07700 900 736', email: 'olga.dimitrova@example.com', created_at: '2025-11-05' },
  { id: 'PT-1004', first_name: 'Henry', last_name: 'Calloway', phone: '07700 900 291', email: 'henry.calloway@example.com', created_at: '2025-10-14' },
  { id: 'PT-1003', first_name: 'Zoe', last_name: 'Fairbanks', phone: '020 7946 0648', email: 'zoe.fairbanks@example.com', created_at: '2025-09-23' },
  { id: 'PT-1002', first_name: 'Devon', last_name: 'Pritchard', phone: '07700 900 573', email: 'devon.pritchard@example.com', created_at: '2025-08-30' },
  { id: 'PT-1001', first_name: 'Tom', last_name: 'Whitfield', phone: '07700 900 826', email: 'tom.whitfield@example.com', created_at: '2025-07-12' }
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatAdded(iso) {
  const parts = String(iso).split('-');
  if (parts.length !== 3) return iso;
  return Number(parts[2]) + ' ' + MONTHS[Number(parts[1]) - 1] + ' ' + parts[0];
}

function digitsOnly(value) {
  return String(value).replace(/\D/g, '');
}

export default function Screen() {
  const navigate = useNavigate();
  const surface = `color-mix(in srgb, ${brand.backgroundColor} 94%, ${brand.primaryColor})`;
  const surfaceRaised = `color-mix(in srgb, ${brand.backgroundColor} 90%, ${brand.primaryColor})`;
  const hairline = `color-mix(in srgb, ${brand.backgroundColor} 88%, ${brand.primaryColor})`;
  const hairlineSoft = `color-mix(in srgb, ${brand.backgroundColor} 93%, ${brand.primaryColor})`;
  const rowHover = `color-mix(in srgb, ${brand.backgroundColor} 88%, ${brand.accentColor})`;
  const accentSoft = `color-mix(in srgb, ${brand.backgroundColor} 84%, ${brand.accentColor})`;
  const danger = `color-mix(in srgb, tomato 72%, ${brand.primaryColor})`;
  const dangerSurface = `color-mix(in srgb, ${brand.backgroundColor} 86%, tomato)`;

  const [patients, setPatients] = React.useState(SEED_PATIENTS);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [formError, setFormError] = React.useState(null);
  const [added, setAdded] = React.useState(null);

  const addButtonRef = React.useRef(null);
  const firstFieldRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const timers = React.useRef([]);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    timers.current.push(t);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  React.useEffect(() => {
    if (modalOpen && firstFieldRef.current) firstFieldRef.current.focus();
  }, [modalOpen]);

  const trimmedQuery = query.trim();

  const filtered = React.useMemo(() => {
    const sorted = patients
      .slice()
      .sort((a, b) =>
        a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name)
      );
    if (!trimmedQuery) return sorted;
    const q = trimmedQuery.toLowerCase();
    const qDigits = digitsOnly(trimmedQuery);
    return sorted.filter((p) => {
      const name = (p.first_name + ' ' + p.last_name).toLowerCase();
      const byName = name.indexOf(q) !== -1;
      const byEmail = p.email ? p.email.toLowerCase().indexOf(q) !== -1 : false;
      const byPhone = qDigits.length >= 3 && p.phone ? digitsOnly(p.phone).indexOf(qDigits) !== -1 : false;
      const byRef = p.id.toLowerCase().indexOf(q) !== -1;
      return byName || byEmail || byPhone || byRef;
    });
  }, [patients, trimmedQuery]);

  const groups = React.useMemo(() => {
    const out = [];
    filtered.forEach((p) => {
      const letter = p.last_name.charAt(0).toUpperCase();
      const last = out[out.length - 1];
      if (last && last.letter === letter) last.rows.push(p);
      else out.push({ letter, rows: [p] });
    });
    return out;
  }, [filtered]);

  function openModal() {
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSaving(false);
    if (addButtonRef.current) addButtonRef.current.focus();
  }

  function discard() {
    setForm({ first_name: '', last_name: '', phone: '', email: '' });
    setFormError(null);
    closeModal();
  }

  function setField(key, value) {
    setForm((prev) => Object.assign({}, prev, { [key]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    const fields = [];
    const sentences = [];
    if (!firstName) {
      fields.push('first_name');
      sentences.push('First name is required.');
    }
    if (!lastName) {
      fields.push('last_name');
      sentences.push('Last name is required.');
    }
    if (email && !EMAIL_RE.test(email)) {
      fields.push('email');
      sentences.push('Enter a valid email such as ellie.dawson@example.com.');
    }
    if (fields.length) {
      setFormError({ fields: fields, message: sentences.join(' ') });
      return;
    }

    setFormError(null);
    setSaving(true);
    const t = setTimeout(() => {
      const nextRef = 'PT-' + (1042 + patients.length - SEED_PATIENTS.length + 1);
      const record = {
        id: nextRef,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        email: email,
        created_at: '2026-10-28'
      };
      setPatients((prev) => [record].concat(prev));
      setAdded(record);
      setQuery('');
      setForm({ first_name: '', last_name: '', phone: '', email: '' });
      setSaving(false);
      setModalOpen(false);
      if (addButtonRef.current) addButtonRef.current.focus();
    }, 550);
    timers.current.push(t);
  }

  function handleDialogKeyDown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      discard();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const nodes = Array.prototype.slice
      .call(dialogRef.current.querySelectorAll('button, input, textarea, select, a[href]'))
      .filter((n) => !n.disabled && n.getAttribute('aria-hidden') !== 'true');
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const labelStyle = {
    fontFamily: brand.fontBody,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontSize: '11px',
    color: brand.neutralColor
  };

  const headerCellStyle = Object.assign({}, labelStyle, {
    borderBottom: `1px solid ${hairline}`,
    padding: '14px 20px',
    textAlign: 'left',
    fontWeight: 500,
    background: 'transparent'
  });

  const cellStyle = {
    padding: '16px 20px',
    borderBottom: `1px solid ${hairlineSoft}`,
    fontFamily: brand.fontBody,
    fontSize: '14px',
    color: brand.primaryColor,
    fontVariantNumeric: 'tabular-nums'
  };

  const fieldStyle = (invalid) => ({
    backgroundColor: brand.backgroundColor,
    border: `1px solid ${invalid ? danger : hairline}`,
    color: brand.primaryColor,
    borderRadius: brand.radius,
    fontFamily: brand.fontBody,
    height: '44px',
    padding: '0 12px',
    width: '100%'
  });

  const invalidField = (key) => Boolean(formError && formError.fields.indexOf(key) !== -1);

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        '--vt-accent': brand.accentColor,
        '--vt-row-hover': rowHover
      }}
    >
      <style>{`
        .vt-focus:focus-visible { outline: 2px solid var(--vt-accent); outline-offset: 2px; }
        .vt-row { transition: background-color 150ms ease; }
        .vt-row:hover { background-color: var(--vt-row-hover); }
        .vt-btn { transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease; }
        @keyframes vt-row-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes vt-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes vt-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes vt-breathe { 0%, 100% { opacity: .3; } 50% { opacity: .62; } }
        .vt-in { animation: vt-row-in 340ms ease-out both; }
        .vt-overlay { animation: vt-fade 160ms ease-out both; }
        .vt-panel { animation: vt-rise 220ms ease-out both; }
        .vt-skel { animation: vt-breathe 1.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vt-in, .vt-overlay, .vt-panel, .vt-skel { animation: none; }
          .vt-row, .vt-btn { transition: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
        {/* Row 1 — title + primary action */}
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8" data-wf="b-0-0">
            <p style={labelStyle}>Marlowe Street Clinic &middot; Front desk</p>
            <h1
              className="mt-3 text-4xl leading-tight"
              style={{ fontFamily: brand.fontHeading, color: brand.primaryColor, letterSpacing: '-0.01em' }}
            >
              Patients
            </h1>
            <div className="mt-4 h-px w-16" style={{ backgroundColor: brand.accentColor }} aria-hidden="true" />
            <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Contact details only — look someone up before you book, or open a record to correct a phone number
              or email.
            </p>
          </div>
          <div className="col-span-12 flex md:col-span-4 md:justify-end">
            <Button
              data-wf="b-0-1"
              ref={addButtonRef}
              onClick={openModal}
              className="vt-focus vt-btn inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-sm font-medium md:w-auto"
              style={{
                backgroundColor: brand.accentColor,
                color: brand.backgroundColor,
                borderRadius: brand.radius,
                border: '1px solid transparent'
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add patient
            </Button>
          </div>
        </div>

        {/* Success banner after a save */}
        {added ? (
          <div
            role="status"
            className="vt-in mt-8 flex flex-wrap items-center gap-4 px-5 py-4"
            style={{ backgroundColor: accentSoft, border: `1px solid ${brand.accentColor}`, borderRadius: brand.radius }}
          >
            <CheckCircle className="h-4 w-4 shrink-0" style={{ color: brand.accentColor }} aria-hidden="true" />
            <p className="text-sm" style={{ color: brand.primaryColor }}>
              <span style={{ fontFamily: brand.fontHeading }}>
                {added.first_name} {added.last_name}
              </span>{' '}
              added to the patient list as{' '}
              <span style={{ color: brand.accentColor, fontVariantNumeric: 'tabular-nums' }}>{added.id}</span>.
            </p>
          </div>
        ) : null}

        {/* Row 2 — search */}
        <section className="mt-8" data-wf="b-1-0" aria-labelledby="patient-search-label">
          <Label
            id="patient-search-label"
            htmlFor="patient-search"
            className="block"
            style={labelStyle}
          >
            Search by name, phone or email
          </Label>
          <div className="relative mt-3">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: brand.neutralColor }}
              aria-hidden="true"
            />
            <Input
              id="patient-search"
              type="search"
              value={query}
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Dawson, 07700 900 318, ellie.dawson@example.com"
              className="vt-focus w-full"
              style={{
                backgroundColor: surface,
                border: `1px solid ${hairline}`,
                borderRadius: brand.radius,
                color: brand.primaryColor,
                height: '52px',
                paddingLeft: '44px',
                paddingRight: query ? '112px' : '16px',
                fontFamily: brand.fontBody,
                fontSize: '15px'
              }}
            />
            {query ? (
              <Button
                onClick={() => setQuery('')}
                className="vt-focus vt-btn absolute right-3 top-1/2 h-8 -translate-y-1/2 px-3 text-xs"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${hairline}`,
                  color: brand.neutralColor,
                  borderRadius: brand.radius
                }}
              >
                Clear search
              </Button>
            ) : null}
          </div>
        </section>

        {/* Row 3 — directory table */}
        <section
          className="mt-6"
          data-wf="b-2-0"
          aria-labelledby="patient-count"
          style={{ backgroundColor: surface, border: `1px solid ${hairline}`, borderRadius: brand.radius }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
            <h2
              id="patient-count"
              className="text-lg"
              style={{ fontFamily: brand.fontHeading, color: brand.primaryColor, fontVariantNumeric: 'tabular-nums' }}
            >
              {trimmedQuery
                ? `${filtered.length} of ${patients.length} patients`
                : `${patients.length} patients`}
            </h2>
            <p className="text-xs" style={{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? 'Loading the directory…' : 'Synced 14:32 · sorted by last name'}
            </p>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: hairline }} aria-hidden="true" />

          <div className="overflow-x-auto">
            <Table className="w-full border-collapse text-left">
              <THead>
                <TR>
                  <TH data-wf="i-2-0-0" scope="col" style={headerCellStyle}>First name</TH>
                  <TH data-wf="i-2-0-1" scope="col" style={headerCellStyle}>Last name</TH>
                  <TH data-wf="i-2-0-2" scope="col" style={headerCellStyle}>Phone</TH>
                  <TH data-wf="i-2-0-3" scope="col" style={headerCellStyle}>Email</TH>
                  <TH data-wf="i-2-0-4" scope="col" style={headerCellStyle}>Added</TH>
                </TR>
              </THead>
              <TBody>
                {loading
                  ? [0, 1, 2, 3, 4, 5].map((i) => (
                      <TR key={'skeleton-' + i}>
                        {[0, 1, 2, 3, 4].map((c) => (
                          <TD key={c} style={cellStyle}>
                            <span
                              className="vt-skel block h-3"
                              style={{
                                backgroundColor: brand.neutralColor,
                                borderRadius: '2px',
                                width: c === 3 ? '78%' : c === 0 ? '46%' : '60%'
                              }}
                            />
                          </TD>
                        ))}
                      </TR>
                    ))
                  : groups.map((group) => (
                      <React.Fragment key={group.letter}>
                        <TR>
                          <TH
                            scope="colgroup"
                            colSpan={5}
                            style={{
                              padding: '10px 20px',
                              borderBottom: `1px solid ${hairlineSoft}`,
                              backgroundColor: surfaceRaised,
                              textAlign: 'left',
                              fontFamily: brand.fontHeading,
                              fontSize: '13px',
                              fontWeight: 400,
                              letterSpacing: '0.2em',
                              color: brand.accentColor
                            }}
                          >
                            {group.letter}
                          </TH>
                        </TR>
                        {group.rows.map((p) => {
                          const isNew = added && added.id === p.id;
                          return (
                            <TR
                              key={p.id}
                              className={'vt-row cursor-pointer' + (isNew ? ' vt-in' : '')}
                              onClick={() => navigate('patient-detail')}
                              style={isNew ? { backgroundColor: accentSoft } : undefined}
                            >
                              <TD style={cellStyle}>
                                <span className="flex items-center gap-3">
                                  <span
                                    aria-hidden="true"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center text-xs"
                                    style={{
                                      border: `1px solid ${hairline}`,
                                      color: brand.accentColor,
                                      fontFamily: brand.fontHeading,
                                      letterSpacing: '0.04em',
                                      borderRadius: '2px'
                                    }}
                                  >
                                    {p.first_name.charAt(0) + p.last_name.charAt(0)}
                                  </span>
                                  <span className="flex flex-col">
                                    <button
                                      type="button"
                                      className="vt-focus text-left"
                                      aria-label={`Open record for ${p.first_name} ${p.last_name}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('patient-detail');
                                      }}
                                      style={{ color: brand.primaryColor, background: 'transparent' }}
                                    >
                                      {p.first_name}
                                    </button>
                                    <span
                                      className="text-[11px]"
                                      style={{ color: brand.accentColor, fontVariantNumeric: 'tabular-nums' }}
                                    >
                                      {p.id}
                                    </span>
                                  </span>
                                </span>
                              </TD>
                              <TD style={cellStyle}>{p.last_name}</TD>
                              <TD style={cellStyle}>
                                {p.phone ? (
                                  p.phone
                                ) : (
                                  <span style={{ color: brand.neutralColor }}>
                                    <span aria-hidden="true">—</span>
                                    <span className="sr-only">No phone on file</span>
                                  </span>
                                )}
                              </TD>
                              <TD style={Object.assign({}, cellStyle, { color: brand.neutralColor })}>
                                {p.email ? (
                                  p.email
                                ) : (
                                  <span>
                                    <span aria-hidden="true">—</span>
                                    <span className="sr-only">No email on file</span>
                                  </span>
                                )}
                              </TD>
                              <TD style={Object.assign({}, cellStyle, { whiteSpace: 'nowrap' })}>
                                <span className="flex items-center justify-between gap-4">
                                  {formatAdded(p.created_at)}
                                  <ChevronRight
                                    className="h-4 w-4"
                                    style={{ color: brand.neutralColor }}
                                    aria-hidden="true"
                                  />
                                </span>
                              </TD>
                            </TR>
                          );
                        })}
                      </React.Fragment>
                    ))}
              </TBody>
            </Table>
          </div>
        </section>

        {/* Row 4 — no results */}
        {!loading && filtered.length === 0 ? (
          <section
            className="vt-in mt-6 px-6 py-12"
            data-wf="b-3-0"
            style={{ backgroundColor: surface, border: `1px solid ${hairline}`, borderRadius: brand.radius }}
          >
            {patients.length === 0 ? (
              <Empty
                title="No patients on file yet"
                description="The directory is empty. Add the first patient and their contact details will be ready for booking."
                action={
                  <Button
                    onClick={openModal}
                    className="vt-focus vt-btn inline-flex h-11 items-center gap-2 px-5 text-sm"
                    style={{
                      backgroundColor: brand.accentColor,
                      color: brand.backgroundColor,
                      borderRadius: brand.radius
                    }}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add patient
                  </Button>
                }
              />
            ) : (
              <Empty
                title={`No patients match “${trimmedQuery}”`}
                description="Try another name, phone or email — partial spellings work, and phone numbers match with or without spaces."
                action={
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                      onClick={openModal}
                      className="vt-focus vt-btn inline-flex h-11 items-center gap-2 px-5 text-sm"
                      style={{
                        backgroundColor: brand.accentColor,
                        color: brand.backgroundColor,
                        borderRadius: brand.radius
                      }}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add patient
                    </Button>
                    <Button
                      onClick={() => setQuery('')}
                      className="vt-focus vt-btn h-11 px-5 text-sm"
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${hairline}`,
                        color: brand.primaryColor,
                        borderRadius: brand.radius
                      }}
                    >
                      Show all patients
                    </Button>
                  </div>
                }
              />
            )}
          </section>
        ) : null}
      </div>

      {/* Row 5 — new patient dialog */}
      {modalOpen ? (
        <div
          className="vt-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
          style={{ backgroundColor: `color-mix(in srgb, ${brand.backgroundColor} 78%, transparent)` }}
        >
          <div
            ref={dialogRef}
            data-wf="b-4-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-patient-title"
            aria-describedby="new-patient-help"
            onKeyDown={handleDialogKeyDown}
            className="vt-panel w-full max-w-xl"
            style={{
              backgroundColor: surface,
              border: `1px solid ${hairline}`,
              borderRadius: brand.radius,
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)'
            }}
          >
            <div className="flex items-start justify-between gap-4 px-7 pt-7">
              <div>
                <p style={labelStyle}>Patient record</p>
                <h2
                  id="new-patient-title"
                  className="mt-2 text-2xl"
                  style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
                >
                  New patient
                </h2>
              </div>
              <Button
                aria-label="Close new patient form"
                onClick={discard}
                className="vt-focus vt-btn flex h-9 w-9 items-center justify-center"
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${hairline}`,
                  color: brand.neutralColor,
                  borderRadius: brand.radius
                }}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <p id="new-patient-help" className="px-7 pt-3 text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
              Contact details only — no clinical information is stored on a patient record.
            </p>

            <div className="mt-6 h-px w-full" style={{ backgroundColor: hairline }} aria-hidden="true" />

            <form onSubmit={handleSave} noValidate>
              <div className="grid grid-cols-1 gap-5 px-7 py-7 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first_name" className="block" style={labelStyle}>
                    First name <span style={{ color: brand.accentColor }}>(required)</span>
                  </Label>
                  <Input
                    data-wf="i-4-0-0"
                    id="first_name"
                    ref={firstFieldRef}
                    value={form.first_name}
                    required
                    aria-invalid={invalidField('first_name')}
                    aria-describedby={formError ? 'new-patient-error' : undefined}
                    onChange={(e) => setField('first_name', e.target.value)}
                    className="vt-focus mt-3"
                    style={fieldStyle(invalidField('first_name'))}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="block" style={labelStyle}>
                    Last name <span style={{ color: brand.accentColor }}>(required)</span>
                  </Label>
                  <Input
                    data-wf="i-4-0-1"
                    id="last_name"
                    value={form.last_name}
                    required
                    aria-invalid={invalidField('last_name')}
                    aria-describedby={formError ? 'new-patient-error' : undefined}
                    onChange={(e) => setField('last_name', e.target.value)}
                    className="vt-focus mt-3"
                    style={fieldStyle(invalidField('last_name'))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block" style={labelStyle}>
                    Phone
                  </Label>
                  <Input
                    data-wf="i-4-0-2"
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    placeholder="07700 900 318"
                    onChange={(e) => setField('phone', e.target.value)}
                    className="vt-focus mt-3"
                    style={Object.assign({}, fieldStyle(false), { fontVariantNumeric: 'tabular-nums' })}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block" style={labelStyle}>
                    Email
                  </Label>
                  <Input
                    data-wf="i-4-0-3"
                    id="email"
                    type="email"
                    value={form.email}
                    placeholder="ellie.dawson@example.com"
                    aria-invalid={invalidField('email')}
                    aria-describedby={formError ? 'new-patient-error' : undefined}
                    onChange={(e) => setField('email', e.target.value)}
                    className="vt-focus mt-3"
                    style={fieldStyle(invalidField('email'))}
                  />
                </div>

                {/* Row 6 — validation message */}
                {formError ? (
                  <p
                    data-wf="b-5-0"
                    id="new-patient-error"
                    role="alert"
                    className="vt-in sm:col-span-2 flex items-start gap-3 px-4 py-3 text-sm leading-relaxed"
                    style={{
                      backgroundColor: dangerSurface,
                      border: `1px solid ${danger}`,
                      borderRadius: brand.radius,
                      color: brand.primaryColor
                    }}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: danger }} aria-hidden="true" />
                    <span>
                      {formError.message} Nothing you typed has been lost.
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="h-px w-full" style={{ backgroundColor: hairline }} aria-hidden="true" />

              {/* Row 7 — actions */}
              <div className="grid grid-cols-1 gap-3 px-7 py-6 sm:grid-cols-2">
                <Button
                  data-wf="b-6-0"
                  type="submit"
                  disabled={saving}
                  className="vt-focus vt-btn inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium"
                  style={{
                    backgroundColor: brand.accentColor,
                    color: brand.backgroundColor,
                    borderRadius: brand.radius,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'progress' : 'pointer'
                  }}
                >
                  {saving ? (
                    <React.Fragment>
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      Saving patient…
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Save patient
                    </React.Fragment>
                  )}
                </Button>
                <Button
                  data-wf="b-6-1"
                  type="button"
                  onClick={discard}
                  className="vt-focus vt-btn inline-flex h-11 items-center justify-center px-5 text-sm"
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${hairline}`,
                    color: brand.primaryColor,
                    borderRadius: brand.radius
                  }}
                >
                  Discard
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
