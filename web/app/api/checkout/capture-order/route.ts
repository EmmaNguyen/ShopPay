import { capturePayPalOrder, paypalConfigured } from "@/lib/paypal";
import { z } from "zod";

const BodySchema = z.object({
  orderId: z.string().min(4).max(64),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!paypalConfigured()) {
    return Response.json(
      { error: "PayPal not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await capturePayPalOrder(parsed.data.orderId);
    return Response.json({ id: result.id, status: result.status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Capture failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
