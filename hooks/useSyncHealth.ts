"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSyncHealth() {
  return useQuery({
    queryKey: ["sync-health"],
    queryFn: api.getSyncHealth,
    staleTime: 15_000,
  });
}
