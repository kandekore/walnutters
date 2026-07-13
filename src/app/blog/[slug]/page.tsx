import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.imagePath ? [post.imagePath] : [site.logo],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.imagePath ? `${site.url}${post.imagePath}` : undefined,
    datePublished: post.createdAt.toISOString(),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="container-x max-w-3xl py-14 md:py-20">
      <Link href="/blog" className="text-sm font-semibold text-secondary hover:underline">← Back to blog</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-heading md:text-4xl">{post.title}</h1>
      {post.excerpt && <p className="mt-3 text-lg text-ink/75">{post.excerpt}</p>}
      {post.imagePath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imagePath} alt={post.title} className="mt-6 aspect-[16/9] w-full rounded-2xl border border-trim object-cover" />
      )}
      <div className="rich mt-8">
        {post.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-cream p-6 text-center">
        <h2 className="text-xl font-bold text-heading">Bring your football memories to life</h2>
        <Link href="/shop" className="btn btn-primary mt-4">Shop the collection</Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </article>
  );
}
