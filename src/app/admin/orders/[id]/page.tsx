import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseObject } from "@/lib/parse";
import { formatPrice } from "@/lib/money";
import StatusSelect from "@/components/admin/StatusSelect";

type Params = { params: Promise<{ id: string }> };

export default async function AdminOrderDetail({ params }: Params) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const addr = parseObject<{ line1: string; line2?: string; city: string; postcode: string; country: string }>(order.shippingAddress);

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-semibold text-secondary hover:underline">← All orders</Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-heading">Order {order.orderNumber}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-ink/60">Status:</span>
          <StatusSelect url={`/api/admin/orders/${order.id}`} field="status" value={order.status} options={["PENDING", "PAID", "FULFILLED", "CANCELLED"]} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="card p-5 md:col-span-2">
          <h3 className="mb-3 font-bold text-heading">Items</h3>
          <ul className="space-y-3">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.imagePath ?? "/assets/brand/walnutterz-logo.png"} alt={i.name} className="h-12 w-12 rounded-md border border-trim object-cover" />
                <span className="flex-1 text-ink/80">{i.name} × {i.quantity}</span>
                <span className="font-semibold">{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-cream-deep pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span>{formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between text-lg font-bold text-heading"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <div className="card h-fit p-5">
          <h3 className="mb-3 font-bold text-heading">Customer</h3>
          <p className="text-sm text-ink/80">{order.customerName}</p>
          <p className="text-sm text-ink/60">{order.email}</p>
          {addr && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-heading">Ship to</h4>
              <p className="mt-1 text-sm text-ink/70">
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.city}<br />
                {addr.postcode}<br />
                {addr.country}
              </p>
            </div>
          )}
          <div className="mt-4 text-sm">
            <span className="text-ink/60">Payment: </span>
            <span className="chip">{order.paymentStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
