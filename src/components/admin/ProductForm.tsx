"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GIFT_OCCASIONS, DECADES } from "@/lib/site";

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  regularPrice: string; // pounds
  salePrice: string;
  category: string;
  era: string;
  occasions: string[];
  featured: boolean;
  active: boolean;
  stockStatus: string;
  imagePath: string | null;
};

export default function ProductForm({ initial }: { initial: ProductFormData }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);
  const [occasions, setOccasions] = useState<string[]>(initial.occasions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(initial.imagePath);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    form.set("occasions", occasions.join(","));
    try {
      const url = isEdit ? `/api/admin/products/${initial.id}` : "/api/admin/products";
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setBusy(false);
    }
  }

  const toggle = (o: string) =>
    setOccasions((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" defaultValue={initial.name} required />
        <Field name="slug" label="Slug (URL)" defaultValue={initial.slug} placeholder="auto from name if blank" />
      </div>

      <Field name="shortDescription" label="Short description" defaultValue={initial.shortDescription} />

      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="description">Full description</label>
        <textarea id="description" name="description" rows={4} defaultValue={initial.description}
          className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field name="regularPrice" label="Price (£)" type="number" step="0.01" defaultValue={initial.regularPrice} required />
        <Field name="salePrice" label="Sale price (£)" type="number" step="0.01" defaultValue={initial.salePrice} />
        <Field name="category" label="Category" defaultValue={initial.category} placeholder="e.g. Club" />
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="era">Era (Time Tunnel)</label>
          <select id="era" name="era" defaultValue={initial.era} className="w-full rounded-xl border border-trim px-3 py-3 outline-none focus:border-primary">
            <option value="">—</option>
            {DECADES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-heading">Occasions (Gift Finder)</label>
        <div className="flex flex-wrap gap-2">
          {GIFT_OCCASIONS.map((o) => (
            <button type="button" key={o} onClick={() => toggle(o)}
              className={`chip ${occasions.includes(o) ? "!bg-primary !text-white !border-primary" : ""}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="stockStatus">Stock status</label>
          <select id="stockStatus" name="stockStatus" defaultValue={initial.stockStatus} className="w-full rounded-xl border border-trim px-3 py-3 outline-none focus:border-primary">
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Sold out</option>
          </select>
        </div>
        <div className="flex items-end gap-6 pb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink"><input type="checkbox" name="featured" defaultChecked={initial.featured} className="h-4 w-4 accent-[var(--color-primary)]" /> Featured</label>
          <label className="flex items-center gap-2 text-sm font-medium text-ink"><input type="checkbox" name="active" defaultChecked={initial.active} className="h-4 w-4 accent-[var(--color-primary)]" /> Active</label>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="image">
          Product image {isEdit && "(leave blank to keep current)"}
        </label>
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="h-20 w-20 rounded-lg border border-trim object-cover" />
          )}
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }}
            className="block text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:file:bg-trim" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        <a href="/admin/products" className="btn btn-ghost">Cancel</a>
      </div>
    </form>
  );
}

function Field({ name, label, defaultValue, type = "text", required = false, placeholder, step }: {
  name: string; label: string; defaultValue?: string; type?: string; required?: boolean; placeholder?: string; step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-heading" htmlFor={name}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input id={name} name={name} type={type} step={step} defaultValue={defaultValue} required={required} placeholder={placeholder}
        className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
    </div>
  );
}
