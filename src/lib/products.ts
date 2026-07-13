import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/parse";
import { effectivePrice } from "@/lib/money";
import type { Product } from "@prisma/client";

export type ProductView = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  regularPrice: number;
  salePrice: number | null;
  price: number;
  onSale: boolean;
  currency: string;
  stockStatus: string;
  imagePath: string | null;
  gallery: string[];
  category: string | null;
  occasions: string[];
  era: string | null;
  featured: boolean;
  salesCount: number;
};

export function toProductView(p: Product): ProductView {
  const price = effectivePrice(p);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    regularPrice: p.regularPrice,
    salePrice: p.salePrice,
    price,
    onSale: p.salePrice != null && p.salePrice < p.regularPrice,
    currency: p.currency,
    stockStatus: p.stockStatus,
    imagePath: p.imagePath,
    gallery: parseArray(p.gallery),
    category: p.category,
    occasions: parseArray(p.occasions),
    era: p.era,
    featured: p.featured,
    salesCount: p.salesCount,
  };
}

export async function getProducts(): Promise<ProductView[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { salesCount: "desc" }, { name: "asc" }],
  });
  return products.map(toProductView);
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const p = await prisma.product.findUnique({ where: { slug } });
  return p ? toProductView(p) : null;
}
