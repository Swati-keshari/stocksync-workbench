"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useAuditLog() {
  return useQuery({
    queryKey: ["audit-log"],
    queryFn: api.getAuditLog,
    staleTime: 30_000,
  });
}
