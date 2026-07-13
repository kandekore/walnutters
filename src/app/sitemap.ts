import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/shop", priority: 0.9 },
    { path: "/our-models", priority: 0.8 },
    { path: "/about-us", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/custom-orders", priority: 0.8 },
    { path: "/design-your-own", priority: 0.8 },
    { path: "/gift-finder", priority: 0.7 },
    { path: "/time-tunnel", priority: 0.7 },
    { path: "/making-of", priority: 0.6 },
    { path: "/meet-the-maker", priority: 0.7 },
    { path: "/gallery", priority: 0.6 },
    { path: "/testimonials", priority: 0.7 },
    { path: "/why-walnut", priority: 0.7 },
    { path: "/quick-turnaround", priority: 0.6 },
    { path: "/faqs", priority: 0.6 },
    { path: "/blog", priority: 0.6 },
    { path: "/contact-us", priority: 0.7 },
    { path: "/contact", priority: 0.5 },
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));

  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });
    for (const p of products) {
      entries.push({
        url: `${base}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, createdAt: true },
    });
    for (const post of posts) {
      entries.push({
        url: `${base}/blog/${post.slug}`,
        lastModified: post.createdAt,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    /* DB not ready during some build steps — static routes still emit. */
  }

  return entries;
}
