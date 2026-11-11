export type FlightTimelineStep = {
  time: string;
  place: string;
  detail?: string;
};

export type FlightDetails = {
  airline: string;
  flight: string;
  fromCity: string;
  toCity: string;
  date: string;
  departs: string;
  arrives: string;
  duration: string;
  stops: string;
  cabin: string;
  timeline: FlightTimelineStep[];
  sourceLabel?: string;
  sourceUrl?: string;
};

export type GroundDetails = {
  vendor: string;
  service: string;
  vehicle: string;
  fromCity: string;
  toCity: string;
  date: string;
  departs: string;
  arrives: string;
  duration: string;
  distanceMiles: number;
  timeline: FlightTimelineStep[];
  sourceLabel?: string;
  sourceUrl?: string;
};

export type Product = {
  sku: string;
  title: string;
  category: string;
  priceUsd: number;
  tags: string[];
  blurb: string;
  flight?: FlightDetails;
  ground?: GroundDetails;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type SessionState = {
  selectedSku?: string;
  lastSearchResults: Product[];
  awaitingPayment: boolean;
  preparedOrderSku?: string;
};

export type AssistantUiStep =
  | "search"
  | "pick"
  | "consent"
  | "checkout"
  | "done";

export type AssistantUi = {
  step?: AssistantUiStep;
  label?: string;
};

export type ChatApiResponse = {
  reply: string;
  products?: Product[];
  awaitingPayment?: boolean;
  selectedProduct?: Product;
  selectedSku?: string;
  ui?: AssistantUi;
  sessionId: string;
  demoMode?: boolean;
};
