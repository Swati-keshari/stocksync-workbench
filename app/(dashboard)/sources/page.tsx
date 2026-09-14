"use client";

import { useState } from "react";
import { useSources } from "@/hooks/useSources";
import { ConnectionPill } from "@/components/shared/StatusPill";
import { SourceConfigModal } from "@/components/sources/SourceConfigModal";
import { ReconciliationRulesPanel } from "@/components/sources/ReconciliationRulesPanel";
import { useUiStore } from "@/stores/useUiStore";
import { ShoppingCart, Warehouse, Store, Loader2, Settings2, XCircle } from "lucide-react";
import { SOURCE_STORY, type InventorySource, type SourceId } from "@/lib/types";

const ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  pos: Store,
  wms: Warehouse,
  ecom: ShoppingCart,
};

export default function SourcesPage() {
  const { data: sources, isLoading } = useSources();
  const pushToast = useUiStore((s) => s.pushToast);
  const [testing, setTesting] = useState<string | null>(null);
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [configuring, setConfiguring] = useState<InventorySource | null>(null);

  function testConnection(source: InventorySource) {
    setTesting(source.id);
    setTimeout(() => {
      setTesting(null);
      // Degraded sources realistically fail a test more often than
      // healthy ones — this isn't just a "success" toast machine.
      const failChance = source.status === "degraded" ? 0.5 : 0.05;
      if (Math.random() < failChance) {
        pushToast(`${source.name} did not answer. Try the switch again.`, "error");
      } else {
        pushToast(`${source.name} answered in ${source.latencyMs}ms`, "success");
      }
    }, 1100 + Math.random() * 600);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-text-primary">The three notebooks</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          Same shop, three lists. Flip a switch to pause a list. If a list is off, StockSync stops comparing it until
          you turn it back on.
        </p>
      </div>

      {isLoading || !sources ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-card border border-border bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => {
            const Icon = ICON[source.id] ?? Store;
            const connected = toggled[source.id] ?? source.connected;
            return (
              <div key={source.id} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-alt text-text-secondary">
                    <Icon size={18} />
                  </span>
                  <button
                    role="switch"
                    aria-checked={connected}
                    onClick={() => {
                      const next = !connected;
                      setToggled((t) => ({ ...t, [source.id]: next }));
                      pushToast(
                        next ? `${source.name} is counting again` : `${source.name} paused — we will skip this list`,
                        next ? "success" : "info"
                      );
                    }}
                    className={`relative h-6 w-11 rounded-pill transition-colors ${connected ? "bg-primary" : "bg-surface-alt"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        connected ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{source.name}</p>
                  <p className="text-xs text-text-secondary">{SOURCE_STORY[source.id as SourceId].meaning}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <ConnectionPill status={connected ? source.status : "offline"} />
                  <span className="text-text-secondary">
                    {connected
                      ? `Last copy ${new Date(source.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Paused"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>Copies every {source.syncFrequencyMinutes} min</span>
                  <span className="tabular-nums">{source.recordsSynced.toLocaleString()} rows</span>
                </div>
                {!connected && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-status-critical/10 px-2.5 py-1.5 text-xs text-status-critical">
                    <XCircle size={13} />
                    This list is paused, so fights that need it will wait.
                  </div>
                )}
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => testConnection(source)}
                    disabled={testing === source.id || !connected}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface py-2 text-xs font-medium text-text-primary hover:bg-surface-alt disabled:opacity-50"
                  >
                    {testing === source.id && <Loader2 size={13} className="animate-spin" />}
                    {testing === source.id ? "Checking…" : "Check if it answers"}
                  </button>
                  <button
                    onClick={() => setConfiguring(source)}
                    aria-label={`Configure ${source.name}`}
                    className="flex items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                  >
                    <Settings2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ReconciliationRulesPanel />

      {configuring && <SourceConfigModal source={configuring} onClose={() => setConfiguring(null)} />}
    </div>
  );
}
