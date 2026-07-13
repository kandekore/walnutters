"use client";

import { useState } from "react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length ? images : ["/assets/brand/Walnutterz logo.jpg"];
  const [active, setActive] = useState(gallery[0]);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-trim bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active} alt={alt} className="aspect-square w-full object-cover" />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((img) => (
            <button
              key={img}
              onClick={() => setActive(img)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                active === img ? "border-primary" : "border-trim"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
