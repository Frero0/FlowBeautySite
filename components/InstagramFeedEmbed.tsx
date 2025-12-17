"use client";

import { useState } from "react";

const placeholders = [
  { id: 1, gradient: "from-[#f9d8cc] to-[#fff5ee]" },
  { id: 2, gradient: "from-[#f7cedd] to-[#fdeef6]" },
  { id: 3, gradient: "from-[#fbe1d3] to-[#fff8f1]" },
  { id: 4, gradient: "from-[#f9d4df] to-[#fff2f8]" },
  { id: 5, gradient: "from-[#fbe0d1] to-[#fff8f2]" },
  { id: 6, gradient: "from-[#f9d0da] to-[#fff2f6]" }
];

export function InstagramFeedEmbed() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const showFallback = !isLoaded || hasError;

  return (
    <div className="space-y-2">
      <div className="relative h-[240px] max-h-[250px] overflow-hidden rounded-2xl bg-white/80 ring-1 ring-ink/5">
        {!hasError && (
          <iframe
            title="Feed Instagram Flow Beauty Estetica"
            src="https://www.instagram.com/flowbeautyestetica/embed/"
            loading="lazy"
            className={`h-full w-full border-0 transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
        {showFallback && (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 bg-white/90 p-3">
            {placeholders.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl bg-gradient-to-br ${item.gradient} shadow-soft ring-1 ring-ink/5`}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-[11px] text-ink/60">
        Se il feed non è visibile, segui il profilo per scoprire gli ultimi rituali e novità dal centro.
      </p>
    </div>
  );
}
