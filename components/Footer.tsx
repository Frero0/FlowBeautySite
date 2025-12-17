"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { InstagramFeedEmbed } from "@/components/InstagramFeedEmbed";

const treatmentLinks = [
  { label: "Viso", href: "#viso" },
  { label: "Mani", href: "#mani" },
  { label: "Piedi", href: "#piedi" },
  { label: "Ciglia & sopracciglia", href: "#ciglia" },
  { label: "Epilazione", href: "#epilazione" },
  { label: "Trucco permanente", href: "#trucco-permanente" }
];

export function Footer() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleInput = () => {
    if (submitted) setSubmitted(false);
  };

  return (
    <footer className="border-t border-ink/10 bg-white/80 text-ink">
      <div className="container py-12 text-sm text-ink/80">
        <div className="mt-3 grid gap-8 lg:grid-cols-[1.05fr_1fr_1.2fr] lg:items-stretch">
          <div className="flex h-full flex-col rounded-[28px] bg-white/90 px-5 py-4 shadow-card ring-1 ring-ink/5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="rounded-2xl bg-nude-100 p-2.5 ring-1 ring-ink/5">
                <Image
                  src="/logo-flow.png"
                  alt="Flow Beauty Estetica logo"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div>
                <p className="font-display text-lg text-ink">Flow Beauty Estetica</p>
                <p className="text-xs uppercase tracking-[0.12em] text-ink/60">Estetica &amp; benessere</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink/60">
              Lusso quotidiano e rituali personalizzati, nel cuore di Pinerolo. Prenditi un momento per te.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="https://www.instagram.com/flowbeautyestetica/"
                target="_blank"
                rel="noreferrer"
                aria-label="Flow Beauty Estetica su Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
              >
                <span aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M15.5 12A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 15.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <circle cx="16.5" cy="7.5" r="0.9" fill="currentColor" />
                  </svg>
                </span>
              </a>
              <a
                href="https://www.facebook.com/flowbeautyestetica/"
                target="_blank"
                rel="noreferrer"
                aria-label="Flow Beauty Estetica su Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
              >
                <span aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14.5 8.5h2.5V6c0-1.1.42-2 2.3-2H21v3h-1.3c-.8 0-.7.34-.7.9v1.6H21v3h-2v7.5h-4V14H13V11h2V9.6c0-1.26.53-1.1 1.5-1.1Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs font-medium text-ink/60">
              {treatmentLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1 text-ink/70 underline-offset-4 hover:text-ink hover:underline"
                  >
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex h-full flex-col rounded-[28px] bg-white/90 px-5 py-4 shadow-card ring-1 ring-ink/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Newsletter</p>
            <h3 className="mt-2 font-display text-xl text-ink">Novità, rituali e inviti privati</h3>
            <p className="mt-2 text-xs text-ink/60">
              Ricevi aggiornamenti selezionati, aperture extra e consigli firmati Flow Beauty.
            </p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="newsletter-name" className="text-xs font-medium text-ink">
                    Nome
                  </label>
                  <input
                    id="newsletter-name"
                    name="firstName"
                    type="text"
                    required
                    onChange={handleInput}
                    className="w-full rounded-2xl border border-ink/15 bg-white/80 px-4 py-2.5 text-sm shadow-soft focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/25"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="newsletter-surname" className="text-xs font-medium text-ink">
                    Cognome
                  </label>
                  <input
                    id="newsletter-surname"
                    name="lastName"
                    type="text"
                    required
                    onChange={handleInput}
                    className="w-full rounded-2xl border border-ink/15 bg-white/80 px-4 py-2.5 text-sm shadow-soft focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/25"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="newsletter-email" className="text-xs font-medium text-ink">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  onChange={handleInput}
                  className="w-full rounded-2xl border border-ink/15 bg-white/80 px-4 py-2.5 text-sm shadow-soft focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/25"
                />
              </div>
              <label className="flex items-start gap-3 text-xs text-ink/60">
                <input
                  type="checkbox"
                  required
                  onChange={handleInput}
                  className="mt-0.5 h-4 w-4 rounded border-ink/30 text-ink focus:ring-ink/30"
                />
                <span>
                  Acconsento al trattamento dei dati personali e ho letto la{" "}
                  <a href="#" className="underline decoration-dotted underline-offset-4 hover:text-ink">
                    privacy policy
                  </a>
                  .
                </span>
              </label>
              <div className="mt-auto space-y-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40"
                >
                  Iscriviti
                </button>
                <p className="text-xs text-emerald-600" role="status" aria-live="polite">
                  {submitted ? "Grazie! Ti contatteremo presto." : ""}
                </p>
              </div>
            </form>
          </div>

          <div className="flex h-full flex-col rounded-[28px] bg-white/90 px-5 py-4 shadow-card ring-1 ring-ink/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Instagram</p>
                <p className="font-display text-xl text-ink">Momenti dal centro</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink/50">
                @flowbeautyestetica
              </span>
            </div>
            <div className="mt-3 flex-1">
              <InstagramFeedEmbed />
            </div>
            <a
              href="https://www.instagram.com/flowbeautyestetica/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
            >
              Segui su Instagram
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-ink/10 pt-5 text-xs text-ink/60 md:flex md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Flow Beauty Estetica. Tutti i diritti riservati.</p>
          <div className="mt-2 flex gap-4 md:mt-0">
            <a href="#" className="hover:text-ink">
              Privacy
            </a>
            <a href="#" className="hover:text-ink">
              Cookie
            </a>
            <a href="#prenota" className="hover:text-ink">
              Prenota ora
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
