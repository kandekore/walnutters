import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/content/pages";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata("contact-us", {
  title: "Contact Walnutterz for Bespoke Football Models",
  path: "/contact-us",
});

const OCCASIONS = [
  "⚽ Local grassroots football teams",
  "🎂 Birthday and Father's Day gifts",
  "🏆 End of season presentations",
  "⭐ Player of the Match awards",
  "🥇 Goal of the Season trophies",
  "👏 Coach of the Year awards",
  "🌟 Best Tekker awards",
  "🏅 Club Volunteer & Special Achievement awards",
  "❤️ Memorial keepsakes & retirement gifts",
  "🎨 Personalised football legends & favourite players",
];

export default function ContactUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        headline="Connect with Walnutterz"
        subheadline="Have an idea for a custom football figure? We'd love to hear from you — many of our favourite creations started with a simple conversation."
      />

      <section className="container-x grid gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="text-2xl font-extrabold text-heading">Custom designs &amp; special requests</h2>
          <p className="mt-3 text-ink/80">We create bespoke walnut head football figures for:</p>
          <ul className="mt-4 grid gap-2">
            {OCCASIONS.map((o) => (
              <li key={o} className="rounded-lg bg-cream px-3 py-2 text-sm text-ink/85">{o}</li>
            ))}
          </ul>

          <div className="mt-8 card p-6">
            <h3 className="text-lg font-bold text-heading">How to contact us</h3>
            <ul className="mt-3 space-y-2 text-ink/85">
              <li>📱 <strong>Mobile:</strong> <a className="text-secondary hover:underline" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>
              <li>📧 <strong>Email:</strong> <a className="text-secondary hover:underline" href={`mailto:${site.email}`}>{site.email}</a></li>
              <li>📍 <strong>Based in:</strong> {site.location}</li>
            </ul>
            <p className="mt-4 text-sm text-ink/70">
              It helps if you can include your name, the player or person to create, team name, photos of the kit or
              badge, any personalisation, and the date you need it by.
            </p>
          </div>
        </div>

        <div>
          <ContactForm />
          <p className="mt-4 text-center text-sm text-ink/70">
            Prefer a full custom brief? Use our{" "}
            <a href="/design-your-own" className="font-semibold text-secondary hover:underline">Design Your Own</a> tool.
          </p>
        </div>
      </section>
    </>
  );
}
