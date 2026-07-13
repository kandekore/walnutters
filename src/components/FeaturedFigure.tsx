import Link from "next/link";
import { getFeaturedFigure } from "@/lib/featured";
import { formatPrice } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";

export default async function FeaturedFigure() {
  const featured = await getFeaturedFigure();

  return (
    <section className="bg-cream-deep py-14 md:py-20">
      <div className="container-x">
        <div className="mb-8 text-center">
          <span className="eyebrow">Featured Figure of the Week</span>
          <h2 className="mt-2 text-3xl font-extrabold text-heading">This Week&apos;s Best Seller</h2>
        </div>

        {!featured ? (
          <p className="text-center text-ink/70">
            No featured figure is available this week — check back soon!
          </p>
        ) : (
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.product.imagePath ?? "/assets/brand/Walnutterz logo.jpg"}
                alt={featured.product.name}
                className="aspect-square w-full rounded-2xl border border-trim object-cover shadow-card"
              />
              <span className="absolute left-4 top-4 rounded-full bg-heading px-4 py-1.5 text-sm font-bold text-cream">
                ⭐ Best seller
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-heading">{featured.product.name}</h3>
              <p className="mt-2 text-2xl font-bold text-secondary">
                {formatPrice(featured.product.price)}
              </p>
              {featured.product.shortDescription && (
                <p className="mt-3 text-ink/80">{featured.product.shortDescription}</p>
              )}

              <div className="mt-5 space-y-3">
                {featured.reviews.length === 0 ? (
                  <p className="text-sm text-ink/60">No reviews available yet.</p>
                ) : (
                  featured.reviews.map((r, i) => (
                    <div key={i} className="rounded-xl border border-trim bg-white p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-heading">{r.authorName}</span>
                        <span className="text-sm font-bold text-primary">{r.rating}/10 ★</span>
                      </div>
                      <p className="mt-1 text-sm text-ink/75">{r.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <AddToCartButton
                  slug={featured.product.slug}
                  name={featured.product.name}
                  price={featured.product.price}
                  imagePath={featured.product.imagePath}
                />
                <Link href={`/products/${featured.product.slug}`} className="btn btn-outline">
                  View details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
