"use client";

export function MeterBar({
  label,
  value,
  max = 100,
  color = "#7c241c",
  invert = false,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  invert?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="select-none">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-carta/70">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-2 bg-black/40 border border-black/50 mt-0.5 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            opacity: invert ? 0.6 : 0.9,
          }}
        />
      </div>
    </div>
  );
}
