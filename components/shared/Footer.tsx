import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-text-secondary sm:flex-row sm:px-6">
        <span>StockSync — personal workbench by Swati Keshari. Demo data only.</span>
        <div className="flex items-center gap-4">
          <Link href="/learn" className="hover:text-text-primary">
            Learn
          </Link>
          <Link href="/help" className="hover:text-text-primary">
            Help
          </Link>
          <Link href="/status" className="hover:text-text-primary">
            Status
          </Link>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
