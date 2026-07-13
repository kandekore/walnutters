import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">Messages</h2>
      {messages.length === 0 ? (
        <div className="card p-10 text-center text-ink/60">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-heading">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="ml-3 text-sm text-secondary hover:underline">{m.email}</a>
                </div>
                <span className="text-xs text-ink/50">{new Date(m.createdAt).toLocaleString("en-GB")}</span>
              </div>
              {m.subject && <p className="mt-2 text-sm font-semibold text-heading">{m.subject}</p>}
              <p className="mt-1 text-sm text-ink/75 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
