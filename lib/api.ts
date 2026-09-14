import type {
  ReconciliationItem,
  InventorySource,
  SyncHealth,
  BackfillJob,
  Notification,
  AuditEntry,
} from "./types";

// All of these hit local Next.js API routes under app/api/**, which read
// from the JSON fixtures in /data and simulate light server-side jitter.
// There is no real database and no real WebSocket server — see the
// "frontend-intern pivot" note in the project spec. useReconciliationSocket
// layers simulated live updates on top of these by writing straight into
// the TanStack Query cache.

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return res.json() as Promise<T>;
}

async function postResolve(ids: string[]): Promise<{ resolved: string[] }> {
  const res = await fetch("/api/reconciliation-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Request failed");
  }
  return res.json();
}

export const api = {
  getReconciliationItems: () => getJSON<ReconciliationItem[]>("/api/reconciliation-items"),
  getSyncHealth: () => getJSON<SyncHealth>("/api/sync-health"),
  getSources: () => getJSON<InventorySource[]>("/api/sources"),
  getBackfill: () => getJSON<BackfillJob>("/api/backfill"),
  getNotifications: () => getJSON<Notification[]>("/api/notifications"),
  getAuditLog: () => getJSON<AuditEntry[]>("/api/audit-log"),

  // Actually resolves server-side (see app/api/_store.ts) — a subsequent
  // refetch will correctly reflect this instead of reverting to the
  // static fixture. The route itself injects the ~10% failure rate and
  // latency that exercise useOptimisticResolve's rollback + retry path.
  resolveItem: async (id: string): Promise<{ id: string }> => {
    await postResolve([id]);
    return { id };
  },

  // Same endpoint, batched — used by the bulk-action flow so bulk resolves
  // survive a refetch the same way single resolves do.
  resolveItems: async (ids: string[]): Promise<{ resolved: string[] }> => postResolve(ids),
};
