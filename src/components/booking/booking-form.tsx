"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

type BookingFormProps = {
  prefill?: {
    industry?: string;
    revenue?: string;
    leads?: string;
    score?: string;
    goals?: string;
  };
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  goals: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  industry: "",
  goals: "",
};

export function BookingForm({ prefill }: BookingFormProps) {
  const router = useRouter();
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    industry: prefill?.industry || "",
    goals:
      prefill?.goals ||
      [
        prefill?.revenue ? `Current monthly revenue: £${prefill.revenue}` : "",
        prefill?.leads ? `Monthly leads: ${prefill.leads}` : "",
        prefill?.score ? `Simulator score: ${prefill.score}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
  }));
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDates() {
      const response = await fetch("/api/book");
      const data = (await response.json()) as { dates?: string[] };
      const nextDates = data.dates || [];
      setDates(nextDates);
      if (nextDates[0]) {
        setSelectedDate(nextDates[0]);
      }
    }

    void loadDates();
  }, []);

  useEffect(() => {
    async function loadTimes(date: string) {
      setLoadingTimes(true);
      setSelectedTime("");
      const response = await fetch(`/api/book?date=${date}`);
      const data = (await response.json()) as { times?: string[] };
      setTimes(data.times || []);
      setLoadingTimes(false);
    }

    if (selectedDate) {
      void loadTimes(selectedDate);
    }
  }, [selectedDate]);

  const dateLabel = useMemo(
    () =>
      selectedDate
        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
    [selectedDate],
  );

  const updateField = (key: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!selectedDate || !selectedTime) {
      setError("Please choose an available slot.");
      return;
    }

    setSubmitting(true);

    const payload = {
      date: selectedDate,
      time: selectedTime,
      ...form,
    };

    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      success?: boolean;
      error?: string;
      booking?: {
        id: string;
        date: string;
        time: string;
      name: string;
      email: string;
      industry?: string;
      goals?: string;
    };
    };

    if (!response.ok || !data.success || !data.booking) {
      setError(data.error || "Could not reserve this slot.");
      setSubmitting(false);
      return;
    }

    trackEvent("book_call_click", {
      source: "booking_form",
      date: data.booking.date,
      time: data.booking.time,
    });

    const query = new URLSearchParams({
      id: data.booking.id,
      date: data.booking.date,
      time: data.booking.time,
      name: data.booking.name,
      email: data.booking.email,
      industry: form.industry || prefill?.industry || "",
      score: prefill?.score || "",
      goals: form.goals,
    });

    router.push(`/book/confirmation?${query.toString()}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Select date</label>
        <select
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="h-10 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-100"
        >
          {dates.map((date) => (
            <option key={date} value={date}>
              {new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
              })}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Select time (30 min)</label>
        <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/55 p-2">
          {loadingTimes ? <p className="col-span-3 text-xs text-slate-400">Loading slots...</p> : null}
          {!loadingTimes && times.length === 0 ? <p className="col-span-3 text-xs text-slate-400">No slots available for this date.</p> : null}
          {!loadingTimes
            ? times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    selectedTime === time
                      ? "border-cyan-400 bg-cyan-500/15 text-cyan-100"
                      : "border-slate-700 bg-slate-900/50 text-slate-200"
                  }`}
                >
                  {time}
                </button>
              ))
            : null}
        </div>
        {selectedDate && selectedTime ? <p className="text-xs text-cyan-200">Selected: {dateLabel} at {selectedTime}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Full name</label>
          <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Email</label>
          <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Phone</label>
          <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Company</label>
          <Input value={form.company} onChange={(event) => updateField("company", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Website (optional)</label>
        <Input value={form.website} onChange={(event) => updateField("website", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" placeholder="https://example.co.uk" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Industry</label>
        <Input value={form.industry} onChange={(event) => updateField("industry", event.target.value)} className="border-slate-700 bg-slate-950/50 text-slate-100" placeholder="e.g. Plumber, Dentist, Gym" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-[0.08em] text-slate-300 uppercase">Primary goals</label>
        <textarea
          value={form.goals}
          onChange={(event) => updateField("goals", event.target.value)}
          className="min-h-24 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-100"
          placeholder="Tell us your biggest blocker and what outcome you want in the next 30 days."
        />
      </div>

      {error ? <p className="text-xs text-red-300">{error}</p> : null}

      <Button type="submit" className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200" disabled={submitting}>
        {submitting ? "Booking..." : "Confirm booking"}
      </Button>
      <p className="text-xs text-slate-400">Availability: Mon-Sun, 09:00 to 19:00, 30-minute slots.</p>
    </form>
  );
}
