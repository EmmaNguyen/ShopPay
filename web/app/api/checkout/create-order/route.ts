import { getProductBySku } from "@/lib/catalog";
import { resolveProduct } from "@/lib/catalog-resolve";
import { createPayPalOrder, paypalConfigured } from "@/lib/paypal";
import { z } from "zod";

const BodySchema = z.object({
  sku: z.string().min(1),
  sessionId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const product =
    (parsed.data.sessionId
      ? resolveProduct(parsed.data.sessionId, parsed.data.sku)
      : undefined) ?? getProductBySku(parsed.data.sku);
  if (!product) {
    return Response.json({ error: "Unknown fare" }, { status: 404 });
  }

  if (!paypalConfigured()) {
    return Response.json(
      { error: "PayPal not configured" },
      { status: 503 }
    );
  }

  try {
    const order = await createPayPalOrder({
      title: product.title,
      sku: product.sku,
      priceUsd: product.priceUsd,
    });
    return Response.json({ orderId: order.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create order failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
