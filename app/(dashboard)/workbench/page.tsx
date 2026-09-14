"use client";

import { useSources } from "@/hooks/useSources";
import { useSyncHealth } from "@/hooks/useSyncHealth";
import { useReconciliationItems } from "@/hooks/useReconciliationItems";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { SyncActivityChart } from "@/components/dashboard/SyncActivityChart";
import { PendingSummary } from "@/components/dashboard/PendingSummary";
import { ExposureCard } from "@/components/dashboard/ExposureCard";
import { HealthBar } from "@/components/shared/HealthBar";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LiveTicker } from "@/components/artifacts/Motion";
import Link from "next/link";

export default function WorkbenchPage() {
  const { data: sources, isLoading: sourcesLoading } = useSources();
  const { data: health, isLoading: healthLoading } = useSyncHealth();
  const { data: items } = useReconciliationItems();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <LiveTicker />
        <h1 className="mt-2 font-display text-3xl text-text-primary">Workbench</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          Read this like a scoreboard. Three notebooks (shop, warehouse, website) send counts. If they disagree, the
          mismatch list grows. Open{" "}
          <Link href="/learn" className="text-primary hover:underline">
            Learn
          </Link>{" "}
          if a word looks hard.
        </p>
      </div>

      <section className="rounded-card border border-border bg-surface p-4">
        <h2 className="font-display text-xl">What you are looking at</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-text-secondary">
          <li>Cards below = each notebook and whether it is “online” in the demo.</li>
          <li>Score = how clean the lists look (100 is tidy).</li>
          <li>Chart = pretend traffic of rows copied vs fights found.</li>
          <li>
            Next stop:{" "}
            <Link href="/reconciliation" className="text-primary hover:underline">
              Mismatches
            </Link>{" "}
            to pick a winner for each fight.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-text-secondary">The three notebooks</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sourcesLoading || !sources
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[124px] animate-pulse rounded-card border border-border bg-surface" />
              ))
            : sources.map((s) => <StatusCard key={s.id} source={s} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4 lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">How tidy are the lists?</h3>
            {health && (
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  health.dataQualityTrend >= 0 ? "text-status-low" : "text-status-critical"
                }`}
              >
                {health.dataQualityTrend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {Math.abs(health.dataQualityTrend)}%
              </span>
            )}
          </div>
          {healthLoading || !health ? (
            <div className="h-10 animate-pulse rounded bg-surface-alt" />
          ) : (
            <>
              <p className="mb-3 font-display text-3xl tabular-nums text-text-primary">
                {health.dataQualityScore}
                <span className="text-base font-normal text-text-secondary"> / 100</span>
              </p>
              <HealthBar score={health.dataQualityScore} />
              <p className="mt-3 text-xs text-text-secondary">
                Wait time to copy a row:{" "}
                <span className="tabular-nums text-text-primary">{health.latencySeconds}s</span>
              </p>
            </>
          )}
        </div>

        <div className="rounded-card border border-border bg-surface p-4 lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-text-primary">Rows copied vs fights found</h3>
          <p className="mb-2 text-xs text-text-secondary">Last 7 pretend hours</p>
          {healthLoading || !health ? (
            <div className="h-64 animate-pulse rounded bg-surface-alt" />
          ) : (
            <SyncActivityChart activity={health.activity} />
          )}
        </div>
      </section>

      <section>{health && <PendingSummary pending={health.pendingItems} />}</section>

      {items && items.length > 0 && (
        <section>
          <ExposureCard items={items} />
        </section>
      )}
    </div>
  );
}
