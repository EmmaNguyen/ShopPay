const ITEMS = [
  { id: "Budget", color: "bg-emerald-600", glyph: "$" },
  { id: "Fast", color: "bg-amber-500", glyph: "⚡" },
  { id: "Best", color: "bg-paypal-navy", glyph: "★" },
] as const;

export function TrackLegend() {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2"
      aria-label="Budget cheapest, Fast fastest, Best overall"
    >
      {ITEMS.map((item) => (
        <div key={item.id} className="flex items-center gap-1.5">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${item.color}`}
          >
            {item.glyph}
          </span>
          <span className="text-[11px] font-semibold text-ink/70">{item.id}</span>
        </div>
      ))}
    </div>
  );
}
