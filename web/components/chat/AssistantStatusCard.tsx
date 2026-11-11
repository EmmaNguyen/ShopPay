import type { AssistantUi } from "@/lib/types";

type Props = {
  ui?: AssistantUi;
  loading?: boolean;
};

export function AssistantStatusCard({ ui, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-paypal-blue/20 bg-surface px-4 py-3 shadow-sm">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-paypal-blue/10">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paypal-blue/25 opacity-60" />
          <span className="text-lg" aria-hidden>
            ✈
          </span>
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Searching catalog</p>
          <p className="text-xs text-ink/50">Tool: search_products</p>
        </div>
      </div>
    );
  }

  if (!ui?.label) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-mist/80 px-4 py-2.5">
      <StepIcon step={ui.step} />
      <p className="text-sm font-medium text-ink">{ui.label}</p>
    </div>
  );
}

function StepIcon({ step }: { step?: string }) {
  const icon =
    step === "pick"
      ? "🎫"
      : step === "consent"
        ? "🔐"
        : step === "checkout"
          ? "💳"
          : "🔎";
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base shadow-sm">
      {icon}
    </span>
  );
}
