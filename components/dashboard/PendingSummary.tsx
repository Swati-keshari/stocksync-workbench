import Link from "next/link";
import { SeverityPill } from "@/components/shared/StatusPill";
import type { SyncHealth } from "@/lib/types";

export function PendingSummary({ pending }: { pending: SyncHealth["pendingItems"] }) {
  const rows: { key: keyof typeof pending; severity: "critical" | "high" | "medium" | "low" }[] = [
    { key: "critical", severity: "critical" },
    { key: "high", severity: "high" },
    { key: "medium", severity: "medium" },
    { key: "low", severity: "low" },
  ];

  return (
    <div className="flex h-full flex-col rounded-card border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Pending reconciliation</h3>
        <span className="text-2xl font-semibold tabular-nums text-text-primary">{pending.total}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        {rows.map(({ key, severity }) => (
          <div key={key} className="flex items-center justify-between">
            <SeverityPill severity={severity} />
            <span className="text-sm font-medium tabular-nums text-text-primary">{pending[key]}</span>
          </div>
        ))}
      </div>
      <Link
        href="/reconciliation"
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Open reconciliation queue
      </Link>
    </div>
  );
}
