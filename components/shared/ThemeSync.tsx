"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/useUiStore";

/**
 * The theme store defaults to "dark" at the JS level (Zustand's initial
 * state can't know localStorage at module-load time). The inline script in
 * the root layout already sets the *real* `data-theme` attribute on <html>
 * before first paint — this component's only job is to read that back into
 * the store once, so anything driven by the JS theme value (chart colors,
 * the AG Grid dark-theme class) agrees with what's actually on screen.
 *
 * This is mounted once in the root layout, not inside ThemeToggle — it
 * needs to run on every page regardless of whether that page happens to
 * render a theme toggle button.
 */
export function ThemeSync() {
  const setTheme = useUiStore((s) => s.setTheme);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, [setTheme]);

  return null;
}
