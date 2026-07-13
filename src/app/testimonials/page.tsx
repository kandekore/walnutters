import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("testimonials", {
  title: "Testimonials — Why They Love Walnutterz",
  path: "/testimonials",
});

const TESTIMONIALS = [
  {
    quote:
      "We were looking for something different to give our football centre a bit of personality, and the Walnutterz figures were exactly what we wanted. The craftsmanship and attention to detail are outstanding, and everyone who visits comments on them. We bought five models for display, and they've become a real talking point. If you're a football fan looking for something unique, we couldn't recommend Walnutterz highly enough.",
    author: "Oli & Paul",
    role: "Owners, Back of the Net Indoor Football Centre, Wakefield",
    image: "/assets/images/Back of the Net.jpg",
  },
  {
    quote:
      "From the moment we unpacked our Walnutterz figures, we knew we'd made the right choice. They're brilliantly handcrafted, full of character and capture the spirit of football perfectly. Our customers love spotting the different legends on display, and they've generated loads of positive comments. Fantastic quality, great service and something completely different from anything else out there.",
    author: "Ramesh",
    role: "Manager, Light Waves Football & Leisure Centre, Wakefield",
    image: null,
  },
  {
    quote:
      "Finding something different for a football-mad 12-year-old isn't easy, but Walnutterz absolutely delivered. Riley was over the moon with his personalised Thornes Juniors figure and his football legend model. The quality is outstanding, and they make such a fantastic keepsake. Thank you for creating something so special.",
    author: "Billy",
    role: "Proud parent of Riley, Under 13 player at Thornes Juniors, Wakefield",
    image: "/assets/images/Thornes Juniors.jpg",
  },
];

export default function TestimonialsPage() {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Walnutterz Handcrafted Walnut Head Football Figures",
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      reviewBody: t.quote,
      author: { "@type": "Person", name: t.author },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: TESTIMONIALS.length,
    },
  };

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        headline="From Football Fans to Football Families"
        subheadline="Every figure tells a story — here's what our customers think."
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className={`card grid gap-6 p-6 md:p-8 ${t.image ? "md:grid-cols-[220px_1fr]" : ""} items-center`}
            >
              {t.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image}
                  alt={t.author}
                  className="h-48 w-full rounded-xl border border-trim object-cover md:h-full"
                />
              )}
              <div>
                <div className="text-4xl leading-none text-primary">“</div>
                <blockquote className="text-lg text-ink/85">{t.quote}</blockquote>
                <figcaption className="mt-4">
                  <span className="block font-bold text-heading">{t.author}</span>
                  <span className="text-sm text-ink/70">{t.role}</span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="btn btn-primary">Shop the collection</Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
    </>
  );
}
