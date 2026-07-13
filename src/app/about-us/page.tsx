import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("about-us", { path: "/about-us" });

export default function AboutUsPage() {
  return (
    <BriefPage
      slug="about-us"
      eyebrow="About Walnutterz"
      heroImage="/assets/images/about/Walnutters_SHELF_01.jpg"
    />
  );
}
