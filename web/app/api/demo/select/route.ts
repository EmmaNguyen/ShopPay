import { toolSelectProduct } from "@/lib/agent/tools";
import { resolveDemoMode } from "@/lib/demo-mode";
import { getSession } from "@/lib/session";
import { z } from "zod";

const BodySchema = z.object({
  sessionId: z.string().uuid(),
  sku: z.string().min(1),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  getSession(parsed.data.sessionId);
  const result = toolSelectProduct(parsed.data.sessionId, parsed.data.sku);
  return Response.json({
    ...result,
    demoMode: resolveDemoMode(),
  });
}
