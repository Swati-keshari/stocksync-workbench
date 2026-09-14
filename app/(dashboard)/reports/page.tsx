"use client";

import { useSyncHealth } from "@/hooks/useSyncHealth";
import { SyncActivityChart } from "@/components/dashboard/SyncActivityChart";
import { ShelfBars, TallyNudge } from "@/components/artifacts/Motion";

export default function ReportsPage() {
  const { data: health, isLoading } = useSyncHealth();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Same fake numbers as the workbench, drawn again so a manager page has a home.
        </p>
      </div>
      <TallyNudge />
      <ShelfBars />
      <div className="rounded-card border border-border bg-surface p-4">
        {isLoading || !health ? (
          <div className="h-64 animate-pulse rounded bg-surface-alt" />
        ) : (
          <SyncActivityChart activity={health.activity} />
        )}
      </div>
    </div>
  );
}
