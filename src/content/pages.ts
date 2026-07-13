import brief from "./brief.json";
import type { Metadata } from "next";
import { site } from "@/lib/site";

type OpenGraph = {
  title: string | null;
  description: string | null;
  type: string;
  twitter_card: string;
};

export type PageSeo = {
  title: string;
  description: string;
  focus_keyword: string;
};

export type PageContent = {
  slug: string;
  title: string;
  hero_headline: string;
  hero_subheadline: string;
  body_content: string;
  sections:
    | { type: string; heading: string; content: string }[]
    | null;
  cta_text: string;
  cta_url: string | null;
  page_seo: PageSeo;
  open_graph: OpenGraph;
};

type BriefPage = {
  slug: string;
  title: string;
  content: {
    hero_headline?: string | null;
    hero_subheadline?: string | null;
    body_content?: string | null;
    sections?: { type: string; heading: string; content: string }[] | null;
    cta_text?: string | null;
    cta_url?: string | null;
    page_seo?: Partial<PageSeo> | null;
    open_graph?: Partial<OpenGraph> | null;
  };
};

const pages = (brief as { website_structure: { pages: BriefPage[] } })
  .website_structure.pages;

/** Look up a brief page's content by its slug. */
export function getPage(slug: string): PageContent | null {
  const p = pages.find((x) => x.slug === slug);
  if (!p) return null;
  const c = p.content ?? {};
  return {
    slug: p.slug,
    title: p.title,
    hero_headline: c.hero_headline ?? p.title,
    hero_subheadline: c.hero_subheadline ?? "",
    body_content: c.body_content ?? "",
    sections: c.sections ?? null,
    cta_text: c.cta_text ?? "",
    cta_url: c.cta_url ?? null,
    page_seo: {
      title: c.page_seo?.title || "",
      description: c.page_seo?.description || "",
      focus_keyword: c.page_seo?.focus_keyword || "",
    },
    open_graph: {
      title: c.open_graph?.title ?? null,
      description: c.open_graph?.description ?? null,
      type: c.open_graph?.type ?? "website",
      twitter_card: c.open_graph?.twitter_card ?? "summary_large_image",
    },
  };
}

/** Build Next.js Metadata from a brief page + optional overrides. */
export function pageMetadata(
  slug: string,
  overrides?: { title?: string; description?: string; path?: string }
): Metadata {
  const page = getPage(slug);
  const title =
    overrides?.title ||
    page?.page_seo.title ||
    (page ? `${page.title}` : site.name);
  const description =
    overrides?.description ||
    page?.page_seo.description ||
    page?.hero_subheadline ||
    site.description;
  const path = overrides?.path ?? `/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [site.logo],
    },
  };
}
