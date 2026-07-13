import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parseObject } from "@/lib/parse";
import { formatPrice } from "@/lib/money";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-blue-100 text-blue-800 border-blue-200",
  FULFILLED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default async function AccountOrdersPage() {
  const user = await requireUser("/account");
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-heading">Order history</h2>

      {orders.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-ink/70">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn btn-primary mt-5">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {orders.map((order) => {
            const addr = parseObject<{ line1: string; city: string; postcode: string }>(order.shippingAddress);
            return (
              <div key={order.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-deep pb-3">
                  <div>
                    <span className="font-bold text-heading">{order.orderNumber}</span>
                    <span className="ml-3 text-sm text-ink/60">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <span className={`chip border ${STATUS_STYLES[order.status] ?? ""}`}>{order.status}</span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <ul className="space-y-2">
                    {order.items.map((i) => (
                      <li key={i.id} className="flex items-center gap-3 text-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={i.imagePath ?? "/assets/brand/Walnutterz logo.jpg"} alt={i.name} className="h-12 w-12 rounded-md border border-trim object-cover" />
                        <span className="text-ink/80">{i.name} × {i.quantity}</span>
                        <span className="ml-auto text-ink/60">{formatPrice(i.unitPrice * i.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-right sm:min-w-40">
                    <p className="text-sm text-ink/60">Total</p>
                    <p className="text-xl font-bold text-heading">{formatPrice(order.total)}</p>
                    {addr && <p className="mt-2 text-xs text-ink/60">Ship to: {addr.line1}, {addr.city}, {addr.postcode}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
