"use client";

import { useState } from "react";

function FileInput({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-heading" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:file:bg-trim"
      />
    </div>
  );
}

function TextField({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-heading" htmlFor={name}>{label}</label>
      <input id={name} name={name} placeholder={placeholder}
        className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
    </div>
  );
}

export default function DesignForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/custom-request", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
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
        <div className="text-5xl">✅</div>
        <h3 className="mt-3 text-xl font-bold text-heading">Design request received!</h3>
        <p className="mt-2 text-ink/75">
          Thanks! We&apos;ll review your design and aim to send a mock-up within 24 hours before your handcrafted figure
          is produced.
        </p>
        <button onClick={() => setStatus("idle")} className="btn btn-ghost mt-4">Submit another</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Your name *" />
        <TextField name="email" label="Your email *" placeholder="you@example.com" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FileInput name="teamPhoto" label="Team photo" />
        <FileInput name="kitPhoto" label="Kit photo" />
        <FileInput name="clubBadge" label="Club badge" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="favouritePlayer" label="Favourite player" placeholder="e.g. Alan Shearer" />
        <TextField name="hairColour" label="Hair colour" placeholder="e.g. Brown" />
        <TextField name="shirtNumber" label="Shirt number" placeholder="e.g. 9" />
        <TextField name="pose" label="Pose" placeholder="e.g. Arm-aloft celebration" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="personalMessage">Personal message</label>
        <textarea id="personalMessage" name="personalMessage" rows={4}
          placeholder="Anything else we should know — occasion, personalisation, deadline…"
          className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>

      <p className="text-xs text-ink/60">Images: JPEG, PNG or WebP, up to 5MB each. Your details are handled in line with GDPR.</p>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto">
        {status === "sending" ? "Submitting…" : "Submit my design"}
      </button>
    </form>
  );
}
