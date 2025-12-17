"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type HeroCarouselProps = {
  images: { src: string; alt: string }[];
  interval?: number;
};

export function HeroCarousel({ images, interval = 5000 }: HeroCarouselProps) {
  const slides = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!slides.length || isPaused) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [slides.length, isPaused, interval]);

  const goTo = (nextIndex: number) => {
    if (!slides.length) return;
    setIndex((nextIndex + slides.length) % slides.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) goTo(index - 1);
      else goTo(index + 1);
    }
    setTouchStartX(null);
  };

  if (!slides.length) return null;

  return (
    <div
      className="relative h-[420px] overflow-hidden rounded-[40px] bg-nude-100 shadow-card ring-1 ring-ink/5 sm:h-[520px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={slideIndex !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slideIndex === 0}
            className="object-cover"
            sizes="(min-width: 1024px) 600px, 100vw"
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <button
          type="button"
          aria-label="Slide precedente"
          className="pointer-events-auto rounded-full border border-white/50 bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          onClick={() => goTo(index - 1)}
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Vai alla slide ${dotIndex + 1}`}
              className={`pointer-events-auto h-2 w-2 rounded-full transition ${
                dotIndex === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Slide successiva"
          className="pointer-events-auto rounded-full border border-white/50 bg-white/20 p-2 text-white backdrop-blur hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          onClick={() => goTo(index + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
