import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">Orders</h2>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/60">No orders yet.</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="border-t border-cream-deep">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-secondary hover:underline">{o.orderNumber}</Link>
                </td>
                <td className="px-4 py-3 text-ink/60">{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-3 text-ink/80">{o.customerName}<br /><span className="text-xs text-ink/50">{o.email}</span></td>
                <td className="px-4 py-3 text-ink/70">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><span className="chip">{o.paymentStatus}</span></td>
                <td className="px-4 py-3"><span className="chip">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
