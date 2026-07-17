import Link from "next/link";

type Props = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
};

export default function HomeHero({
  eyebrow,
  headline,
  subheadline,
  image,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: Props) {
  return (
    <section className="relative isolate flex min-h-[62vh] items-center overflow-hidden border-y-4 border-trim md:min-h-[72vh]">
      {/* Full-bleed background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={headline}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom"
      />
      {/* Subtle overlay for depth behind the panel */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/20 via-black/5 to-transparent"
        aria-hidden
      />

      <div className="container-x py-16 md:py-24">
        {/* Semi-transparent brown text panel */}
        <div className="max-w-xl rounded-2xl border border-white/40 bg-white/65 p-7 shadow-card backdrop-blur-sm sm:p-9">
          {eyebrow && (
            <span className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-heading sm:text-4xl md:text-5xl">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-4 max-w-lg text-lg text-ink/80">{subheadline}</p>
          )}
          {(ctaText || secondaryCtaText) && (
            <div className="mt-7 flex flex-wrap gap-3">
              {ctaText && ctaHref && (
                <Link href={ctaHref} className="btn btn-primary">
                  {ctaText}
                </Link>
              )}
              {secondaryCtaText && secondaryCtaHref && (
                <Link href={secondaryCtaHref} className="btn btn-outline">
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
