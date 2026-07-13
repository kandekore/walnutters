import Link from "next/link";
import { getPage } from "@/content/pages";
import PageHero from "@/components/ui/PageHero";
import ContentSections from "@/components/ContentSections";
import RichContent from "@/components/RichContent";
import { notFound } from "next/navigation";

type Props = {
  slug: string;
  eyebrow?: string;
  heroImage?: string | null;
  defaultCtaHref?: string;
  children?: React.ReactNode;
};

/** Default renderer for a content page defined in the brief. */
export default function BriefPage({
  slug,
  eyebrow,
  heroImage,
  defaultCtaHref = "/shop",
  children,
}: Props) {
  const page = getPage(slug);
  if (!page) notFound();

  const ctaText = page.cta_text || "Explore the collection";
  const ctaHref = page.cta_url || defaultCtaHref;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        headline={page.hero_headline}
        subheadline={page.hero_subheadline}
        image={heroImage}
        ctaText={ctaText}
        ctaHref={ctaHref}
        secondaryCtaText="Custom orders"
        secondaryCtaHref="/custom-orders"
      />

      <section className="container-x py-14 md:py-20">
        {page.sections && page.sections.length > 0 ? (
          <div className="mx-auto max-w-4xl">
            <ContentSections sections={page.sections} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <RichContent html={page.body_content} />
          </div>
        )}

        {children}

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href={ctaHref} className="btn btn-primary">{ctaText}</Link>
          <Link href="/design-your-own" className="btn btn-outline">Design your own</Link>
        </div>
      </section>
    </>
  );
}
