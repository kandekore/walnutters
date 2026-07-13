"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContentEditor({
  contentKey,
  title,
  body,
  imagePath,
  videoUrl,
  heading,
  showVideo = false,
}: {
  contentKey: string;
  title: string;
  body: string;
  imagePath: string | null;
  videoUrl: string;
  heading: string;
  showVideo?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(imagePath);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/content/${contentKey}`, {
        method: "PATCH",
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h3 className="text-lg font-bold text-heading">{heading}</h3>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading">Title</label>
        <input name="title" defaultValue={title} className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading">Body (blank line = new paragraph)</label>
        <textarea name="body" defaultValue={body} rows={8} className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
      </div>
      {showVideo && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-heading">Video URL (optional)</label>
          <input name="videoUrl" defaultValue={videoUrl} placeholder="/uploads/making-of.mp4 or an .mp4 URL" className="w-full rounded-xl border border-trim px-4 py-3 outline-none focus:border-primary" />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-semibold text-heading">Image</label>
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="h-20 w-20 rounded-lg border border-trim object-cover" />
          )}
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }}
            className="block text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-cream-deep file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:file:bg-trim" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="btn btn-primary">
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-sm text-green-700">Saved ✓</span>}
        {status === "error" && <span className="text-sm text-red-600">Save failed</span>}
      </div>
    </form>
  );
}
