"use client";

import { Sun, Moon } from "lucide-react";
import { useUiStore } from "@/stores/useUiStore";

// Theme-store correction on mount is handled once, app-wide, by
// <ThemeSync /> in the root layout — not here — so this button doesn't
// need to own that responsibility itself and works correctly even if it's
// the very first theme-aware component to mount on a given page.
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("stocksync-theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:text-text-primary hover:bg-surface-alt"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
