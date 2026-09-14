import { ConnectionPill } from "@/components/shared/StatusPill";
import type { InventorySource } from "@/lib/types";
import { ShoppingCart, Warehouse, Store } from "lucide-react";

const ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  pos: Store,
  wms: Warehouse,
  ecom: ShoppingCart,
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}

export function StatusCard({ source }: { source: InventorySource }) {
  const Icon = ICON[source.id] ?? Store;
  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-alt text-text-secondary">
            <Icon size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">{source.name}</p>
            <p className="text-xs text-text-secondary">{source.vendor}</p>
          </div>
        </div>
        <ConnectionPill status={source.status} />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <p className="text-text-secondary">Last copy</p>
          <p className="mt-0.5 font-medium tabular-nums text-text-primary">{timeAgo(source.lastSync)}</p>
        </div>
        <div>
          <p className="text-text-secondary">Wait</p>
          <p className="mt-0.5 font-medium tabular-nums text-text-primary">{source.latencyMs}ms</p>
        </div>
        <div>
          <p className="text-text-secondary">Rows</p>
          <p className="mt-0.5 font-medium tabular-nums text-text-primary">
            {source.recordsSynced.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
