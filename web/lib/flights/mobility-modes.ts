/** User-selectable ways to reach the chosen rebook airport (MCI stop or OMA home). */
export const MOBILITY_MODES = [
  "flight",
  "bus",
  "train",
  "uber",
  "lyft",
] as const;

export type MobilityMode = (typeof MOBILITY_MODES)[number];

export const MOBILITY_MODE_LABELS: Record<MobilityMode, string> = {
  flight: "Flight",
  bus: "Bus & rental",
  train: "Train",
  uber: "Uber",
  lyft: "Lyft",
};

type ModeOffer = {
  transportMode?: string;
  groundType?: string;
  vendor?: string;
};

export function parseMobilityModesParam(
  raw: string | null | undefined
): MobilityMode[] | undefined {
  if (!raw?.trim()) return undefined;
  const set = new Set<MobilityMode>();
  for (const part of raw.split(",")) {
    const key = part.trim().toLowerCase();
    if ((MOBILITY_MODES as readonly string[]).includes(key)) {
      set.add(key as MobilityMode);
    }
  }
  return set.size > 0 ? [...set] : undefined;
}

export function mobilityModesQuery(modes: MobilityMode[]): string {
  return modes.join(",");
}

function isFlight(offer: ModeOffer): boolean {
  return offer.transportMode !== "ground";
}

function isBusGroup(offer: ModeOffer): boolean {
  if (offer.transportMode !== "ground") return false;
  const t = offer.groundType;
  return t === "bus" || t === "shuttle" || t === "rental";
}

function isTrain(offer: ModeOffer): boolean {
  return offer.transportMode === "ground" && offer.groundType === "train";
}

function isUber(offer: ModeOffer): boolean {
  return (
    offer.transportMode === "ground" &&
    offer.groundType === "rideshare" &&
    offer.vendor === "Uber"
  );
}

function isLyft(offer: ModeOffer): boolean {
  return (
    offer.transportMode === "ground" &&
    offer.groundType === "rideshare" &&
    offer.vendor === "Lyft"
  );
}

export function offerMatchesMobilityMode(
  offer: ModeOffer,
  mode: MobilityMode
): boolean {
  if (mode === "flight") return isFlight(offer);
  if (mode === "bus") return isBusGroup(offer);
  if (mode === "train") return isTrain(offer);
  if (mode === "uber") return isUber(offer);
  return isLyft(offer);
}

export function filterOffersByMobilityModes<T>(
  offers: T[],
  modes: MobilityMode[] | undefined
): T[] {
  if (!modes || modes.length === 0) return offers;
  return offers.filter((o) =>
    modes.some((m) => offerMatchesMobilityMode(o as ModeOffer, m))
  );
}

export function formatMobilityModesList(modes: MobilityMode[]): string {
  return modes.map((m) => MOBILITY_MODE_LABELS[m]).join(" · ");
}
