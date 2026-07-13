"use client";

import Link from "next/link";
import { useState } from "react";

export type TunnelPlayer = {
  id: string;
  decade: string;
  name: string;
  story: string;
  productSlug: string | null;
};

export default function TimeTunnel({
  decades,
  players,
}: {
  decades: string[];
  players: TunnelPlayer[];
}) {
  const [active, setActive] = useState(decades[0] ?? "1990s");
  const [openPlayer, setOpenPlayer] = useState<string | null>(null);

  const decadePlayers = players.filter((p) => p.decade === active);

  return (
    <div>
      {/* Timeline nav */}
      <div className="sticky top-[var(--header-h)] z-10 -mx-5 bg-white/95 px-5 py-3 backdrop-blur">
        <div className="flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
          {decades.map((d) => (
            <button
              key={d}
              onClick={() => { setActive(d); setOpenPlayer(null); }}
              className={`shrink-0 rounded-full px-5 py-2 font-display font-bold transition ${
                active === d ? "bg-primary text-white shadow" : "bg-cream-deep text-secondary hover:bg-trim"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Decade content */}
      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-heading">The {active}</h2>
        <p className="mt-2 text-ink/70">Tap a legend to read their story and order the matching figure.</p>

        {decadePlayers.length === 0 ? (
          <div className="card mt-6 p-8 text-center text-ink/60">More legends from this decade coming soon.</div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {decadePlayers.map((p) => {
              const open = openPlayer === p.id;
              return (
                <div key={p.id} className={`card p-5 transition ${open ? "ring-2 ring-primary" : ""}`}>
                  <button onClick={() => setOpenPlayer(open ? null : p.id)} className="flex w-full items-center justify-between text-left">
                    <span className="text-lg font-bold text-heading">{p.name}</span>
                    <span className="text-primary transition" style={{ transform: open ? "rotate(45deg)" : "none" }}>＋</span>
                  </button>
                  {open && (
                    <div className="mt-3 border-t border-cream-deep pt-3">
                      <p className="text-sm text-ink/75">{p.story}</p>
                      <Link
                        href={p.productSlug ? `/products/${p.productSlug}` : "/shop"}
                        className="btn btn-primary mt-4 text-sm"
                      >
                        Order the figure
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
