import { prisma } from "@/lib/prisma";
import StatusSelect from "@/components/admin/StatusSelect";
import RowAction from "@/components/admin/RowAction";

export const dynamic = "force-dynamic";

function Photo({ src, label }: { src: string | null; label: string }) {
  if (!src) return null;
  return (
    <a href={src} target="_blank" rel="noreferrer" className="text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-20 w-20 rounded-lg border border-trim object-cover" />
      <span className="mt-1 block text-xs text-ink/50">{label}</span>
    </a>
  );
}

export default async function AdminCustomRequestsPage() {
  const requests = await prisma.customRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">Design Your Own — requests</h2>

      {requests.length === 0 ? (
        <div className="card p-10 text-center text-ink/60">No custom design requests yet.</div>
      ) : (
        <div className="space-y-5">
          {requests.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cream-deep pb-3">
                <div>
                  <p className="font-bold text-heading">{r.name}</p>
                  <a href={`mailto:${r.email}`} className="text-sm text-secondary hover:underline">{r.email}</a>
                  <p className="text-xs text-ink/50">{new Date(r.createdAt).toLocaleString("en-GB")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusSelect url={`/api/admin/custom-requests/${r.id}`} field="status" value={r.status} options={["NEW", "IN_PROGRESS", "MOCKUP_SENT", "COMPLETED"]} />
                  <RowAction url={`/api/admin/custom-requests/${r.id}`} method="DELETE" label="Delete" confirmText="Delete this request?" className="text-sm font-semibold text-red-600 hover:underline" />
                </div>
              </div>

              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <dl className="space-y-1 text-sm">
                  {r.favouritePlayer && <Row label="Favourite player" value={r.favouritePlayer} />}
                  {r.hairColour && <Row label="Hair colour" value={r.hairColour} />}
                  {r.shirtNumber && <Row label="Shirt number" value={r.shirtNumber} />}
                  {r.pose && <Row label="Pose" value={r.pose} />}
                  {r.personalMessage && <Row label="Message" value={r.personalMessage} />}
                </dl>
                <div className="flex flex-wrap gap-3">
                  <Photo src={r.teamPhotoPath} label="Team" />
                  <Photo src={r.kitPhotoPath} label="Kit" />
                  <Photo src={r.clubBadgePath} label="Badge" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="min-w-32 font-semibold text-heading">{label}</dt>
      <dd className="text-ink/75">{value}</dd>
    </div>
  );
}
