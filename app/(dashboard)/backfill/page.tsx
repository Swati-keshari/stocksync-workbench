"use client";

import { useBackfill } from "@/hooks/useBackfill";
import { useBackfillSocket } from "@/hooks/useBackfillSocket";
import { ProgressTracker } from "@/components/backfill/ProgressTracker";

export default function BackfillPage() {
  const { data: job, isLoading } = useBackfill();
  useBackfillSocket();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-3xl text-text-primary">Catch up old days</h1>
        <p className="mt-1 max-w-2xl text-sm text-text-secondary">
          If a notebook was late yesterday, this replay copies those old sales so the three lists can meet again.
        </p>
      </div>

      {isLoading || !job ? (
        <div className="h-96 w-full animate-pulse rounded-card border border-border bg-surface" />
      ) : (
        <ProgressTracker job={job} />
      )}
    </div>
  );
}
