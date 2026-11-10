"use client";

import { useCallback, useState } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { ProductCard } from "@/components/ProductCard";
import type { ChatMessage, Product } from "@/lib/types";

type Turn = ChatMessage & {
  products?: Product[];
};

export function Chat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "assistant",
      content:
        'Hi — I\'m ShopPal. Try: **wireless earbuds under $80**. I\'ll show options, you pick one, then say **yes, pay** before PayPal checkout.',
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userTurn: Turn = { role: "user", content: trimmed };
      const nextTurns = [...turns, userTurn];
      setTurns(nextTurns);
      setInput("");
      setLoading(true);
      setCheckoutProduct(null);

      const messages = nextTurns.map(({ role, content }) => ({ role, content }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, sessionId }),
        });
        const data = (await res.json()) as {
          reply: string;
          products?: Product[];
          awaitingPayment?: boolean;
          selectedProduct?: Product;
          sessionId: string;
          demoMode?: boolean;
        };
        if (data.sessionId) setSessionId(data.sessionId);
        if (data.demoMode != null) setDemoMode(data.demoMode);

        setTurns((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            products: data.products,
          },
        ]);

        if (data.awaitingPayment && data.selectedProduct) {
          setCheckoutProduct(data.selectedProduct);
        }
      } catch {
        setTurns((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Something went wrong. Is the dev server running?",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, turns]
  );

  const onSelectProduct = (sku: string) => {
    const idx = turns[turns.length - 1]?.products?.findIndex((p) => p.sku === sku);
    const label =
      idx != null && idx >= 0 ? `I'll take option ${idx + 1}` : `I'll take ${sku}`;
    void sendMessage(label);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[720px]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {turns.map((t, i) => (
          <div key={i} className="space-y-3">
            <MessageBubble role={t.role} content={t.content} />
            {t.products && t.products.length > 0 && (
              <div className="grid gap-3">
                {t.products.map((p, j) => (
                  <ProductCard
                    key={p.sku}
                    product={p}
                    index={j}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <p className="text-sm text-ink/50 animate-pulse">ShopPal is thinking…</p>
        )}
        {checkoutProduct && (
          <PayPalCheckout
            product={checkoutProduct}
            demoMode={demoMode}
            onSuccess={(orderId, status) => {
              setCheckoutProduct(null);
              setTurns((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `Payment **${status}** in sandbox.\n\nOrder ID: \`${orderId}\`\n\nThanks for shopping with ShopPal.`,
                },
              ]);
            }}
            onError={(msg) => {
              setTurns((prev) => [
                ...prev,
                { role: "assistant", content: msg },
              ]);
            }}
          />
        )}
      </div>

      <form
        className="mt-4 flex gap-2 border-t border-black/5 pt-4"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you need…"
          className="flex-1 rounded-xl border border-black/10 bg-surface px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-paypal-blue"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-paypal-navy text-white px-5 py-3 font-semibold disabled:opacity-40 hover:bg-paypal-blue transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
