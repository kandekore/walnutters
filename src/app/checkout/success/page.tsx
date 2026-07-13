import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ order?: string }>;

export default async function SuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber
    ? await prisma.order.findUnique({ where: { orderNumber }, include: { items: true } })
    : null;

  return (
    <div className="container-x max-w-2xl py-16 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-4 text-3xl font-extrabold text-heading">Thank you for your order!</h1>
      <p className="mt-3 text-ink/75">
        {order
          ? `Your order ${order.orderNumber} has been received. We'll begin handcrafting your figure(s) with care.`
          : "Your order has been received. We'll be in touch soon."}
      </p>

      {order && (
        <div className="card mt-8 p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="font-bold text-heading">Order {order.orderNumber}</span>
            <span className="chip">{order.status}</span>
          </div>
          <ul className="mt-4 space-y-2">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between text-sm">
                <span className="text-ink/80">{i.name} × {i.quantity}</span>
                <span>{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-cream-deep pt-3 font-bold text-heading">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account" className="btn btn-primary">View my orders</Link>
        <Link href="/shop" className="btn btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}
