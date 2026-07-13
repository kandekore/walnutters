import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";

const SLUG = "highlight-the-uniqueness-and-craftsmanship-of-walnut-models-more-prominently";

export const metadata: Metadata = pageMetadata(SLUG, {
  title: "Why Walnut? Handcrafted Football Models — Unique Artistry",
  path: "/why-walnut",
});

export default function WhyWalnutPage() {
  return (
    <BriefPage
      slug={SLUG}
      eyebrow="Craftsmanship"
      heroImage="/assets/images/Paints + Brushes.jpg"
    />
  );
}
