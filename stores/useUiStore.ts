import { create } from "zustand";
import type { Severity } from "@/lib/types";

interface UiState {
  // Reconciliation table selection + drawer
  selectedIds: string[];
  drawerItemId: string | null;
  bulkModalOpen: boolean;

  // Filters (applied client-side to the grid)
  severityFilter: Severity[];
  searchQuery: string;

  // Theme (also mirrored to <html data-theme> + localStorage — see ThemeToggle)
  theme: "light" | "dark";

  // Simulated WebSocket connection state — see useReconciliationSocket
  connectionStatus: "connected" | "reconnecting";
  setConnectionStatus: (s: "connected" | "reconnecting") => void;

  // Lightweight global toasts (bulk progress, mutation errors, etc.)
  toasts: { id: string; message: string; tone: "success" | "error" | "info" }[];
  pushToast: (message: string, tone?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;

  // Reconciliation policy — configurable on /sources, applied to future
  // syncs only (this session doesn't retroactively reclassify open items).
  reconciliationRules: { autoResolveThresholdPct: number; criticalThresholdUnits: number };
  setReconciliationRules: (rules: { autoResolveThresholdPct: number; criticalThresholdUnits: number }) => void;

  setSelectedIds: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  openBulkModal: () => void;
  closeBulkModal: () => void;
  setSeverityFilter: (severities: Severity[]) => void;
  setSearchQuery: (q: string) => void;
  setTheme: (t: "light" | "dark") => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  selectedIds: [],
  drawerItemId: null,
  bulkModalOpen: false,
  severityFilter: [],
  searchQuery: "",
  theme: "dark",
  connectionStatus: "connected",
  toasts: [],
  reconciliationRules: { autoResolveThresholdPct: 2, criticalThresholdUnits: 20 },

  setConnectionStatus: (s) => set({ connectionStatus: s }),
  setReconciliationRules: (rules) => set({ reconciliationRules: rules }),
  pushToast: (message, tone = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set({ toasts: [...get().toasts, { id, message, tone }] });
    setTimeout(() => get().dismissToast(id), 4500);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelected: (id) => {
    const current = get().selectedIds;
    set({
      selectedIds: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  },
  clearSelection: () => set({ selectedIds: [] }),
  openDrawer: (id) => set({ drawerItemId: id }),
  closeDrawer: () => set({ drawerItemId: null }),
  openBulkModal: () => set({ bulkModalOpen: true }),
  closeBulkModal: () => set({ bulkModalOpen: false }),
  setSeverityFilter: (severities) => set({ severityFilter: severities }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setTheme: (t) => set({ theme: t }),
}));
