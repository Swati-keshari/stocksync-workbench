"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ReconciliationItem } from "@/lib/types";

type BulkAction = "bulk_resolve" | "bulk_accept_pos" | "bulk_manual_count";

const ACTION_LABEL: Record<BulkAction, string> = {
  bulk_resolve: "Resolve selected items",
  bulk_accept_pos: "Accept POS as source of truth",
  bulk_manual_count: "Request manual count",
};

export function BulkActionModal() {
  const bulkModalOpen = useUiStore((s) => s.bulkModalOpen);
  const closeBulkModal = useUiStore((s) => s.closeBulkModal);
  const selectedIds = useUiStore((s) => s.selectedIds);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const pushToast = useUiStore((s) => s.pushToast);
  const drawerItemId = useUiStore((s) => s.drawerItemId);
  const closeDrawer = useUiStore((s) => s.closeDrawer);
  const queryClient = useQueryClient();

  const [action, setAction] = useState<BulkAction>("bulk_accept_pos");
  const [running, setRunning] = useState(false);

  if (!bulkModalOpen) return null;

  async function runAction() {
    setRunning(true);
    const idsToProcess = [...selectedIds];

    try {
      if (action === "bulk_resolve" || action === "bulk_accept_pos") {
        // Resolves server-side first (see app/api/_store.ts) — only once
        // that's confirmed do we touch the client cache, so a bulk action
        // can't silently "succeed" in the UI while the mock backend never
        // actually recorded it (which would make the rows reappear on the
        // next refetch, exactly like the single-item resolve bug this
        // mirrors).
        await api.resolveItems(idsToProcess);
        queryClient.setQueryData<ReconciliationItem[]>(["reconciliation-items"], (old) =>
          (old ?? []).filter((item) => !idsToProcess.includes(item.id))
        );
        // If the detail drawer happens to be open on one of the items this
        // bulk action just removed, close it — otherwise it has no
        // mutation of its own to complete and would keep showing a frozen,
        // now-nonexistent item indefinitely (see DetailDrawer's
        // last-known-item fallback, which only clears on an explicit
        // close).
        if (drawerItemId && idsToProcess.includes(drawerItemId)) closeDrawer();
      }
      closeBulkModal();
      clearSelection();
      pushToast(`${ACTION_LABEL[action]} — ${idsToProcess.length} item(s) processed`, "success");
    } catch (err) {
      pushToast(
        err instanceof Error ? err.message : "Bulk action failed — nothing was changed",
        "error"
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-card border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-sm font-semibold text-text-primary">Bulk action</h2>
          <button onClick={closeBulkModal} className="text-text-secondary hover:text-text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="mb-1 text-sm text-text-secondary">
            {selectedIds.length} item{selectedIds.length === 1 ? "" : "s"} selected
          </p>
          {(Object.keys(ACTION_LABEL) as BulkAction[]).map((key) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                action === key ? "border-primary bg-primary/10" : "border-border hover:bg-surface-alt"
              }`}
            >
              <input
                type="radio"
                name="bulk-action"
                checked={action === key}
                onChange={() => setAction(key)}
                className="accent-primary"
              />
              {ACTION_LABEL[key]}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button
            onClick={closeBulkModal}
            disabled={running}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-alt disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={runAction}
            disabled={running || selectedIds.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {running && <Loader2 size={14} className="animate-spin" />}
            {running ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
