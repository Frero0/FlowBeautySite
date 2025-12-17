"use client";

import { useEffect } from "react";

export function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const saved = sessionStorage.getItem("scroll-position");

    if (navEntry?.type === "reload") {
      if (saved) {
        const y = Number(saved);
        window.scrollTo(0, Number.isFinite(y) ? y : 0);
      } else if (window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    const handleScroll = () => {
      sessionStorage.setItem("scroll-position", String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
