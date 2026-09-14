export function HealthBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "var(--status-low)"
      : score >= 75
        ? "var(--status-medium)"
        : score >= 60
          ? "var(--status-high)"
          : "var(--status-critical)";

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-alt">
        <div
          className="h-full rounded-pill transition-[width] duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
