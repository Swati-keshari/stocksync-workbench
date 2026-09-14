"use client";

import { useState } from "react";
import { X, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";
import type { InventorySource } from "@/lib/types";

const FREQUENCY_OPTIONS = [1, 2, 5, 10, 15, 30, 60];

export function SourceConfigModal({ source, onClose }: { source: InventorySource; onClose: () => void }) {
  const pushToast = useUiStore((s) => s.pushToast);
  const [frequency, setFrequency] = useState(source.syncFrequencyMinutes);
  const [revealKey, setRevealKey] = useState(false);
  const [rotating, setRotating] = useState(false);

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      pushToast(`${label} copied to clipboard`, "success");
    } catch {
      // navigator.clipboard can throw/reject in non-secure contexts (plain
      // http), when the permission is denied, or when it's simply
      // unavailable — in every one of those cases nothing was actually
      // copied, so the toast must say that rather than claim success.
      pushToast(`Couldn't copy ${label.toLowerCase()} — copy it manually`, "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-card border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Configure {source.name}</h2>
            <p className="text-xs text-text-secondary">{source.vendor} · {source.kind}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">API key</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary">
                {revealKey ? source.apiKeyMasked.replace(/•/g, "8") : source.apiKeyMasked}
              </code>
              <button
                onClick={() => setRevealKey((v) => !v)}
                aria-label={revealKey ? "Hide key" : "Reveal key"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-alt"
              >
                {revealKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button
                onClick={() => copyToClipboard(source.apiKeyMasked.replace(/•/g, "8"), "API key")}
                aria-label="Copy key"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-alt"
              >
                <Copy size={15} />
              </button>
            </div>
            <button
              onClick={() => {
                setRotating(true);
                setTimeout(() => {
                  setRotating(false);
                  pushToast(`Rotated API key for ${source.name} — update it wherever it's used`, "info");
                }, 900);
              }}
              disabled={rotating}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-60"
            >
              <RefreshCw size={12} className={rotating ? "animate-spin" : ""} />
              {rotating ? "Rotating…" : "Rotate key"}
            </button>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Webhook URL</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary">
                {source.webhookUrl}
              </code>
              <button
                onClick={() => copyToClipboard(source.webhookUrl, "Webhook URL")}
                aria-label="Copy webhook URL"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-surface-alt"
              >
                <Copy size={15} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Sync frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary focus:border-primary"
              >
                {FREQUENCY_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    Every {m} min
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-secondary">Rate limit</label>
              <p className="rounded-lg border border-border bg-bg px-3 py-2 text-sm tabular-nums text-text-secondary">
                {source.rateLimitPerMinute} req/min
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Granted scopes</label>
            <div className="flex flex-wrap gap-1.5">
              {source.scopes.map((scope) => (
                <span key={scope} className="rounded-pill bg-surface-alt px-2.5 py-1 text-xs text-text-secondary">
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button onClick={onClose} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-alt">
            Close
          </button>
          <button
            onClick={() => {
              pushToast(`Sync frequency for ${source.name} set to every ${frequency} min`, "success");
              onClose();
            }}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
