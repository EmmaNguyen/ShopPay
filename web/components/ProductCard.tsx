import { FlightTimeline } from "@/components/FlightTimeline";
import { CompactTripChip } from "@/components/chat/CompactTripChip";
import { JourneyStrip } from "@/components/chat/JourneyStrip";
import {
  TransportIcon,
  mobilityModeFromProduct,
} from "@/components/chat/transport-icons";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  index: number;
  selected?: boolean;
  onSelect: (sku: string) => void;
  trackLabel?: string;
  compact?: boolean;
};

const TRACK_STYLES: Record<string, { tag: string; ring: string; accent: string }> = {
  Budget: {
    tag: "bg-emerald-600 text-white",
    ring: "border-emerald-600",
    accent: "text-emerald-700",
  },
  Fast: {
    tag: "bg-amber-500 text-amber-950",
    ring: "border-amber-500",
    accent: "text-amber-700",
  },
  Best: {
    tag: "bg-paypal-navy text-white",
    ring: "border-paypal-blue",
    accent: "text-paypal-navy",
  },
};

const TRACK_TIMELINE_ACCENT: Record<string, string> = {
  Budget: "bg-emerald-600",
  Fast: "bg-amber-500",
  Best: "bg-paypal-navy",
};

function statChips(product: Product): string[] {
  const chips: string[] = [];
  if (product.flight) {
    chips.push(product.flight.stops);
    chips.push(product.flight.cabin);
  }
  if (product.ground) {
    if (product.ground.distanceMiles) chips.push(`${product.ground.distanceMiles} mi`);
    if (product.tags.includes("compare-only")) chips.push("Estimate");
  }
  return chips;
}

export function ProductCard({
  product,
  index,
  selected,
  onSelect,
  trackLabel,
  compact = false,
}: Props) {
  const ground = product.ground;
  const flight = product.flight;

  if (ground || flight) {
    const styles = trackLabel
      ? (TRACK_STYLES[trackLabel] ?? {
          tag: "bg-ink text-white",
          ring: "border-ink/30",
          accent: "text-ink",
        })
      : {
          tag: "bg-ink/80 text-white",
          ring: "border-ink/25",
          accent: "text-ink/70",
        };
    const isGround = !!ground;
    const compareOnly = product.tags.includes("compare-only");
    const mode = mobilityModeFromProduct(product);
    const headline = isGround ? ground.service : flight!.flight;
    const chips = statChips(product);
    const aria = isGround
      ? `${trackLabel ?? "Option"} ${ground.vendor} $${product.priceUsd}`
      : `${trackLabel ?? "Option"} ${flight!.flight} $${product.priceUsd}`;

    if (compact) {
      return (
        <button
          type="button"
          onClick={() => onSelect(product.sku)}
          aria-label={aria}
          className={`shrink-0 w-[152px] snap-start rounded-xl border-2 bg-white p-3 shadow-sm transition ${
            selected ? `${styles.ring} ring-2 ring-success` : "border-sp-rule"
          }`}
        >
          <div className="flex items-start justify-between gap-1">
            <TransportIcon mode={mode} className="h-5 w-5 shrink-0 text-paypal-navy" />
            <span className="text-lg font-bold text-paypal-navy leading-none">
              ${product.priceUsd.toFixed(0)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-ink line-clamp-2 mt-1.5 min-h-[2rem]">
            {headline}
          </p>
          <CompactTripChip product={product} />
          {selected ? (
            <p className="text-[10px] font-semibold text-paypal-navy text-center mt-1">
              Held · yes, pay below ↓
            </p>
          ) : null}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onSelect(product.sku)}
        aria-label={aria}
        className={`w-full text-left rounded-xl border-2 bg-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-paypal-blue ${
          selected
            ? `${styles.ring} ring-2 ring-offset-2 ring-success`
            : "border-sp-rule hover:border-paypal-blue/40"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            {trackLabel ? (
              <span
                className={`text-[10px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5 ${styles.tag}`}
              >
                {trackLabel}
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase text-ink/45">+</span>
            )}
            <TransportIcon mode={mode} className="h-4 w-4 text-ink/60" />
          </div>
          <div className="flex items-center gap-2">
            {compareOnly ? (
              <span
                className="h-2 w-2 rounded-full bg-amber-500"
                title="Over budget estimate"
              />
            ) : null}
            <span className="text-xl font-bold text-paypal-navy">
              ${product.priceUsd.toFixed(0)}
            </span>
            {selected ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white text-xs">
                ✓
              </span>
            ) : null}
          </div>
        </div>
        <div className="px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-ink truncate">{headline}</p>
          <JourneyStrip product={product} accent={styles.accent} />
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {chips.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-mono rounded bg-ink/5 text-ink/60 px-1.5 py-0.5"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          {!compact ? (
            <FlightTimeline
              steps={isGround ? ground.timeline : flight!.timeline}
              accent={
                trackLabel
                  ? (TRACK_TIMELINE_ACCENT[trackLabel] ?? "bg-paypal-blue")
                  : "bg-ink/40"
              }
            />
          ) : null}
          {selected ? (
            <p className="text-xs font-semibold text-paypal-navy animate-pulse">
              Next: yes, pay below ↓
            </p>
          ) : null}
          {ground?.sourceUrl || flight?.sourceUrl ? (
            <a
              href={(ground?.sourceUrl ?? flight?.sourceUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[10px] text-paypal-blue hover:underline"
            >
              <span className="h-3.5 w-3.5 rounded border border-paypal-blue/40 flex items-center justify-center text-[8px]">
                ↗
              </span>
              {ground?.sourceLabel ?? flight?.sourceLabel ?? "Source"}
            </a>
          ) : null}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(product.sku)}
      aria-label={`${product.title} $${product.priceUsd}`}
      className={`w-full text-left rounded-xl border-2 border-sp-rule bg-white px-4 py-3 shadow-sm ${
        selected ? "ring-2 ring-success" : ""
      }`}
    >
      <p className="text-sm font-semibold text-ink truncate">{product.title}</p>
      <p className="text-xl font-bold text-paypal-navy mt-1">
        ${product.priceUsd.toFixed(0)}
      </p>
    </button>
  );
}
