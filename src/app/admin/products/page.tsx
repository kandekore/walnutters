import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import RowAction from "@/components/admin/RowAction";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-heading">Products</h2>
        <Link href="/admin/products/new" className="btn btn-primary text-sm">+ New product</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-secondary">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-cream-deep">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.imagePath ?? "/assets/brand/Walnutterz logo.jpg"} alt={p.name} className="h-11 w-11 rounded-md border border-trim object-cover" />
                    <div>
                      <p className="font-semibold text-heading">{p.name}</p>
                      <p className="text-xs text-ink/50">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.salePrice ? (
                    <><span className="line-through text-ink/40">{formatPrice(p.regularPrice)}</span> {formatPrice(p.salePrice)}</>
                  ) : formatPrice(p.regularPrice)}
                </td>
                <td className="px-4 py-3 text-ink/70">{p.salesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.featured && <span className="chip !bg-heading !text-cream !border-heading">Featured</span>}
                    <span className={`chip ${p.active ? "" : "!bg-red-100 !text-red-700 !border-red-200"}`}>{p.active ? "Active" : "Hidden"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-sm font-semibold text-secondary hover:underline">Edit</Link>
                    <RowAction
                      url={`/api/admin/products/${p.id}`}
                      method="DELETE"
                      label="Delete"
                      confirmText={`Delete "${p.name}"? Products with past orders are hidden instead.`}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
