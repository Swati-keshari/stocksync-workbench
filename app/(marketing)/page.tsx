import Link from "next/link";
import {
  ConveyorStrip,
  CountBoards,
  DashedSync,
  FloatingClip,
  InkPath,
  LedgerPulse,
  LiveTicker,
  OrbitNodes,
  ScanBox,
  ShelfBars,
  StampMark,
  TallyNudge,
} from "@/components/artifacts/Motion";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <LiveTicker />
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05]">
            Three lists of the same biscuits. Pick the true count.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-text-secondary">
            StockSync is Swati Keshari&apos;s personal demo. A shop till, a warehouse, and a website each keep their own
            notebook. When the numbers disagree, this screen shows the fight in plain English.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/workbench"
              className="rounded-[4px] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Open the workbench
            </Link>
            <Link href="/learn" className="rounded-[4px] border border-border px-4 py-2.5 text-sm hover:bg-surface">
              Explain like class 10
            </Link>
          </div>
          <div className="mt-8">
            <InkPath />
          </div>
        </div>
        <div className="space-y-4 rounded-[4px] border border-border bg-surface p-5">
          <CountBoards />
          <DashedSync />
          <p className="text-sm text-text-secondary">
            Same packet of tea. Shop says 42, warehouse says 38, website says 40. The workbench lists that as a
            mismatch so a person can choose which list to trust.
          </p>
          <StampMark />
        </div>
      </section>
      <ConveyorStrip />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-3 sm:px-6">
        <div className="space-y-3">
          <LedgerPulse />
          <h2 className="font-display text-2xl">Watch lists refresh</h2>
          <p className="text-sm text-text-secondary">A pulse means a pretend sync just ran. Nothing is talking to a real shop.</p>
        </div>
        <div className="space-y-3">
          <ScanBox />
          <h2 className="font-display text-2xl">Find the gap</h2>
          <p className="text-sm text-text-secondary">The scan line is a visual for “we are comparing rows by product code.”</p>
        </div>
        <div className="space-y-3">
          <OrbitNodes />
          <h2 className="font-display text-2xl">One product, three homes</h2>
          <p className="text-sm text-text-secondary">Till, warehouse, website orbit the same SKU until someone picks a winner.</p>
        </div>
      </section>
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="font-display text-3xl">Money at risk, not scary jargon</h2>
            <p className="mt-3 text-text-secondary">
              If lists disagree, you might sell an item you do not have. The rupee figure is a story number for the demo.
            </p>
            <TallyNudge />
            <FloatingClip />
          </div>
          <ShelfBars />
        </div>
      </section>
    </div>
  );
}
