"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl">⚽</div>
        <h3 className="mt-3 text-xl font-bold text-heading">Message received!</h3>
        <p className="mt-2 text-ink/75">
          Thanks for getting in touch. We&apos;ll get back to you as soon as possible to discuss your ideas.
        </p>
        <button onClick={() => setStatus("idle")} className="btn btn-ghost mt-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Subject (e.g. player, team, occasion)" name="subject" />
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="message">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about the figure you'd like — player, team, colours, personalisation and the date you need it by."
          className="w-full rounded-xl border border-trim bg-white px-4 py-3 outline-none focus:border-primary"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-heading" htmlFor={name}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-trim bg-white px-4 py-3 outline-none focus:border-primary"
      />
    </div>
  );
}
