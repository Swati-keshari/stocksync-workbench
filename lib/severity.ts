import type { Severity, SourceId, Reason } from "./types";

/**
 * Single source of truth for "what counts as an outlier and how bad is it."
 * Both data/reconciliation-items.json (via scripts/recompute-fixtures.js)
 * and useReconciliationSocket's simulated live updates run through this —
 * so a number on screen means the same thing whether it came from the
 * initial fixture or from a simulated sync tick five minutes later.
 */

function median3(a: number, b: number, c: number) {
  return [a, b, c].sort((x, y) => x - y)[1];
}

export interface VarianceResult {
  outlier: SourceId;
  unitDelta: number;
  variancePct: number;
  median: number;
}

// Outlier = whichever source deviates furthest from the median of all
// three quantities — a deterministic stand-in for the isolation-forest
// anomaly detector described in the project's ML section.
export function computeVariance(quantities: Record<SourceId, number>): VarianceResult {
  const { pos, wms, ecom } = quantities;
  const med = median3(pos, wms, ecom);
  const deviations: Record<SourceId, number> = {
    pos: Math.abs(pos - med),
    wms: Math.abs(wms - med),
    ecom: Math.abs(ecom - med),
  };
  const outlier = (Object.keys(deviations) as SourceId[]).reduce((a, b) =>
    deviations[a] >= deviations[b] ? a : b
  );
  const unitDelta = deviations[outlier];
  const variancePct = Math.round((unitDelta / Math.max(med, 1)) * 1000) / 10;
  return { outlier, unitDelta, variancePct, median: med };
}

// Severity needs BOTH a meaningful percentage AND a meaningful absolute
// unit count. A 2-unit swing on a base of 4 units is noise; a 2-unit swing
// on a base of 400 units might genuinely be shrinkage. This keeps
// low-volume SKUs from screaming "critical" purely because percentages
// are unstable at small numbers.
export function classifySeverity(variancePct: number, unitDelta: number): Severity {
  if (unitDelta >= 20 || (variancePct >= 30 && unitDelta >= 5)) return "critical";
  if (unitDelta >= 10 || (variancePct >= 15 && unitDelta >= 3)) return "high";
  if (unitDelta >= 4 || (variancePct >= 6 && unitDelta >= 1)) return "medium";
  return "low";
}

export function suggestReason(severity: Severity, unitDelta: number, variancePct: number): Reason {
  if (severity === "low") return "timing_lag";
  if (variancePct >= 20 && unitDelta >= 5) return "possible_shrinkage";
  return "data_entry_error";
}
