export type Product = {
  sku: string;
  title: string;
  category: string;
  priceUsd: number;
  tags: string[];
  blurb: string;
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

export type ChatApiResponse = {
  reply: string;
  products?: Product[];
  awaitingPayment?: boolean;
  selectedProduct?: Product;
  sessionId: string;
};
