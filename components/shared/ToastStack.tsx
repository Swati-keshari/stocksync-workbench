"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import clsx from "clsx";
import { useUiStore } from "@/stores/useUiStore";

const ICON = { success: CheckCircle2, error: XCircle, info: Info };
const COLOR: Record<string, string> = {
  success: "var(--status-low)",
  error: "var(--status-critical)",
  info: "var(--primary)",
};

export function ToastStack() {
  const toasts = useUiStore((s) => s.toasts);
  const dismissToast = useUiStore((s) => s.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICON[t.tone];
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 shadow-lg animate-toast-in"
          >
            <Icon size={17} style={{ color: COLOR[t.tone] }} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm text-text-primary">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="shrink-0 text-text-secondary hover:text-text-primary"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
