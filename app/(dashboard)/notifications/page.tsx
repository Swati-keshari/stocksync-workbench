"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/lib/types";

const TYPE_ICON = { critical: AlertCircle, warning: AlertTriangle, success: CheckCircle2, info: Info };
const TYPE_COLOR: Record<string, string> = {
  critical: "text-status-critical",
  warning: "text-status-medium",
  success: "text-status-low",
  info: "text-primary",
};

type Filter = "all" | "unread" | Notification["type"];

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");

  const notifications = data ?? [];
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  function markAllRead() {
    queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
      (old ?? []).map((n) => ({ ...n, read: true }))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-text-secondary">Every sync, variance, and resolution event in one feed.</p>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-alt"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "unread", "critical", "warning", "success", "info"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "rounded-pill border px-3 py-1.5 text-xs font-medium capitalize",
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface text-text-secondary hover:bg-surface-alt"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-card border border-border bg-surface" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border py-16 text-center">
            <p className="text-sm font-medium text-text-primary">No notifications here</p>
            <p className="text-xs text-text-secondary">You're caught up for this filter.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = TYPE_ICON[n.type];
            const content = (
              <>
                <Icon size={17} className={clsx("mt-0.5 shrink-0", TYPE_COLOR[n.type])} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{n.title}</p>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-sm text-text-secondary">{n.message}</p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                  {new Date(n.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {n.itemId && <ChevronRight size={15} className="shrink-0 text-text-secondary" />}
              </>
            );
            const rowClass = clsx(
              "flex items-start gap-3 rounded-card border border-border p-4",
              n.read ? "bg-surface" : "bg-surface-alt",
              n.itemId && "transition-colors hover:border-primary/40"
            );
            return n.itemId ? (
              <Link key={n.id} href={`/reconciliation?open=${n.itemId}`} className={rowClass}>
                {content}
              </Link>
            ) : (
              <div key={n.id} className={rowClass}>
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
