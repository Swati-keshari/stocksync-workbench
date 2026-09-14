import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-4 text-center text-text-primary">
      <h1 className="font-display text-3xl">This page is not in the map</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        Try the public home, or the workbench if you already opened the demo.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/" className="rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-white">
          Home
        </Link>
        <Link href="/workbench" className="rounded-[4px] border border-border px-4 py-2 text-sm">
          Workbench
        </Link>
      </div>
    </div>
  );
}
