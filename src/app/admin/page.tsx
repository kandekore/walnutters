import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, paidAgg, pendingRequests, pendingGallery, messages, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: { in: ["paid", "mock_paid"] } } }),
      prisma.customRequest.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
      prisma.galleryItem.count({ where: { approved: false } }),
      prisma.contactMessage.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    ]);

  const stats = [
    { label: "Revenue", value: formatPrice(paidAgg._sum.total ?? 0), href: "/admin/orders" },
    { label: "Orders", value: String(orderCount), href: "/admin/orders" },
    { label: "Products", value: String(productCount), href: "/admin/products" },
    { label: "Design requests", value: String(pendingRequests), href: "/admin/custom-requests", badge: pendingRequests > 0 },
    { label: "Gallery to review", value: String(pendingGallery), href: "/admin/gallery", badge: pendingGallery > 0 },
    { label: "Messages", value: String(messages), href: "/admin/messages" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 transition hover:-translate-y-1">
            <p className="text-sm text-ink/60">{s.label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${s.badge ? "text-primary" : "text-heading"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-heading">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-secondary hover:underline">View all →</Link>
        </div>
        <div className="card overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-ink/60">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-secondary">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-cream-deep">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-secondary hover:underline">{o.orderNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-ink/80">{o.customerName}</td>
                    <td className="px-4 py-3 text-ink/60">{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3"><span className="chip">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
