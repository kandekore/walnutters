import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ContactForm";
import RichContent from "@/components/RichContent";
import { getPage, pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("contact", {
  title: "Contact Walnutterz",
  path: "/contact",
});

export default function ContactPage() {
  const page = getPage("contact");
  return (
    <>
      <PageHero
        eyebrow="On my walnut head, son!"
        headline={page?.hero_headline ?? "Get in touch with Walnutterz"}
        subheadline={page?.hero_subheadline ?? undefined}
      />
      <section className="container-x grid gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="mx-auto max-w-none">
          <RichContent html={page?.body_content ?? ""} />
        </div>
        <div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
