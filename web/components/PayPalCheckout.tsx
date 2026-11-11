"use client";

import type { ReactNode } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  sessionId: string | null;
  demoMode: boolean;
  onSuccess: (orderId: string, status: string) => void;
  onError: (message: string) => void;
};

export function PayPalCheckout({
  product,
  sessionId,
  demoMode,
  onSuccess,
  onError,
}: Props) {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "sb";

  if (demoMode) {
    return (
      <div className="rounded-2xl border border-paypal-blue/25 bg-gradient-to-b from-mist to-surface p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-bold text-paypal-navy">PayPal sandbox</p>
          <span className="text-xs font-mono text-ink/45">${product.priceUsd.toFixed(2)}</span>
        </div>
        <p className="text-xs text-ink/55 mb-3 truncate">{product.title}</p>
        <button
          type="button"
          className="w-full rounded-lg bg-paypal-blue text-white py-3 font-semibold"
          onClick={() => onSuccess(`DEMO-${Date.now()}`, "COMPLETED")}
        >
          Simulate PayPal approval
        </button>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <CheckoutCard product={product}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect" }}
          createOrder={async () => {
            const res = await fetch("/api/checkout/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sku: product.sku,
                ...(sessionId ? { sessionId } : {}),
              }),
            });
            const data = (await res.json()) as { orderId?: string; error?: string };
            if (!res.ok || !data.orderId) {
              throw new Error(data.error ?? "Could not create order");
            }
            return data.orderId;
          }}
          onApprove={async (data) => {
            const orderId = data.orderID;
            if (!orderId) {
              onError("Missing order ID");
              return;
            }
            const res = await fetch("/api/checkout/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId }),
            });
            const payload = (await res.json()) as {
              status?: string;
              id?: string;
              error?: string;
            };
            if (!res.ok) {
              onError(payload.error ?? "Capture failed");
              return;
            }
            onSuccess(payload.id ?? orderId, payload.status ?? "COMPLETED");
          }}
          onError={(err) => {
            console.error(err);
            onError("PayPal widget error — check sandbox credentials.");
          }}
        />
      </CheckoutCard>
    </PayPalScriptProvider>
  );
}

function CheckoutCard({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-paypal-navy/15 bg-surface p-4 shadow-md animate-message-in">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
        Approve in PayPal
      </p>
      {children}
    </div>
  );
}
