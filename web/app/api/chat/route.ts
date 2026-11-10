import { runAgent } from "@/lib/agent/run-agent";
import { getSession } from "@/lib/session";
import type { ChatMessage } from "@/lib/types";
import { z } from "zod";
import { randomUUID } from "crypto";

const BodySchema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(4000),
    })
  ),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const sessionId = parsed.data.sessionId ?? randomUUID();
  getSession(sessionId);

  const messages = parsed.data.messages as ChatMessage[];
  const result = await runAgent(sessionId, messages);

  const demoMode =
    process.env.DEMO_MODE === "true" ||
    !process.env.PAYPAL_CLIENT_ID ||
    !process.env.PAYPAL_CLIENT_SECRET;

  return Response.json({
    reply: result.reply,
    products: result.products,
    awaitingPayment: result.awaitingPayment,
    selectedProduct: result.selectedProduct,
    sessionId,
    demoMode,
  });
}
