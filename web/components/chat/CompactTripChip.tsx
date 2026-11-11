import {
  productDestinationCode,
  productOriginCode,
} from "@/lib/flights/product-route";
import type { Product } from "@/lib/types";

function times(product: Product): { dep: string; arr: string; duration: string } {
  if (product.ground) {
    const g = product.ground;
    const arr = g.arrives.includes(" on ") ? g.arrives.split(" on ")[0]!.trim() : g.arrives;
    const duration = g.duration.replace(/^Total\s+/i, "");
    return { dep: g.departs, arr, duration };
  }
  if (product.flight) {
    const f = product.flight;
    const arr = f.arrives.includes(" on ") ? f.arrives.split(" on ")[0]!.trim() : f.arrives;
    const duration = f.duration.replace(/^Total\s+/i, "");
    return { dep: f.departs, arr, duration };
  }
  return { dep: "—", arr: "—", duration: "" };
}

type Props = { product: Product };

/** Narrow chip for the horizontal “more options” row — not a boarding pass. */
export function CompactTripChip({ product }: Props) {
  const { dep, arr, duration } = times(product);
  const from = productOriginCode(product);
  const to = productDestinationCode(product);

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-center gap-2 font-mono tabular-nums">
        <span className="text-sm font-bold text-ink">{dep}</span>
        <span className="text-ink/35">→</span>
        <span className="text-sm font-bold text-ink">{arr}</span>
      </div>
      <p className="text-[10px] text-ink/50 text-center leading-snug truncate">
        {duration}
      </p>
      <p className="text-[10px] font-mono text-center text-paypal-navy font-semibold">
        {from} → {to}
      </p>
    </div>
  );
}
