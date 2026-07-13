import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TimeTunnel from "@/components/TimeTunnel";
import { prisma } from "@/lib/prisma";
import { DECADES } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Football Time Tunnel",
  description:
    "Travel decade by decade through football's greatest legends — read their stories and order the matching handcrafted Walnutterz figure.",
  alternates: { canonical: "/time-tunnel" },
};

export const dynamic = "force-dynamic";

export default async function TimeTunnelPage() {
  const players = await prisma.timeTunnelPlayer.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <PageHero
        eyebrow="Nostalgia • Storytelling • Shopping"
        headline="The Football Time Tunnel"
        subheadline="Click a decade to explore its iconic players and moments — then bring a legend home in walnut."
        align="center"
      />
      <section className="container-x py-10 md:py-16">
        <TimeTunnel
          decades={DECADES}
          players={players.map((p) => ({
            id: p.id,
            decade: p.decade,
            name: p.name,
            story: p.story,
            productSlug: p.productSlug,
          }))}
        />
      </section>
    </>
  );
}
