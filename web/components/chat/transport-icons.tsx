import type { MobilityMode } from "@/lib/flights/mobility-modes";
import type { Product } from "@/lib/types";

export function mobilityModeFromProduct(product: Product): MobilityMode | "coach" {
  if (product.flight) return "flight";
  if (product.tags.includes("bus")) return "bus";
  if (product.tags.includes("rental")) return "bus";
  if (product.tags.includes("shuttle")) return "coach";
  if (product.tags.includes("train")) return "train";
  if (product.tags.includes("rideshare")) {
    return product.ground?.vendor === "Lyft" ? "lyft" : "uber";
  }
  return "bus";
}

type IconProps = { className?: string };

export function TransportIcon({
  mode,
  className = "h-5 w-5",
}: {
  mode: MobilityMode | "coach";
  className?: string;
}) {
  switch (mode) {
    case "flight":
      return <IconPlane className={className} />;
    case "bus":
      return <IconBus className={className} />;
    case "coach":
      return <IconBus className={className} />;
    case "train":
      return <IconTrain className={className} />;
    case "uber":
      return <IconCar className={className} />;
    case "lyft":
      return <IconCar className={className} />;
    default:
      return <IconCar className={className} />;
  }
}

function IconPlane({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function IconBus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-2.21-3.58-4-8-4S4 3.79 4 6v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM6 10V6h12v4H6z" />
    </svg>
  );
}

function IconTrain({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5V22l3.5-1 2.5 1 2.5-1 2.5 1 3.5-1v-1.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.87 0 6 .25 6 1.5S15.87 7 12 7s-6-.25-6-1.5S8.13 4 12 4zM7.5 17A1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 14 1.5 1.5 0 019 15.5 1.5 1.5 0 017.5 17zm9 0a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5z" />
    </svg>
  );
}

function IconCar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}
