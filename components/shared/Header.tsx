"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronDown, LayoutDashboard, ListChecks, History, Cable, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";
import { api } from "@/lib/api";

const NAV_LINKS = [
  { href: "/workbench", label: "Workbench", icon: LayoutDashboard },
  { href: "/reconciliation", label: "Mismatches", icon: ListChecks },
  { href: "/backfill", label: "Catch up", icon: RefreshCw },
  { href: "/sources", label: "Notebooks", icon: Cable },
  { href: "/reports", label: "Reports", icon: History },
];

export function Header() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
    staleTime: 30_000,
  });
  const unread = notifications?.filter((n) => !n.read).length ?? 0;

  // onMouseLeave alone never fires on touch devices — without this, the
  // dropdown would stay stuck open on mobile with no way to dismiss it
  // except tapping one of its own links.
  useEffect(() => {
    if (!profileOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-primary text-white text-sm">
            S
          </span>
          <span className="hidden sm:inline">StockSync</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/workbench" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-alt text-primary"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/notifications"
            aria-label="Notifications"
            className={clsx(
              "relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:text-text-primary hover:bg-surface-alt",
              pathname === "/notifications" && "text-primary"
            )}
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-status-critical px-1 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </Link>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface py-1 pl-1 pr-2 hover:bg-surface-alt"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                SK
              </span>
              <ChevronDown size={14} className="text-text-secondary" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 w-44 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-surface-alt" onClick={() => setProfileOpen(false)}>
                  Profile
                </Link>
                <Link href="/help" className="block px-3 py-2 text-sm hover:bg-surface-alt" onClick={() => setProfileOpen(false)}>
                  Help
                </Link>
                <Link href="/" className="block px-3 py-2 text-sm hover:bg-surface-alt" onClick={() => setProfileOpen(false)}>
                  Public site
                </Link>
                <div className="my-1 border-t border-border" />
                <Link href="/login" className="block px-3 py-2 text-sm text-status-critical hover:bg-surface-alt" onClick={() => setProfileOpen(false)}>
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/workbench" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                active ? "bg-surface-alt text-primary" : "text-text-secondary"
              )}
            >
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
