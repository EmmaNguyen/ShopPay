import { TransportIcon, mobilityModeFromProduct } from "@/components/chat/transport-icons";
import {
  productDestinationCode,
  productOriginCode,
} from "@/lib/flights/product-route";
import type { Product } from "@/lib/types";

function departArrive(product: Product): { dep: string; arr: string; duration: string } {
  if (product.ground) {
    const g = product.ground;
    const arr = g.arrives.includes(" on ") ? g.arrives.split(" on ")[0] : g.arrives;
    return { dep: g.departs, arr, duration: g.duration.replace("Total ", "") };
  }
  if (product.flight) {
    const f = product.flight;
    const arr = f.arrives.includes(" on ") ? f.arrives.split(" on ")[0] : f.arrives;
    return { dep: f.departs, arr, duration: f.duration.replace("Total ", "") };
  }
  return { dep: "—", arr: "—", duration: "" };
}

type Props = { product: Product; accent?: string };

export function JourneyStrip({ product, accent = "text-paypal-blue" }: Props) {
  const { dep, arr, duration } = departArrive(product);
  const mode = mobilityModeFromProduct(product);
  const from = productOriginCode(product);
  const to = productDestinationCode(product);

  return (
    <div className="flex items-center gap-3">
      <span className={`shrink-0 ${accent}`}>
        <TransportIcon mode={mode} className="h-6 w-6" />
      </span>
      <div className="flex items-baseline gap-2 font-mono tabular-nums min-w-0 flex-1">
        <span className="text-lg font-bold text-ink">{dep}</span>
        <div className="flex-1 flex flex-col items-center px-1 min-w-[48px]">
          <div className={`h-0.5 w-full rounded-full bg-current opacity-30 ${accent}`} />
          <span className="text-[10px] text-ink/50 mt-0.5 truncate max-w-full">{duration}</span>
        </div>
        <span className="text-lg font-bold text-ink">{arr}</span>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[10px] font-mono text-ink/40">{from}</p>
        <p className="text-xs font-bold text-paypal-navy">→ {to}</p>
      </div>
    </div>
  );
}
