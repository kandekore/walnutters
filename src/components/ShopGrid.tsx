"use client";

import { useMemo, useState } from "react";
import type { ProductView } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { GIFT_OCCASIONS } from "@/lib/site";

export default function ShopGrid({
  products,
  initialOccasion,
}: {
  products: ProductView[];
  initialOccasion?: string;
}) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products]
  );

  const [category, setCategory] = useState<string>("All");
  const [occasions, setOccasions] = useState<string[]>(
    initialOccasion ? [initialOccasion] : []
  );
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (occasions.length && !occasions.some((o) => p.occasions.includes(o))) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const toggleOccasion = (o: string) =>
    setOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <div className="card p-5">
          <label className="mb-1 block text-sm font-semibold text-heading">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models…"
            className="w-full rounded-lg border border-trim px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <h3 className="mt-5 mb-2 text-sm font-bold uppercase tracking-wide text-secondary">Category</h3>
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`chip ${category === c ? "!bg-primary !text-white !border-primary" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>

          <h3 className="mt-5 mb-2 text-sm font-bold uppercase tracking-wide text-secondary">Occasion</h3>
          <div className="flex flex-wrap gap-2">
            {GIFT_OCCASIONS.map((o) => (
              <button
                key={o}
                onClick={() => toggleOccasion(o)}
                className={`chip ${occasions.includes(o) ? "!bg-secondary !text-white !border-secondary" : ""}`}
              >
                {o}
              </button>
            ))}
          </div>

          {(category !== "All" || occasions.length > 0 || query) && (
            <button
              onClick={() => { setCategory("All"); setOccasions([]); setQuery(""); }}
              className="btn btn-ghost mt-5 w-full text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <p className="mb-4 text-sm text-ink/70">
          Showing <strong>{filtered.length}</strong> of {products.length} models
        </p>
        {filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-ink/70">No models match your filters. Try clearing them, or{" "}
              <a href="/design-your-own" className="font-semibold text-secondary hover:underline">design your own</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
