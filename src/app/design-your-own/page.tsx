import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import DesignForm from "@/components/DesignForm";

export const metadata: Metadata = {
  title: "Design Your Own Walnutterz",
  description:
    "Create a bespoke walnut head football figure. Send us your team photo, kit, badge, favourite player and personal touches — we'll send a mock-up before we craft it.",
  alternates: { canonical: "/design-your-own" },
};

const STEPS = [
  { n: "1", title: "Share your idea", text: "Upload your kit, badge and team photo, and tell us about the player or person." },
  { n: "2", title: "We design a mock-up", text: "We'll create a mock-up design and send it to you — usually within 24 hours." },
  { n: "3", title: "You approve", text: "Happy with the design? Give us the go-ahead and we'll start crafting." },
  { n: "4", title: "Handcrafted & delivered", text: "Your one-of-a-kind figure is hand-painted, packaged and posted to your door." },
];

export default function DesignYourOwnPage() {
  return (
    <>
      <PageHero
        eyebrow="Bespoke"
        headline="Design Your Own Walnutterz"
        subheadline="One of our biggest selling points — a figure made just for you. Tell us your vision and we'll bring it to life in walnut."
      />

      <section className="container-x py-14 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">{s.n}</div>
              <h3 className="mt-3 text-lg font-bold text-heading">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-extrabold text-heading">Start your design</h2>
          <DesignForm />
        </div>
      </section>
    </>
  );
}
