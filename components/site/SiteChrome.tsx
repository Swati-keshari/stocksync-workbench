"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/learn", label: "Learn" },
  { href: "/pricing", label: "Pricing" },
  { href: "/workbench", label: "Workbench" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded-[4px] px-3 py-2 text-sm",
                pathname === l.href ? "bg-surface-alt text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-[4px] bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Start demo
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    {
      title: "Product",
      links: [
        ["/product", "Product"],
        ["/how-it-works", "How it works"],
        ["/integrations", "Integrations"],
        ["/security", "Security"],
        ["/pricing", "Pricing"],
        ["/status", "Status"],
      ],
    },
    {
      title: "Company",
      links: [
        ["/about", "About"],
        ["/careers", "Careers"],
        ["/customers", "Customers"],
        ["/partners", "Partners"],
        ["/press", "Press"],
        ["/contact", "Contact"],
      ],
    },
    {
      title: "Read",
      links: [
        ["/learn", "Learn (class 10)"],
        ["/blog", "Journal"],
        ["/changelog", "Changelog"],
        ["/legal/privacy", "Privacy"],
        ["/legal/terms", "Terms"],
        ["/help", "In-app help"],
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            A personal project by Swati Keshari. Pretend shop data so you can see how stock lists get compared.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="mb-3 font-display text-base">{col.title}</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
