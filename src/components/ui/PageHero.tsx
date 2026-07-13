import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image?: string | null;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export default function PageHero({
  eyebrow,
  headline,
  subheadline,
  image,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  align = "left",
  children,
}: Props) {
  const hasImage = Boolean(image);
  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        className={`container-x grid items-center gap-8 py-14 md:py-20 ${
          hasImage ? "md:grid-cols-2" : ""
        }`}
      >
        <div className={align === "center" && !hasImage ? "mx-auto max-w-3xl text-center" : ""}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-heading sm:text-4xl md:text-5xl">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-4 max-w-xl text-lg text-ink/80" style={align === "center" && !hasImage ? { marginInline: "auto" } : undefined}>
              {subheadline}
            </p>
          )}
          {(ctaText || secondaryCtaText) && (
            <div className={`mt-7 flex flex-wrap gap-3 ${align === "center" && !hasImage ? "justify-center" : ""}`}>
              {ctaText && ctaHref && (
                <Link href={ctaHref} className="btn btn-primary">{ctaText}</Link>
              )}
              {secondaryCtaText && secondaryCtaHref && (
                <Link href={secondaryCtaHref} className="btn btn-outline">{secondaryCtaText}</Link>
              )}
            </div>
          )}
          {children}
        </div>

        {hasImage && (
          <div className="relative">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-accent/40 blur-2xl" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image as string}
              alt={headline}
              className="relative z-10 aspect-[4/3] w-full rounded-2xl border border-trim object-cover shadow-card"
            />
          </div>
        )}
      </div>
    </section>
  );
}
