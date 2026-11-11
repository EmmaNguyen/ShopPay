import scenario from "@/data/demo-scenario.json";

export type DemoPrompt = {
  label: string;
  message: string;
  phase: "search" | "select";
};

export const DEMO_PROMPTS = scenario.prompts as DemoPrompt[];
export const DEMO_SEARCH_PROMPTS = DEMO_PROMPTS.filter((p) => p.phase === "search");
export const DEMO_SELECT_PROMPTS = DEMO_PROMPTS.filter((p) => p.phase === "select");
export const DEMO_SELECT_MESSAGE = scenario.selectMessage;

/** First search chip — replay scripts & docs. */
export const DEMO_OPENING_MESSAGE = DEMO_SEARCH_PROMPTS[0]?.message ?? "";
