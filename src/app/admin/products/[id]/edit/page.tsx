import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/parse";
import ProductForm from "@/components/admin/ProductForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">Edit: {product.name}</h2>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          regularPrice: (product.regularPrice / 100).toFixed(2),
          salePrice: product.salePrice ? (product.salePrice / 100).toFixed(2) : "",
          category: product.category ?? "",
          era: product.era ?? "",
          occasions: parseArray(product.occasions),
          featured: product.featured,
          active: product.active,
          stockStatus: product.stockStatus,
          imagePath: product.imagePath,
        }}
      />
    </div>
  );
}
