"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, isToday } from "date-fns";
import { it } from "date-fns/locale";
import { categories } from "@/data/services";
import { getSlotsForDay } from "@/lib/slots";

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

export function BookingForm() {
  const services = useMemo(
    () => categories.flatMap((c) => c.services),
    []
  );

  const availableDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 21; i++) {
      const day = addDays(new Date(), i);
      if (getSlotsForDay(day).length) {
        days.push(day);
      }
    }
    return days;
  }, []);

  const [form, setForm] = useState<FormState>(() => ({
    serviceId: services[0]?.id ?? "",
    date: availableDays[0] ? format(availableDays[0], "yyyy-MM-dd") : "",
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: ""
  }));
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const slots = useMemo(() => {
    if (!form.date) return [];
    const [year, month, day] = form.date.split("-").map((v) => parseInt(v, 10));
    const dateObj = new Date(year, month - 1, day);
    return getSlotsForDay(dateObj);
  }, [form.date]);

  useEffect(() => {
    if (slots.length && !slots.find((s) => s.value === form.time)) {
      setForm((prev) => ({ ...prev, time: slots[0]?.value ?? "" }));
    }
  }, [slots, form.time]);

  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setStatus({ type: "idle" });
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "submitting" });
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: form.email || undefined,
          notes: form.notes || undefined
        })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Errore durante la prenotazione.");
      }
      setStatus({ type: "success", id: json.booking.id });
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
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 p-6 shadow-card ring-1 ring-white/50 backdrop-blur">
      <div className="mb-4">
        <p className="text-sm font-medium text-ink/70">Prenotazione</p>
        <h3 className="text-2xl font-display text-ink">Blocca il tuo appuntamento</h3>
        <p className="text-sm text-ink/70">
          Scegli trattamento, giorno e orario. Ti confermiamo via email/telefono.
        </p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Trattamento</span>
            <select
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
              value={form.serviceId}
              onChange={handleChange("serviceId")}
              required
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — {service.price}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Giorno</span>
            <select
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
              value={form.date}
              onChange={handleChange("date")}
              required
            >
              {availableDays.map((day) => (
                <option key={day.toISOString()} value={format(day, "yyyy-MM-dd")}>
                  {format(day, "EEEE dd MMMM", { locale: it })} {isToday(day) ? "(oggi)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Orario</span>
            <select
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
              value={form.time}
              onChange={handleChange("time")}
              required
            >
              {slots.length === 0 && <option>Nessun orario disponibile</option>}
              {slots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Nome e cognome</span>
            <input
              type="text"
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
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
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
              value={form.phone}
              onChange={handleChange("phone")}
              minLength={5}
              required
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-ink/80">Email (facoltativa)</span>
            <input
              type="email"
              className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="per conferma"
            />
          </label>
        </div>
        <label className="space-y-1 text-sm">
          <span className="text-ink/80">Note (facoltative)</span>
          <textarea
            className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm focus:border-ink/30 focus:outline-none"
            rows={3}
            value={form.notes}
            onChange={handleChange("notes")}
            maxLength={300}
            placeholder="Preferenze, sensibilità, obiettivi..."
          />
        </label>
        {status.type === "error" && (
          <p className="text-sm text-red-600">{status.message}</p>
        )}
        {status.type === "success" && (
          <p className="text-sm text-green-700">
            Prenotazione ricevuta! Riferimento: {status.id}
          </p>
        )}
        <button
          type="submit"
          disabled={status.type === "submitting"}
          className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
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
