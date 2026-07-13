import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/money";
import { site } from "@/lib/site";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description = product.shortDescription || product.description || site.description;
  return {
    title: `${product.name} — Walnut Head Football Figure`,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.imagePath ? [product.imagePath] : [site.logo],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    orderBy: { createdAt: "desc" },
  });

  const all = await getProducts();
  const related = all.filter((p) => p.slug !== product.slug).slice(0, 4);

  const inStock = product.stockStatus === "in_stock";
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imagePath ? `${site.url}${product.imagePath}` : undefined,
    description: product.shortDescription || product.description || undefined,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: product.currency,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.slug}`,
    },
    ...(avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            bestRating: "10",
            reviewCount: reviews.length,
          },
        }
      : {}),
  };

  return (
    <div className="container-x py-10 md:py-16">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-heading">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.gallery.length ? product.gallery : product.imagePath ? [product.imagePath] : []} alt={product.name} />

        <div>
          {product.category && <span className="eyebrow">{product.category}</span>}
          <h1 className="mt-2 text-3xl font-extrabold text-heading md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            {product.onSale && (
              <span className="text-lg text-ink/50 line-through">{formatPrice(product.regularPrice)}</span>
            )}
            <span className="text-3xl font-bold text-secondary">{formatPrice(product.price)}</span>
            <span className={`chip ${inStock ? "" : "!bg-red-100 !text-red-700 !border-red-200"}`}>
              {inStock ? "In stock" : "Sold out"}
            </span>
          </div>

          {product.shortDescription && (
            <p className="mt-5 text-lg text-ink/85">{product.shortDescription}</p>
          )}
          {product.description && (
            <p className="mt-4 text-ink/75">{product.description}</p>
          )}

          <ul className="mt-6 space-y-2 text-sm text-ink/80">
            <li>🌰 Genuine walnut shell head — hand-cast and hand-painted</li>
            <li>⭐ One-of-a-kind: no two figures are ever alike</li>
            <li>🎁 A perfect gift, keepsake or collector&apos;s display piece</li>
            <li>🇬🇧 Individually made to order in Wakefield</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              slug={product.slug}
              name={product.name}
              price={product.price}
              imagePath={product.imagePath}
              className="btn btn-primary flex-1 min-w-[180px]"
              label={`Add to basket — ${formatPrice(product.price)}`}
              disabled={!inStock}
            />
            <Link href="/design-your-own" className="btn btn-outline">Want it personalised?</Link>
          </div>

          {product.occasions.length > 0 && (
            <div className="mt-6">
              <span className="text-sm font-semibold text-secondary">Great for: </span>
              {product.occasions.map((o) => (
                <span key={o} className="chip mr-2 mt-2 inline-flex">{o}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-extrabold text-heading">Customer reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-ink/70">No reviews available yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-heading">{r.authorName}</span>
                  <span className="font-bold text-primary">{r.rating}/10 ★</span>
                </div>
                <p className="mt-2 text-sm text-ink/75">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-extrabold text-heading">You might also like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </div>
  );
}
