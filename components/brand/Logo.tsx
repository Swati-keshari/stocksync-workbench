import Link from "next/link";

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-2 font-display text-lg tracking-tight">
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-[3px] bg-primary text-[13px] font-semibold text-white"
      >
        S
      </span>
      {!compact && <span>StockSync</span>}
    </Link>
  );
}
