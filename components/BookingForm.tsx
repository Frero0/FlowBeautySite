"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek
} from "date-fns";
import { it } from "date-fns/locale";
import { fromZonedTime } from "date-fns-tz";

type FormState = {
  serviceId: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  name: string;
  phone: string;
  email: string;
  notes: string;
};

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; id: string }
  | { type: "error"; message: string };
type BookingFormProps = {
  services: { id: string; name: string; priceLabel: string }[];
  defaultStaffId: string;
  staffName?: string;
};

const TZ = "Europe/Rome";
const CALENDAR_LIMIT_DAYS = 60;
const today = startOfToday();
const maxSelectable = addDays(today, CALENDAR_LIMIT_DAYS);

export function BookingForm({ services, defaultStaffId, staffName }: BookingFormProps) {
  const serviceOptions = useMemo(() => services, [services]);

  const [form, setForm] = useState<FormState>(() => ({
    serviceId: serviceOptions[0]?.id ?? "",
    date: format(today, "yyyy-MM-dd"),
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: ""
  }));
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [slots, setSlots] = useState<string[]>([]);
  const [timezone, setTimezone] = useState(TZ);
  const [slotsStatus, setSlotsStatus] = useState<"idle" | "loading" | "error">("idle");
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [monthCursor, setMonthCursor] = useState<Date>(startOfMonth(today));
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const dayRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (serviceOptions.length && !serviceOptions.find((s) => s.id === form.serviceId)) {
      setForm((prev) => ({ ...prev, serviceId: serviceOptions[0]?.id ?? "" }));
    }
  }, [serviceOptions, form.serviceId]);

  useEffect(() => {
    if (!form.serviceId || !form.date) return;
    const controller = new AbortController();
    setSlotsStatus("loading");
    setSlotsError(null);
    fetch(
      `/api/availability?serviceId=${encodeURIComponent(form.serviceId)}&staffId=${encodeURIComponent(defaultStaffId)}&date=${form.date}`,
      { signal: controller.signal }
    )
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || "Impossibile recuperare gli orari.");
        }
        const nextSlots: string[] = json.data?.slots ?? [];
        setTimezone(json.data?.timezone || TZ);
        setSlots(nextSlots);
        setForm((prev) => ({
          ...prev,
          time: nextSlots.includes(prev.time) ? prev.time : nextSlots[0] ?? ""
        }));
        setSlotsStatus("idle");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setSlots([]);
        setSlotsStatus("error");
        setSlotsError((error as Error).message);
      });
    return () => controller.abort();
  }, [form.serviceId, form.date, defaultStaffId]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dayRef.current && !dayRef.current.contains(target)) {
        setIsDayOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(target)) {
        setIsTimeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setStatus({ type: "idle" });
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus({ type: "idle" });
    setForm((prev) => ({
      ...prev,
      serviceId: e.target.value,
      time: ""
    }));
  };

  const handleDateSelect = (date: string) => {
    setStatus({ type: "idle" });
    setForm((prev) => ({
      ...prev,
      date,
      time: ""
    }));
    setIsDayOpen(false);
  };

  const handleSlotSelect = (slot: string) => {
    setStatus({ type: "idle" });
    setForm((prev) => ({ ...prev, time: slot }));
    setIsTimeOpen(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "submitting" });
    try {
      if (!form.serviceId) {
        throw new Error("Seleziona un trattamento.");
      }
      if (!defaultStaffId) {
        throw new Error("Nessuno staff disponibile al momento.");
      }
      if (!form.date) {
        throw new Error("Scegli un giorno.");
      }
      if (!form.time) {
        throw new Error("Scegli un orario.");
      }

      const startAt = fromZonedTime(`${form.date}T${form.time}:00`, timezone || TZ).toISOString();

      const payload = {
        serviceId: form.serviceId,
        staffId: defaultStaffId,
        startAt,
        customer: {
          fullName: form.name,
          phone: form.phone,
          email: form.email || undefined
        },
        notes: form.notes || undefined
      };

      console.log("booking payload", payload);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        const issues = Array.isArray(json?.issues)
          ? json.issues.map((i: { message?: string }) => i?.message).filter(Boolean).join("; ")
          : undefined;
        const apiError =
          json?.error ||
          issues ||
          "Errore durante la prenotazione.";
        throw new Error(apiError);
      }
      setStatus({ type: "success", id: json.data?.id ?? "ok" });
      setForm((prev) => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        notes: ""
      }));
    } catch (err) {
      setStatus({
        type: "error",
        message: (err as Error).message
      });
      if ((err as Error).message?.toLowerCase().includes("disponibile")) {
        if (form.date) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      }
    }
  }

  if (!serviceOptions.length) {
    return (
      <div className="rounded-2xl bg-white/80 p-6 shadow-card ring-1 ring-white/50 backdrop-blur">
        <p className="text-sm text-ink/70">Nessun trattamento disponibile al momento.</p>
      </div>
    );
  }

  const goToPrevMonth = () => {
    setMonthCursor((prev) => {
      const candidate = startOfMonth(addDays(prev, -1));
      return isBefore(candidate, startOfMonth(today)) ? startOfMonth(today) : candidate;
    });
  };

  const goToNextMonth = () => {
    setMonthCursor((prev) => {
      const candidate = startOfMonth(addDays(endOfMonth(prev), 1));
      return isAfter(candidate, startOfMonth(maxSelectable)) ? startOfMonth(maxSelectable) : candidate;
    });
  };

  return (
    <div className="rounded-[32px] bg-white/90 p-6 shadow-card ring-1 ring-ink/5 backdrop-blur md:p-8">
      <div className="mb-5 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Booking online</p>
        <h3 className="text-2xl font-display text-ink">Blocca il tuo appuntamento</h3>
        <p className="text-sm text-ink/70">
          Calendario aggiornato in tempo reale. Seleziona trattamento, giorno e orario preferito.
        </p>
        {staffName && (
          <p className="text-xs text-ink/60">Staff assegnato: {staffName}</p>
        )}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="space-y-1 text-sm">
          <span className="text-ink/80">Trattamento</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm shadow-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/30"
              value={form.serviceId}
              onChange={handleServiceChange}
              required
            >
              {serviceOptions.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — {service.priceLabel}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink/50">⌄</span>
          </div>
        </label>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2" ref={dayRef}>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-left text-sm shadow-soft hover:border-accent/50"
              onClick={() => {
                setIsDayOpen((prev) => !prev);
                setIsTimeOpen(false);
              }}
            >
              <span className="text-ink">
                Giorno{" "}
                <span className="text-ink/60">
                  {form.date ? format(parseISO(form.date), "EEEE d MMMM", { locale: it }) : "Seleziona"}
                </span>
              </span>
              <span className={`transition ${isDayOpen ? "rotate-180" : ""}`}>⌄</span>
            </button>
            <div
              className={`overflow-hidden transition-all ${
                isDayOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-2 rounded-3xl border border-ink/10 bg-white/80 p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Seleziona una data</p>
                  <div className="flex items-center gap-2 text-xs text-ink/60">
                    <button
                      type="button"
                      className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 hover:border-accent/50"
                      onClick={goToPrevMonth}
                    >
                      ‹
                    </button>
                    <span className="font-semibold text-ink">
                      {format(monthCursor, "LLLL yyyy", { locale: it })}
                    </span>
                    <button
                      type="button"
                      className="rounded-full border border-ink/15 bg-white/70 px-3 py-1 hover:border-accent/50"
                      onClick={goToNextMonth}
                    >
                      ›
                    </button>
                  </div>
                </div>
                <CalendarGrid
                  month={monthCursor}
                  selectedDate={form.date}
                  onSelect={handleDateSelect}
                  maxDate={maxSelectable}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2" ref={timeRef}>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-left text-sm shadow-soft hover:border-accent/50"
              onClick={() => {
                setIsTimeOpen((prev) => !prev);
                setIsDayOpen(false);
              }}
            >
              <span className="text-ink">
                Orario{" "}
                <span className="text-ink/60">{form.time || "Seleziona"}</span>
              </span>
              <span className={`transition ${isTimeOpen ? "rotate-180" : ""}`}>⌄</span>
            </button>
            <div
              className={`overflow-hidden transition-all ${
                isTimeOpen ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-2 rounded-3xl border border-ink/10 bg-white/80 p-4 shadow-soft">
                <SlotsGrid
                  slots={slots}
                  loading={slotsStatus === "loading"}
                  error={slotsError}
                  selected={form.time}
                  onSelect={handleSlotSelect}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Nome e cognome</span>
            <input
              type="text"
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-2.5 text-sm shadow-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
              value={form.name}
              onChange={handleChange("name")}
              minLength={2}
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Telefono</span>
            <input
              type="tel"
              className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-2.5 text-sm shadow-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
              value={form.phone}
              onChange={handleChange("phone")}
              minLength={5}
              required
            />
          </label>
        </div>
        <label className="space-y-1 text-sm">
          <span className="text-ink/80">Email (facoltativa)</span>
          <input
            type="email"
            className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-2.5 text-sm shadow-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="per conferma"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-ink/80">Note (facoltative)</span>
          <textarea
            className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-2 text-sm shadow-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/25"
            rows={3}
            value={form.notes}
            onChange={handleChange("notes")}
            maxLength={300}
            placeholder="Preferenze, sensibilità, obiettivi..."
          />
        </label>
        {status.type === "error" && (
          <p className="text-sm font-medium text-red-600">{status.message}</p>
        )}
        {status.type === "success" && (
          <p className="text-sm font-medium text-emerald-600">
            Prenotazione ricevuta! Riferimento: {status.id}
          </p>
        )}
        <button
          type="submit"
          disabled={status.type === "submitting" || !form.time}
          className="w-full rounded-full bg-gradient-to-r from-nude-300 via-accent/80 to-nude-200 px-5 py-3 text-sm font-semibold text-ink shadow-soft transition hover:from-nude-200 hover:to-nude-100 disabled:opacity-60"
        >
          {status.type === "submitting" ? "Invio in corso..." : "Conferma prenotazione"}
        </button>
        <p className="text-xs text-ink/60">
          Cancellazione gratuita fino a 24h prima. Conferma via telefono/WhatsApp.
        </p>
      </form>
    </div>
  );
}

function CalendarGrid({
  month,
  selectedDate,
  onSelect,
  maxDate
}: {
  month: Date;
  selectedDate: string;
  onSelect: (date: string) => void;
  maxDate: Date;
}) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const selected = selectedDate ? parseISO(selectedDate) : null;

  const days: Date[] = [];
  for (let cursor = start; !isAfter(cursor, end); cursor = addDays(cursor, 1)) {
    days.push(cursor);
  }

  return (
    <div className="space-y-2 rounded-2xl border border-ink/10 bg-white/80 p-3 shadow-soft">
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50">
        {["L", "M", "M", "G", "V", "S", "D"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const disabled = isBefore(day, today) || isAfter(day, maxDate);
          const isSelected = selected && isSameDay(day, selected);
          const isMuted = !isSameMonth(day, month);
          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => !disabled && onSelect(dayStr)}
              disabled={disabled}
              className={`flex h-10 items-center justify-center rounded-lg border text-sm transition ${
                isSelected
                  ? "border-transparent bg-gradient-to-r from-nude-300 to-accent/60 text-ink font-semibold shadow-soft"
                  : "border-ink/10 bg-white text-ink"
              } ${isMuted ? "opacity-60" : ""} ${
                disabled ? "cursor-not-allowed opacity-40" : "hover:border-accent/40 hover:shadow-soft"
              }`}
            >
              {format(day, "d", { locale: it })}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SlotsGrid({
  slots,
  loading,
  error,
  selected,
  onSelect
}: {
  slots: string[];
  loading: boolean;
  error: string | null;
  selected: string;
  onSelect: (slot: string) => void;
}) {
  const gridContent = () => {
    if (loading) {
      return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-9 animate-pulse rounded-full bg-nude-100/80" />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-600">{error}</p>;
    }

    if (!slots.length) {
      return <p className="text-sm text-ink/60">Nessun orario disponibile per questo giorno.</p>;
    }

    return (
      <div className="grid max-h-60 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const isSelected = slot === selected;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelect(slot)}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                isSelected
                  ? "bg-accent text-white shadow-soft"
                  : "border border-ink/15 bg-white text-ink hover:border-accent/40"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    );
  };

  return <div className="rounded-2xl border border-ink/10 bg-white/70 p-3">{gridContent()}</div>;
}
