import { getContent } from "@/lib/content";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const [maker, making] = await Promise.all([
    getContent("meet-the-maker"),
    getContent("making-of"),
  ]);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">Site content</h2>
      <div className="space-y-8">
        <ContentEditor
          heading="Meet the Maker"
          contentKey="meet-the-maker"
          title={maker?.title ?? ""}
          body={maker?.body ?? ""}
          imagePath={maker?.imagePath ?? null}
          videoUrl={maker?.videoUrl ?? ""}
        />
        <ContentEditor
          heading="The Making of a Walnutterz"
          contentKey="making-of"
          title={making?.title ?? ""}
          body={making?.body ?? ""}
          imagePath={making?.imagePath ?? null}
          videoUrl={making?.videoUrl ?? ""}
          showVideo
        />
      </div>
    </div>
  );
}
