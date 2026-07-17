import Link from "next/link";
import type { ProductView } from "@/lib/products";
import { formatPrice } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: ProductView }) {
  const soldOut = product.stockStatus !== "in_stock";
  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imagePath ?? "/assets/brand/walnutterz-logo.png"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-heading px-3 py-1 text-xs font-bold text-cream">
            ⭐ Featured
          </span>
        )}
        {product.onSale && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-heading">
            Sale
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-lg font-bold text-heading hover:text-primary">{product.name}</h3>
          </Link>
          <div className="text-right">
            {product.onSale && (
              <span className="block text-xs text-ink/50 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
            <span className="font-bold text-secondary">{formatPrice(product.price)}</span>
          </div>
        </div>

        {product.category && <span className="mt-1 text-xs font-medium text-primary">{product.category}</span>}

        {product.shortDescription && (
          <p className="clamp-2 mt-2 text-sm text-ink/70">{product.shortDescription}</p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <AddToCartButton
            slug={product.slug}
            name={product.name}
            price={product.price}
            imagePath={product.imagePath}
            className="btn btn-primary flex-1 text-sm"
            disabled={soldOut}
          />
          <Link
            href={`/products/${product.slug}`}
            className="btn btn-ghost text-sm"
            aria-label={`View ${product.name}`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
