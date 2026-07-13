import { prisma } from "@/lib/prisma";
import RowAction from "@/components/admin/RowAction";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: [{ approved: "asc" }, { createdAt: "desc" }] });
  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  return (
    <div>
      <h2 className="mb-2 text-2xl font-extrabold text-heading">Gallery moderation</h2>
      <p className="mb-6 text-sm text-ink/60">Submitted photos are held here until approved.</p>

      <h3 className="mb-3 font-bold text-heading">Pending ({pending.length})</h3>
      {pending.length === 0 ? (
        <div className="card p-6 text-center text-ink/60">Nothing waiting for review.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {pending.map((i) => (
            <div key={i.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.imagePath} alt={i.customerName} className="aspect-square w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-heading">{i.customerName}</p>
                <p className="text-xs text-primary">{i.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <RowAction url={`/api/admin/gallery/${i.id}`} method="PATCH" body={{ approved: true }} label="Approve" className="btn btn-primary !px-3 !py-1 text-xs" />
                  <RowAction url={`/api/admin/gallery/${i.id}`} method="DELETE" label="Reject" confirmText="Delete this photo?" className="text-xs font-semibold text-red-600 hover:underline" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mb-3 mt-10 font-bold text-heading">Approved ({approved.length})</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {approved.map((i) => (
          <div key={i.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.imagePath} alt={i.customerName} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <p className="text-sm font-semibold text-heading">{i.customerName}</p>
              <p className="text-xs text-primary">{i.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <RowAction url={`/api/admin/gallery/${i.id}`} method="PATCH" body={{ approved: false }} label="Unpublish" className="text-xs font-semibold text-secondary hover:underline" />
                <RowAction url={`/api/admin/gallery/${i.id}`} method="DELETE" label="Delete" confirmText="Delete this photo?" className="text-xs font-semibold text-red-600 hover:underline" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
