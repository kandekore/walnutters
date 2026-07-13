import { prisma } from "@/lib/prisma";
import { toProductView, type ProductView } from "@/lib/products";

export type FeaturedFigure = {
  product: ProductView;
  reviews: { authorName: string; rating: number; text: string }[];
} | null;

/**
 * Featured Figure of the Week: the best-selling model (by sales in the trailing
 * week, falling back to an explicit `featured` flag / all-time sales) plus up to
 * three recent customer reviews. Returns null when nothing qualifies.
 */
export async function getFeaturedFigure(): Promise<FeaturedFigure> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Aggregate the past week's sales per product.
  const recent = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      productId: { not: null },
      order: { createdAt: { gte: weekAgo }, paymentStatus: { in: ["paid", "mock_paid"] } },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 1,
  });

  let product = null;
  if (recent.length > 0 && recent[0].productId) {
    product = await prisma.product.findUnique({ where: { id: recent[0].productId } });
  }

  // Fallbacks so the shop always has a featured figure to show.
  if (!product) {
    product =
      (await prisma.product.findFirst({ where: { featured: true, active: true } })) ??
      (await prisma.product.findFirst({ where: { active: true }, orderBy: { salesCount: "desc" } }));
  }

  if (!product) return null;

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return {
    product: toProductView(product),
    reviews: reviews.map((r) => ({
      authorName: r.authorName,
      rating: r.rating,
      text: r.text.slice(0, 150),
    })),
  };
}
