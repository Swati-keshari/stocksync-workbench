"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";
import { useOptimisticResolve } from "@/hooks/useOptimisticResolve";
import { SeverityPill } from "@/components/shared/StatusPill";
import { SOURCE_LABEL, REASON_LABEL, type ReconciliationItem, type SourceId } from "@/lib/types";
import type { UseMutationResult } from "@tanstack/react-query";

export function DetailDrawer({ items }: { items: ReconciliationItem[] }) {
  const drawerItemId = useUiStore((s) => s.drawerItemId);
  const closeDrawer = useUiStore((s) => s.closeDrawer);
  const resolve = useOptimisticResolve();

  // The grid row backing this drawer can vanish from `items` the instant
  // the user clicks Resolve (optimistic removal happens immediately, but
  // the mutation itself — including retries — can take several seconds).
  // Falling back to the last-known copy keeps the open drawer showing
  // real content and live pending/retry state instead of unmounting
  // itself mid-mutation, only to potentially reappear moments later if
  // the mutation fails and rolls back.
  const liveItem = items.find((i) => i.id === drawerItemId) ?? null;
  const [lastItem, setLastItem] = useState<ReconciliationItem | null>(null);

  useEffect(() => {
    if (liveItem) setLastItem(liveItem);
  }, [liveItem]);

  useEffect(() => {
    if (!drawerItemId) setLastItem(null);
  }, [drawerItemId]);

  const item = liveItem ?? (drawerItemId ? lastItem : null);
  if (!item) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40" onClick={closeDrawer} />
      {/* key={item.id} is load-bearing: it forces this subtree (and its
          local state — the accepted-source choice, the notes draft) to
          remount whenever the drawer switches to a different item. Without
          it, clicking a new row while the drawer is already open for a
          different item would carry over the previous item's selection —
          silently applying it to the wrong SKU. */}
      <DrawerBody key={item.id} item={item} resolve={resolve} onClose={closeDrawer} />
    </>
  );
}

function DrawerBody({
  item,
  resolve,
  onClose,
}: {
  item: ReconciliationItem;
  resolve: UseMutationResult<{ id: string }, Error, string, { prev: ReconciliationItem[] | undefined }>;
  onClose: () => void;
}) {
  const pushToast = useUiStore((s) => s.pushToast);
  const [note, setNote] = useState("");
  const [acceptedSource, setAcceptedSource] = useState<SourceId | null>(null);

  // `resolve` is one shared mutation instance reused across whichever
  // item's drawer is currently open. Without checking `resolve.variables`
  // (the id actually passed to the last .mutate() call), switching to a
  // different item's drawer while a PRIOR item's resolve is still pending
  // would incorrectly show/disable THIS item's buttons too.
  const isThisItemPending = resolve.isPending && resolve.variables === item.id;
  const retrying = isThisItemPending && resolve.failureCount > 0;

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-drawer">
      <div className="flex items-start justify-between border-b border-border p-5">
        <div>
          <p className="text-xs text-text-secondary">{item.sku} · {item.location}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-text-primary">{item.product}</h2>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-text-secondary hover:text-text-primary">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <SeverityPill severity={item.severity} />
          <span className="text-sm tabular-nums text-text-secondary">
            {item.variancePct.toFixed(1)}% ({item.unitDelta > 0 ? "+" : ""}{item.unitDelta} units)
          </span>
          <span className="ml-auto rounded-pill bg-surface-alt px-2.5 py-1 text-xs font-medium tabular-nums text-text-primary">
            ${item.impactValue.toLocaleString()} exposure
          </span>
        </div>

        <section className="mb-5 flex items-center justify-between rounded-lg border border-border bg-surface-alt p-3">
          <div>
            <p className="text-xs text-text-secondary">Assigned to</p>
            <p className="text-sm font-medium text-text-primary">{item.assignedTo ?? "Unassigned"}</p>
          </div>
          {item.manualCountDue && (
            <div className="text-right">
              <p className="text-xs text-text-secondary">Count due</p>
              <p className="text-sm font-medium text-text-primary">
                {new Date(item.manualCountDue).toLocaleDateString([], { month: "short", day: "numeric" })}
              </p>
            </div>
          )}
          {!item.assignedTo && (
            <button
              onClick={() => pushToast(`Assigned ${item.sku} to you`, "info")}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg"
            >
              Assign to me
            </button>
          )}
        </section>

        <section className="mb-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Per-source quantities
          </h3>
          <div className="overflow-hidden rounded-lg border border-border">
            {(Object.keys(item.quantities) as SourceId[]).map((src) => (
              <button
                key={src}
                onClick={() => setAcceptedSource(src)}
                aria-pressed={acceptedSource === src}
                className={`flex w-full items-center justify-between border-b border-border px-3 py-2.5 text-sm last:border-b-0 ${
                  acceptedSource === src ? "bg-primary/10" : "bg-surface hover:bg-surface-alt"
                }`}
              >
                <span className="flex items-center gap-2 text-text-primary">
                  {SOURCE_LABEL[src]}
                  {src === item.outlier && (
                    <span className="rounded-pill bg-status-critical/15 px-1.5 py-0.5 text-[10px] font-medium text-status-critical">
                      outlier
                    </span>
                  )}
                </span>
                <span className="tabular-nums font-medium text-text-primary">{item.quantities[src]}</span>
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            Last synced {new Date(item.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </section>

        <section className="mb-5 rounded-lg border border-border bg-surface-alt p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles size={13} />
            ML-suggested reason
          </div>
          <p className="text-sm text-text-primary">{REASON_LABEL[item.suggestedReason]}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {Math.round(item.confidence * 100)}% confidence · variance anomaly + reason classification
          </p>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Notes</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context for whoever reviews this next…"
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary"
          />
        </section>
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-5">
        <button
          disabled={!acceptedSource || isThisItemPending}
          onClick={() => {
            if (!acceptedSource) return;
            pushToast(`Accepted ${SOURCE_LABEL[acceptedSource]} as source of truth for ${item.sku}`, "success");
            resolve.mutate(item.id);
          }}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Accept a source
        </button>
        <button
          onClick={() => {
            pushToast(`Manual count requested for ${item.sku}`, "info");
            onClose();
          }}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-alt"
        >
          Create manual count
        </button>
        <button
          onClick={() => resolve.mutate(item.id)}
          disabled={isThisItemPending}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-alt disabled:opacity-50"
        >
          {retrying ? `Retrying… (attempt ${resolve.failureCount + 1}/3)` : isThisItemPending ? "Resolving…" : "Resolve item"}
        </button>
      </div>
    </aside>
  );
}
