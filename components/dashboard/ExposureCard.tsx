import { DollarSign } from "lucide-react";
import type { ReconciliationItem } from "@/lib/types";

export function ExposureCard({ items }: { items: ReconciliationItem[] }) {
  const total = items.reduce((sum, i) => sum + i.impactValue, 0);
  const criticalHigh = items
    .filter((i) => i.severity === "critical" || i.severity === "high")
    .reduce((sum, i) => sum + i.impactValue, 0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-critical/15 text-status-critical">
          <DollarSign size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Estimated shrinkage exposure</h3>
          <p className="text-xs text-text-secondary">
            At cost, across {items.length} open reconciliation items
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-text-secondary">Critical + high only</p>
          <p className="text-lg font-semibold tabular-nums text-status-critical">
            ${criticalHigh.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary">Total exposure</p>
          <p className="text-2xl font-semibold tabular-nums text-text-primary">
            ${total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
