"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { BackfillJob } from "@/lib/types";

const LOG_MESSAGES = [
  "Processed batch",
  "Validated batch",
  "Reconciled batch",
];

/**
 * Stands in for a real backend job worker. Without this, the Backfill page
 * showed a progress bar frozen at whatever percentage the fixture data
 * happened to say — obviously fake the moment anyone watched it for more
 * than a few seconds. This nudges itemsProcessed forward periodically,
 * keeps stats and the activity log roughly in step with it, and stops
 * cleanly at 100% instead of overshooting itemsTotal.
 *
 * Respects `status`: only advances while "running" — paused, cancelled,
 * complete, and failed jobs are left alone.
 */
export function useBackfillSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.setQueryData<BackfillJob>(["backfill"], (old) => {
        if (!old || old.status !== "running") return old;

        const remaining = old.itemsTotal - old.itemsProcessed;
        if (remaining <= 0) return { ...old, status: "complete", itemsProcessed: old.itemsTotal, etaSeconds: 0 };

        const chunk = Math.min(remaining, Math.round(150 + Math.random() * 250));
        const itemsProcessed = old.itemsProcessed + chunk;
        const justFinished = itemsProcessed >= old.itemsTotal;
        const secondsPerItem = old.etaSeconds > 0 ? old.etaSeconds / Math.max(remaining, 1) : 0.02;
        const etaSeconds = justFinished ? 0 : Math.max(0, Math.round((old.itemsTotal - itemsProcessed) * secondsPerItem));

        // Most new records update cleanly; a small fraction surface a
        // variance, an even smaller fraction fail validation — roughly
        // matching the ratios already implied by the fixture's totals.
        const recordsUpdated = old.stats.recordsUpdated + Math.round(chunk * 0.97);
        const newVariances = Math.random() < 0.6 ? Math.round(Math.random() * 3) : 0;
        const newErrors = Math.random() < 0.08 ? 1 : 0;

        const log = [...old.log];
        if (Math.random() < 0.7) {
          const label = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
          const batchNum = Math.round((itemsProcessed / old.itemsTotal) * 840);
          log.unshift({
            time: new Date().toISOString(),
            level: newErrors > 0 ? "error" : "info",
            message:
              newErrors > 0
                ? `Batch ${batchNum} failed validation — rows skipped, logged to audit`
                : `${label} ${batchNum}/840`,
          });
        }
        if (justFinished) {
          log.unshift({ time: new Date().toISOString(), level: "info", message: "Backfill completed successfully" });
        }

        return {
          ...old,
          itemsProcessed,
          etaSeconds,
          status: justFinished ? "complete" : "running",
          stats: {
            recordsUpdated,
            variancesFound: old.stats.variancesFound + newVariances,
            errors: old.stats.errors + newErrors,
          },
          log: log.slice(0, 12),
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [queryClient]);
}
