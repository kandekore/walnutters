"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHIPPING_FLAT } from "@/lib/money";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, count } = useCart();

  return (
    <div className="container-x py-14 md:py-20">
      <h1 className="text-3xl font-extrabold text-heading">Your Basket</h1>

      {items.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <p className="text-ink/70">Your basket is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-6">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.slug} className="card flex gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imagePath ?? "/assets/brand/walnutterz-logo.png"}
                  alt={item.name}
                  className="h-24 w-24 flex-shrink-0 rounded-lg border border-trim object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-bold text-heading hover:text-primary">{item.name}</Link>
                      <p className="text-sm text-ink/70">{formatPrice(item.price)} each</p>
                    </div>
                    <button onClick={() => removeItem(item.slug)} className="text-sm text-secondary hover:underline">Remove</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-trim">
                      <button onClick={() => setQuantity(item.slug, item.quantity - 1)} className="px-3 py-1 text-secondary" aria-label="Decrease">−</button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => setQuantity(item.slug, item.quantity + 1)} className="px-3 py-1 text-secondary" aria-label="Increase">＋</button>
                    </div>
                    <span className="font-bold text-secondary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="card h-fit p-6">
            <h2 className="text-lg font-bold text-heading">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink/70">Subtotal ({count} items)</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink/70">Shipping</span><span>{formatPrice(SHIPPING_FLAT)}</span></div>
              <div className="mt-2 flex justify-between border-t border-cream-deep pt-3 text-lg font-bold text-heading">
                <span>Total</span><span>{formatPrice(subtotal + SHIPPING_FLAT)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn btn-primary mt-6 w-full">Proceed to checkout</Link>
            <Link href="/shop" className="btn btn-ghost mt-2 w-full">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
