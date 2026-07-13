"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

type Method = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export default function PaymentMethods({ methods }: { methods: Method[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const stripeLive = Boolean(publishableKey);

  async function addCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: fd.get("number"),
          expMonth: fd.get("expMonth"),
          expYear: fd.get("expYear"),
          makeDefault: fd.get("makeDefault") === "on",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save card");
      setAdding(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save card");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this card?")) return;
    await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function makeDefault(id: string) {
    await fetch(`/api/payment-methods/${id}`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-heading">Payment methods</h2>
        {!adding && (
          <button onClick={() => setAdding(true)} className="btn btn-primary text-sm">+ Add card</button>
        )}
      </div>

      {!stripeLive && (
        <p className="mt-2 rounded-lg bg-cream px-4 py-3 text-sm text-ink/70">
          🧪 Demo mode: cards are validated and stored securely as brand + last 4 digits only (no full card number is ever kept). Add Stripe keys to enable a live tokenised vault.
        </p>
      )}

      {adding && (
        <form onSubmit={addCard} className="card mt-5 space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="number">Card number</label>
            <input id="number" name="number" inputMode="numeric" placeholder="4242 4242 4242 4242" required
              className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="expMonth">Expiry month</label>
              <input id="expMonth" name="expMonth" type="number" min={1} max={12} placeholder="12" required
                className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-heading" htmlFor="expYear">Expiry year</label>
              <input id="expYear" name="expYear" type="number" min={2024} max={2100} placeholder="2028" required
                className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input type="checkbox" name="makeDefault" className="h-4 w-4 accent-[var(--color-primary)]" /> Set as default
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Saving…" : "Save card"}</button>
            <button type="button" onClick={() => setAdding(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {methods.length === 0 && !adding && (
          <div className="card p-8 text-center text-ink/70">No payment methods saved yet.</div>
        )}
        {methods.map((m) => (
          <div key={m.id} className="card flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded-md bg-heading text-xs font-bold text-cream">
                {m.brand === "Visa" ? "VISA" : m.brand === "Mastercard" ? "MC" : m.brand === "American Express" ? "AMEX" : "CARD"}
              </div>
              <div>
                <p className="font-semibold text-heading">
                  {m.brand} •••• {m.last4}
                  {m.isDefault && <span className="chip ml-2 !bg-primary !text-white !border-primary">Default</span>}
                </p>
                <p className="text-sm text-ink/60">Expires {String(m.expMonth).padStart(2, "0")}/{m.expYear}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!m.isDefault && (
                <button onClick={() => makeDefault(m.id)} className="btn btn-ghost text-sm">Set default</button>
              )}
              <button onClick={() => remove(m.id)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
