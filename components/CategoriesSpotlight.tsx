"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Category } from "@/data/services";

type Props = {
  categories: Category[];
};

export function CategoriesSpotlight({ categories }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCategory = categories.find((cat) => cat.id === activeId) ?? null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleClose = useCallback(() => {
    setActiveId(null);
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.top = `-${scrollY}px`;
    body.style.position = "fixed";
    body.style.width = "100%";
    requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [activeCategory]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  const overlayVariants = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 0.6, transition: { duration: prefersReducedMotion ? 0 : 0.2 } },
      exit: { opacity: 0, transition: { duration: prefersReducedMotion ? 0 : 0.2 } }
    }),
    [prefersReducedMotion]
  );

  const cardVariants = useMemo(
    () => ({
      initial: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: prefersReducedMotion ? 0 : 0.25, ease: [0.215, 0.61, 0.355, 1] }
      },
      exit: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.98,
        transition: { duration: prefersReducedMotion ? 0 : 0.2 }
      }
    }),
    [prefersReducedMotion]
  );

  return (
    <LayoutGroup>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            id={category.id}
            layoutId={`category-${category.id}`}
            className="group flex h-full flex-col rounded-2xl bg-white/80 p-5 text-left shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 active:scale-[0.99] scroll-mt-24"
            onClick={() => setActiveId(category.id)}
            type="button"
            aria-expanded={activeId === category.id}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-xl text-ink">{category.name}</h3>
                <p className="text-sm text-ink/70">{category.description}</p>
              </div>
              <span className="rounded-full bg-nude-100 px-3 py-1 text-xs text-ink/70">
                {category.services.length} tratt.
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-ink/80">
              {category.services.slice(0, 3).map((svc) => (
                <div key={svc.id} className="flex items-center justify-between">
                  <span>{svc.name}</span>
                  <span className="text-ink/60">{svc.price}</span>
                </div>
              ))}
              {category.services.length > 3 && (
                <p className="text-xs text-ink/60">+ altri {category.services.length - 3}</p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-ink/70"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={overlayVariants}
              onClick={handleClose}
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
              {(() => {
                const dialogTitleId = `spotlight-${activeCategory.id}`;
                return (
                  <motion.div
                    layoutId={`category-${activeCategory.id}`}
                    className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-[32px] bg-white/95 p-6 shadow-card ring-1 ring-ink/5 backdrop-blur"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={cardVariants}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={dialogTitleId}
                  >
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={handleClose}
                      className="absolute right-4 top-4 rounded-full border border-ink/10 bg-white/80 p-2 text-sm text-ink/60 transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30"
                      aria-label="Chiudi"
                    >
                      ×
                    </button>
                    <div className="space-y-2 pr-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                        Categoria
                      </p>
                      <div className="flex items-center gap-3">
                        <h3 id={dialogTitleId} className="font-display text-3xl text-ink">
                          {activeCategory.name}
                        </h3>
                        <span className="rounded-full bg-nude-100 px-3 py-1 text-xs text-ink/70">
                          {activeCategory.services.length} tratt.
                        </span>
                      </div>
                      <p className="text-sm text-ink/70">{activeCategory.description}</p>
                    </div>
                    <div className="mt-5 flex-1 overflow-y-auto rounded-2xl border border-ink/10 bg-white/70 p-4">
                      <ul className="divide-y divide-ink/5">
                        {activeCategory.services.map((svc) => (
                          <li key={svc.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-semibold text-ink">{svc.name}</p>
                                <p className="text-sm text-ink/70">{svc.description}</p>
                              </div>
                              <span className="whitespace-nowrap text-sm font-semibold text-ink/80">
                                {svc.price}
                              </span>
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/40">
                              {svc.duration}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
