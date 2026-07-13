import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopGrid from "@/components/ShopGrid";
import FeaturedFigure from "@/components/FeaturedFigure";
import { getProducts } from "@/lib/products";
import { getPage, pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("shop", {
  title: "Shop Walnut Football Models — Unique Collectibles",
  path: "/shop",
});

type SearchParams = Promise<{ occasion?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { occasion } = await searchParams;
  const products = await getProducts();
  const page = getPage("shop");

  return (
    <>
      <PageHero
        eyebrow="Shop"
        headline={page?.hero_headline ?? "Score a Unique Collectible!"}
        subheadline={page?.hero_subheadline ?? undefined}
      />

      <FeaturedFigure />

      <section className="container-x py-14 md:py-20">
        <ShopGrid products={products} initialOccasion={occasion} />
      </section>
    </>
  );
}
