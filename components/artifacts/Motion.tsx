"use client";

export function LedgerPulse() {
  return (
    <div className="relative h-24 w-24" aria-hidden>
      <span className="artifact-pulse absolute inset-3 rounded-full border border-primary/50" />
      <span className="artifact-pulse absolute inset-3 rounded-full border border-primary/40 [animation-delay:800ms]" />
      <span className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-primary text-center text-[10px] font-semibold leading-10 text-white">
        sync
      </span>
    </div>
  );
}

export function CountBoards() {
  const boards = [
    { label: "Shop till", value: "42" },
    { label: "Warehouse", value: "38" },
    { label: "Online shop", value: "40" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {boards.map((b, i) => (
        <div
          key={b.label}
          className="rounded-[4px] border border-border bg-surface p-3 text-center"
          style={{ animationDelay: `${i * 180}ms` }}
        >
          <p className="text-[11px] text-text-secondary">{b.label}</p>
          <p className="artifact-flip mt-1 font-display text-3xl tabular-nums" style={{ animationDelay: `${i * 400}ms` }}>
            {b.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ConveyorStrip() {
  const items = ["SKU-1024 tea", "SKU-881 mug", "SKU-44 rice", "SKU-19 oil", "SKU-700 soap"];
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-surface-alt py-2">
      <div className="artifact-conveyor flex w-max gap-8 text-xs text-text-secondary">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="whitespace-nowrap">
            ▢ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ScanBox() {
  return (
    <div className="relative h-28 overflow-hidden rounded-[4px] border border-border bg-surface">
      <div className="artifact-scan absolute inset-x-2 h-6 bg-primary/20" />
      <p className="absolute inset-0 flex items-center justify-center text-xs text-text-secondary">
        Scanning shelf counts
      </p>
    </div>
  );
}

export function OrbitNodes() {
  return (
    <div className="relative mx-auto h-36 w-36" aria-hidden>
      <div className="artifact-orbit absolute inset-0">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-brass" />
        <span className="absolute bottom-2 left-3 h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="absolute bottom-2 right-3 h-2.5 w-2.5 rounded-full bg-status-high" />
      </div>
      <span className="absolute inset-0 m-auto h-12 w-12 rounded-full border border-border bg-surface text-center text-[10px] font-medium leading-[3rem]">
        SKU
      </span>
    </div>
  );
}

export function ShelfBars() {
  const fills = ["42%", "78%", "55%", "91%"];
  return (
    <div className="flex h-28 items-end gap-2">
      {fills.map((fill) => (
        <div key={fill} className="flex h-full flex-1 items-end rounded-[3px] bg-surface-alt">
          <div className="artifact-shelf h-full bg-primary/70" style={{ ["--fill" as string]: fill }} />
        </div>
      ))}
    </div>
  );
}

export function InkPath() {
  return (
    <svg viewBox="0 0 220 64" className="h-16 w-full text-primary" aria-hidden>
      <path
        className="artifact-ink"
        d="M8 40 C 40 8, 80 56, 110 28 S 180 8, 212 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function FloatingClip() {
  return (
    <div className="artifact-float rounded-[4px] border border-border bg-surface px-4 py-3 text-sm shadow-none">
      Clipboard: 3 lists, 1 truth to pick
    </div>
  );
}

export function LiveTicker() {
  return (
    <div className="flex items-center gap-2 text-xs text-text-secondary">
      <span className="artifact-live inline-block h-2 w-2 rounded-full bg-primary" />
      Live demo — numbers update on a timer, not a real warehouse
    </div>
  );
}

export function DashedSync() {
  return (
    <svg viewBox="0 0 240 40" className="h-10 w-full text-brass" aria-hidden>
      <line className="artifact-path" x1="8" y1="20" x2="232" y2="20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function StampMark() {
  return (
    <div className="artifact-stamp inline-flex rotate-[-6deg] rounded-full border-2 border-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
      Counted
    </div>
  );
}

export function TallyNudge() {
  return (
    <p className="artifact-tally font-display text-4xl tabular-nums">
      ₹12,480
    </p>
  );
}
