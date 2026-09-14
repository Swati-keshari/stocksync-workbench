"use client";

import { useReconciliationSocket } from "@/hooks/useReconciliationSocket";

/** Invisible — just keeps the simulated live-update subscription mounted
 *  for as long as the dashboard shell is on screen. */
export function LiveSync() {
  useReconciliationSocket();
  return null;
}
