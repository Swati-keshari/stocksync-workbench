import { Article } from "@/components/site/Article";
import { TallyNudge } from "@/components/artifacts/Motion";

export default function PricingPage() {
  return (
    <Article title="Pricing for this demo" lead="This is a portfolio build. There is no billing.">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Classroom", "Free", "Learn pages and fake data."],
          ["Workbench", "Free", "Full dashboard, still mocked."],
          ["Production shop", "Not sold", "Would need a real backend."],
        ].map(([name, price, note]) => (
          <div key={name} className="rounded-[4px] border border-border bg-surface p-4">
            <p className="font-display text-xl">{name}</p>
            <p className="mt-2 text-2xl">{price}</p>
            <p className="mt-2 text-sm text-text-secondary">{note}</p>
          </div>
        ))}
      </div>
      <TallyNudge />
    </Article>
  );
}
