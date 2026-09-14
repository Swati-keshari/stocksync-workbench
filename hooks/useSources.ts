"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: api.getSources,
    staleTime: 15_000,
  });
}
