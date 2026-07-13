"use client";

import { useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/site";

export default function GallerySubmit() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/gallery", { method: "POST", body: new FormData(e.currentTarget) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl">📸</div>
        <h3 className="mt-3 text-xl font-bold text-heading">Thanks for sharing!</h3>
        <p className="mt-2 text-ink/75">Your photo has been submitted and will appear once approved.</p>
        <button onClick={() => setStatus("idle")} className="btn btn-ghost mt-4">Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="customerName">Your name *</label>
          <input id="customerName" name="customerName" required className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="category">Category</label>
          <select id="category" name="category" className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary">
            {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="caption">Caption</label>
        <input id="caption" name="caption" placeholder="Tell us about your display" className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="photo">Photo * (JPEG/PNG, max 5MB)</label>
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" required
          className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:file:bg-trim" />
      </div>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto">
        {status === "sending" ? "Uploading…" : "Share my photo"}
      </button>
    </form>
  );
}
