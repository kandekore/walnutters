import type { Metadata } from "next";
import BriefPage from "@/components/BriefPage";
import { pageMetadata } from "@/content/pages";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = pageMetadata("our-models", { path: "/our-models" });

export default async function OurModelsPage() {
  const products = await getProducts();
  return (
    <BriefPage
      slug="our-models"
      eyebrow="The Collection"
      heroImage="/assets/images/Side shot.jpg"
      defaultCtaHref="/shop"
    >
      <div className="mt-14">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-heading">Browse our models</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </BriefPage>
  );
}
