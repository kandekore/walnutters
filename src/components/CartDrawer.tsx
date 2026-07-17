"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHIPPING_FLAT } from "@/lib/money";

export default function CartDrawer() {
  const { items, isOpen, setOpen, subtotal, setQuantity, removeItem, count } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-trim p-5">
          <h2 className="text-lg font-bold text-heading">Your Basket ({count})</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-2xl text-secondary">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-ink/70">Your basket is empty.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-primary mt-6">
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-3 border-b border-cream-deep pb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imagePath ?? "/assets/brand/walnutterz-logo.png"}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 rounded-lg border border-trim object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="font-semibold text-heading">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-sm text-secondary hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-ink/70">{formatPrice(item.price)}</p>
                    <div className="mt-2 inline-flex items-center rounded-full border border-trim">
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity - 1)}
                        className="px-3 py-1 text-secondary"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.slug, item.quantity + 1)}
                        className="px-3 py-1 text-secondary"
                        aria-label="Increase quantity"
                      >＋</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-trim p-5">
            <div className="mb-1 flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-3 flex justify-between text-sm text-ink/70">
              <span>Shipping</span>
              <span>{formatPrice(SHIPPING_FLAT)}</span>
            </div>
            <div className="mb-4 flex justify-between text-lg font-bold text-heading">
              <span>Total</span>
              <span>{formatPrice(subtotal + SHIPPING_FLAT)}</span>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Checkout
            </Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-ghost mt-2 w-full">
              View basket
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
