import {
  toolPrepareCheckout,
  toolSearchProducts,
  toolSelectProduct,
  type ToolResult,
} from "@/lib/agent/tools";
import { userConfirmedPayment } from "@/lib/confirm";
import { getSession } from "@/lib/session";
import type { ChatMessage } from "@/lib/types";

function parseMaxPrice(text: string): number | undefined {
  const m = text.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
  if (!m) return undefined;
  if (/under|below|max|less than|budget/i.test(text)) {
    return parseFloat(m[1]);
  }
  return undefined;
}

function parseSelectionIndex(text: string): number | undefined {
  const patterns = [
    /(?:second|2nd)\s+one/i,
    /(?:first|1st)\s+one/i,
    /(?:third|3rd)\s+one/i,
    /number\s+(\d+)/i,
    /option\s+(\d+)/i,
  ];
  if (/second|2nd/i.test(text)) return 2;
  if (/first|1st/i.test(text)) return 1;
  if (/third|3rd/i.test(text)) return 3;
  const num = text.match(/(?:buy|take|want)\s+(?:the\s+)?#?(\d+)/i);
  if (num) return parseInt(num[1], 10);
  for (const p of patterns) {
    const hit = text.match(p);
    if (hit?.[1]) return parseInt(hit[1], 10);
  }
  return undefined;
}

/** Deterministic agent for hackathon demo without OpenAI. */
export function runFallbackAgent(
  sessionId: string,
  messages: ChatMessage[]
): ToolResult {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return {
      reply:
        'Tell me what you\'re looking for — e.g. "wireless earbuds under $80".',
    };
  }

  const text = lastUser.content;
  const session = getSession(sessionId);

  if (userConfirmedPayment(text)) {
    return toolPrepareCheckout(sessionId, text);
  }

  const selIdx = parseSelectionIndex(text);
  if (selIdx != null && session.lastSearchResults.length > 0) {
    return toolSelectProduct(sessionId, String(selIdx));
  }

  if (
    /buy|take|want|get|i'll take|i will take/i.test(text) &&
    session.lastSearchResults.length > 0
  ) {
    const titleFragment = text.replace(/buy|take|want|get|the|i'll|i will/gi, "").trim();
    if (titleFragment.length > 2) {
      return toolSelectProduct(sessionId, titleFragment);
    }
  }

  const maxPrice = parseMaxPrice(text);
  const query = text
    .replace(/under\s+\$?\d+(\.\d+)?/gi, "")
    .replace(/below\s+\$?\d+(\.\d+)?/gi, "")
    .trim();

  return toolSearchProducts(sessionId, query || "wireless earbuds", maxPrice);
}

type OpenAIToolCall = {
  name: string;
  arguments: Record<string, unknown>;
};

async function runOpenAIAgent(
  sessionId: string,
  messages: ChatMessage[]
): Promise<ToolResult | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const tools = [
    {
      type: "function" as const,
      function: {
        name: "search_products",
        description: "Search catalog by query and optional max price USD",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" },
            maxPriceUsd: { type: "number" },
          },
          required: ["query"],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "select_product",
        description: "Select SKU or 1-based index from last search",
        parameters: {
          type: "object",
          properties: {
            skuOrIndex: { type: "string" },
          },
          required: ["skuOrIndex"],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "prepare_checkout",
        description: "Only after user confirmed payment in their message",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are ShopPal. Use tools. Never invent products. Ask user to say yes, pay before prepare_checkout.",
        },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      tools,
      tool_choice: "auto",
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices: Array<{
      message: {
        content?: string;
        tool_calls?: Array<{
          function: { name: string; arguments: string };
        }>;
      };
    }>;
  };

  const msg = data.choices[0]?.message;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser?.content ?? "";

  if (msg?.tool_calls?.length) {
    const call = msg.tool_calls[0].function;
    const args = JSON.parse(call.arguments || "{}") as Record<string, unknown>;
    if (call.name === "search_products") {
      return toolSearchProducts(
        sessionId,
        String(args.query ?? ""),
        args.maxPriceUsd as number | undefined
      );
    }
    if (call.name === "select_product") {
      return toolSelectProduct(sessionId, String(args.skuOrIndex ?? "1"));
    }
    if (call.name === "prepare_checkout") {
      return toolPrepareCheckout(sessionId, userText);
    }
  }

  if (msg?.content) {
    return { reply: msg.content };
  }
  return null;
}

export async function runAgent(
  sessionId: string,
  messages: ChatMessage[]
): Promise<ToolResult> {
  const openai = await runOpenAIAgent(sessionId, messages);
  if (openai) return openai;
  return runFallbackAgent(sessionId, messages);
}
