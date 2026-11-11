import type { RebookDestinationCode } from "@/lib/flights/rebook-destination";
import { rebookDestinationMeta } from "@/lib/flights/rebook-destination";

type Props = { destination: RebookDestinationCode };

export function RouteRibbon({ destination }: Props) {
  const meta = rebookDestinationMeta(destination);
  return (
    <div
      className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-black/10 bg-white shadow-sm"
      aria-label={`Dallas Fort Worth to ${meta.city}`}
    >
      <div className="flex-1 px-3 py-2.5 text-center bg-[#f7f1e6]">
        <p className="text-[9px] font-mono tracking-widest text-ink/45">FROM</p>
        <p className="text-xl font-bold text-paypal-navy">DFW</p>
      </div>
      <div className="flex flex-col items-center justify-center px-2 min-w-[100px] bg-gradient-to-b from-paypal-blue/10 to-paypal-navy/5">
        <svg viewBox="0 0 80 12" className="w-20 h-3 text-paypal-blue" aria-hidden>
          <line x1="0" y1="6" x2="72" y2="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
          <polygon points="72,6 64,2 64,10" fill="currentColor" />
        </svg>
        <p className="text-[10px] font-mono font-semibold text-ink/60 mt-1">
          {meta.milesFromDfw} mi
        </p>
        <p className="text-[9px] text-ink/45">20–21 Nov</p>
        {"ribbonNote" in meta && meta.ribbonNote ? (
          <p className="text-[8px] text-ink/45 text-center max-w-[100px] leading-tight">
            {meta.ribbonNote}
          </p>
        ) : null}
      </div>
      <div className="flex-1 px-3 py-2.5 text-center bg-[#f7f1e6]">
        <p className="text-[9px] font-mono tracking-widest text-ink/45">TO</p>
        <p className="text-xl font-bold text-paypal-navy">{meta.code}</p>
      </div>
    </div>
  );
}
