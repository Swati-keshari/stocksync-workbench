import clsx from "clsx";
import type { Severity } from "@/lib/types";

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: "Small",
  medium: "Okay",
  high: "Big",
  critical: "Urgent",
};

const SEVERITY_CLASSES: Record<Severity, string> = {
  low: "text-status-low bg-status-low/15",
  medium: "text-status-medium bg-status-medium/15",
  high: "text-status-high bg-status-high/15",
  critical: "text-status-critical bg-status-critical/15",
};

const SEVERITY_DOT: Record<Severity, string> = {
  low: "bg-status-low",
  medium: "bg-status-medium",
  high: "bg-status-high",
  critical: "bg-status-critical",
};

export function SeverityPill({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium",
        SEVERITY_CLASSES[severity],
        className
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", SEVERITY_DOT[severity])} />
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

type ConnState = "connected" | "degraded" | "offline";

const CONN_LABEL: Record<ConnState, string> = {
  connected: "Working",
  degraded: "Slow",
  offline: "Off",
};

const CONN_CLASSES: Record<ConnState, string> = {
  connected: "text-status-low bg-status-low/15",
  degraded: "text-status-medium bg-status-medium/15",
  offline: "text-status-critical bg-status-critical/15",
};

const CONN_DOT: Record<ConnState, string> = {
  connected: "bg-status-low",
  degraded: "bg-status-medium",
  offline: "bg-status-critical",
};

export function ConnectionPill({ status }: { status: ConnState }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium",
        CONN_CLASSES[status]
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", CONN_DOT[status])} />
      {CONN_LABEL[status]}
    </span>
  );
}
