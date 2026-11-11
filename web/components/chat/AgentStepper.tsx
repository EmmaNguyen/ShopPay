import type { AssistantUiStep } from "@/lib/types";

const steps: { id: AssistantUiStep; label: string }[] = [
  { id: "pick", label: "Pick" },
  { id: "consent", label: "yes, pay" },
  { id: "checkout", label: "PayPal" },
];

type Props = { active?: AssistantUiStep };

function stepIndex(active: AssistantUiStep): number {
  if (active === "search" || active === "pick") return 0;
  if (active === "consent") return 1;
  if (active === "checkout" || active === "done") return 2;
  return 0;
}

export function AgentStepper({ active = "pick" }: Props) {
  const idx = stepIndex(active);

  return (
    <ol className="flex items-center gap-1 text-[11px] font-medium" aria-label="ShopPal flow">
      {steps.map((s, i) => {
        const done = i < idx;
        const on = i === idx;
        return (
          <li key={s.id} className="flex items-center gap-1 flex-1 min-w-0">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                on
                  ? "bg-paypal-blue text-white"
                  : done
                    ? "bg-success/20 text-success"
                    : "bg-mist text-ink/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={`truncate ${on ? "text-ink" : "text-ink/45"}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <span className="mx-1 h-px flex-1 bg-black/10 hidden sm:block" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
