import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meet the Maker",
  description:
    "The story behind Walnutterz — why we started, our love of football, the carving process and why we chose walnut shells.",
  alternates: { canonical: "/meet-the-maker" },
};

export const dynamic = "force-dynamic";

export default async function MeetTheMakerPage() {
  const content = await getContent("meet-the-maker");
  const paragraphs = (content?.body ?? "").split("\n\n").filter(Boolean);

  return (
    <div className="container-x py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="eyebrow">Meet the Maker</span>
          <h1 className="mt-2 text-3xl font-extrabold text-heading md:text-4xl">{content?.title ?? "Meet the Maker"}</h1>
        </div>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-[minmax(0,340px)_1fr]">
          {content?.imagePath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.imagePath}
              alt="The maker at work"
              className="w-full rounded-2xl border border-trim object-cover shadow-card"
            />
          )}
          <div className="rich">
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>Our story is coming soon.</p>
            )}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-cream p-8 text-center">
          <h2 className="text-2xl font-bold text-heading">People buy from the person as much as the product.</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/75">
            Every figure is made by hand, one at a time. Fancy something made just for you?
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/design-your-own" className="btn btn-primary">Design your own</Link>
            <Link href="/shop" className="btn btn-outline">Shop the collection</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
