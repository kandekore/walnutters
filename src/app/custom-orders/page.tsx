import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("custom-orders", { path: "/custom-orders" });

export default function CustomOrdersPage() {
  return (
    <BriefPage
      slug="custom-orders"
      eyebrow="Bespoke"
      heroImage="/assets/images/Walnutters_FACUP_WIMLIV.jpg"
      defaultCtaHref="/design-your-own"
    />
  );
}
