"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";
import { useAuditLog } from "@/hooks/useAuditLog";
import type { AuditEntry } from "@/lib/types";

const OUTCOME_CLASSES: Record<AuditEntry["outcome"], string> = {
  resolved: "text-status-low bg-status-low/15",
  pending: "text-status-medium bg-status-medium/15",
  flagged: "text-status-critical bg-status-critical/15",
};

export default function AuditLogPage() {
  const { data, isLoading } = useAuditLog();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((e) => `${e.actor} ${e.action} ${e.sku} ${e.detail}`.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Audit log</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Full history of resolves, accepts, and manual counts across the workbench.
        </p>
      </div>

      <div className="relative w-72">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actor, SKU, or action…"
          className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary"
        />
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt text-xs text-text-secondary">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium">Time</th>
              <th className="px-4 py-2.5 text-left font-medium">Actor</th>
              <th className="px-4 py-2.5 text-left font-medium">Action</th>
              <th className="px-4 py-2.5 text-left font-medium">SKU</th>
              <th className="px-4 py-2.5 text-left font-medium">Detail</th>
              <th className="px-4 py-2.5 text-left font-medium">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-secondary">
                  No matching audit entries.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-text-secondary">
                    {new Date(e.time).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-text-primary">{e.actor}</td>
                  <td className="whitespace-nowrap px-4 py-3 capitalize text-text-primary">
                    {e.action.replace(/_/g, " ")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-text-primary">{e.sku}</td>
                  <td className="px-4 py-3 text-text-secondary">{e.detail}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={clsx("rounded-pill px-2 py-1 text-xs font-medium capitalize", OUTCOME_CLASSES[e.outcome])}>
                      {e.outcome}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
