import fixtures from "@/data/reconciliation-items.json";
import type { ReconciliationItem } from "@/lib/types";

/**
 * A real (if tiny and in-memory) mutable store for the mock backend.
 *
 * Without this, resolving an item only ever removed it from the client's
 * TanStack Query cache — the GET route kept re-reading the static JSON
 * fixture unmodified. The very next cache invalidation (which
 * useOptimisticResolve's onSettled always triggers, success or failure)
 * would refetch that same untouched fixture and silently bring the
 * "resolved" row back. Routes now read/write through here instead, so a
 * refetch reflects what was actually done.
 *
 * Caveats, since this is a mock and not a real database: state lives in
 * this Node module's memory, so it resets on every server restart, and it
 * would NOT behave correctly if this route were ever deployed across
 * multiple serverless instances (each would have its own copy). Fine for
 * local dev / a single long-running process; not a substitute for a real
 * backend.
 */
let items: ReconciliationItem[] = JSON.parse(JSON.stringify(fixtures));

export function listItems(): ReconciliationItem[] {
  return items;
}

export function resolveItems(ids: string[]): { resolved: string[]; missing: string[] } {
  const idSet = new Set(ids);
  const resolved: string[] = [];
  const missing: string[] = [];
  for (const id of ids) {
    if (items.some((i) => i.id === id)) resolved.push(id);
    else missing.push(id);
  }
  items = items.filter((i) => !idSet.has(i.id));
  return { resolved, missing };
}

export function resetItems() {
  items = JSON.parse(JSON.stringify(fixtures));
}
