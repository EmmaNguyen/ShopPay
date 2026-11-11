import {
  DEMO_SEARCH_PROMPTS,
  DEMO_SELECT_PROMPTS,
} from "@/lib/demo-scenario";

type Props = {
  disabled?: boolean;
  onPick: (text: string) => void;
  /** search = before fares; select = after fare cards */
  mode: "search" | "select";
};

export function QuickPromptChips({ disabled, onPick, mode }: Props) {
  const list = mode === "search" ? DEMO_SEARCH_PROMPTS : DEMO_SELECT_PROMPTS;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((p) => (
        <button
          key={p.label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(p.message)}
          className="rounded-full border border-paypal-blue/30 bg-holiday-frost/80 px-4 py-2 text-sm font-semibold text-paypal-navy hover:bg-paypal-blue/10 disabled:opacity-40 transition"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
