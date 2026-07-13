import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import RichContent from "@/components/RichContent";
import { getPage, pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("faqs", {
  title: "Walnut Head Football Models FAQs",
  path: "/faqs",
});

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function FaqsPage() {
  const page = getPage("faqs");
  const faqs = (page?.sections ?? []).map((s) => ({
    q: s.heading,
    a: s.content,
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="FAQs"
        headline={page?.hero_headline ?? "Your Walnutterz Questions Answered!"}
        subheadline={page?.hero_subheadline ?? undefined}
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="card group p-5 [&_summary]:list-none" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-lg font-bold text-heading">{f.q}</span>
                <span className="text-2xl text-primary transition group-open:rotate-45">＋</span>
              </summary>
              <div className="mt-3 border-t border-cream-deep pt-3">
                <RichContent html={f.a} />
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink/75">Still have a question?</p>
          <Link href="/contact-us" className="btn btn-primary mt-4">Get in touch</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
