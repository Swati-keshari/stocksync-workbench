"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
    staleTime: 30_000,
  });
}
