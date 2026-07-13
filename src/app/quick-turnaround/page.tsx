import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";

const SLUG = "consider-offering-a-quick-turnaround-option-for-non-custom-orders";

export const metadata: Metadata = pageMetadata(SLUG, {
  title: "Quick Turnaround Walnut Head Models — Fast Delivery",
  path: "/quick-turnaround",
});

export default function QuickTurnaroundPage() {
  return (
    <BriefPage
      slug={SLUG}
      eyebrow="Ready to ship"
      heroImage="/assets/images/England pair.jpg"
      defaultCtaHref="/shop"
    />
  );
}
