import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Making of a Walnutterz",
  description:
    "See how a humble walnut shell becomes a one-of-a-kind hand-painted football figure — from casting and sanding to the final fine details.",
  alternates: { canonical: "/making-of" },
};

export const dynamic = "force-dynamic";

const STEPS = [
  { emoji: "🌰", title: "The walnut shell", text: "Every figure begins with a genuine walnut shell — no two are ever alike." },
  { emoji: "🧱", title: "Casting the body", text: "A plaster cast mould is left to set for 24 hours to form a solid foundation." },
  { emoji: "🪵", title: "Sanding & priming", text: "The figure is carefully sanded and given a prime undercoat, then a base coat." },
  { emoji: "🎨", title: "Hand painting", text: "The kit, colours, numbers, boots and eyes are painted by hand over several hours." },
  { emoji: "✨", title: "The fine details", text: "The finishing touches bring each character's personality to life." },
  { emoji: "📦", title: "Packaging the order", text: "Your finished figure is carefully packaged and posted, ready to treasure." },
];

export default async function MakingOfPage() {
  const content = await getContent("making-of");

  return (
    <>
      <PageHero
        eyebrow="How it's made"
        headline={content?.title ?? "The Making of a Walnutterz"}
        subheadline={content?.body ?? "People love seeing how handmade products are made — here's how a walnut shell becomes a football keepsake."}
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        {/* Video (user-initiated per the brief) or a fallback image */}
        <div className="mx-auto max-w-4xl">
          {content?.videoUrl ? (
            <div className="aspect-video overflow-hidden rounded-2xl border border-trim shadow-card">
              <video controls preload="none" className="h-full w-full" poster={content.imagePath ?? undefined}>
                <source src={content.videoUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : content?.imagePath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.imagePath} alt="The making of a Walnutterz" className="w-full rounded-2xl border border-trim object-cover shadow-card" />
          ) : null}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-sm font-bold text-primary">Step {i + 1}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-heading">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink/75">Hours of patient work justify every figure&apos;s premium finish.</p>
          <Link href="/shop" className="btn btn-primary mt-4">Shop the collection</Link>
        </div>
      </section>
    </>
  );
}
