"use client";

import { useEffect, useMemo, useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/site";

export type GalleryEntry = {
  id: string;
  customerName: string;
  imagePath: string;
  category: string;
  caption: string | null;
};

export default function GalleryView({ items }: { items: GalleryEntry[] }) {
  const [filter, setFilter] = useState("All");
  const [slide, setSlide] = useState(0);

  // Randomise slideshow order once on mount (per the brief).
  const shuffled = useMemo(() => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(((i + 1) * 9301 + 49297) % 233280 / 233280 * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [items]);

  useEffect(() => {
    if (shuffled.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % shuffled.length), 15000);
    return () => clearInterval(t);
  }, [shuffled.length]);

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
  const current = shuffled[slide];

  if (items.length === 0) {
    return (
      <div className="card p-10 text-center text-ink/70">
        No gallery photos yet — be the first to share yours below!
      </div>
    );
  }

  return (
    <div>
      {/* Slideshow */}
      {current && (
        <div className="relative overflow-hidden rounded-2xl border border-trim shadow-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.imagePath} alt={current.caption ?? current.customerName} className="max-h-[520px] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
            <span className="chip !bg-white/20 !text-white !border-white/30">{current.category}</span>
            <p className="mt-2 text-lg font-bold">{current.customerName}</p>
            {current.caption && <p className="text-sm text-white/85">{current.caption}</p>}
          </div>
          {shuffled.length > 1 && (
            <div className="absolute right-4 top-4 flex gap-1">
              {shuffled.map((_, i) => (
                <span key={i} className={`h-2 w-2 rounded-full ${i === slide ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {["All", ...GALLERY_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`chip ${filter === c ? "!bg-primary !text-white !border-primary" : ""}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {filtered.map((item) => (
          <figure key={item.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imagePath} alt={item.caption ?? item.customerName} className="aspect-square w-full object-cover" />
            <figcaption className="p-3">
              <p className="text-sm font-semibold text-heading">{item.customerName}</p>
              <p className="text-xs text-primary">{item.category}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
