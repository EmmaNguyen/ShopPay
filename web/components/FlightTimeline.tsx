import type { FlightTimelineStep } from "@/lib/types";

type Props = {
  steps: FlightTimelineStep[];
  accent?: string;
};

/** Vertical journey timeline for Budget / Fast / Best cards. */
export function FlightTimeline({ steps, accent = "bg-paypal-blue" }: Props) {
  return (
    <ol className="relative pl-1 space-y-0 text-sm" aria-label="Trip timeline">
      {steps.map((step, i) => {
        const isConnector = !step.place && !step.time;
        if (isConnector) {
          return (
            <li key={i} className="flex gap-3 py-1.5">
              <div className="flex w-4 shrink-0 flex-col items-center">
                <span className={`w-0.5 flex-1 min-h-[12px] ${accent}`} />
              </div>
              <p className="text-xs text-ink/55 italic py-0.5">{step.detail}</p>
            </li>
          );
        }

        const isLast = i === steps.length - 1;
        return (
          <li key={i} className="flex gap-3">
            <div className="flex w-4 shrink-0 flex-col items-center">
              <span className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${accent}`} />
              {!isLast ? (
                <span className={`w-0.5 flex-1 min-h-[8px] ${accent}`} />
              ) : null}
            </div>
            <div className="pb-3 min-w-0">
              <p className="font-mono font-semibold text-ink tabular-nums">{step.time}</p>
              <p className="font-medium text-ink">{step.place}</p>
              {step.detail ? (
                <p className="text-xs text-ink/55">{step.detail}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
