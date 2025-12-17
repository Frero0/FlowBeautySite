"use client";

import { useMemo, useState } from "react";
import { GOOGLE_REVIEWS_URL, reviews } from "@/data/googleReviews";

const ITEMS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(reviews.length / ITEMS_PER_PAGE);

export function ReviewsCarousel() {
  const [page, setPage] = useState(0);

  const paginated = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return reviews.slice(start, start + ITEMS_PER_PAGE);
  }, [page]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Recensioni precedenti"
            disabled={page === 0}
            className="rounded-full border border-ink/15 p-3 text-ink/70 transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Recensioni successive"
            disabled={page === TOTAL_PAGES - 1}
            className="rounded-full border border-ink/15 p-3 text-ink/70 transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`Vai alla pagina ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                page === index ? "bg-ink" : "bg-ink/20"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {paginated.map((review) => (
          <a
            key={review.id}
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-full flex-col rounded-2xl bg-white/80 p-5 text-left shadow-soft ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">{review.author}</p>
                <p className="text-xs text-ink/60">{review.timeAgo}</p>
              </div>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <span key={idx} aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-ink/75 line-clamp-4">{review.text}</p>
            <div className="mt-auto pt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
              Google
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
