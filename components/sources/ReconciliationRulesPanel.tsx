"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";

export function ReconciliationRulesPanel() {
  const rules = useUiStore((s) => s.reconciliationRules);
  const setRules = useUiStore((s) => s.setReconciliationRules);
  const pushToast = useUiStore((s) => s.pushToast);
  const [draft, setDraft] = useState(rules);

  const dirty = draft.autoResolveThresholdPct !== rules.autoResolveThresholdPct || draft.criticalThresholdUnits !== rules.criticalThresholdUnits;

  return (
    <div className="rounded-card border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-text-secondary" />
        <h3 className="text-sm font-semibold text-text-primary">When is a fight too small to care?</h3>
      </div>
      <p className="mb-4 text-xs text-text-secondary">
        Move the sliders. New copies use the new rules. Rows already in Mismatches keep their old size.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">
            Ignore tiny gaps — if the lists differ by less than this percent, clear it next time
          </span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={draft.autoResolveThresholdPct}
              onChange={(e) => setDraft((d) => ({ ...d, autoResolveThresholdPct: Number(e.target.value) }))}
              className="flex-1 accent-primary"
            />
            <span className="w-12 shrink-0 text-right tabular-nums text-text-primary">
              {draft.autoResolveThresholdPct}%
            </span>
          </div>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-secondary">
            Call it urgent — if this many packets are missing, mark it urgent even if the percent looks small
          </span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={draft.criticalThresholdUnits}
              onChange={(e) => setDraft((d) => ({ ...d, criticalThresholdUnits: Number(e.target.value) }))}
              className="flex-1 accent-primary"
            />
            <span className="w-12 shrink-0 text-right tabular-nums text-text-primary">
              {draft.criticalThresholdUnits} pkts
            </span>
          </div>
        </label>
      </div>

      {dirty && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setDraft(rules)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-alt"
          >
            Reset
          </button>
          <button
            onClick={() => {
              setRules(draft);
              pushToast("Rules saved for the next copy", "success");
            }}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
