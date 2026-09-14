"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useReconciliationItems() {
  return useQuery({
    queryKey: ["reconciliation-items"],
    queryFn: api.getReconciliationItems,
    staleTime: 10_000,
  });
}
