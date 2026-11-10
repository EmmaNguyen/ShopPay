"use client";

import type { ReactNode } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  demoMode: boolean;
  onSuccess: (orderId: string, status: string) => void;
  onError: (message: string) => void;
};

export function PayPalCheckout({
  product,
  demoMode,
  onSuccess,
  onError,
}: Props) {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "sb";

  if (demoMode) {
    return (
      <div className="rounded-xl border border-warning/50 bg-amber-50 p-4">
        <p className="text-sm font-medium text-ink mb-3">
          Simulated payment (demo mode) — PayPal credentials not configured
        </p>
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
              body: JSON.stringify({ sku: product.sku }),
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
    <div className="rounded-xl border border-paypal-navy/15 bg-surface p-4 shadow-md animate-message-in">
      <p className="text-sm text-ink/80 mb-3">
        PayPal checkout: <strong>{product.title}</strong> — $
        {product.priceUsd.toFixed(2)}
      </p>
      {children}
    </div>
  );
}
