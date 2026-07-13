import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import GalleryView from "@/components/GalleryView";
import GallerySubmit from "@/components/GallerySubmit";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Customer Gallery",
  description:
    "See Walnutterz figures on display in football rooms, home bars, man caves, trophy cabinets and clubhouses. Share your own!",
  alternates: { canonical: "/gallery" },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow="Customer Gallery"
        headline="Walnutterz on Display"
        subheadline="From football rooms and home bars to trophy cabinets and clubhouses — see where our figures live, and share your own."
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        <GalleryView
          items={items.map((i) => ({
            id: i.id,
            customerName: i.customerName,
            imagePath: i.imagePath,
            category: i.category,
            caption: i.caption,
          }))}
        />

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="mb-4 text-center">
            <span className="eyebrow">Join in</span>
            <h2 className="mt-2 text-2xl font-extrabold text-heading">Share your Walnutterz display</h2>
          </div>
          <GallerySubmit />
        </div>
      </section>
    </>
  );
}
