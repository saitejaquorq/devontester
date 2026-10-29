/// <reference types="vite/client" />
import * as React from "react";
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { apiFetch, ApiError } from "@/lib/api";
import { Button, Select, Empty, Card, CardHeader, CardTitle, CardContent } from "@/lib/ui";

type Provider = {
  id: string;
  name: string;
  specialty?: string;
  is_active?: boolean;
};

type Appointment = {
  id: string;
  provider_id: string;
  patient_id?: string;
  patient_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  reason_note?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
};

type ViewName = "day" | "week";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function toDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

function toEvent(appointment: Appointment): CalendarEvent {
  const label = appointment.patient_name || appointment.patient_id || "Appointment";
  const status = appointment.status ? ` (${appointment.status})` : "";
  return {
    id: appointment.id,
    title: `${label}${status}`,
    start: toDateTime(appointment.date, appointment.start_time),
    end: toDateTime(appointment.date, appointment.end_time),
    resource: appointment,
  };
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return `${fallback} (${err.status})`;
  return fallback;
}

export default function Screen() {
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [providersLoading, setProvidersLoading] = React.useState(true);
  const [providersError, setProvidersError] = React.useState<unknown>(null);
  const [providerId, setProviderId] = React.useState<string>("");

  const [view, setView] = React.useState<ViewName>("week");
  const [date, setDate] = React.useState<Date>(new Date());

  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [apptsLoading, setApptsLoading] = React.useState(false);
  const [apptsError, setApptsError] = React.useState<unknown>(null);

  const loadProviders = React.useCallback(() => {
    setProvidersLoading(true);
    setProvidersError(null);
    return apiFetch<Provider[]>("/providers")
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProviders(list);
        setProviderId((current) => current || list[0]?.id || "");
      })
      .catch((err) => setProvidersError(err))
      .finally(() => setProvidersLoading(false));
  }, []);

  React.useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const loadCalendar = React.useCallback(() => {
    if (!providerId) return undefined;
    setApptsLoading(true);
    setApptsError(null);
    const params = new URLSearchParams({
      provider_id: providerId,
      view,
      date: format(date, "yyyy-MM-dd"),
    });
    return apiFetch<Appointment[]>(`/calendar?${params.toString()}`)
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch((err) => setApptsError(err))
      .finally(() => setApptsLoading(false));
  }, [providerId, view, date]);

  React.useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  const events = React.useMemo(() => appointments.map(toEvent), [appointments]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <p role="status" className="text-sm text-slate-500">
              Loading providers…
            </p>
          ) : providersError ? (
            <Empty
              title="Couldn't load providers"
              description={errorMessage(providersError, "There was a problem reaching the provider list.")}
              action={<Button onClick={loadProviders}>Try again</Button>}
            />
          ) : providers.length === 0 ? (
            <Empty title="No providers found" description="Add a provider before booking appointments." />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm" htmlFor="calendar-provider">
                  <span className="font-medium text-slate-700">Provider</span>
                  <Select
                    id="calendar-provider"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    options={providers.map((p) => ({ value: p.id, label: p.name }))}
                  />
                </label>
                <div className="flex gap-1" role="group" aria-label="Calendar view">
                  <Button
                    type="button"
                    variant={view === "day" ? "primary" : "secondary"}
                    size="sm"
                    aria-pressed={view === "day"}
                    onClick={() => setView("day")}
                  >
                    Day
                  </Button>
                  <Button
                    type="button"
                    variant={view === "week" ? "primary" : "secondary"}
                    size="sm"
                    aria-pressed={view === "week"}
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                </div>
              </div>

              {apptsLoading ? (
                <p role="status" className="text-sm text-slate-500">
                  Loading appointments…
                </p>
              ) : apptsError ? (
                <Empty
                  title="Couldn't load the calendar"
                  description={errorMessage(
                    apptsError,
                    "There was a problem reaching the calendar.",
                  )}
                  action={<Button onClick={loadCalendar}>Try again</Button>}
                />
              ) : events.length === 0 ? (
                <Empty
                  title="No appointments"
                  description="There are no appointments for this provider in the selected period."
                />
              ) : (
                <div style={{ height: 600 }}>
                  <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    toolbar={false}
                    views={[Views.DAY, Views.WEEK]}
                    view={view === "day" ? Views.DAY : Views.WEEK}
                    onView={(nextView) => setView(nextView === Views.DAY ? "day" : "week")}
                    date={date}
                    onNavigate={(nextDate) => setDate(nextDate)}
                    style={{ height: "100%" }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
