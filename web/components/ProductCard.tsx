import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  index: number;
  onSelect: (sku: string) => void;
};

export function ProductCard({ product, index, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product.sku)}
      className="w-full text-left rounded-xl border border-paypal-blue/20 bg-surface p-4 shadow-sm hover:border-paypal-blue hover:ring-2 hover:ring-paypal-blue/30 transition focus:outline-none focus:ring-2 focus:ring-paypal-blue"
    >
      <div className="flex justify-between gap-3">
        <ProductCardTitle index={index} title={product.title} />
        <span className="font-semibold text-paypal-navy shrink-0">
          ${product.priceUsd.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-ink/70 mt-2">{product.blurb}</p>
      <p className="text-xs text-paypal-blue mt-2">Tap to select</p>
    </button>
  );
}

function ProductCardTitle({ index, title }: { index: number; title: string }) {
  return (
    <div>
      <span className="text-xs font-mono text-ink/50">#{index + 1}</span>
      <h3 className="font-semibold text-ink">{title}</h3>
    </div>
  );
}
