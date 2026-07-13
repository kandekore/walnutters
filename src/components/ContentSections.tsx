import RichContent from "@/components/RichContent";

export type BriefSection = {
  type: string;
  heading: string;
  content: string;
};

const ICONS: Record<string, string> = {
  value_proposition: "✨",
  features: "🏆",
  process: "🎨",
  testimonial: "💬",
  cta: "⚽",
  faq: "❓",
};

/**
 * Renders the brief's `sections[]` blocks as an alternating, readable layout.
 * `content` may contain HTML (lists, blockquotes) so it flows through RichContent.
 */
export default function ContentSections({ sections }: { sections: BriefSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((s, i) => (
        <div key={i} className="card p-6 md:p-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-deep text-xl">
              {ICONS[s.type] ?? "•"}
            </span>
            <h2 className="text-xl font-bold text-heading md:text-2xl">{s.heading}</h2>
          </div>
          <RichContent html={s.content} />
        </div>
      ))}
    </div>
  );
}
