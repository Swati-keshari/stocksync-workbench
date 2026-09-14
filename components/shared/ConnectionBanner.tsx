"use client";

import { Loader2 } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";

export function ConnectionBanner() {
  const status = useUiStore((s) => s.connectionStatus);
  if (status !== "reconnecting") return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-status-medium/15 px-4 py-1.5 text-xs font-medium text-status-medium">
      <Loader2 size={13} className="animate-spin" />
      Reconnecting to live sync…
    </div>
  );
}
