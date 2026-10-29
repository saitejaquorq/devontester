// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch, ApiError } from "@/lib/api";

const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Empty } =
  UI;

// Set by Patients.tsx right before it navigates here, since the app shell has no
// per-record route param for this screen to read an id from.
export const SELECTED_PATIENT_KEY = "devontester.selected_patient_id";

function readSelectedPatientId() {
  try {
    return window.sessionStorage.getItem(SELECTED_PATIENT_KEY);
  } catch {
    return null;
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Turns a thrown ApiError 422 into a field-aware message, matching the pattern
// used on the Patients list form so there is one way to render API field errors.
function describeSaveError(err) {
  if (
    err instanceof ApiError &&
    err.status === 422 &&
    err.body &&
    Array.isArray(err.body.detail)
  ) {
    const fields = [];
    const sentences = [];
    err.body.detail.forEach((d) => {
      const loc = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : null;
      if (loc && fields.indexOf(loc) === -1) fields.push(loc);
      const label = loc === "email" ? "Email" : loc === "phone" ? "Phone" : "This field";
      sentences.push(`${label} ${d.msg || "is invalid"}.`);
    });
    if (sentences.length) return { fields, message: sentences.join(" ") };
  }
  return null;
}

export default function Screen() {
  const navigate = useNavigate();
  const [patientId] = React.useState(readSelectedPatientId);
  const [patient, setPatient] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  const [form, setForm] = React.useState({ phone: "", email: "" });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);
  const [fieldError, setFieldError] = React.useState(null);
  const [saved, setSaved] = React.useState(false);

  const emailRef = React.useRef(null);

  const loadPatient = React.useCallback(() => {
    if (!patientId) {
      setLoading(false);
      setLoadError(new Error("No patient selected"));
      return undefined;
    }
    setLoading(true);
    setLoadError(null);
    return apiFetch(`/patients/${patientId}`)
      .then((data) => {
        setPatient(data);
        setForm({ phone: data.phone || "", email: data.email || "" });
      })
      .catch((err) => setLoadError(err))
      .finally(() => setLoading(false));
  }, [patientId]);

  React.useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setFieldError(null);
    setSaveError(null);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (saving || !patient) return;
    setSaving(true);
    setSaveError(null);
    setFieldError(null);
    setSaved(false);
    try {
      const updated = await apiFetch(`/patients/${patient.id}`, {
        method: "PATCH",
        body: JSON.stringify({ phone: form.phone, email: form.email }),
      });
      // Reflect the saved record straight from the response — no refetch needed.
      setPatient(updated);
      setForm({ phone: updated.phone || "", email: updated.email || "" });
      setSaved(true);
    } catch (err) {
      const described = describeSaveError(err);
      if (described) {
        setFieldError(described);
        if (described.fields.indexOf("email") !== -1 && emailRef.current) {
          emailRef.current.focus();
        }
      } else {
        setSaveError(
          "Couldn't save these changes. Check your connection and try again — nothing you typed has been lost.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <p role="status" className="text-sm text-slate-500">
          Loading patient record…
        </p>
      </div>
    );
  }

  if (loadError || !patient) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <Empty
          title="Couldn't load this patient"
          description="There was a problem reaching the patient record. Check your connection and try again."
          action={<Button onClick={loadPatient}>Try again</Button>}
        />
      </div>
    );
  }

  const fullName = `${patient.first_name} ${patient.last_name}`.trim();
  const invalid = (key) => Boolean(fieldError && fieldError.fields.indexOf(key) !== -1);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        Patient record <span className="ml-2">{patient.id}</span>
      </p>
      <h1 className="mt-2 text-3xl" style={{ fontFamily: brand.fontHeading }}>
        {fullName}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Record created {formatDate(patient.created_at)} · last updated{" "}
        {formatDate(patient.updated_at)}
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
          <CardDescription>
            How the desk reaches this patient. Changes save straight to the record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} noValidate className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="block">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                aria-invalid={invalid("phone") ? "true" : undefined}
                aria-describedby={fieldError ? "contact-error" : undefined}
                className="mt-2 w-full"
              />
            </div>
            <div>
              <Label htmlFor="email" className="block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                ref={emailRef}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={invalid("email") ? "true" : undefined}
                aria-describedby={fieldError ? "contact-error" : undefined}
                className="mt-2 w-full"
              />
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving changes…" : "Save changes"}
              </Button>
            </div>

            <div className="sm:col-span-2 text-sm">
              {fieldError ? (
                <p
                  id="contact-error"
                  role="alert"
                  className="flex items-center gap-2 text-red-600"
                >
                  <Icons.AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {fieldError.message} Nothing was saved — your edits are still here.
                </p>
              ) : saveError ? (
                <p role="alert" className="flex items-center gap-2 text-red-600">
                  <Icons.AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {saveError}
                </p>
              ) : saved ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-2 text-emerald-600"
                >
                  <Icons.CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Contact details saved.
                </p>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Button type="button" variant="secondary" className="mt-6" onClick={() => navigate("patients")}>
        Back to patients
      </Button>
    </div>
  );
}
