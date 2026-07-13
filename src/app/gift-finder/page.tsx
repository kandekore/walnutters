import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { GIFT_OCCASIONS } from "@/lib/site";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Gift Finder",
  description:
    "Find the perfect walnut head football figure by occasion — birthdays, Father's Day, Christmas, retirement, coach gifts, Player of the Match and club awards.",
  alternates: { canonical: "/gift-finder" },
};

const EMOJI: Record<string, string> = {
  Birthday: "🎂",
  "Father's Day": "👔",
  Christmas: "🎄",
  Retirement: "🏵️",
  "Coach Gift": "📋",
  "Player of the Match": "⭐",
  "Football Club Awards": "🏆",
};

export default async function GiftFinderPage() {
  const products = await getProducts();
  const countFor = (o: string) => products.filter((p) => p.occasions.includes(o)).length;

  return (
    <>
      <PageHero
        eyebrow="Gift Finder"
        headline="Find the perfect football gift"
        subheadline="Not sure where to start? Pick an occasion and we'll show you figures that fit the moment."
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GIFT_OCCASIONS.map((o) => (
            <Link
              key={o}
              href={`/shop?occasion=${encodeURIComponent(o)}`}
              className="card group flex items-center gap-4 p-6 transition hover:-translate-y-1"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-deep text-2xl">
                {EMOJI[o] ?? "🎁"}
              </span>
              <div>
                <h2 className="text-lg font-bold text-heading group-hover:text-primary">{o}</h2>
                <p className="text-sm text-ink/60">{countFor(o)} matching {countFor(o) === 1 ? "figure" : "figures"}</p>
              </div>
              <span className="ml-auto text-primary">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-cream p-8 text-center">
          <h2 className="text-2xl font-bold text-heading">Something more personal?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/75">
            For a truly bespoke gift, design your own figure of a favourite player, teammate or family member.
          </p>
          <Link href="/design-your-own" className="btn btn-primary mt-5">Design your own</Link>
        </div>
      </section>
    </>
  );
}
