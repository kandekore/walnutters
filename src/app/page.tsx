import Link from "next/link";
import type { Metadata } from "next";
import { getPage } from "@/content/pages";
import { getProducts } from "@/lib/products";
import HomeHero from "@/components/HomeHero";
import ProductCard from "@/components/ProductCard";
import FeaturedFigure from "@/components/FeaturedFigure";

export const metadata: Metadata = {
  title: "Handcrafted Walnut Head Football Figures",
  description:
    "Discover handcrafted walnut football models that capture 90s nostalgia and modern flair. Unique, personalised art pieces for every football fan.",
  alternates: { canonical: "/" },
};

const WHY = [
  { icon: "🌰", title: "Genuine walnut shells", text: "Real walnut heads — a natural, artisanal alternative to mass-produced plastic figures." },
  { icon: "🎨", title: "Hand-painted detail", text: "Every kit, number, boot and eye is painted by hand over several hours for a flawless finish." },
  { icon: "⭐", title: "Truly one-of-a-kind", text: "No two shells are ever alike, so no two figures are ever the same. A unique collectible, every time." },
  { icon: "🎁", title: "The perfect gift", text: "Birthdays, Father's Day, retirements, club awards and Player of the Match keepsakes." },
];

const COMMUNITY = [
  { href: "/time-tunnel", emoji: "🕰️", title: "The Football Time Tunnel", text: "Travel decade by decade through the legends who shaped the game." },
  { href: "/design-your-own", emoji: "✏️", title: "Design Your Own", text: "Send us your kit, badge and player — we'll craft a bespoke figure just for you." },
  { href: "/meet-the-maker", emoji: "👋", title: "Meet the Maker", text: "The story behind Walnutterz and the passion in every brushstroke." },
  { href: "/gallery", emoji: "📸", title: "Customer Gallery", text: "See Walnutterz figures on display in football rooms, bars and trophy cabinets." },
  { href: "/making-of", emoji: "🔨", title: "The Making Of", text: "From walnut shell to finished figure — watch a keepsake come to life." },
  { href: "/gift-finder", emoji: "🎯", title: "Gift Finder", text: "Find the perfect figure for any occasion in just a couple of taps." },
];

export default async function HomePage() {
  const page = getPage("home");
  const products = await getProducts();

  return (
    <>
      <HomeHero
        eyebrow="The Original Walnut Head Football Figures"
        headline={page?.hero_headline ?? "Celebrate Football Nostalgia!"}
        subheadline={page?.hero_subheadline ?? undefined}
        image="/assets/images/WALNUTTERS_TEAM_02.jpg"
        ctaText="Explore the collection"
        ctaHref="/shop"
        secondaryCtaText="Design your own"
        secondaryCtaHref="/design-your-own"
      />

      {/* Why Walnutterz */}
      <section className="container-x py-14 md:py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Why Walnutterz?</span>
          <h2 className="mt-2 text-3xl font-extrabold text-heading">Uniquely crafted, hand-painted models</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink/75">
            We bring the beloved memories of 1990s and early 2000s football to life — every piece a one-of-a-kind
            masterpiece, capturing the essence of football legends and iconic moments.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="card p-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream-deep text-2xl">
                {w.icon}
              </div>
              <h3 className="text-lg font-bold text-heading">{w.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Figure of the Week */}
      <FeaturedFigure />

      {/* Shop the collection */}
      <section className="container-x py-14 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">Shop</span>
            <h2 className="mt-2 text-3xl font-extrabold text-heading">Score a unique collectible</h2>
          </div>
          <Link href="/shop" className="btn btn-outline">View all models</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Community hub */}
      <section className="bg-cream py-14 md:py-20">
        <div className="container-x">
          <div className="mb-10 text-center">
            <span className="eyebrow">The Walnutterz Community</span>
            <h2 className="mt-2 text-3xl font-extrabold text-heading">More than a catalogue — a destination</h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink/75">
              A home for football fans and collectors who love reliving the history of the game while discovering
              unique handcrafted keepsakes.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMMUNITY.map((c) => (
              <Link key={c.href} href={c.href} className="card group p-6 transition hover:-translate-y-1">
                <div className="mb-3 text-3xl">{c.emoji}</div>
                <h3 className="text-lg font-bold text-heading group-hover:text-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{c.text}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials teaser */}
      <section className="container-x py-14 md:py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Testimonials</span>
          <h2 className="mt-2 text-3xl font-extrabold text-heading">From football fans to football families</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { q: "The craftsmanship and attention to detail are outstanding, and everyone who visits comments on them.", a: "Oli & Paul, Back of the Net, Wakefield" },
            { q: "Brilliantly handcrafted, full of character and capture the spirit of football perfectly.", a: "Ramesh, Light Waves Leisure Centre" },
            { q: "Riley was over the moon with his personalised figure. The quality is outstanding.", a: "Billy, proud parent, Thornes Juniors" },
          ].map((t, i) => (
            <figure key={i} className="card p-6">
              <div className="text-3xl text-primary">“</div>
              <blockquote className="text-ink/80">{t.q}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-secondary">— {t.a}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/testimonials" className="btn btn-ghost">Read more testimonials →</Link>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-secondary py-16 text-center text-white">
        <div className="container-x">
          <h2 className="text-3xl font-extrabold text-white">On my walnut head, son!</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Can&apos;t find the player you&apos;re looking for? If you can picture it, there&apos;s a good chance we can carve it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/custom-orders" className="btn bg-white text-secondary hover:bg-cream">Start a custom order</Link>
            <Link href="/shop" className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary">Shop now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
