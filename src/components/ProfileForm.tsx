"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), password: fd.get("password") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="email">Email</label>
        <input id="email" value={email} disabled className="w-full rounded-xl border border-trim bg-cream px-4 py-3 text-ink/60" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="name">Name</label>
        <input id="name" name="name" defaultValue={name} required className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="password">New password (optional)</label>
        <input id="password" name="password" type="password" minLength={6} placeholder="Leave blank to keep current" className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "saved" && <p className="text-sm text-green-700">Profile updated ✓</p>}
      <button type="submit" disabled={status === "saving"} className="btn btn-primary">
        {status === "saving" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
