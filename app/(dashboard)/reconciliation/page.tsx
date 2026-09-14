"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SEVERITY_LABEL } from "@/components/shared/StatusPill";
import clsx from "clsx";
import { useReconciliationItems } from "@/hooks/useReconciliationItems";
import { useUiStore } from "@/stores/useUiStore";
import { ReconciliationGrid } from "@/components/reconciliation/ReconciliationGrid";
import { DetailDrawer } from "@/components/reconciliation/DetailDrawer";
import { BulkActionModal } from "@/components/reconciliation/BulkActionModal";
import type { ReconciliationItem, Severity } from "@/lib/types";

const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

function DeepLinkHandler({ items }: { items: ReconciliationItem[] | undefined }) {
  // Supports notifications (and anywhere else) linking straight into a
  // specific item's drawer via /reconciliation?open=<id>.
  const searchParams = useSearchParams();
  const openDrawer = useUiStore((s) => s.openDrawer);
  const pushToast = useUiStore((s) => s.pushToast);
  const openId = searchParams.get("open");

  useEffect(() => {
    if (!openId || !items) return;
    if (items.some((i) => i.id === openId)) {
      openDrawer(openId);
    } else {
      // The linked item may have already been resolved (e.g. by another
      // session, or by the live simulation's own state) — fail loudly
      // instead of silently doing nothing, which would look like the link
      // is just broken.
      pushToast("That item is no longer in the queue — it may already be resolved.", "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, items]);

  return null;
}

function ReconciliationContent() {
  const { data: items, isLoading } = useReconciliationItems();
  const severityFilter = useUiStore((s) => s.severityFilter);
  const setSeverityFilter = useUiStore((s) => s.setSeverityFilter);
  const searchQuery = useUiStore((s) => s.searchQuery);
  const setSearchQuery = useUiStore((s) => s.setSearchQuery);
  const selectedIds = useUiStore((s) => s.selectedIds);
  const clearSelection = useUiStore((s) => s.clearSelection);
  const openBulkModal = useUiStore((s) => s.openBulkModal);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      if (severityFilter.length > 0 && !severityFilter.includes(item.severity)) return false;
      if (searchQuery && !`${item.sku} ${item.product}`.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [items, severityFilter, searchQuery]);

  function toggleSeverity(s: Severity) {
    setSeverityFilter(severityFilter.includes(s) ? severityFilter.filter((x) => x !== s) : [...severityFilter, s]);
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={null}>
        <DeepLinkHandler items={items} />
      </Suspense>

      <div>
        <h1 className="font-display text-3xl text-text-primary">Fights to settle</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          {items?.length ?? 0} products where the three notebooks disagree. Biggest money gap first. Click a row,
          pick which count to keep.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a product name…"
            className="w-64 rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSeverity(s)}
              className={clsx(
                "rounded-pill border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                severityFilter.includes(s)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-alt"
              )}
            >
              {SEVERITY_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !items ? (
        <div className="h-[560px] w-full animate-pulse rounded-card border border-border bg-surface" />
      ) : (
        <ReconciliationGrid items={filtered} />
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-pill border border-border bg-surface px-4 py-2.5 shadow-lg">
          <span className="text-sm text-text-primary">{selectedIds.length} selected</span>
          <button onClick={openBulkModal} className="rounded-pill bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover">
            Bulk actions
          </button>
          <button onClick={clearSelection} className="text-xs text-text-secondary hover:text-text-primary">
            Clear
          </button>
        </div>
      )}

      {items && <DetailDrawer items={items} />}
      <BulkActionModal />
    </div>
  );
}

export default function ReconciliationPage() {
  return (
    <Suspense fallback={<div className="h-[560px] w-full animate-pulse rounded-card border border-border bg-surface" />}>
      <ReconciliationContent />
    </Suspense>
  );
}
