"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useBackfill() {
  return useQuery({
    queryKey: ["backfill"],
    queryFn: api.getBackfill,
    // Progress is simulated entirely client-side after the initial load
    // (see useBackfillSocket) — the mock API route has no server-side
    // notion of time passing, so a background refetch would silently
    // rewind the progress bar back to the fixture's static starting point.
    // staleTime: Infinity + refetchOnMount: false makes the first fetch
    // authoritative for the rest of the session.
    staleTime: Infinity,
    refetchOnMount: false,
  });
}
