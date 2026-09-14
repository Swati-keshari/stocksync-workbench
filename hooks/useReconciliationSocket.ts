"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUiStore } from "@/stores/useUiStore";
import { computeVariance, classifySeverity, suggestReason } from "@/lib/severity";
import type { ReconciliationItem, SourceId } from "@/lib/types";

/**
 * Stands in for the real WebSocket subscription described in the spec.
 * There is no socket server in this build — every "event" here is a
 * setInterval tick that writes straight into the TanStack Query cache via
 * queryClient.setQueryData, exactly as the real handler would on message
 * receipt. The rest of the app never knows the difference: it only ever
 * reads from ['reconciliation-items'] in the Query cache.
 *
 * The walk is bounded and mean-reverting (±20% of each item's *first
 * observed* quantity this session, nudged back toward that baseline more
 * often than away from it) so a long-running tab settles into plausible
 * drift instead of a percentage random-walking off into the hundreds.
 * Every quantity change is recomputed through lib/severity.ts, so
 * variance/severity/outlier never fall out of sync with the number
 * actually on screen.
 */
export function useReconciliationSocket() {
  const queryClient = useQueryClient();
  const setConnectionStatus = useUiStore((s) => s.setConnectionStatus);
  const tick = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Populated lazily, per item, the first time that item is touched by a
  // tick below — NOT eagerly at mount. An eager mount-time read of
  // queryClient.getQueryData(['reconciliation-items']) would almost always
  // return undefined, since the query hasn't resolved yet on a fresh page
  // load (fetches are async, even to a local mock route) — which silently
  // defeated mean-reversion entirely: with no baseline, `current - base`
  // was always 0, so the revert-bias branch never fired.
  const baseline = useRef<Record<string, Record<SourceId, number>>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      tick.current += 1;

      // Every ~9th tick, simulate a brief reconnect (mirrors the top-bar
      // "Reconnecting…" state called for in the spec's performance section).
      if (tick.current % 9 === 0) {
        setConnectionStatus("reconnecting");
        reconnectTimeout.current = setTimeout(() => setConnectionStatus("connected"), 1800);
        return;
      }

      queryClient.setQueryData<ReconciliationItem[]>(["reconciliation-items"], (old) => {
        if (!old || old.length === 0) return old;
        const pending = old.filter((i) => i.status === "pending");
        if (pending.length === 0) return old;

        const target = pending[Math.floor(Math.random() * pending.length)];

        // First time this item is touched this session, lock in its
        // current quantities as the reversion baseline.
        if (!baseline.current[target.id]) {
          baseline.current[target.id] = { ...target.quantities };
        }
        const base = baseline.current[target.id];

        // Nudge one non-POS source by ±1–2 units, biased back toward its
        // original value once it's drifted more than 20% away from it.
        const movable: SourceId[] = ["wms", "ecom"];
        const src = movable[Math.floor(Math.random() * movable.length)];
        const current = target.quantities[src];
        const driftedFromBase = current - base[src];
        const revertThreshold = Math.max(base[src] * 0.2, 1);
        const revertBias = Math.abs(driftedFromBase) > revertThreshold ? -Math.sign(driftedFromBase) : 0;
        const step = revertBias !== 0 ? revertBias : Math.random() < 0.5 ? -1 : 1;
        const newQty = Math.max(0, current + step * (Math.random() < 0.7 ? 1 : 2));

        const newQuantities = { ...target.quantities, [src]: newQty };
        const { outlier, unitDelta, variancePct } = computeVariance(newQuantities);
        const severity = classifySeverity(variancePct, unitDelta);
        const suggestedReason = suggestReason(severity, unitDelta, variancePct);
        const impactValue = Math.round(unitDelta * target.unitCost * 100) / 100;

        return old.map((item) =>
          item.id === target.id
            ? {
                ...item,
                quantities: newQuantities,
                outlier,
                unitDelta,
                variancePct,
                severity,
                suggestedReason,
                impactValue,
                lastSeen: new Date().toISOString(),
              }
            : item
        );
      });
    }, 7000);

    return () => {
      clearInterval(interval);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [queryClient, setConnectionStatus]);
}
