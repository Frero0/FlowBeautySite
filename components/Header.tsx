"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { siteInfo } from "@/data/site";

const navigation = [
  { href: "#servizi", label: "Servizi" },
  { href: "#prezzi", label: "Prezzi" },
  { href: "#recensioni", label: "Recensioni" },
  { href: "#chi-siamo", label: "Chi siamo" },
  { href: "#contatti", label: "Contatti" }
];

export function Header() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const wasMenuOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowTopBar(y < 40);
      setIsCompact(y > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      if (wasMenuOpen.current) {
        menuButtonRef.current?.focus();
      }
      wasMenuOpen.current = false;
      return;
    }

    wasMenuOpen.current = true;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"
    );
    const firstFocusable = focusables?.[0];
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-transparent bg-white/80 backdrop-blur transition-all duration-300 ${
        isCompact ? "border-ink/10 shadow-soft" : ""
      }`}
    >
      <div
        className={`border-b border-ink/10 bg-[#f8ece4]/90 transition-all duration-300 ${
          showTopBar ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="container flex flex-wrap items-center justify-between gap-3 py-2 text-xs text-ink/70">
          <div className="flex flex_wrap items-center gap-4">
            <a href={`mailto:${siteInfo.email}`} className="hover:text-ink">
              {siteInfo.email}
            </a>
            <a href={`tel:${siteInfo.phone.replace(/\s+/g, "")}`} className="hover:text-ink">
              {siteInfo.phone}
            </a>
            <a href={`https://wa.me/${siteInfo.whatsapp}`} className="hidden sm:inline-flex hover:text-ink">
              WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-ink/60">Mar–Ven 09:00–19:00 · Sab 09:00–13:00</span>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/flowbeautyestetica/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink/10 p-1.5 text-ink/60 hover:text-ink"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://www.facebook.com/flowbeautyestetica/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink/10 p-1.5 text-ink/60 hover:text-ink"
                aria-label="Facebook"
              >
                FB
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`container flex items-center justify-between transition-all duration-300 ${
          isCompact ? "py-3" : "py-5"
        }`}
      >
        <a href="/" className="flex items-center gap-3">
          <div
            className={`overflow-hidden rounded-full bg-nude-100 ring-1 ring-ink/10 transition-all duration-300 ${
              isCompact ? "h-10 w-10" : "h-12 w-12"
            }`}
          >
            <Image
              src="/logo-flow.jpg"
              alt="Flow Beauty Estetica"
              width={isCompact ? 40 : 48}
              height={isCompact ? 40 : 48}
              className="object-contain"
            />
          </div>
          <div>
            <p className={`font-display text-ink ${isCompact ? "text-lg" : "text-xl"} leading-tight`}>
              Flow Beauty Estetica
            </p>
            <p className="text-xs text-ink/70">Pinerolo</p>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink/80">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink md:hidden"
            aria-label="Apri menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-ink/80" />
              <span className="h-0.5 w-5 rounded-full bg-ink/80" />
              <span className="h-0.5 w-5 rounded-full bg-ink/80" />
            </span>
          </button>
          <a
            href={`https://wa.me/${siteInfo.whatsapp}`}
            className="hidden sm:inline-flex rounded-full border border-ink/15 px-3 py-2 text-xs font-semibold text-ink hover:border-ink/30"
          >
            WhatsApp
          </a>
          <a
            href="#prenota"
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-ink/90"
          >
            Prenota ora
          </a>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`fixed right-4 top-4 z-50 w-[min(88vw,360px)] rounded-[28px] bg-[#f8ece4]/90 p-5 shadow-card ring-1 ring-ink/10 backdrop-blur transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-[120%]"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">Menu</p>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink"
            aria-label="Chiudi menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-3 text-sm text-ink">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-transparent px-3 py-2 text-ink/80 hover:border-ink/15 hover:bg-white/70 hover:text-ink"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
