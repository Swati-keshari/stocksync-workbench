// One-off script — recomputes data/reconciliation-items.json so variance %,
// outlier detection, and severity all come from ONE consistent formula
// instead of hand-typed numbers. Run with: node scripts/recompute-fixtures.js
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "reconciliation-items.json");

const UNIT_COST = {
  "BRW-1042": 9, "BRW-2210": 6, "BRW-3305": 7, "BRW-0087": 18,
  "BRW-4421": 22, "BRW-1188": 3, "BRW-5502": 5, "BRW-6613": 14,
  "BRW-7790": 16, "BRW-8801": 4, "BRW-9920": 11, "BRW-1075": 9,
  "BRW-2298": 10, "BRW-3341": 24, "BRW-4459": 8, "BRW-5588": 12,
};

// A couple of the higher-severity items get a human assignee + a manual
// count due date, to reflect that not everything just sits in a queue —
// someone is on the hook for it.
const ASSIGNMENTS = {
  "rec_001": { assignedTo: "Marcus Owusu", manualCountDue: "2026-09-14" },
  "rec_005": { assignedTo: "Priya Nair", manualCountDue: "2026-09-13" },
  "rec_016": { assignedTo: "Marcus Owusu", manualCountDue: "2026-09-14" },
  "rec_009": { assignedTo: "Priya Nair", manualCountDue: "2026-09-15" },
};

function median3(a, b, c) {
  return [a, b, c].sort((x, y) => x - y)[1];
}

// Outlier = whichever source deviates furthest from the median of all
// three — the same logic the isolation-forest model in the spec's ML
// section would approximate; here it's just done deterministically.
function computeVariance(quantities) {
  const { pos, wms, ecom } = quantities;
  const med = median3(pos, wms, ecom);
  const deviations = { pos: Math.abs(pos - med), wms: Math.abs(wms - med), ecom: Math.abs(ecom - med) };
  const outlier = Object.keys(deviations).reduce((a, b) => (deviations[a] >= deviations[b] ? a : b));
  const unitDelta = deviations[outlier];
  const variancePct = Math.round((unitDelta / Math.max(med, 1)) * 1000) / 10;
  return { outlier, unitDelta, variancePct, median: med };
}

// Severity needs BOTH a meaningful percentage AND a meaningful absolute
// unit count — a 2-unit swing on a base of 4 is not the same operational
// problem as a 2-unit swing on a base of 400, even though the % can look
// identical or worse. This is what keeps small-quantity SKUs from
// screaming "critical" over noise.
function classifySeverity(variancePct, unitDelta) {
  if (unitDelta >= 20 || (variancePct >= 30 && unitDelta >= 5)) return "critical";
  if (unitDelta >= 10 || (variancePct >= 15 && unitDelta >= 3)) return "high";
  if (unitDelta >= 4 || (variancePct >= 6 && unitDelta >= 1)) return "medium";
  return "low";
}

function reasonFor(severity, unitDelta, variancePct) {
  if (severity === "low") return "timing_lag";
  if (variancePct >= 20 && unitDelta >= 5) return "possible_shrinkage";
  return "data_entry_error";
}

const items = JSON.parse(fs.readFileSync(FILE, "utf8"));

const updated = items.map((item) => {
  const { outlier, unitDelta, variancePct } = computeVariance(item.quantities);
  const severity = classifySeverity(variancePct, unitDelta);
  const unitCost = UNIT_COST[item.sku] ?? 10;
  const impactValue = Math.round(unitDelta * unitCost * 100) / 100;
  const suggestedReason = reasonFor(severity, unitDelta, variancePct);
  const assignment = ASSIGNMENTS[item.id] ?? { assignedTo: null, manualCountDue: null };

  return {
    ...item,
    outlier,
    unitDelta,
    variancePct,
    severity,
    unitCost,
    impactValue,
    suggestedReason,
    confidence: item.confidence, // left as-authored; a real model would recompute this too
    ...assignment,
  };
});

// Sort by dollar impact descending — the ordering an ops team actually
// wants (biggest exposure first), not just biggest percentage first.
updated.sort((a, b) => b.impactValue - a.impactValue);

fs.writeFileSync(FILE, JSON.stringify(updated, null, 2) + "\n");
console.log(`Recomputed ${updated.length} items.`);
updated.forEach((i) =>
  console.log(
    `${i.sku}\t${i.severity}\t${i.variancePct}%\t+${i.unitDelta}u\t$${i.impactValue}\toutlier=${i.outlier}`
  )
);
