import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/content/pages";

export const metadata: Metadata = pageMetadata("blog", {
  title: "Blog — Football Nostalgia & Craftsmanship",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow="The Walnutterz Journal"
        headline="Unearth Football Nostalgia"
        subheadline="Stories of football legends, quirky art and the craft behind every hand-painted figure."
        align="center"
      />

      <section className="container-x py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card group overflow-hidden transition hover:-translate-y-1">
              {post.imagePath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imagePath} alt={post.title} className="aspect-[16/10] w-full object-cover" />
              )}
              <div className="p-5">
                <h2 className="text-lg font-bold text-heading group-hover:text-primary">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>}
                <span className="mt-4 inline-block text-sm font-semibold text-primary">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
