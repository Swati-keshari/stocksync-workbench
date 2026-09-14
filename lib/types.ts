export type Severity = "low" | "medium" | "high" | "critical";
export type Reason = "timing_lag" | "data_entry_error" | "possible_shrinkage";
export type SourceId = "pos" | "wms" | "ecom";

export interface ReconciliationItem {
  id: string;
  sku: string;
  product: string;
  location: string;
  quantities: Record<SourceId, number>;
  outlier: SourceId;
  unitDelta: number;
  variancePct: number;
  severity: Severity;
  suggestedReason: Reason;
  confidence: number;
  lastSeen: string;
  status: "pending" | "resolved";
  notes?: string;
  /** Cost per unit (COGS, not retail) — used to size $ exposure, the metric
   *  ops teams actually prioritize by, not raw percentage. */
  unitCost: number;
  /** unitDelta * unitCost, rounded to cents. */
  impactValue: number;
  assignedTo: string | null;
  manualCountDue: string | null;
}

export interface InventorySource {
  id: SourceId;
  name: string;
  vendor: string;
  kind: string;
  status: "connected" | "degraded" | "offline";
  lastSync: string;
  latencyMs: number;
  recordsSynced: number;
  connected: boolean;
  apiKeyMasked: string;
  webhookUrl: string;
  syncFrequencyMinutes: number;
  rateLimitPerMinute: number;
  scopes: string[];
}

export interface SyncHealth {
  dataQualityScore: number;
  dataQualityTrend: number;
  pendingItems: { total: number; critical: number; high: number; medium: number; low: number };
  activity: { labels: string[]; series: { name: string; data: number[] }[] };
  latencySeconds: number;
}

export interface BackfillJob {
  jobId: string;
  status: "running" | "paused" | "complete" | "failed" | "cancelled";
  source: SourceId;
  dateRange: { from: string; to: string };
  itemsTotal: number;
  itemsProcessed: number;
  startedAt: string;
  etaSeconds: number;
  stats: { recordsUpdated: number; variancesFound: number; errors: number };
  log: { time: string; level: "info" | "warning" | "error"; message: string }[];
}

export interface Notification {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  /** Links this notification to a specific reconciliation item, if any —
   *  clicking it opens that item's drawer instead of just marking it read. */
  itemId?: string;
}

export interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  action: string;
  sku: string;
  detail: string;
  outcome: "resolved" | "pending" | "flagged";
}

export const REASON_LABEL: Record<Reason, string> = {
  timing_lag: "Timing lag",
  data_entry_error: "Data entry error",
  possible_shrinkage: "Possible shrinkage",
};

export const SOURCE_LABEL: Record<SourceId, string> = {
  pos: "Shop till",
  wms: "Storeroom",
  ecom: "Website",
};

export const SOURCE_STORY: Record<SourceId, { name: string; meaning: string }> = {
  pos: { name: "Shop till", meaning: "The cash counter notebook. Each sale ticks one off." },
  wms: { name: "Storeroom", meaning: "The back-room notebook. Staff write how many boxes they see." },
  ecom: { name: "Website", meaning: "The online notebook. It shows how many a customer can buy." },
};
