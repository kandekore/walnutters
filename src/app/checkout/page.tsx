"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHIPPING_FLAT } from "@/lib/money";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stripeLive = Boolean(publishableKey);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const customer = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-extrabold text-heading">Your basket is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-14 md:py-20">
      <h1 className="text-3xl font-extrabold text-heading">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8">
          <h2 className="text-lg font-bold text-heading">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full name" required defaultValue={session?.user?.name ?? ""} />
            <Field name="email" label="Email" type="email" required defaultValue={session?.user?.email ?? ""} />
          </div>
          <Field name="line1" label="Address line 1" required />
          <Field name="line2" label="Address line 2" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="city" label="Town / City" required />
            <Field name="postcode" label="Postcode" required />
            <Field name="country" label="Country" defaultValue="United Kingdom" required />
          </div>

          <div className="rounded-xl bg-cream p-4 text-sm text-ink/75">
            {stripeLive ? (
              <>💳 You&apos;ll be redirected to our secure Stripe checkout to complete payment.</>
            ) : (
              <>🧪 <strong>Demo mode:</strong> no payment keys are configured, so this places a test order without a real charge. Add Stripe keys in <code>.env</code> to enable live payments.</>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Placing order…" : `Place order — ${formatPrice(subtotal + SHIPPING_FLAT)}`}
          </button>
          {!session && (
            <p className="text-center text-sm text-ink/60">
              Have an account? <Link href="/login?callbackUrl=/checkout" className="font-semibold text-secondary hover:underline">Sign in</Link> to save this to your order history.
            </p>
          )}
        </form>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold text-heading">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li key={i.slug} className="flex justify-between text-sm">
                <span className="text-ink/80">{i.name} × {i.quantity}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-cream-deep pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink/70">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink/70">Shipping</span><span>{formatPrice(SHIPPING_FLAT)}</span></div>
            <div className="flex justify-between text-lg font-bold text-heading"><span>Total</span><span>{formatPrice(subtotal + SHIPPING_FLAT)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", required = false, defaultValue }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-heading" htmlFor={name}>
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input id={name} name={name} type={type} required={required} defaultValue={defaultValue}
        className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
    </div>
  );
}
