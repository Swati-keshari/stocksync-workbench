"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pause, Play, RotateCcw, AlertCircle, Info, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";
import { SOURCE_LABEL, type BackfillJob } from "@/lib/types";

const LEVEL_ICON = { info: Info, warning: AlertTriangle, error: AlertCircle };
const LEVEL_COLOR: Record<string, string> = {
  info: "text-text-secondary",
  warning: "text-status-medium",
  error: "text-status-critical",
};

const STATUS_LABEL: Record<BackfillJob["status"], string> = {
  running: "Backfill in progress",
  paused: "Backfill paused",
  complete: "Backfill complete",
  cancelled: "Backfill cancelled",
  failed: "Backfill failed",
};

function formatEta(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// job comes straight from the ['backfill'] query cache, which
// useBackfillSocket advances every ~2.5s — this component reads and
// mutates that same cache directly (no more local state disconnected from
// the actual job data) so Pause/Cancel/Retry have real, visible effects.
export function ProgressTracker({ job }: { job: BackfillJob }) {
  const pushToast = useUiStore((s) => s.pushToast);
  const queryClient = useQueryClient();
  const [retrying, setRetrying] = useState(false);

  const pct = Math.round((job.itemsProcessed / job.itemsTotal) * 100);
  const isActive = job.status === "running" || job.status === "paused";

  function togglePause() {
    queryClient.setQueryData<BackfillJob>(["backfill"], (old) => {
      if (!old) return old;
      const next = old.status === "paused" ? "running" : "paused";
      return { ...old, status: next };
    });
    pushToast(job.status === "paused" ? "Backfill resumed" : "Backfill paused", "info");
  }

  function cancel() {
    queryClient.setQueryData<BackfillJob>(["backfill"], (old) => (old ? { ...old, status: "cancelled" } : old));
    pushToast("Backfill cancelled", "error");
  }

  function retryFailedBatches() {
    setRetrying(true);
    setTimeout(() => {
      queryClient.setQueryData<BackfillJob>(["backfill"], (old) =>
        old
          ? {
              ...old,
              stats: { ...old.stats, errors: 0 },
              log: [
                { time: new Date().toISOString(), level: "info" as const, message: "Failed batches re-processed successfully" },
                ...old.log,
              ].slice(0, 12),
            }
          : old
      );
      setRetrying(false);
      pushToast("Failed batches retried successfully", "success");
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-text-secondary">
              {SOURCE_LABEL[job.source]} · {job.dateRange.from} – {job.dateRange.to}
            </p>
            <h2 className="mt-0.5 flex items-center gap-1.5 text-base font-semibold text-text-primary">
              {job.status === "complete" && <CheckCircle2 size={16} className="text-status-low" />}
              {STATUS_LABEL[job.status]}
            </h2>
          </div>
          {isActive && (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePause}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-alt"
              >
                {job.status === "paused" ? <Play size={13} /> : <Pause size={13} />}
                {job.status === "paused" ? "Resume" : "Pause"}
              </button>
              <button
                onClick={cancel}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-status-critical hover:bg-surface-alt"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="mb-2 h-2.5 w-full overflow-hidden rounded-pill bg-surface-alt">
          <div
            className="h-full rounded-pill bg-primary transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="tabular-nums">
            {job.itemsProcessed.toLocaleString()} / {job.itemsTotal.toLocaleString()} records ({pct}%)
          </span>
          <span className="tabular-nums">
            {job.status === "running" ? `ETA ${formatEta(job.etaSeconds)}` : STATUS_LABEL[job.status]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs text-text-secondary">Records updated</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
            {job.stats.recordsUpdated.toLocaleString()}
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs text-text-secondary">Variances found</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-status-medium">
            {job.stats.variancesFound.toLocaleString()}
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs text-text-secondary">Errors</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-status-critical">{job.stats.errors}</p>
        </div>
      </div>

      {job.stats.errors > 0 && (
        <div className="flex items-center justify-between rounded-card border border-status-critical/30 bg-status-critical/10 p-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-status-critical" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {job.stats.errors} batch{job.stats.errors === 1 ? "" : "es"} failed validation
              </p>
              <p className="text-xs text-text-secondary">Skipped rows were logged to the audit trail for review.</p>
            </div>
          </div>
          <button
            onClick={retryFailedBatches}
            disabled={retrying}
            className="flex items-center gap-1.5 rounded-lg border border-status-critical/40 bg-surface px-3 py-1.5 text-xs font-medium text-status-critical hover:bg-status-critical/10 disabled:opacity-60"
          >
            {retrying ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
            {retrying ? "Retrying…" : "Retry now"}
          </button>
        </div>
      )}

      <div className="rounded-card border border-border bg-surface p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Activity log</h3>
        <div className="flex flex-col gap-2.5">
          {job.log.map((entry, i) => {
            const Icon = LEVEL_ICON[entry.level];
            return (
              <div key={`${entry.time}-${i}`} className="flex items-start gap-2.5 text-sm">
                <Icon size={14} className={`mt-0.5 shrink-0 ${LEVEL_COLOR[entry.level]}`} />
                <p className="flex-1 text-text-primary">{entry.message}</p>
                <span className="shrink-0 tabular-nums text-xs text-text-secondary">
                  {new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
