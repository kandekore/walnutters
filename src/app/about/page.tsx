import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("about", {
  title: "About Walnutterz — Handcrafted Football Figures",
  path: "/about",
});

export default function AboutPage() {
  return (
    <BriefPage
      slug="about"
      eyebrow="Our Story"
      heroImage="/assets/images/about/WALNUTTERS_TEAM_02.jpg"
    />
  );
}
