import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";

/** Minimal canceled pass — visual, almost no copy. */
export function CanceledPassCompact() {
  const c = JENKINS_INCIDENT.canceledConnection;

  return (
    <article
      className="relative overflow-hidden rounded-lg border-2 border-red-600/40 bg-[#f4efe4] shadow-md"
      aria-label={`Canceled flight ${c.flightNumber} to Kansas City`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-3xl font-black uppercase tracking-[0.35em] text-red-600/25 -rotate-12 border-4 border-red-600/25 px-4 py-1 rounded">
          Cancelled
        </span>
      </div>
      <div className="relative flex items-center gap-3 px-4 py-3">
        <div className="text-center">
          <p className="text-2xl font-bold">DFW</p>
          <p className="text-[10px] font-mono text-ink/50">{c.scheduledDeparture}</p>
        </div>
        <MotionLine />
        <div className="text-center min-w-0 flex-1">
          <p className="text-[10px] font-mono text-red-700 font-bold">WX · Gate {c.gate}</p>
          <p className="text-xs font-semibold truncate">AA {c.flightNumber}</p>
          <p className="text-[10px] text-ink/45">20 Nov · Seat {c.seat}</p>
        </div>
        <MotionLine />
        <div className="text-center">
          <p className="text-2xl font-bold">MCI</p>
          <p className="text-[10px] font-mono text-ink/50 line-through opacity-60">
            {c.scheduledDeparture}
          </p>
        </div>
      </div>
    </article>
  );
}

function MotionLine() {
  return (
    <svg className="w-10 h-4 text-ink/30 shrink-0" viewBox="0 0 40 16" aria-hidden>
      <path d="M0 8h28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M26 4l8 4-8 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
